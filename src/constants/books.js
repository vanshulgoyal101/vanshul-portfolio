// Curated reading list shown on the "From My Shelf" card and its dedicated
// /reading-list page. Notes are intentionally short and personal.
export const BOOKS = [
  {
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    note: "Wealth, health and peace aren't luck — they're skills. The closest thing to a manual for all three.",
  },
  {
    title: 'Exhalation',
    author: 'Ted Chiang',
    note: 'Science fiction for people who actually think. Each story is a quiet thought experiment that rearranges you.',
  },
  {
    title: 'The Lifecycle of Software Objects',
    author: 'Ted Chiang',
    note: 'What do we owe the minds we build? Chiang takes his time, and the question stays with you for years.',
  },
  {
    title: 'The Prophet',
    author: 'Kahlil Gibran',
    note: 'Old wisdom in plain clothes. Read one page, close the book, and think for an hour.',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    note: 'One simple idea that is hard to live: commit fully, and the world starts conspiring to help you.',
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    note: "Every regret is a door to a life you didn't live. The work is learning to close them and stay.",
  },
  {
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    note: 'Physics as horror. It keeps stretching your sense of scale until the present feels small.',
  },
  {
    title: 'Macbeth',
    author: 'William Shakespeare',
    note: 'Ambition with no floor. A good man talks himself into ruin, one rationalisation at a time.',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    note: "We run the planet because we can believe in things that don't exist — money, nations, gods, all stories.",
  },
  {
    title: '1984',
    author: 'George Orwell',
    note: 'Control the words and you control the thoughts. Worth rereading whenever you feel too comfortable.',
  },
  {
    title: '80,000 Hours',
    author: 'Benjamin Todd',
    note: "You'll work about 80,000 hours in a life. Spend them like they matter, because they do.",
  },
  {
    title: 'The Daily Stoic',
    author: 'Ryan Holiday',
    note: 'One page a day. Not to sound wise — to actually be a little calmer tomorrow.',
  },
];

export const ESSAYS = [
  {
    title: 'Machines of Loving Grace',
    author: 'Dario Amodei',
    url: 'https://darioamodei.com/essay/machines-of-loving-grace',
    note: 'A concrete, hopeful picture of what powerful AI could do for health, science, prosperity, peace, and human meaning.',
  },
  {
    title: 'An Alien Mind',
    author: 'Jakub Pachocki',
    url: 'https://x.com/merettm/status/2096630018495377464?s=48',
    note: 'A warning about the choices ahead as AI becomes more capable, and why the future still has to remain in human hands.',
  },
  {
    title: 'Why Are Rivers So Mathematical?',
    author: 'Natalie Wolchover',
    url: 'https://www.quantamagazine.org/why-are-rivers-so-mathematical-20260810/',
    note: 'A beautiful look at Hack’s law, river networks, and the surprising order hidden in flowing water.',
  },
  {
    title: 'Modern Sisyphus: The Absurdity of the Corporate World',
    author: 'Unwana Johnson',
    url: 'https://journal.nyphilosophy.org/p/modern-sisyphus-the-absurdity-of',
    note: 'A sharp philosophical reading of performance metrics, voluntary self-exploitation, and the corporate boulder.',
  },
  {
    title: 'Waking up science’s sleeping beauties',
    author: 'Ulkar Aghayeva',
    url: 'https://worksinprogress.co/issue/waking-up-sciences-sleeping-beauties/',
    note: 'Why important discoveries can sleep for decades, and how better connections across the literature might wake them.',
  },
  {
    title: 'The Adolescence of Technology',
    author: 'Dario Amodei',
    url: 'https://darioamodei.com/essay/the-adolescence-of-technology',
    note: 'A sober companion to Machines of Loving Grace about the risks humanity must navigate as AI becomes powerful.',
  },
];

export const SHELF_ITEMS = [...BOOKS, ...ESSAYS];
