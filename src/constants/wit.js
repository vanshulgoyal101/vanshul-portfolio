// Playful copy in one place. Jokes only draw on things the site already shows
// (the rocket, NASA and the rover, cricket, the bookshelf, the panda favicon),
// so they never invent facts about the author.

import { SOURCE_REPO_URL } from './siteConfig';

// One is chosen per page load and shown under the footer's name.
export const FOOTER_QUIPS = [
  'Best viewed with curiosity.',
  'No pandas were harmed in the making of this website.',
  'Handcrafted in India. Deployed by robots.',
  'Achievement unlocked: you found the footer.',
  'Built with React, three.js and an unreasonable number of commits.',
];

// One is chosen per visit to a missing page, above the plain explanation.
export const NOT_FOUND_QUIPS = [
  'Houston, we have a 404.',
  'I checked the bookshelf, the cricket kit and under the rover. Nothing.',
  'Even NASA loses contact sometimes. This one has gone dark.',
  'It may have launched without us. The rocket only needs three taps.',
  'Last seen drifting somewhere past the asteroid belt.',
];

// Shown as the tab title while the visitor is looking at another tab.
export const AWAY_TITLES = [
  '🚀 Houston, we lost a visitor',
  '👋 Come back, the rocket is fueled',
  '🐼 The panda misses you',
];

export const KONAMI_TOAST = {
  title: 'Cheat code accepted 🎮',
  message: '+30 lives granted. Sadly, none of them carry over to production.',
};

export const CONSOLE_GREETING = {
  title: 'Hey there, fellow inspector 👋',
  lines: [
    'Poking around under the hood? Respect. The whole site is open source:',
    SOURCE_REPO_URL,
    'Psst: try ↑ ↑ ↓ ↓ ← → ← → B A somewhere on the page.',
  ],
};
