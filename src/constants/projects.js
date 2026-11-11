// Featured projects and the secondary project directory. Plain data (no JSX)
// so the homepage components and the build-time prerender render the same
// facts. `icon` and `brand` values are keys that the Projects component maps
// to icons.

export const FEATURED_PROJECTS = [
  {
    id: 'adbrain',
    title: 'AdBrain',
    brand: 'adbrain',
    role: 'Founder & Solo Developer',
    description:
      'An AI ad-creative generator and manager for local businesses — fill a "brand brain", set a goal, and get on-brand ad variants (image + copy) ready to launch on Meta. Built as a real product, with a live solar business as customer zero.',
    image: '/images/projects/adbrain.webp?v=99a19eb',
    fallbackIcon: 'adbrain',
    stats: [
      { icon: 'rocket', text: 'Live SaaS · adbrain.vanshul.com' },
      { icon: 'code', text: 'Next.js 16 · React 19 · Supabase' },
    ],
    link: 'https://adbrain.vanshul.com',
    caseStudy: {
      problem: 'Local businesses need a repeatable way to turn their brand and campaign goal into ad creative.',
      contribution: 'Built the product end to end: brand setup, image and copy generation, and creative management.',
      decision: 'Keep reusable brand context separate from individual campaign goals so each new creative starts from the same foundation.',
      outcome: 'A live product with a solar business as its first real-world use case.',
    },
  },
  {
    id: 'tiny-arcade',
    title: 'Tiny Arcade — 12 Browser Games',
    role: 'Solo Developer',
    description:
      '12 instant-play games including 2048, reflex, memory, typing and mental maths. Lightweight TypeScript interfaces, shared game architecture and cloud leaderboards.',
    image: '/images/projects/tiny-arcade.webp',
    fallbackIcon: 'game',
    stats: [
      { icon: 'rocket', text: '12 instant-play games, including 2048' },
      { icon: 'code', text: 'TypeScript + Vite' },
    ],
    link: 'https://games.vanshul.com',
    caseStudy: {
      problem: 'Make short, replayable games that work immediately in a browser without an installation.',
      contribution: 'Built the games, responsive interfaces, shared audio and score-sharing utilities, and leaderboard integration.',
      decision: 'Separate game rules from rendering so timing, scoring and round transitions can be tested independently of the interface.',
      outcome: 'A live collection of browser games with tested game logic and shared interaction patterns.',
    },
  },
  {
    id: 'nasa-herc',
    title: 'NASA Human Exploration Rover Challenge',
    role: 'Team Lead',
    description:
      'Led a team of 6 to design and manufacture a human-powered rover for NASA HERC 2023. Achieved top 20 global ranking and engaged 12,000+ students in STEM activities.',
    image: '/images/projects/nasa-herc.webp',
    fallbackIcon: 'rocket',
    stats: [
      { icon: 'groups', text: '12k+ students reached for STEM' },
      { icon: 'money', text: '$30,000 raised via govt & private sources' },
    ],
    link: 'https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge/',
    caseStudy: {
      problem: 'Design and manufacture a human-powered rover for NASA HERC 2023.',
      contribution: 'Led a six-person team through the design and manufacturing work, alongside fundraising and STEM outreach.',
      decision: 'Take the rover from design into physical manufacture, making the engineering work accountable to a working vehicle.',
      outcome: 'Competed at NASA HERC 2023 with the team and its manufactured rover.',
    },
  },
];

// Labels for the four case-study fields, in display order.
export const CASE_STUDY_FIELDS = [
  ['problem', 'The problem'],
  ['contribution', 'My contribution'],
  ['decision', 'Engineering decision'],
  ['outcome', 'Outcome'],
];

