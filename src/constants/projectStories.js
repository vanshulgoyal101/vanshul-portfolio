// The full story behind each featured project, shown at /projects/<id>/.
// Kept apart from projects.js so the homepage bundle never carries it: only
// the lazy project page and the build scripts import this module.
//
// Every fact here comes from the owner's notes. Do not add numbers, dates or
// outcomes they do not state, and keep team work credited to the team.
import { FEATURED_PROJECTS } from './projects.js';
import { AUTHOR_NAME } from './siteConfig.js';
import { projectPath } from './routes.js';

export const PROJECT_STORIES = {
  adbrain: {
    seoTitle: 'AdBrain: AI ads for local businesses',
    description:
      'How I built AdBrain: describe a local business once, pick a goal, and get ad copy, images and a paused Meta campaign ready to launch.',
    summary:
      'AdBrain makes ads for local businesses. The owner describes the business once and picks a goal. AdBrain writes the copy, makes the images and prepares a Meta campaign that stays paused until the owner turns it on. I built it alone, end to end.',
    facts: [
      'Works for any kind of local business',
      'Every campaign starts paused, under a weekly spend cap',
    ],
    sections: [
      {
        heading: 'From one industry to any business',
        paragraphs: [
          'AdBrain started with a solar business, and the first version only knew solar.',
          'Then I took solar out of the product logic. The ad angles are now general, and the type of business is plain text the owner types in. The database stopped assuming solar too.',
        ],
      },
      {
        heading: 'How it works',
        paragraphs: [
          'The Brand Brain holds the business profile and its assets. It can fill itself in from the business’s website.',
          'The Creative Studio writes copy and makes an image for each ad, in several variants. The owner approves the ones they like or asks for new ones.',
          'An assistant guides the first ad. It asks one question at a time and offers answers to tap, so nobody faces a blank prompt.',
          'Campaigns go to Meta. Results come back as a plain-language summary, and a campaign can be paused or resumed from AdBrain.',
        ],
      },
      {
        heading: 'Guarding the money',
        paragraphs: [
          'Anything that can spend money sits behind one safety boundary. Campaigns are created paused. There is a weekly spend cap. AdBrain blocks turning a campaign on above the cap and can pause it on its own when the cap is reached.',
          'The AI calls have their own guard. Low-risk tasks use a cheaper pool of models, and if that pool fails the task fails. It never quietly moves to a paid model.',
        ],
      },
      {
        heading: 'Checking the ads',
        paragraphs: [
          'Generated copy passes a fixed quality check before anyone sees it. If it fails, AdBrain retries once.',
        ],
      },
    ],
    repo: 'https://github.com/vanshulgoyal101/adbrain',
    linkLabel: 'Open AdBrain',
    about: {
      '@type': 'SoftwareApplication',
      name: 'AdBrain',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://adbrain.vanshul.com',
    },
  },
  'tiny-arcade': {
    seoTitle: 'Tiny Arcade: 12 browser games',
    description:
      'Tiny Arcade: 12 small browser games, from 2048 to typing and memory, built in TypeScript with shared code and cloud leaderboards.',
    summary:
      'Tiny Arcade is 12 small games that run in the browser. There is nothing to install: open a page and play. Ten of them sit on the hub at games.vanshul.com. I built all of them myself.',
    facts: [
      '12 games, 10 of them on the hub',
      'Cloud scores and leaderboards, with Google sign-in',
    ],
    sections: [
      {
        heading: 'The games',
        paragraphs: [
          '2048. A Wordle clone. Typing (Sprint). Mental maths (Flashmath). Memory (Echo and Digit Span). Reflexes (Hue Hunt). Colour matching (Chromatic). Speed reading (Flash). Geography across 196 countries (Where). Ear training (Interval). A word of the day.',
          'Interval and the word of the day are still live, but off the hub.',
        ],
      },
      {
        heading: 'One shape for every game',
        paragraphs: [
          'Every game is laid out the same way. One file draws the screen. Another holds the rules and never touches the page.',
          'That split is what makes the rules testable. Timing, scoring and rounds run in tests without a browser.',
          'Shared modules handle audio, sound effects, overlays, share cards, number formatting and ranks. A fix in one place reaches every game.',
        ],
      },
      {
        heading: 'Scores you can trust',
        paragraphs: [
          'Scores live in Supabase. You sign in with Google on the hub, and the leaderboard loads in a single database call.',
          'Database rules clamp forged scores, and other players cannot read your saved data.',
        ],
      },
      {
        heading: 'Small games, real bugs',
        paragraphs: [
          'A fast replay could start a second animation loop and run a game at double speed. Now every start cancels the old loop first.',
          'A quick double tap could submit an answer twice. Now input is guarded before any delay.',
          'On Windows, flag emoji showed up as letters. So the geography game draws real flag images, including on share cards.',
          'In September 2026 the test suite had 754 tests across 52 files, and every game had been played through in real browsers at phone and desktop widths.',
        ],
      },
    ],
    repo: 'https://github.com/vanshulgoyal101/arcade',
    linkLabel: 'Play Tiny Arcade',
    about: {
      '@type': 'WebSite',
      name: 'Tiny Arcade',
      url: 'https://games.vanshul.com',
    },
  },
  'nasa-herc': {
    seoTitle: 'NASA HERC 2023: leading team Godspeed',
    description:
      'The story of team Godspeed at NASA HERC 2023: a human-powered rover that travelled as luggage, a Top 20 finish, $30,000 raised and 12,000+ students reached.',
    summary:
      'In 2023 I led Godspeed, a team of six, at NASA’s Human Exploration Rover Challenge. We designed and built a human-powered rover, raised $30,000 in sponsorship, and competed at NASA’s Marshall Space Flight Center in Huntsville, Alabama. We finished in the Top 20.',
    facts: [
      'Team lead of Godspeed, a team of six',
      'Selected among the top 61 teams worldwide; finished in the Top 20',
      'Competed at NASA Marshall Space Flight Center, Huntsville, Alabama',
      'August 2022 to 2023',
    ],
    sections: [
      {
        heading: 'The challenge',
        paragraphs: [
          'HERC is a student engineering competition run by NASA. Teams design and build a rover that people power themselves.',
          '61 teams from around the world were selected to compete. We were one of them, representing India.',
        ],
      },
      {
        heading: 'A rover that travels as luggage',
        paragraphs: [
          'Shipping a rover to Alabama would have cost more than we had. So we designed it to come apart.',
          'The pieces flew as checked luggage, and we put the rover back together at the venue. It arrived without damage.',
        ],
      },
      {
        heading: 'Collecting samples',
        paragraphs: [
          'The team built a sample-collection tool driven by an array of motors under microprocessor control.',
        ],
      },
      {
        heading: 'Leading the team',
        paragraphs: [
          'A lot of my job was not on the rover. It was everything that made the rover possible.',
          'We raised $30,000 (about ₹23 lakh) from government and private sponsors. I worked with professors, vendors and college administration to keep the project moving.',
          'A faculty mentor guided us. We wrote design and operational-readiness reports along with the build.',
          'We also took the project to students. Our STEM outreach reached more than 12,000 of them.',
        ],
      },
      {
        heading: 'How it went',
        paragraphs: [
          'We finished in the Top 20. The rover itself was a partial success: it did not do everything we built it to do.',
          'The strongest results came from leadership and execution: the money we raised, the students we reached, and a team of six that got a rover built and to Huntsville.',
        ],
      },
    ],
    linkLabel: 'About the challenge on nasa.gov',
    about: {
      '@type': 'Thing',
      name: 'NASA Human Exploration Rover Challenge',
      url: 'https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge/',
    },
  },
};

// A featured project merged with its story, page path and page title, or
// null for an id that has no page (the route then renders the 404 state).
export const getProjectPage = (id) => {
  const project = FEATURED_PROJECTS.find((item) => item.id === id);
  if (!project || !Object.hasOwn(PROJECT_STORIES, id)) return null;
  const story = PROJECT_STORIES[id];
  return {
    ...project,
    story,
    path: projectPath(id),
    pageTitle: `${story.seoTitle} — ${AUTHOR_NAME}`,
  };
};

// Every published project page, in the homepage's featured order.
export const PROJECT_PAGES = FEATURED_PROJECTS.map((project) => getProjectPage(project.id)).filter(Boolean);
