# Gaivota FM — frontend

Frontend público e administrativo da Gaivota FM 98.1, rádio de Tramandaí/RS. O
projeto foi construído com React, TypeScript, Vite, Bun, Tailwind CSS e React
Router.

## Funcionalidades

- página inicial com apresentação da rádio, notícias recentes e player;
- navegação pública para início, notícias, quem somos e agenda;
- leitura de notícias com Markdown sanitizado;
- títulos e metadados específicos por rota para SEO básico da SPA;
- login administrativo com sessão e controle de acesso;
- painel administrativo para criar, editar, publicar, transformar em rascunho e
  excluir notícias;
- tags, filtros por status e busca no painel de notícias;
- pré-visualização da notícia usando o mesmo renderer Markdown da leitura
  pública;
- player persistente da transmissão ao vivo;
- layout responsivo com menu hamburger no mobile.

A página de agenda está temporariamente em implementação e exibe uma mensagem
informativa para o visitante.

## Rotas

| Rota           | Acesso        | Descrição                    |
| -------------- | ------------- | ---------------------------- |
| `/`            | Público       | Página inicial e player      |
| `/about`       | Público       | Quem somos                   |
| `/agenda`      | Público       | Agenda em implementação      |
| `/news`        | Público       | Lista de notícias publicadas |
| `/news/:slug`  | Público       | Leitura de uma notícia       |
| `/admin/login` | Público       | Login administrativo         |
| `/admin/news`  | Administrador | Gestão de notícias           |

## Arquitetura

O código segue uma arquitetura orientada a funcionalidades:

```text
src/
├── app/       # composição da aplicação, providers e rotas
├── core/      # API, sessão, player, layout, metadados e estilos globais
└── features/  # capacidades da aplicação organizadas por domínio de tela
    ├── about/
    ├── agenda/
    ├── auth/
    ├── home/
    └── news/
```

Cada feature pode conter `public/`, `internal/` e `use-cases/`. O arquivo
`public/index.ts` é o contrato público da feature; detalhes internos não devem
ser importados diretamente por outras features.

As regras de dependências estão em:

- `.dependency-cruiser.cjs`;
- `../backend/architecture-analysis/adrs/`.

## Pré-requisitos

- [Bun](https://bun.sh/) 1.4 ou superior;
- backend da rádio executando em `http://127.0.0.1:5000` para desenvolvimento
  completo.

## Configuração local

Instale as dependências:

```bash
bun install
```

Crie `.env` a partir de `.env.example`:

```env
VITE_API_URL=/api/v1
VITE_RADIO_STREAM_URL=https://stm16.xcast.com.br:9172/
```

Durante o desenvolvimento, o Vite encaminha `/api` para `http://127.0.0.1:5000`.
A variável `VITE_API_URL` pode continuar relativa para manter cookies e proteção
CSRF no mesmo domínio do frontend.

Inicie o servidor:

```bash
bun run dev
```

Por padrão, o Vite disponibiliza a aplicação em `http://localhost:5173`.

## Comandos

```bash
bun run dev                 # servidor de desenvolvimento
bun run build               # build de produção
bun run preview             # serve o build localmente
bun run lint                # ESLint
bun run format              # verifica formatação
bun run format:fix          # corrige formatação
bun run typecheck           # TypeScript
bun run check-deps          # valida dependências entre módulos
bun run metrics             # CLOC e Dependency Cruiser
bun check                   # validação completa e build
```

Antes de abrir uma alteração, execute:

```bash
bun check
```

O comando verifica lint, formatação, tipos, regras arquiteturais e build de
produção. O build pode emitir um aviso do Vite sobre o tamanho do bundle; isso
não significa falha da aplicação.

## Integração com o backend

A comunicação HTTP fica centralizada em `src/core/http/client.ts`. Os módulos de
API ficam em `src/core/api/` e usam cookies de sessão, credenciais incluídas e
token CSRF para operações que alteram dados.

O frontend espera os endpoints de autenticação e notícias documentados no README
do backend. O papel atualmente usado para o painel é `admin`; não há
funcionalidades acadêmicas ou entidades de estudantes neste projeto.

## Markdown das notícias

O conteúdo das notícias é escrito em Markdown e renderizado por
`react-markdown`, com suporte a GitHub Flavored Markdown e sanitização via
`rehype-sanitize`. O componente compartilhado
`src/features/news/internal/components/MarkdownContent.tsx` é usado tanto na
prévia administrativa quanto na leitura pública para manter os dois resultados
consistentes.

## Player

O player persistente usa a URL definida em `VITE_RADIO_STREAM_URL`. O estado de
reprodução é compartilhado pelo `RadioPlayerProvider`, portanto as páginas não
criam players concorrentes ao navegar entre rotas.

O stream pode não fornecer artista e título da música. Nesse caso, o player
continua funcionando, mas a aplicação não consegue exibir uma música atual ou
calcular um ranking de mais tocadas sem metadados do provedor.

## Observações

- Não coloque credenciais reais no repositório.
- O favicon e a imagem social usam a logo em `public/gaivota-fm-logo.svg`.
- A aplicação é uma SPA; cada rota atualiza o título e os metadados do documento
  no cliente por meio de `PageMetadata`.