// Compact second tier, grouped so breadth shows without clutter.
export const PROJECT_DIRECTORY = [
  {
    category: 'Live products & tools',
    items: [
      { icon: 'sun', title: 'Solaride', desc: 'A rooftop-solar business site with a savings calculator, lead capture and full local SEO — a real business I help run.', live: 'https://solaride.in' },
      { icon: 'puzzle', title: 'ctx', desc: 'An MCP server that turns any GitHub repo into agent-ready context — pack or search a whole repo for the lines that matter.', live: 'https://ctx.vanshul.com', repo: 'https://github.com/vanshulgoyal101/ctx' },
      { icon: 'tools', title: 'Dev Tools', desc: 'A privacy-first offline developer toolbox — JSON, JWT, hashing, encoding and formatters — plus a Smart Paste box that works out what you pasted.', live: 'https://tools.vanshul.com', repo: 'https://github.com/vanshulgoyal101/tools' },
    ],
  },
  {
    category: 'Open source & packages',
    items: [
      { icon: 'brain', title: 'SemCache', desc: 'A zero-cost, tiered semantic cache for LLMs using local ONNX embeddings — sub-30ms matches at $0.', repo: 'https://github.com/vanshulgoyal101/semCache' },
      { icon: 'lock', title: 'Agent Vault', desc: "A cryptographic policy firewall that vets an AI DeFi agent's transactions before signing.", repo: 'https://github.com/vanshulgoyal101/agent-vault' },
      { icon: 'envelope', title: 'Agent Mailroom', desc: 'Machine-to-machine identity and micro-payments for AI agents — DIDs and off-chain channels.', repo: 'https://github.com/vanshulgoyal101/agent-mailroom' },
      { icon: 'wrench', title: 'depshift', desc: 'Detects breaking API changes between Python package versions and auto-suggests migration patches.', repo: 'https://github.com/vanshulgoyal101/autopatch' },
      { icon: 'eye', title: 'AgentWatch', desc: 'Local-first observability and step-by-step trace replay for multi-agent LLM systems.', repo: 'https://github.com/vanshulgoyal101/agentwatch' },
      { icon: 'cube', title: 'Lego', desc: 'Zero-dependency, copy-paste code blocks — 327 crash-proof components across 23 categories.', repo: 'https://github.com/vanshulgoyal101/lego' },
      { icon: 'robot', title: 'Agent Team', desc: 'An autonomous AI software-engineering team that plans, writes and tests code from GitHub Actions.', repo: 'https://github.com/vanshulgoyal101/agent-team' },
      { icon: 'vbrain', title: 'vbrain', desc: 'An AI-queryable second-brain engine — turns Markdown notes into full-text search, a knowledge graph and an MCP server for agents. Open engine, private notes.', live: 'https://vbrain.vanshul.com', repo: 'https://github.com/vanshulgoyal101/vbrain' },
    ],
  },
  {
    category: 'Interactive experiments',
    items: [
      { icon: 'scale', title: 'The Dialectic', desc: 'Two AI personas debate any topic while a live D3 graph maps their concepts and where they clash.', repo: 'https://github.com/vanshulgoyal101/the-dialectic' },
      { icon: 'globe', title: 'Cosmic Zoom', desc: 'A "powers of ten" physics sandbox — zoom across 44 orders of magnitude with real Matter.js physics.', repo: 'https://github.com/vanshulgoyal101/cosmic-zoom' },
      { icon: 'file', title: 'Lexis', desc: 'Typography and readability analytics for long-form Markdown — Flesch, Kincaid and Gunning Fog scoring.', repo: 'https://github.com/vanshulgoyal101/lexis' },
      { icon: 'database', title: 'Memova', desc: 'Ask multiple databases questions in plain English via Gemini. FastAPI + React.', repo: 'https://github.com/vanshulgoyal101/memova' },
    ],
  },
  {
    category: 'Space & earlier',
    items: [
      { icon: 'globe', title: 'NASA Space Apps Collective', desc: 'Worked with an international team on weather visualisations for farming communities in Zimbabwe, built from open NASA soil, precipitation, temperature and humidity data and aimed at crop-rotation planning.', live: 'https://www.spaceappschallenge.org/collective/' },
      { icon: 'rocket', title: 'CanSat 2023 Ground Station', desc: 'A real-time ground-station GUI for sensor data, which I built for our team in the CanSat "satellite in a can" aerospace competition. The team went through the Preliminary Design Review.' },
      { icon: 'desktop', title: 'GoRemote', desc: 'My B.Tech major project — a virtual-office platform for remote teams (Phaser, React, Redux, PeerJS, Colyseus).', repo: 'https://github.com/vanshulgoyal101/GoRemote' },
    ],
  },
];
