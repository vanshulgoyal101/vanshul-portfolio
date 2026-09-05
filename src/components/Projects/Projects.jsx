// src/components/Projects/Projects.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaExternalLinkAlt, FaCode, FaGithub, FaBullseye, FaSun, FaPuzzlePiece, FaTools, FaBrain, FaLock, FaEnvelope, FaWrench, FaEye, FaCube, FaRobot, FaBalanceScale, FaGlobeAmericas, FaDesktop, FaFileAlt, FaDatabase } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';
import { IoGameController } from 'react-icons/io5';

// ─── Styled Components ────────────────────────────────────────────────────────

const ProjectsSection = styled.section`
  position: relative;
  background: transparent;
  padding: 2rem 0 var(--spacing-2xl);

  @media (max-width: 768px) {
    padding: 1rem 0 var(--spacing-xl);
  }
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-lg);

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-md);
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--text-section-title);
  margin-bottom: var(--spacing-md);
  padding-top: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

`;

const SectionSubtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`;

const ProjectCard = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  min-width: 0;
  overflow: hidden;
  position: relative;
  transition: border-color 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08), 
                0 0 0 1px rgba(29, 78, 216, 0.05);
    transform: translateY(-6px);
  }
`;

const ProjectImageWrapper = styled.div`
  aspect-ratio: 8 / 5;
  overflow: hidden;
  background: var(--color-bg-secondary);
  position: relative;
`;

const ProjectImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  transition: transform 0.4s ease;

  ${ProjectCard}:hover & {
    transform: scale(1.04);
  }
`;

/* Fallback gradient shown when image is missing */
const ProjectImageFallback = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(54, 217, 138, 0.2), rgba(54, 217, 138, 0.06));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #36d98a;
  font-size: 2.5rem;
  opacity: 0.7;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  overflow-wrap: anywhere;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
`;

const ProjectRole = styled.p`
  font-size: var(--text-sm);
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-md);
  font-weight: 500;
`;

const ProjectDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
  font-size: var(--text-base);

  @media (max-width: 768px) {
    font-size: var(--text-sm);
    margin-bottom: var(--spacing-sm);
  }
`;

const ProjectStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);

  svg {
    color: var(--color-accent-primary);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: var(--text-xs);
  }
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--spacing-xs) 0;
  min-height: 44px;
  transition: gap 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    text-decoration: underline;
    
    svg {
      transform: translateX(4px);
    }
  }

  @media (max-width: 768px) {
    min-height: 48px;
  }
`;

/* ── "More projects" compact tier ── */

const MoreProjects = styled.div`
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
`;

const CaseStudy = styled.details`
  margin: 1rem 0;
  border-top: 1px solid var(--color-border);

  summary {
    cursor: pointer;
    padding: 0.75rem 0;
    font-weight: 600;
    color: var(--color-accent-primary);
  }

  dt { font-weight: 600; margin-top: 0.75rem; }
  dd { margin: 0.25rem 0 1rem; color: var(--color-text-secondary); font-size: 0.9375rem; }
`;

const MoreHeader = styled(motion.div)`
  text-align: left;
  margin-bottom: var(--spacing-md);
`;

const MoreTitle = styled.h3`
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);

  @media (max-width: 768px) {
    font-size: var(--text-xl);
  }
`;

const MoreSubtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--text-base);
`;

const CategoryGroup = styled.div`
  margin-top: 2rem;
`;

const CategoryLabel = styled.h4`
  font-size: var(--text-sm);
  letter-spacing: 0;
  color: var(--color-text-secondary);
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const CompactCard = styled(motion.div)`
  min-width: 0;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const CompactTop = styled.div`
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
`;

const CompactIcon = styled.span`
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
`;

const VBrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375M6.003 5.125A3 3 0 0 0 6.401 6.5M3.477 10.896a4 4 0 0 1 .585-.396M19.938 10.5a4 4 0 0 1 .585.396M6 18a4 4 0 0 1-1.967-.516M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
);

const CompactName = styled.h5`
  font-size: var(--text-base);
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
`;

const CompactDesc = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.55;
  margin: 0 0 0 2.25rem;
`;

