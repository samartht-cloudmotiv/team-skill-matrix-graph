# Team Skill Matrix Graph

An interactive, visually immersive Team Skill Matrix Graph built for Assignment 2. Visualises team members, their skills, and proficiency levels as a force-directed graph with an **RPG Skill Tree** aesthetic — think Path of Exile meets a team dashboard.

## Features

- **Interactive Graph** — Force-directed layout with drag-and-drop node positioning
- **RPG Visual Theme** — Dark atmospheric background, gold character-card person nodes, category-coloured hexagonal skill nodes
- **Proficiency Levels** — Learning / Familiar / Expert visualised via star ratings, edge thickness, and animated glow effects
- **Parallax Particle Background** — Multi-layer depth effect with nebula blobs and floating motes
- **Full CRUD** — Add, edit, and delete people, skills, and connections via polished dialogs
- **Detail Panels** — Character sheet (person) and ability info (skill) panels slide in on node click
- **Guild Stats Panel** — Team overview: top skills leaderboard, skill gaps, proficiency distribution, hero rankings
- **Node Highlighting** — Click a node to highlight connected nodes; unconnected nodes dim out
- **Persistent State** — All data stored in `localStorage` via Zustand; survives page refreshes
- **Seed Data** — Ships with realistic sample team data loaded on first visit from CSV files

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Graph | `@xyflow/react` (React Flow v12) |
| Layout | `d3-force` (synchronous, stable) |
| Animations | Framer Motion |
| State | Zustand + `persist` middleware |
| UI Components | shadcn/ui (base-ui) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| CSV Parsing | PapaParse |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/samartht-cloudmotiv/team-skill-matrix-graph.git
cd team-skill-matrix-graph

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage

### Navigating the Graph
- **Pan** — Click and drag on the background
- **Zoom** — Scroll wheel or use the zoom controls (bottom-left)
- **Move nodes** — Drag any node; positions persist until you click "Reset Layout"
- **Select a node** — Click to open the detail panel and highlight connected nodes
- **Deselect** — Click the same node again, or click the background, or press the X on the panel

### Managing Data
- **Add** — Use the **+** button in the header to add a person, skill, or connection
- **Edit** — Open the detail panel for a node, then click the Edit (pencil) icon
- **Delete** — Open the detail panel, click the trash icon; connections cascade-delete automatically
- **Link skills** — From a person's detail panel, click "Link Skill" to create a proficiency connection

### Proficiency Levels
| Level | Stars | Edge Style |
|---|---|---|
| Learning | ★☆☆ | Thin dashed, dim |
| Familiar | ★★☆ | Medium solid |
| Expert | ★★★ | Thick solid + animated pulse glow |

### Node Types
| Type | Shape | Colour |
|---|---|---|
| Person | Rounded card | Gold / amber |
| Skill — Frontend | Hexagon | Emerald green |
| Skill — Backend | Hexagon | Indigo blue |
| Skill — DevOps | Hexagon | Amber orange |
| Skill — Design | Hexagon | Rose pink |

## Seed Data

On first load, the app seeds sample data from:
- `public/data/people.csv` — Team members with roles
- `public/data/skills.csv` — Skills with categories
- `public/data/connections.csv` — Who knows what, at what proficiency level

To reset to seed data: open your browser's DevTools → Application → Local Storage → delete the `skill-matrix` key, then refresh.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages + global styles
├── components/
│   ├── graph/              # React Flow nodes, edges, particle background
│   ├── panels/             # Detail panels (person, skill, summary)
│   ├── forms/              # CRUD dialogs (add/edit/delete)
│   └── layout/             # Header, Legend
├── hooks/                  # useGraphData, useSeedData
└── lib/                    # Store (Zustand), types, constants, layout (d3-force)
public/
└── data/                   # Seed CSV files
```
