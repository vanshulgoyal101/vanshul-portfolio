// src/constants/portfolioData.js

export const bioData = {
  name: "Vanshul Goyal",
  title: "Engineer & Co-founder",
  email: "vanshulgoyal101@gmail.com",
  github: "https://github.com/vanshulgoyal101",
  linkedin: "https://www.linkedin.com/in/vanshul-goyal00/",
  twitter: "https://x.com/goyal_vanshul",
  instagram: "https://www.instagram.com/vanshul_goyal/",
  tagline: "Driven by curiosity, grounded in engineering.",
  aboutText: [
    "I am a recent graduate from Punjab Engineering College with a B.Tech in Electronics and Communication Engineering and a minor in Computer Science.",
    "Currently, I navigate air operations databases as an Associate Analyst at United Airlines, while scaling sustainable energy access across India as the Co-Founder of Solaride.",
    "My path is shaped by the search for how things work. Whether leading teams for NASA research rover engineering challenges or designing HIPAA-compliant healthcare software, I thrive in places where technology intersects with human purpose.",
    "When my screens are closed, I am reading books on history, discussing philosophy, playing cricket in parks, or exploring new cities and cultures."
  ],
  education: {
    degree: "B.Tech in Electronics and Communication Engineering",
    school: "Punjab Engineering College",
    year: "Class of 2025"
  },
  achievements: [
    { number: "Top 20", label: "Global Rank at NASA HERC 2023" },
    { number: "30", label: "Selected Global Space Leaders in NASA Apps Collective" },
    { number: "State", label: "Level Representative in Cricket & Baseball" },
    { number: "98.6%", label: "Score in Joint Entrance Exam (JEE Mains)" }
  ],
  skills: {
    "Languages": ["Java", "Python", "JavaScript", "SQL", "C++"],
    "Frontend": ["React", "HTML5/CSS3", "Framer Motion", "Three.js"],
    "Backend": ["Spring Boot", "Node.js", "Express", "RESTful APIs"],
    "Tools & Platforms": ["Git", "Docker", "MySQL", "Tableau", "Power BI", "Postman"]
  }
};

export const experiences = [
  {
    id: "work-united",
    role: "Associate Analyst",
    company: "United Airlines",
    department: "Air Operations",
    duration: "Jul 2025 - Present",
    location: "Gurugram, India",
    domain: "Aviation Operations & Data",
    description: "Analyzing operations databases and automating reporting flows to optimize airline efficiency. Working closely with cross-functional aviation systems teams.",
    tech: ["Power BI", "SQL", "Tableau", "Data Analysis"]
  },
  {
    id: "work-solaride",
    role: "Co-Founder",
    company: "Solaride",
    department: "Operations & Strategy",
    duration: "2024 - Present",
    location: "Chandigarh, India",
    domain: "Clean Energy Infrastructure",
    description: "Directing project implementations under government clean-energy schemes (PM Surya Ghar & PM KUSUM). Managing field coordination, vendor pipelines, and business development.",
    tech: ["Operations", "Project Management", "Business Strategy", "Solar Energy"],
    link: "https://solaride.in"
  },
  {
    id: "work-zhealth",
    role: "Software Development Engineer Intern",
    company: "zHealth",
    department: "Engineering",
    duration: "2023 - 2024",
    location: "San Francisco, US (Remote)",
    domain: "Digital Health & Software",
    description: "Designed HIPAA-compliant portal screens and automated provider workflows. Developed backend REST endpoints to securely handle patient health documents and logs.",
    tech: ["Java", "Spring Boot", "JavaScript", "MySQL"]
  }
];

export const projects = [
  {
    id: "proj-solaride",
    title: "Solaride Energy",
    role: "Co-Founder",
    domain: "Renewables EPC",
    description: "Accelerating clean energy transition in India by designing, financing, and installing rooftop and agricultural solar arrays.",
    image: "/images/projects/Solaride.png",
    stats: [
      { label: "Focus", value: "Rooftop Solar & Solar Pumps" },
      { label: "Scope", value: "PM Surya Ghar & KUSUM" }
    ],
    link: "https://solaride.in"
  },
  {
    id: "proj-nasa-herc",
    title: "NASA Human Exploration Rover Challenge",
    role: "Team Lead SEDS PEC",
    domain: "Planetary Mobility & Robotics",
    description: "Assembled and led a team of 6 engineers to manufacture a human-powered mechanical rover. Achieved Top 20 global ranking at Huntsville, Alabama.",
    image: "/images/projects/nasa-herc.jpg",
    stats: [
      { label: "Outreach", value: "12,000+ Students Engaged" },
      { label: "Funding", value: "$30,000 Raised" }
    ],
    link: "https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge/"
  },
  {
    id: "proj-nasa-apps",
    title: "NASA Space Apps Collective",
    role: "Global Community Member",
    domain: "Satellite Telemetry Visualization",
    description: "Appointed to NASA Space Apps community. Collaborated globally to build weather visualization systems for Zimbabwean smallholders.",
    image: "/images/projects/spaceapps.png",
    stats: [
      { label: "Collaboration", value: "30 Space Leaders" },
      { label: "Data Source", value: "NASA Earth Observations" }
    ],
    link: "https://www.spaceappschallenge.org/collective/"
  }
];