const CompactLinks = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--color-text-secondary);
  border-radius: 6px;

  &:hover {
    color: var(--color-accent-primary);
    background: var(--color-bg-secondary);
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: 1,
    title: 'AdBrain',
    role: 'Founder & Solo Developer',
    description: 'An AI ad-creative generator and manager for local businesses — fill a "brand brain", set a goal, and get on-brand ad variants (image + copy) ready to launch on Meta. Built as a real product, with a live solar business as customer zero.',
    image: '/images/projects/adbrain.webp',
    fallbackIcon: <FaBullseye />,
    stats: [
      { icon: <FaRocket />, text: 'Live SaaS · adbrain.vanshul.com' },
      { icon: <FaCode />, text: 'Next.js 16 · React 19 · Supabase' },
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
    id: 2,
    title: 'Tiny Arcade — 10 Browser Games',
    role: 'Solo Developer',
    description: 'Instant-play games for reflexes, memory, typing and mental maths. Lightweight TypeScript interfaces, shared game architecture and cloud leaderboards.',
    image: '/images/projects/tiny-arcade.webp',
    fallbackIcon: <IoGameController />,
    stats: [
      { icon: <FaRocket />, text: '10 instant-play games' },
      { icon: <FaCode />, text: 'TypeScript + Vite' },
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
    id: 3,
    title: 'NASA Human Exploration Rover Challenge',
    role: 'Team Lead',
    description: 'Led a team of 6 to design and manufacture a human-powered rover for NASA HERC 2023. Achieved top 20 global ranking and engaged 12,000+ students in STEM activities.',
    image: '/images/projects/nasa-herc.webp',
    fallbackIcon: <FaRocket />,
    stats: [
      { icon: <MdGroups />, text: '12k+ students reached for STEM' },
      { icon: <BiMoney />,  text: '$30,000 raised via govt & private sources' },
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

// Compact second tier — grouped so breadth shows without clutter.
const moreProjects = [
  {
    category: 'Live products & tools',
    items: [
      { icon: <FaSun />, color: '#f2ae68', title: 'Solaride', desc: 'A rooftop-solar business site with a savings calculator, lead capture and full local SEO — a real business I help run.', tags: ['Business', 'SEO'], live: 'https://solaride.in' },
      { icon: <FaPuzzlePiece />, color: '#82b7ff', title: 'ctx', desc: 'An MCP server that turns any GitHub repo into agent-ready context — pack or search a whole repo for the lines that matter.', tags: ['MCP', 'Cloudflare'], live: 'https://ctx.vanshul.com', repo: 'https://github.com/vanshulgoyal101/ctx' },
      // Only one MCP server is featured; ctx is the stronger of the two (2x the code,
      // 6 tools vs 4). mcp is still live at mcp.vanshul.com — to restore it, re-add
      // FaBookOpen to the react-icons/fa import above and uncomment the line below.
      // { icon: <FaBookOpen />, color: '#8fd3ff', title: 'mcp', desc: 'An MCP server that reads the live web as clean Markdown for AI agents.', tags: ['MCP', 'Cloudflare'], live: 'https://mcp.vanshul.com', repo: 'https://github.com/vanshulgoyal101/mcp' },
      { icon: <FaTools />, color: '#72d7c0', title: 'Dev Tools', desc: 'A privacy-first offline developer toolbox — JSON, JWT, hashing, encoding and formatters — plus a Smart Paste box that works out what you pasted.', tags: ['PWA', 'Offline'], live: 'https://tools.vanshul.com', repo: 'https://github.com/vanshulgoyal101/tools' },
    ],
  },
  {
    category: 'Open source & packages',
    items: [
      { icon: <FaBrain />, color: '#c3a6ff', title: 'SemCache', desc: 'A zero-cost, tiered semantic cache for LLMs using local ONNX embeddings — sub-30ms matches at $0.', tags: ['npm i semcache'], repo: 'https://github.com/vanshulgoyal101/semCache' },
      { icon: <FaLock />, color: '#ff8c7a', title: 'Agent Vault', desc: "A cryptographic policy firewall that vets an AI DeFi agent's transactions before signing.", tags: ['pip install agent-vault-py'], repo: 'https://github.com/vanshulgoyal101/agent-vault' },
      { icon: <FaEnvelope />, color: '#f095c8', title: 'Agent Mailroom', desc: 'Machine-to-machine identity and micro-payments for AI agents — DIDs and off-chain channels.', tags: ['pip install agent-mailroom'], repo: 'https://github.com/vanshulgoyal101/agent-mailroom' },
      { icon: <FaWrench />, color: '#f4c95d', title: 'depshift', desc: 'Detects breaking API changes between Python package versions and auto-suggests migration patches.', tags: ['pip install depshift'], repo: 'https://github.com/vanshulgoyal101/autopatch' },
      { icon: <FaEye />, color: '#72d7c0', title: 'AgentWatch', desc: 'Local-first observability and step-by-step trace replay for multi-agent LLM systems.', tags: ['Python', 'SQLite'], repo: 'https://github.com/vanshulgoyal101/agentwatch' },
      { icon: <FaCube />, color: '#8fd3ff', title: 'Lego', desc: 'Zero-dependency, copy-paste code blocks — 327 crash-proof components across 23 categories.', tags: ['CLI', 'Zero-dep'], repo: 'https://github.com/vanshulgoyal101/lego' },
      { icon: <FaRobot />, color: '#82b7ff', title: 'Agent Team', desc: 'An autonomous AI software-engineering team that plans, writes and tests code from GitHub Actions.', tags: ['Agents', 'CI'], repo: 'https://github.com/vanshulgoyal101/agent-team' },
      { icon: <VBrainIcon />, color: '#36d98a', title: 'vbrain', desc: 'An AI-queryable second-brain engine — turns Markdown notes into full-text search, a knowledge graph and an MCP server for agents. Open engine, private notes.', tags: ['MCP', 'Cloudflare'], live: 'https://vbrain.vanshul.com', repo: 'https://github.com/vanshulgoyal101/vbrain' },
    ],
  },
  {
    category: 'Interactive experiments',
    items: [
      { icon: <FaBalanceScale />, color: '#c3a6ff', title: 'The Dialectic', desc: 'Two AI personas debate any topic while a live D3 graph maps their concepts and where they clash.', tags: ['React', 'D3', 'Gemini'], repo: 'https://github.com/vanshulgoyal101/the-dialectic' },
      { icon: <FaGlobeAmericas />, color: '#82b7ff', title: 'Cosmic Zoom', desc: 'A "powers of ten" physics sandbox — zoom across 44 orders of magnitude with real Matter.js physics.', tags: ['React', 'Matter.js'], repo: 'https://github.com/vanshulgoyal101/cosmic-zoom' },
      { icon: <FaFileAlt />, color: '#f4c95d', title: 'Lexis', desc: 'Typography and readability analytics for long-form Markdown — Flesch, Kincaid and Gunning Fog scoring.', tags: ['React', 'TypeScript'], repo: 'https://github.com/vanshulgoyal101/lexis' },
      { icon: <FaDatabase />, color: '#72d7c0', title: 'Memova', desc: 'Ask multiple databases questions in plain English via Gemini. FastAPI + React.', tags: ['FastAPI', 'React'], repo: 'https://github.com/vanshulgoyal101/memova' },
    ],
  },
  {
    category: 'Space & earlier',
    items: [
      { icon: <FaGlobeAmericas />, color: '#72d7c0', title: 'NASA Space Apps Collective', desc: 'Selected among 30 global space leaders; built weather-visualisation tools for Zimbabwean farmers from open NASA data.', tags: ['NASA', 'Data'], live: 'https://www.spaceappschallenge.org/collective/' },
      { icon: <FaDesktop />, color: '#ff8c7a', title: 'GoRemote', desc: 'My B.Tech major project — a virtual-office platform for remote teams (Phaser, React, Redux, PeerJS, Colyseus).', tags: ['MERN', 'Phaser'], repo: 'https://github.com/vanshulgoyal101/GoRemote' },
    ],
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: 'easeOut' },
  }),
};

// ─── Sub-component: project image with fallback ───────────────────────────────

const ProjectImage = ({ src, alt, fallback }) => {
  const [errored, setErrored] = useState(false);
  return (
    <ProjectImageWrapper>
      {!errored ? (
        <ProjectImg
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <ProjectImageFallback>{fallback}</ProjectImageFallback>
      )}
    </ProjectImageWrapper>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────



const Projects = () => {
  return (
    <ProjectsSection>
      <Container>
        <SectionHeader
          variants={headerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <SectionTitle>Featured Projects</SectionTitle>
          <SectionSubtitle>
            Software in use. Games you can play. A rover we built.
          </SectionSubtitle>
        </SectionHeader>

        <ProjectsGrid>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              custom={i}
              variants={cardVariants}
              initial={false}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <ProjectImage
                src={project.image}
                alt={project.title}
                fallback={project.fallbackIcon}
              />
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectRole>{project.role}</ProjectRole>
                <ProjectDescription>{project.description}</ProjectDescription>
                <CaseStudy>
                  <summary aria-label={`Read case study: ${project.title}`}>Read case study</summary>
                  <dl>
                    <dt>The problem</dt><dd>{project.caseStudy.problem}</dd>
                    <dt>My contribution</dt><dd>{project.caseStudy.contribution}</dd>
                    <dt>Engineering decision</dt><dd>{project.caseStudy.decision}</dd>
                    <dt>Outcome</dt><dd>{project.caseStudy.outcome}</dd>
                  </dl>
                </CaseStudy>

                <ProjectStats>
                  {project.stats.map((stat, idx) => (
                    <StatItem key={idx}>
                      {stat.icon}
                      <span>{stat.text}</span>
                    </StatItem>
                  ))}
                </ProjectStats>

                {project.link && project.link !== '#' && (
                  <ProjectLink href={project.link} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <FaExternalLinkAlt size={12} />
                  </ProjectLink>
                )}
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>

        <MoreProjects role="region" aria-labelledby="project-directory-title">
          <MoreHeader
            variants={headerVariants}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <MoreTitle id="project-directory-title">More things I&apos;ve built</MoreTitle>
            <MoreSubtitle>Live products, open-source packages and interactive experiments.</MoreSubtitle>
          </MoreHeader>

          {moreProjects.map((group) => (
            <CategoryGroup key={group.category}>
              <CategoryLabel>{group.category}</CategoryLabel>
              <CompactGrid>
                {group.items.map((item) => (
                  <CompactCard
                    key={item.title}
                  >
                    <CompactTop>
                      <CompactIcon aria-hidden="true">{item.icon}</CompactIcon>
                      <CompactName>{item.title}</CompactName>
                      <CompactLinks>
                        {item.live && (
                          <IconLink href={item.live} aria-label={`Visit ${item.title}`} title={`Visit ${item.title}`} target="_blank" rel="noopener noreferrer">
                            <FaExternalLinkAlt size={14} aria-hidden="true" />
                          </IconLink>
                        )}
                        {item.repo && (
                          <IconLink href={item.repo} aria-label={`View ${item.title} source code`} title={`View ${item.title} source code`} target="_blank" rel="noopener noreferrer">
                            <FaGithub size={17} aria-hidden="true" />
                          </IconLink>
                        )}
                      </CompactLinks>
                    </CompactTop>
                    <CompactDesc>{item.desc}</CompactDesc>
                  </CompactCard>
                ))}
              </CompactGrid>
            </CategoryGroup>
          ))}
        </MoreProjects>
      </Container>
    </ProjectsSection>
  );
};

export default Projects;