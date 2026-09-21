import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { newsApi, type News, type NewsInput } from '@core/api/news';
import { authApi } from '@core/api/auth';
import { useAuthStore } from '@core/session/auth-store';

const emptyInput: NewsInput = { title: '', summary: '', content: '' };

export function AdminNewsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const client = useAuthStore((state) => state.client);
  const setClient = useAuthStore((state) => state.setClient);
  const [editing, setEditing] = useState<News>();
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
      setEditing(undefined);
      setMessage('Notícia salva.');
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
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    save.mutate({
      title: String(form.get('title')).trim(),
      summary: String(form.get('summary')).trim(),
      content: String(form.get('content')).trim(),
    });
  }
  const values = editing ?? emptyInput;
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
          <form className="form" key={editing?.id ?? 'new'} onSubmit={submit}>
            <label>
              Título
              <input defaultValue={values.title} name="title" required />
            </label>
            <label>
              Resumo
              <textarea defaultValue={values.summary} name="summary" required />
            </label>
            <label>
              Conteúdo
              <textarea defaultValue={values.content} name="content" required />
            </label>
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
                  onClick={() => setEditing(undefined)}
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
                  onClick={() => setEditing(news)}
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