export const wisdomQuotes = [
  {
    quote: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
    author: "Marcus Aurelius",
    category: "Philosophy"
  },
  {
    quote: "Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.",
    author: "Naval Ravikant",
    category: "Philosophy"
  },
  {
    quote: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
    category: "Space"
  },
  {
    quote: "Two possibilities exist: either we are alone in the Universe or we are not. Both are equally terrifying.",
    author: "Arthur C. Clarke",
    category: "Space"
  },
  {
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    category: "Philosophy"
  },
  {
    quote: "Time discovers truth.",
    author: "Seneca",
    category: "Philosophy"
  },
  {
    quote: "The more you know of history, the more liberate you are.",
    author: "David McCullough",
    category: "History"
  },
  {
    quote: "Art washes away from the soul the dust of everyday life.",
    author: "Pablo Picasso",
    category: "Art"
  },
  {
    quote: "The world is a book and those who do not travel read only one page.",
    author: "Augustine of Hippo",
    category: "Travel"
  }
];

export const chatbotKnowledge = {
  welcomeMessage: "Hey! I'm AI Vanshul, a virtual conversational assistant. Ask me about Solaride, NASA HERC, United Airlines, my favorite books, travel logs, or philosophy!",
  defaultSuggestions: [
    "Tell me about Solaride.",
    "What was the NASA Rover project?",
    "Where have you traveled recently?",
    "What is your philosophy on work?"
  ],
  answers: {
    solaride: "Solaride is a clean-energy EPC (Engineering, Procurement, and Construction) company I co-founded. We specialize in rooftop solar installations and solar pumps under national initiatives like PM Surya Ghar and PM KUSUM, making renewable energy accessible to homes, factories, and agricultural farms.",
    nasa_herc: "In 2023, I led a 6-member team from PEC to design and build an off-road human-powered vehicle for NASA's Human Exploration Rover Challenge in Huntsville, Alabama. We achieved a Top 20 global rank, raised $30k in sponsorships, and conducted STEM outreach for over 12k students.",
    nasa_apps: "I was selected as one of 30 global community leaders for the NASA Space Apps Collective, where I worked with an international team developing meteorological interfaces to support farming operations in Zimbabwe.",
    united: "At United Airlines, I work as an Associate Analyst in the Air Operations division. I focus on operating databases, operational reporting automation, and analytics to optimize aircraft flow and efficiency.",
    travel: "I love traveling to learn about history, architecture, and cultures. I'm currently planning to write blog entries detailing my travel logs, focusing on local street cultures, architecture, and historical monuments.",
    philosophy: "I'm deeply influenced by Stoic philosophy (Marcus Aurelius, Seneca) and modern thinkers like Naval Ravikant. I believe that professional focus should follow genuine interest and curiosity, and that personal character is the ultimate metric of a happy life.",
    books: "Some of my favorite books include 'Meditations' by Marcus Aurelius, 'The Almanack of Naval Ravikant', and volumes of world history. I love reading about the rise and fall of civilizations.",
    sports: "I am passionate about sports and have represented my region at the state level in cricket, baseball, and softball. Sports taught me key lessons about team dynamics and pressure execution.",
    fallback: "That's an interesting question! I might not have that specific detail pre-loaded in my sandbox knowledge database. Feel free to connect with the real Vanshul on LinkedIn or send a message via the contact form!",
    private_info: "To protect my privacy, I don't share details like my phone number, physical home address, or internal airline operational stats here. Let's connect on LinkedIn or email me directly for professional conversations!"
  }
};

export const bookshelfData = [
  { title: "Meditations", author: "Marcus Aurelius", category: "Philosophy" },
  { title: "Cosmos", author: "Carl Sagan", category: "Space & Future" },
  { title: "A Short History of Nearly Everything", author: "Bill Bryson", category: "History & Science" },
  { title: "The Story of Art", author: "E.H. Gombrich", category: "Art & Culture" }
];
