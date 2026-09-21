import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { newsApi, type News, type NewsInput } from '@core/api/news';
import { authApi } from '@core/api/auth';
import { PageMetadata } from '@core/components/PageMetadata';
import { useAuthStore } from '@core/session/auth-store';
import { MarkdownContent } from '../../internal/components/MarkdownContent';

const emptyInput: NewsInput = { title: '', summary: '', content: '', tags: [] };

export function AdminNewsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const client = useAuthStore((state) => state.client);
  const setClient = useAuthStore((state) => state.setClient);
  const [editing, setEditing] = useState<News>();
  const [draft, setDraft] = useState<NewsInput>({ ...emptyInput });
  const [tagsText, setTagsText] = useState('');
  const [saveStatus, setSaveStatus] = useState<News['status']>('DRAFT');
  const [panelMode, setPanelMode] = useState<'create' | 'edit' | 'delete'>(
    'create',
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | News['status']>('');
  const [message, setMessage] = useState<string>();
  const query = useQuery({
    queryKey: ['news', 'admin', { search, status: statusFilter }],
    queryFn: () =>
      newsApi.listAdmin({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      }),
    enabled: Boolean(client),
  });
  const save = useMutation({
    mutationFn: async (input: NewsInput & { status: News['status'] }) => {
      if (!editing) return newsApi.create(input);
      const updated = await newsApi.update(editing.id, {
        title: input.title,
        summary: input.summary,
        content: input.content,
        tags: input.tags,
      });
      if (updated.status === input.status) return updated;
      return input.status === 'PUBLISHED'
        ? newsApi.publish(editing.id)
        : newsApi.unpublish(editing.id);
    },
    onSuccess: (_, variables) => {
      resetEditor();
      setMessage(
        variables.status === 'PUBLISHED'
          ? 'Notícia salva e publicada.'
          : 'Notícia salva como rascunho.',
      );
      void queryClient.invalidateQueries({ queryKey: ['news'] });
    },
    onError: (error: unknown) => {
      const detail =
        typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : 'Não foi possível salvar a notícia.';
      setMessage(detail);
    },
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
    onSuccess: (_, variables) => {
      setMessage(
        variables.kind === 'remove'
          ? 'Notícia excluída.'
          : variables.kind === 'publish'
            ? 'Notícia publicada.'
            : 'Notícia devolvida para rascunho.',
      );
      void queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
  if (!client)
    return (
      <main className="mx-auto w-[calc(100%-2rem)] max-w-[940px] pb-24 pt-16">
        <section className="rounded-2xl border border-[#e1e7ef] bg-white p-6 shadow-[0_10px_25px_rgb(16_33_59_/_4%)]">
          <h1 className="mb-4 mt-0 text-[clamp(2.6rem,5vw,4rem)] font-black leading-none tracking-[-0.06em] text-[#10213b]">
            Administração
          </h1>
          <p className="max-w-[50ch] text-[1.08rem] leading-[1.65] text-[#617a9d]">
            Faça login para gerenciar as notícias.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-[10px] bg-[#f0645d] px-[1.15rem] py-3.5 font-extrabold text-white"
            to="/admin/login"
          >
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
    setTagsText('');
    setSaveStatus('DRAFT');
  }

  function startCreate() {
    resetEditor();
    setMessage(undefined);
    setPanelMode('create');
  }

  function editNews(news: News) {
    const tags = news.tags ?? [];
    setEditing(news);
    setDraft({
      title: news.title,
      summary: news.summary,
      content: news.content,
      tags,
    });
    setTagsText(tags.join(', '));
    setSaveStatus(news.status);
    setMessage(undefined);
    setPanelMode('edit');
  }

  function startEditMode() {
    resetEditor();
    setMessage(undefined);
    setPanelMode('edit');
  }

  function startDeleteMode() {
    resetEditor();
    setMessage(undefined);
    setPanelMode('delete');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save.mutate({
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      content: draft.content.trim(),
      tags: [
        ...new Set(
          tagsText
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      ],
      status: saveStatus,
    });
  }

  function removeNews(news: News) {
    if (!window.confirm(`Excluir a notícia “${news.title}”?`)) return;
    action.mutate({ id: news.id, kind: 'remove' });
  }

  return (
    <>
      <PageMetadata noIndex title="Gerenciar notícias" />
      <main className="mx-auto w-[calc(100%-2rem)] max-w-[940px] pb-24 pt-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-[0.18em] text-[#f0645d]">
              PAINEL
            </span>
            <h1 className="mb-0 mt-3 text-[clamp(2.6rem,5vw,4rem)] font-black leading-none tracking-[-0.06em] text-[#10213b]">
              Notícias
            </h1>
          </div>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b9c8da] bg-white px-4 py-2.5 font-bold text-[#223a59]"
            onClick={() => void logout()}
            type="button"
          >
            Sair
          </button>
        </div>
        {message ? (
          <p className="mb-4 rounded-xl bg-[#e6f4ee] px-4 py-3 text-[#264a40]">
            {message}
          </p>
        ) : null}
        <div
          aria-label="Modos do painel de notícias"
          className="mb-5 flex w-full gap-1 rounded-xl border border-[#dce4ee] bg-[#eaf0f6] p-1"
          role="tablist"
        >
          <button
            aria-selected={panelMode === 'create'}
            className={`min-h-11 flex-1 rounded-lg px-4 py-3 text-sm font-black transition ${panelMode === 'create' ? 'bg-white text-[#10213b] shadow-sm' : 'text-[#617a9d] hover:text-[#223a59]'}`}
            onClick={startCreate}
            role="tab"
            type="button"
          >
            Criar
          </button>
          <button
            aria-selected={panelMode === 'edit'}
            className={`min-h-11 flex-1 rounded-lg px-4 py-3 text-sm font-black transition ${panelMode === 'edit' ? 'bg-white text-[#10213b] shadow-sm' : 'text-[#617a9d] hover:text-[#223a59]'}`}
            onClick={startEditMode}
            role="tab"
            type="button"
          >
            Editar
          </button>
          <button
            aria-selected={panelMode === 'delete'}
            className={`min-h-11 flex-1 rounded-lg px-4 py-3 text-sm font-black transition ${panelMode === 'delete' ? 'bg-white text-[#10213b] shadow-sm' : 'text-[#617a9d] hover:text-[#223a59]'}`}
            onClick={startDeleteMode}
            role="tab"
            type="button"
          >
            Deletar
          </button>
        </div>
        {panelMode === 'create' || (panelMode === 'edit' && editing) ? (
          <section className="rounded-2xl border border-[#e1e7ef] bg-white p-6 shadow-[0_10px_25px_rgb(16_33_59_/_4%)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-black tracking-[0.12em] text-[#f0645d]">
                  {editing ? 'MODO EDIÇÃO' : 'MODO CRIAÇÃO'}
                </span>
                <h2 className="mb-0 mt-1 text-2xl font-black tracking-[-0.04em] text-[#10213b]">
                  {editing ? 'Editar notícia' : 'Nova notícia'}
                </h2>
              </div>
              {editing ? (
                <button
                  className="text-sm font-bold text-[#617a9d] underline underline-offset-4"
                  onClick={startCreate}
                  type="button"
                >
                  Criar outra
                </button>
              ) : null}
            </div>
            <form className="grid gap-4" onSubmit={submit}>
              <label
                className="grid gap-1.5 font-bold text-[#223a59]"
                htmlFor="news-title"
              >
                Título
                <input
                  className="w-full rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#10213b] outline-none focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15"
                  id="news-title"
                  name="title"
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                  required
                  value={draft.title}
                />
              </label>
              <label
                className="grid gap-1.5 font-bold text-[#223a59]"
                htmlFor="news-summary"
              >
                Resumo
                <textarea
                  className="min-h-32 w-full resize-y rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#10213b] outline-none focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15"
                  id="news-summary"
                  name="summary"
                  onChange={(event) =>
                    setDraft({ ...draft, summary: event.target.value })
                  }
                  required
                  value={draft.summary}
                />
              </label>
              <label
                className="grid gap-1.5 font-bold text-[#223a59]"
                htmlFor="news-tags"
              >
                Tags
                <input
                  className="w-full rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#10213b] outline-none placeholder:text-[#7890ae] focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15"
                  id="news-tags"
                  onChange={(event) => setTagsText(event.target.value)}
                  placeholder="cidade, cultura, trânsito"
                  value={tagsText}
                />
                <span className="text-xs font-normal text-[#7890ae]">
                  Separe as tags por vírgulas. Use no máximo 10 tags.
                </span>
              </label>
              <div>
                <label
                  className="grid gap-1.5 font-bold text-[#223a59]"
                  htmlFor="news-content"
                >
                  Conteúdo em Markdown
                </label>
                <textarea
                  className="min-h-32 w-full resize-y rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#10213b] outline-none placeholder:text-[#7890ae] focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15"
                  id="news-content"
                  name="content"
                  onChange={(event) =>
                    setDraft({ ...draft, content: event.target.value })
                  }
                  placeholder="Escreva usando Markdown..."
                  required
                  value={draft.content}
                />
              </div>
              <fieldset className="grid gap-2">
                <legend className="font-bold text-[#223a59]">Publicação</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label
                    className={`cursor-pointer rounded-xl border p-3 transition ${saveStatus === 'DRAFT' ? 'border-[#f0645d] bg-[#fff4f3]' : 'border-[#cfd9e6] bg-[#fbfcfe]'}`}
                  >
                    <input
                      checked={saveStatus === 'DRAFT'}
                      className="sr-only"
                      name="news-status"
                      onChange={() => setSaveStatus('DRAFT')}
                      type="radio"
                      value="DRAFT"
                    />
                    <span className="block font-extrabold text-[#10213b]">
                      Salvar como rascunho
                    </span>
                    <span className="mt-1 block text-sm font-normal text-[#617a9d]">
                      A notícia fica visível apenas no painel.
                    </span>
                  </label>
                  <label
                    className={`cursor-pointer rounded-xl border p-3 transition ${saveStatus === 'PUBLISHED' ? 'border-[#f0645d] bg-[#fff4f3]' : 'border-[#cfd9e6] bg-[#fbfcfe]'}`}
                  >
                    <input
                      checked={saveStatus === 'PUBLISHED'}
                      className="sr-only"
                      name="news-status"
                      onChange={() => setSaveStatus('PUBLISHED')}
                      type="radio"
                      value="PUBLISHED"
                    />
                    <span className="block font-extrabold text-[#10213b]">
                      Publicar agora
                    </span>
                    <span className="mt-1 block text-sm font-normal text-[#617a9d]">
                      A notícia aparece imediatamente no site público.
                    </span>
                  </label>
                </div>
              </fieldset>
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#f0645d] px-[1.15rem] py-3.5 font-extrabold text-white active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={save.isPending}
                  type="submit"
                >
                  {saveStatus === 'PUBLISHED'
                    ? 'Publicar notícia'
                    : 'Salvar rascunho'}
                </button>
                {editing ? (
                  <button
                    className="inline-flex items-center justify-center rounded-full border border-[#b9c8da] bg-white px-4 py-2.5 font-bold text-[#223a59]"
                    onClick={resetEditor}
                    type="button"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </form>
            <section
              aria-live="polite"
              className="mt-8 border-t border-[#edf1f5] pt-6"
            >
              <span className="text-xs font-black tracking-[0.12em] text-[#f0645d]">
                PRÉVIA DA NOTÍCIA
              </span>
              <h3 className="mb-2 mt-2 text-2xl font-black tracking-[-0.04em] text-[#10213b]">
                {draft.title.trim() || 'Título da notícia'}
              </h3>
              <p className="mb-5 text-[#617a9d]">
                {draft.summary.trim() || 'O resumo aparecerá aqui.'}
              </p>
              {tagsText.trim() ? (
                <div className="mb-5 flex flex-wrap gap-2">
                  {tagsText
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        className="rounded-full bg-[#eaf0f6] px-3 py-1 text-xs font-bold text-[#45617f]"
                        key={tag}
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              ) : null}
              <div className="rounded-xl border border-[#e1e7ef] bg-[#fbfcfe] p-5">
                {draft.content.trim() ? (
                  <MarkdownContent content={draft.content} />
                ) : (
                  <p className="text-[#7890ae]">
                    O conteúdo renderizado em Markdown aparecerá aqui.
                  </p>
                )}
              </div>
            </section>
          </section>
        ) : (
          <section className="rounded-2xl border border-[#e1e7ef] bg-white p-6 shadow-[0_10px_25px_rgb(16_33_59_/_4%)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-black tracking-[0.12em] text-[#f0645d]">
                  {panelMode === 'delete'
                    ? 'MODO DELEÇÃO'
                    : 'SELECIONE PARA EDITAR'}
                </span>
                <h2 className="mb-0 mt-1 text-2xl font-black tracking-[-0.04em] text-[#10213b]">
                  {panelMode === 'delete'
                    ? 'Deletar notícia'
                    : 'Escolha uma notícia'}
                </h2>
              </div>
              <span className="rounded-full bg-[#f5f7fa] px-3 py-1 text-xs font-bold text-[#617a9d]">
                {query.data?.news.length ?? 0} itens
              </span>
            </div>
            <div className="mb-5 grid gap-2 sm:grid-cols-[1fr_auto]">
              <label className="relative block">
                <span className="sr-only">Pesquisar notícias</span>
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7890ae]"
                  size={17}
                />
                <input
                  aria-label="Pesquisar notícias"
                  className="w-full rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] py-3 pl-10 pr-3 text-[#10213b] outline-none focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar por título ou resumo"
                  value={search}
                />
              </label>
              <label className="relative block">
                <span className="sr-only">Filtrar por status</span>
                <select
                  aria-label="Filtrar por status"
                  className="h-full min-w-40 rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#223a59] outline-none focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15"
                  onChange={(event) =>
                    setStatusFilter(event.target.value as '' | News['status'])
                  }
                  value={statusFilter}
                >
                  <option value="">Todos os status</option>
                  <option value="DRAFT">Rascunhos</option>
                  <option value="PUBLISHED">Publicadas</option>
                </select>
              </label>
            </div>
            {query.isPending ? (
              <p className="text-[#617a9d]">Carregando…</p>
            ) : null}
            {!query.isPending && query.data?.news.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#cfd9e6] px-4 py-8 text-center">
                <p className="font-bold text-[#223a59]">
                  Nenhuma notícia encontrada.
                </p>
                <p className="mt-1 text-sm text-[#617a9d]">
                  Ajuste os filtros ou crie uma nova notícia.
                </p>
              </div>
            ) : null}
            {query.data?.news.map((news) => (
              <article
                className="mt-3 flex flex-col items-start justify-between gap-4 border-t border-[#edf1f5] pt-3 sm:flex-row sm:items-center"
                key={news.id}
              >
                <div>
                  <span className="text-xs font-black tracking-[0.08em] text-[#f0645d]">
                    {news.status}
                  </span>
                  <strong className="block text-[#10213b]">{news.title}</strong>
                  <p className="my-1 text-[#617a9d]">{news.summary}</p>
                  {(news.tags ?? []).length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(news.tags ?? []).map((tag) => (
                        <span
                          className="rounded-full bg-[#eaf0f6] px-2 py-0.5 text-xs font-bold text-[#45617f]"
                          key={tag}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {panelMode === 'edit' ? (
                    <>
                      <button
                        aria-label={`Editar ${news.title}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#b9c8da] bg-white px-4 py-2.5 font-bold text-[#223a59]"
                        onClick={() => editNews(news)}
                        type="button"
                      >
                        <Pencil size={15} />
                        Editar
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-full border border-[#b9c8da] bg-white px-4 py-2.5 font-bold text-[#223a59]"
                        onClick={() =>
                          action.mutate({
                            id: news.id,
                            kind:
                              news.status === 'DRAFT' ? 'publish' : 'unpublish',
                          })
                        }
                        type="button"
                      >
                        {news.status === 'DRAFT' ? 'Publicar' : 'Despublicar'}
                      </button>
                    </>
                  ) : null}
                  {panelMode === 'delete' ? (
                    <button
                      aria-label={`Excluir ${news.title}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#f0645d] bg-white px-4 py-2.5 font-bold text-[#d94f4a]"
                      onClick={() => removeNews(news)}
                      type="button"
                    >
                      <Trash2 size={15} />
                      Deletar
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
