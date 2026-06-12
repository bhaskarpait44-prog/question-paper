# PaperCraft — Question Paper Editor

A full-featured, browser-based Question Paper Builder for School ERP systems.  
Built with **Vite + Vanilla JS + Tailwind CSS** (modular architecture).

---

## 🚀 Quick Start (Standalone)

No build step needed for immediate use:

1. Open `question-paper-editor.html` in any modern browser
2. Start building your paper!

---

## 🛠 Vite Development Setup

```bash
npm install
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

---

## 📁 Project Structure

```
question-paper-editor/
├── index.html                      ← Vite entry point (multi-file version)
├── question-paper-editor.html      ← ✅ Standalone single-file version
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.js                     ← App entry point — wires all modules
    ├── styles/
    │   └── main.css                ← Tailwind + custom CSS variables
    ├── utils/
    │   ├── utils.js                ← uid, debounce, toast, download helpers
    │   ├── state.js                ← Centralized JSON state + pub/sub
    │   └── exporter.js             ← PDF export + JSON save/load
    ├── toolbar/
    │   └── toolbar.js              ← Toolbar rendering + command dispatch
    ├── editor/
    │   ├── editor.js               ← Main editor DOM renderer
    │   └── mathModal.js            ← KaTeX formula insertion modal
    └── preview/
        └── preview.js              ← Live preview renderer
```

---

## 🧩 Module Architecture

### `utils/state.js` — The Brain
Central state store with pub/sub pattern. The paper is stored as structured JSON:

```json
{
  "header": {
    "schoolName": "Springfield Public School",
    "examName": "Annual Examination 2024-25",
    "subject": "Mathematics",
    "class": "Class X",
    "time": "3 Hours",
    "maxMarks": "80",
    "date": "2024-03-15"
  },
  "instructions": "All questions are compulsory...",
  "sections": [
    {
      "id": "abc123",
      "title": "Section A",
      "description": "Answer all questions (1 mark each)",
      "questions": [
        {
          "id": "def456",
          "text": "Find the value of ##F_xyz## when x=2",
          "marks": 1,
          "formulas": {
            "##F_xyz##": "x^2 + 3x - 4"
          }
        }
      ]
    }
  ]
}
```

Formulas are stored as `{ placeholder: latexString }` pairs. The placeholder is
embedded in the question text so position is preserved.

### `toolbar/toolbar.js` — Command Center
- Registers `mousedown` (not click) on format buttons so focus is never lost
- Dispatches `document.execCommand()` for bold/italic/underline/lists
- Tracks `document.queryCommandState()` for active button states
- Manages `activeSectionId` for question insertion target

### `editor/editor.js` — Visual Editor
- Renders paper header fields (grid inputs)
- Renders instructions as a `contenteditable` block
- Renders sections with drag-to-delete and description input
- Renders questions with contenteditable text, marks selector, and formula button
- Extracts formula placeholders from DOM before syncing to state
- Uses `_suppressRender` flag to prevent re-render loops while typing

### `editor/mathModal.js` — Formula Input
- Two tabs: LaTeX direct input + Quick shortcut buttons
- Live KaTeX preview as you type
- Math shortcuts: fractions, powers, roots, Greek letters, trig, calculus
- Chemistry shortcuts: H₂O, CO₂, NaCl, H₂SO₄, C₆H₁₂O₆, etc.
- Returns a `latex` string; caller inserts it into state

### `preview/preview.js` — Live Preview
- Subscribes to state changes (debounced 120ms)
- Renders a clean exam paper layout with:
  - School header with gradient accent
  - Meta row (time ↔ max marks)
  - Gold-accented instructions block  
  - Crimson section headers
  - Questions with right-aligned marks badges
  - Total marks footer
- Formulas rendered inline via KaTeX

### `utils/exporter.js` — Export Engine
- **PDF**: Dynamically loads `html2pdf.js` from CDN, exports preview DOM as A4 PDF
- **JSON Save**: Downloads state as `.json` (Ctrl+S)
- **JSON Load**: File picker, validates structure, reloads state

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **Text Formatting** | Bold, Italic, Underline, H1/H2, Bullet & Numbered lists |
| **Paper Structure** | Header → Instructions → Sections (A/B/C) → Questions |
| **Auto Numbering** | Questions numbered globally (Q1, Q2, Q3 across all sections) |
| **Math Formulas** | KaTeX rendering — LaTeX input + 20 quick shortcuts |
| **Chemistry** | H₂O, CO₂, NaCl, H₂SO₄, C₆H₁₂O₆, KMnO₄ and more |
| **Marks System** | Per-question marks selector (1–10), toolbar quick-set buttons |
| **Live Preview** | Split screen, real-time formatted exam paper preview |
| **Export PDF** | html2pdf.js → A4 PDF with proper formatting |
| **Save/Load JSON** | Full structured JSON round-trip (Ctrl+S / Load button) |
| **Panel Resizer** | Drag divider to resize editor/preview panels |
| **Keyboard Shortcuts** | Ctrl+S = Save, Ctrl+P = Export PDF |

---

## 🔬 Math & Chemistry Examples

```
Fractions:    \frac{a}{b}      → a/b
Powers:       x^{2}            → x²
Square root:  \sqrt{x}         → √x
Pi:           \pi              → π
Sum:          \sum_{i=1}^{n}   → Σ
Integral:     \int_{a}^{b}     → ∫
Water:        H_2O             → H₂O
Glucose:      C_6H_{12}O_6     → C₆H₁₂O₆
Sulfuric:     H_2SO_4          → H₂SO₄
```

---

## 📦 Dependencies (All Free / Open-Source)

| Library | Version | Purpose |
|---------|---------|---------|
| KaTeX | 0.16.10 | Math formula rendering |
| html2pdf.js | 0.10.1 | PDF export (loaded on demand) |
| Vite | 5.x | Build tool (dev only) |
| Tailwind CSS | 3.x | Utility CSS (dev only) |
| Google Fonts | — | Playfair Display, DM Sans, JetBrains Mono |

---

## 🎨 Design System

- **Primary accent**: Crimson `#c0392b` (section headers, CTAs)
- **Secondary**: Gold `#d4a520` (instructions highlight)
- **Success**: Forest green `#1a6b3c` (question numbers)
- **Info**: Blue `#2563eb` (formula UI)
- **Neutral ink scale**: `--ink-50` through `--ink-950`
- **Typography**: Playfair Display (headings/paper) + DM Sans (UI) + JetBrains Mono (code)

---

## 🔧 Extending the Editor

To add a new question type (e.g., MCQ):

1. Add `type` field to question in `state.js`
2. Add rendering branch in `editor.js → buildQuestionBlock()`
3. Add preview rendering in `preview.js`
4. Optionally add a toolbar button in `toolbar.js`

---

## 📄 License

MIT — Free for personal and commercial use.
