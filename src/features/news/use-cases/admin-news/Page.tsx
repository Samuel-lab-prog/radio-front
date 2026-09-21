import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { newsApi, type News, type NewsInput } from '@core/api/news';
import { authApi } from '@core/api/auth';
import { useAuthStore } from '@core/session/auth-store';
import { MarkdownContent } from '../../internal/components/MarkdownContent';

const emptyInput: NewsInput = { title: '', summary: '', content: '' };

export function AdminNewsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const client = useAuthStore((state) => state.client);
  const setClient = useAuthStore((state) => state.setClient);
  const [editing, setEditing] = useState<News>();
  const [draft, setDraft] = useState<NewsInput>({ ...emptyInput });
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [message, setMessage] = useState<string>();
  const query = useQuery({
    queryKey: ['news', 'admin'],
    queryFn: newsApi.listAdmin,
    enabled: Boolean(client),
  });
  const save = useMutation({
    mutationFn: (input: NewsInput) =>
      editing ? newsApi.update(editing.id, input) : newsApi.create(input),
    onSuccess: () => {
      resetEditor();
      setMessage('Notícia salva como rascunho.');
      void queryClient.invalidateQueries({ queryKey: ['news'] });
    },
    onError: () => setMessage('Não foi possível salvar a notícia.'),
  });
  const action = useMutation({
    mutationFn: ({
      id,
      kind,
    }: {
      id: string;
      kind: 'publish' | 'unpublish' | 'remove';
    }) =>
      kind === 'publish'
        ? newsApi.publish(id)
        : kind === 'unpublish'
          ? newsApi.unpublish(id)
          : newsApi.remove(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['news'] }),
  });
  if (!client)
    return (
      <main className="admin">
        <section className="panel">
          <h1>Administração</h1>
          <p className="muted">Faça login para gerenciar as notícias.</p>
          <Link className="primary" to="/admin/login">
            Entrar
          </Link>
        </section>
      </main>
    );
  async function logout() {
    await authApi.logout();
    setClient(null);
    navigate('/');
  }

  function resetEditor() {
    setEditing(undefined);
    setDraft({ ...emptyInput });
    setEditorMode('write');
  }

  function editNews(news: News) {
    setEditing(news);
    setDraft({
      title: news.title,
      summary: news.summary,
      content: news.content,
    });
    setEditorMode('write');
    setMessage(undefined);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save.mutate({
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      content: draft.content.trim(),
    });
  }

  return (
    <main className="admin">
      <div className="section-head">
        <div>
          <span className="eyebrow">PAINEL</span>
          <h1>Notícias</h1>
        </div>
        <button
          className="secondary"
          onClick={() => void logout()}
          type="button"
        >
          Sair
        </button>
      </div>
      {message ? <p className="notice">{message}</p> : null}
      <div className="split">
        <section className="panel">
          <h2>{editing ? 'Editar notícia' : 'Nova notícia'}</h2>
          <form className="form" onSubmit={submit}>
            <label htmlFor="news-title">
              Título
              <input
                id="news-title"
                name="title"
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                required
                value={draft.title}
              />
            </label>
            <label htmlFor="news-summary">
              Resumo
              <textarea
                id="news-summary"
                name="summary"
                onChange={(event) =>
                  setDraft({ ...draft, summary: event.target.value })
                }
                required
                value={draft.summary}
              />
            </label>
            <div>
              <label htmlFor="news-content">Conteúdo em Markdown</label>
              <div
                aria-label="Editor de conteúdo"
                className="editor-tabs"
                role="tablist"
              >
                <button
                  aria-selected={editorMode === 'write'}
                  className={editorMode === 'write' ? 'tab active' : 'tab'}
                  onClick={() => setEditorMode('write')}
                  role="tab"
                  type="button"
                >
                  Editar
                </button>
                <button
                  aria-selected={editorMode === 'preview'}
                  className={editorMode === 'preview' ? 'tab active' : 'tab'}
                  onClick={() => setEditorMode('preview')}
                  role="tab"
                  type="button"
                >
                  Preview
                </button>
              </div>
              {editorMode === 'write' ? (
                <textarea
                  id="news-content"
                  name="content"
                  onChange={(event) =>
                    setDraft({ ...draft, content: event.target.value })
                  }
                  placeholder="Escreva usando Markdown..."
                  required
                  value={draft.content}
                />
              ) : (
                <div aria-live="polite" className="markdown-preview">
                  {draft.content.trim() ? (
                    <MarkdownContent content={draft.content} />
                  ) : (
                    <p className="muted">Digite o conteúdo para visualizar.</p>
                  )}
                </div>
              )}
            </div>
            <div className="actions">
              <button
                className="primary"
                disabled={save.isPending}
                type="submit"
              >
                Salvar rascunho
              </button>
              {editing ? (
                <button
                  className="secondary"
                  onClick={resetEditor}
                  type="button"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </section>
        <section className="panel">
          <h2>Publicadas e rascunhos</h2>
          {query.isPending ? <p className="muted">Carregando…</p> : null}
          {query.data?.news.map((news) => (
            <article className="news-row" key={news.id}>
              <div>
                <span className="tag">{news.status}</span>
                <strong>{news.title}</strong>
                <p>{news.summary}</p>
              </div>
              <div className="actions">
                <button
                  className="secondary"
                  onClick={() => editNews(news)}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="secondary"
                  onClick={() =>
                    action.mutate({
                      id: news.id,
                      kind: news.status === 'DRAFT' ? 'publish' : 'unpublish',
                    })
                  }
                  type="button"
                >
                  {news.status === 'DRAFT' ? 'Publicar' : 'Despublicar'}
                </button>
                <button
                  className="secondary danger"
                  onClick={() => action.mutate({ id: news.id, kind: 'remove' })}
                  type="button"
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
