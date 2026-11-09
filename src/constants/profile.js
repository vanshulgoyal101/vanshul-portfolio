// Facts about the site owner. The homepage renders them and the homepage
// structured data reuses them, so search engines are only told what visitors
// can read on the page.
export const PROFILE = {
  headline: 'Engineer & independent builder',
  role: 'Associate Analyst',
  employer: { name: 'United Airlines', url: 'https://www.united.com' },
  education: {
    school: 'Punjab Engineering College',
    schoolUrl: 'https://pec.ac.in',
    degree: 'B.Tech',
    field: 'Electronics and Communication Engineering',
    minor: 'Computer Science',
    graduated: '2025',
  },
  summary:
    'I build software for real businesses, tools for curious people, and things that move beyond the screen.',
  location: 'India',
  languages: ['English', 'Hindi'],
  photo: '/images/projects/profile2.webp',
  photoAlt: 'Vanshul Goyal — Associate Analyst',
  knowsAbout: [
    'Artificial Intelligence',
    'Software Engineering',
    'Robotics',
    'The Future of Work',
    'Web Development',
  ],
};

// About-section highlight cards. `icon` is a key the About component maps.
export const HIGHLIGHTS = [
  { icon: 'graduation', value: '2025', label: 'B.Tech — Electronics & Communication Engineering' },
  { icon: 'trophy', value: 'Sports', label: 'State Level Cricket, Baseball & Softball' },
  { icon: 'rocket', value: 'Top 20', label: 'NASA HERC 2023 Global Ranking' },
  { icon: 'trophy', value: '98.6%', label: 'JEE Mains Percentile' },
];

export const SKILL_GROUPS = [
  { category: 'Languages', icon: 'java', skills: ['Java', 'Python', 'JavaScript', 'SQL'] },
  { category: 'Frontend', icon: 'react', skills: ['React', 'HTML/CSS', 'Framer Motion', 'Styled Components'] },
  { category: 'Backend', icon: 'server', skills: ['Spring Boot', 'Node.js', 'Express', 'REST APIs'] },
  { category: 'Tools', icon: 'tools', skills: ['Git', 'Docker', 'MySQL', 'Postman', 'Power BI', 'Tableau'] },
];
