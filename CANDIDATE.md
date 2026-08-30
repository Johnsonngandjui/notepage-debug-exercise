# Notepage

Notepage is a scaled-down, single-page block editor in the spirit of Notion. A page is a
flat, ordered list of blocks; each block holds its own text and has a type (Text, Heading,
To-do, Bullet).

The editor supports:

- editing block text inline, and renaming the page
- adding, duplicating, reordering and deleting blocks
- changing a block's type, and checking off to-do blocks
- a **Page stats** panel: words, characters, blocks, headings, empty blocks, to-do
  progress, reading time and the current selection
- a **Search** panel that finds text across the page and highlights matching blocks
- an **Outline** panel listing the page's headings
- undo / redo
- "Copy as Markdown"
- the page is saved to `localStorage`, so a reload keeps your edits ("Reset page" restores
  the sample document)

Keyboard: `Alt + ↑` / `Alt + ↓` moves the selection between blocks.

## Requirements

- Node.js 20.19+ (or 22.13+)
- npm

## Setup

```bash
npm install
```

## Running the app

```bash
npm run dev
```

Then open http://localhost:5173. The dev server hot-reloads, so you can edit code and see
the result immediately.

## Tests

```bash
npm test                                  # whole suite
npm test -- src/utils/stats.test.ts       # one file
npm test -- -t "counts headings"          # tests matching a name
npm run test:watch                        # watch mode
```

## Typecheck, lint and build

```bash
npm run typecheck
npm run lint
npm run build
```

## Codebase structure

```
src/
  main.tsx                  React entry point
  App.tsx                   Top-level layout; wires state, stats and search together
  styles.css

  components/               Presentational React components
    Toolbar.tsx             Page title + add / undo / redo / export / reset buttons
    BlockList.tsx           Renders the ordered list of blocks
    BlockRow.tsx            A single editable block row and its per-block actions
    Sidebar.tsx             Composes the three sidebar panels
    StatsPanel.tsx          Page statistics
    SearchPanel.tsx         Search box and result list
    OutlinePanel.tsx        Heading outline

  hooks/                    React glue between the UI and the logic below
    useEditorState.ts       Owns the reducer, persistence and undo/redo flags
    useDocumentStats.ts     Derives page statistics from the document
    useSearch.ts            Owns the query and the derived match set
    useKeyboardNavigation.ts

  state/                    Application state
    actions.ts              The action union
    documentReducer.ts      Every state transition, including history

  editor/                   Editor domain logic (no React)
    blockFactory.ts         Creating, copying and retyping blocks
    selection.ts            Which block is selected, and how selection moves
    serialize.ts            Markdown export

  utils/                    Pure, framework-free helpers
    text.ts                 Word/character counting, normalisation, truncation
    stats.ts                Document-wide statistics
    search.ts               Substring search across a document
    ids.ts

  types/
    document.ts             Block and PageDocument types

  services/
    sampleDocument.ts       The page a fresh session starts from
    persistence.ts          localStorage load/save + validation
```

Tests live next to the code they cover as `*.test.ts`.
