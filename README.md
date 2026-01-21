# Trusted Hand - Frontend Challenge

Transform this functional-but-ugly citation verification interface into a world-class experience.

## The Product

Trusted Hand verifies citations in legal briefs. Lawyers upload a document, and the system checks whether cited cases exist, quotes are accurate, and authorities are still good law.

This starter shows the **annotated document view**—where users scroll through their brief, see flags on problematic citations, and click to understand what's wrong.

## Your Task

The app works. It's just... rough.

- The brief content is **markdown**, but it's rendered as plain text
- No visual design (system fonts, no spacing, no color system)
- No interactions (no hover states, no transitions, no animations)
- Poor layout (edge-to-edge content, always-visible sidebar)
- No polish (no loading states, no empty states, no keyboard navigation)

**Make it feel like a product lawyers would trust and enjoy using.**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the current state.

## Tech Stack

**Provided:**
- Vite + React 18 + TypeScript
- Tailwind CSS

**Allowed:**
- Markdown rendering libraries (react-markdown, marked, etc.)
- Animation libraries (Framer Motion, React Spring, etc.)
- Icon libraries (Lucide, Heroicons, etc.)
- Utility libraries (clsx, date-fns, etc.)

**Not Allowed:**
- UI component libraries (shadcn/ui, Material UI, Chakra, Radix, Ant Design)
- CSS frameworks with pre-built components (Bootstrap, Bulma)

We want to see *your* design sensibilities, not a library's defaults.

## What You Can Do

- Completely redesign the visual appearance
- Add micro-interactions and animations
- Restructure components and layout
- Change the data shape if it helps your design
- Add features beyond the minimum

## What We're Evaluating

### Visual Design
Typography choices, spacing rhythm, color usage, visual hierarchy. Can you make dense legal information feel approachable without dumbing it down?

### Interaction Design
Hover states, transitions, micro-animations, action feedback. Does clicking a flag feel crafted and responsive?

### Edge Cases
Empty states, loading states, error handling, long content. Did you think beyond the happy path?

### Performance Awareness
Are interactions snappy? Did you avoid unnecessary re-renders? Lawyers use this under deadline pressure—sluggishness erodes trust.

### Creative Additions
What did you add that we didn't ask for? Keyboard shortcuts? A mini-map? Filtering? This shows product thinking—whether you can see what a user would actually want.

## Sample Data

The starter includes a fictional motion to dismiss with 6 citations. The brief content is **markdown-formatted** with headings, lists, blockquotes, and emphasis. Citation markers appear as `[[CITATION:n]]` in the text—you'll need to handle rendering markdown while replacing these markers with clickable citation elements.

| Citation | Status | Severity |
|----------|--------|----------|
| Bell Atlantic Corp. v. Twombly | Valid | None |
| Ashcroft v. Iqbal | Quote Mismatch | Warning |
| Henderson v. United States Dep't of Justice | Not Found | Critical |
| Dura Pharmaceuticals, Inc. v. Broudo | Valid | None |
| Basic Inc. v. Levinson | Overruled | Warning |
| Tellabs, Inc. v. Makor Issues & Rights | Valid | None |

## Deliverables

### 1. GitHub Repository
- Fork this repo
- Clear commit history showing your process
- Update this README with setup instructions for your version

### 2. Design Rationale (500 words max)
What decisions did you make and why? What trade-offs did you consider? What would you do with more time?

### 3. Loom Video (3-5 minutes)
Walk us through the experience as a user would encounter it. Highlight 1-2 technical decisions you're proud of. Show us something we might miss just clicking around.

## Time Budget

**4-6 hours.** Stop there. We mean it.

If you're past 6 hours, stop. A beautiful, polished subset beats a complete but rough implementation. Scope down if needed—we'd rather see taste than sprawl.

## Project Structure

```
src/
├── components/
│   ├── BriefViewer.tsx    # Renders brief with citation highlights
│   └── DetailPanel.tsx    # Shows verification details for selected citation
├── data/
│   └── sampleBrief.ts     # Sample brief and verification results
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Main app component
└── main.tsx               # Entry point
```

## Questions?

Reply to the challenge email—we're happy to clarify anything.

Good luck. We're excited to see what you build.
# lh-ai-fe-ch
