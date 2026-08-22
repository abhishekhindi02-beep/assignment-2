# RELATIVITY LAB

### Interactive Special Relativity Learning Platform

> **Explore the physics of space, time and motion.**
>
> *Change the observer. Change the measurement. Discover what stays invariant.*

---

## 📖 About

**Relativity Lab** is a production-quality, publicly deployable interactive educational web application covering **Chapter 6 — Special Relativity** from *Physics for the IB Diploma, 7th Edition* by K. A. Tsokos.

This is not a textbook-to-webpage conversion. It is an **interactive physics laboratory** that redesigns the chapter as a hands-on learning experience following the educational cycle:

```
OBSERVE → MANIPULATE → MEASURE → CALCULATE → UNDERSTAND → CHECK
```

## 🎯 Target Audience

- **Primary:** IB Diploma Physics students studying Special Relativity
- **Secondary:** Students revising for examinations and anyone wanting an intuitive introduction to Special Relativity

## 🧪 Selected Chapter

**Chapter 6 — Special Relativity** covering:

### Section 6.1 — Reference Frames & Lorentz Transformations
- Reference frames and inertial frames
- Galilean transformations and velocity addition
- Einstein's two postulates
- The gamma factor
- Lorentz transformations (forward and inverse)
- Spacetime interval invariance

### Section 6.2 — Effects of Relativity
- Time dilation and proper time
- Length contraction and proper length
- Relativistic velocity addition
- Relativity of simultaneity (train experiment)
- Muon decay — experimental evidence
- Real-world applications (GPS, particle accelerators)

### Section 6.3 — Spacetime Diagrams
- Interactive spacetime diagram engine
- Worldlines, lightlines, and photon paths
- Future and past light cones
- Causality explorer
- Moving reference-frame axes (primed axes)
- Primed-axis scale
- Length contraction, time dilation, and simultaneity on diagrams
- Event ordering

## ✨ Key Interactive Features

| Feature | Description |
|---------|-------------|
| **Lorentz Event Transformer** | Bidirectional coordinate transformation with live visualization |
| **Time Dilation Lab** | Dual-clock comparison with animated visualization |
| **Length Contraction Lab** | Interactive spaceship/rod that contracts with velocity |
| **Velocity Addition Lab** | Galilean vs relativistic comparison with light-speed invariance |
| **Simultaneity Train Experiment** | Animated thought experiment with frame switching |
| **Muon Decay Simulation** | Dual-frame explanation with Earth and muon perspectives |
| **Spacetime Diagram Studio** | Interactive SVG diagrams with event placement and worldlines |
| **Light Cone Explorer** | Click-to-test causality with mathematical justification |
| **Primed Axis Visualization** | Moving reference frame axes with scale indicators |
| **The Relativity Mission** | 10-stage integrated final challenge |

## 🏗️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| [React](https://react.dev) 18 | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) 4 | Utility-first styling |
| [KaTeX](https://katex.org) | LaTeX math rendering |
| [React Router](https://reactrouter.com) v6 | Client-side navigation |
| [Lucide React](https://lucide.dev) | Lightweight icons |
| SVG | Scientific diagrams & visualizations |

## 🏛️ Architecture

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # AppShell, Sidebar, SectionLayout
│   ├── math/            # MathBlock, InlineMath, FormulaCard
│   ├── quiz/            # QuizCard, NumericQuiz
│   └── ui/              # CalloutCard, ControlSlider, StepReveal
├── features/            # Feature modules (one per topic)
│   ├── landing/         # Hero page
│   ├── referenceFrames/ # Reference frames & events
│   ├── galilean/        # Galilean transformations
│   ├── postulates/      # Einstein's postulates + gamma
│   ├── lorentz/         # Lorentz transformations + interval
│   ├── timeDilation/    # Time dilation lab
│   ├── lengthContraction/ # Length contraction lab
│   ├── velocityAddition/  # Velocity addition lab
│   ├── simultaneity/    # Train thought experiment
│   ├── muon/            # Muon decay simulation
│   ├── spacetime/       # Spacetime diagram studio
│   ├── lightCones/      # Light cones & causality
│   ├── worldlines/      # Worldlines & events
│   ├── lab/             # Integrated calculation lab
│   ├── challenge/       # Final Relativity Mission
│   └── reflection/      # Self-assessment
├── physics/             # Centralized physics calculations
│   └── relativity.ts    # All SR formulas with validation
├── hooks/               # Custom React hooks
│   └── useProgress.ts   # localStorage progress tracking
└── types/               # TypeScript type definitions
    └── index.ts
```

### Physics Engine

All Special Relativity calculations are centralized in `src/physics/relativity.ts`:

- `gamma(v)` — Lorentz factor
- `lorentzX(x, t, v)` / `lorentzT(x, t, v)` — Forward Lorentz transformation
- `inverseLorentzX()` / `inverseLorentzT()` — Inverse transformation
- `timeDilation(properTime, v)` — Time dilation
- `lengthContraction(properLength, v)` — Length contraction
- `relativisticVelocityAdd(u', v)` — Relativistic velocity addition
- `spacetimeInterval(Δt, Δx)` — Invariant interval
- `isCausallyConnected()` — Causality checker

All functions include input validation (|v| < c) and safe error handling.

## 🎨 UX Philosophy

Every major concept follows the learning cycle:

1. **OBSERVE** — See the phenomenon
2. **MANIPULATE** — Change a parameter (velocity, position, frame)
3. **MEASURE** — Read the resulting values
4. **CALCULATE** — See the governing equation
5. **UNDERSTAND** — Read the explanation
6. **CHECK** — Answer a concept question

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment

The application is a static single-page app ready for deployment to:

- **Vercel**: Connect GitHub repo → automatic deploys
- **Netlify**: Connect GitHub repo → automatic deploys
- **GitHub Pages**: Use `npm run build` and deploy `dist/`
- **Cloudflare Pages**: Connect GitHub repo → automatic deploys

No environment variables, authentication, or backend required.

For SPA routing support, add a redirect rule:
- **Netlify**: Create `public/_redirects` with `/* /index.html 200`
- **Vercel**: Handled automatically

## 📱 Responsiveness

Fully responsive from **375px** to large desktop:

| Breakpoint | Layout |
|-----------|--------|
| 375px+ | Mobile: collapsible navigation drawer, stacked layouts |
| 768px+ | Tablet: wider content area |
| 1024px+ | Desktop: persistent sidebar + content |
| 1440px+ | Large desktop: comfortable reading width |

## ♿ Accessibility

- Semantic HTML5 elements
- Keyboard navigation support
- Visible focus states
- ARIA labels on interactive elements
- Sufficient color contrast
- `prefers-reduced-motion` support
- Non-color-only feedback for quiz answers

## 🔬 Scientific Accuracy

- All formulas rendered with **KaTeX** (authentic LaTeX)
- Calculations centralized and validated in the physics engine
- Edge cases handled: v=0, v→c, v≥c (rejected)
- Correct definitions: proper time, proper length, invariant interval
- No physically impossible outputs (NaN, Infinity) reach the UI
- Content faithful to *Physics for the IB Diploma, 7th Edition*

## 📄 License

Educational project — Chapter 6 content based on *Physics for the IB Diploma, 7th Edition, K. A. Tsokos*.

---

Built with ⚛️ React + TypeScript + Vite + Tailwind CSS + KaTeX
