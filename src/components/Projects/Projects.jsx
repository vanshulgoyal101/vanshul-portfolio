// src/components/Projects/Projects.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaExternalLinkAlt, FaCode, FaGithub } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';

// ─── Styled Components ────────────────────────────────────────────────────────

const ProjectsSection = styled.section`
  position: relative;
  background: transparent;
  padding: var(--spacing-2xl) 0;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
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
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  padding-top: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08), 
                0 0 0 1px rgba(29, 78, 216, 0.05);
    transform: translateY(-6px);
  }
`;

const ProjectImageWrapper = styled.div`
  height: 200px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  position: relative;

  @media (max-width: 768px) {
    height: 160px;
  }
`;

const ProjectImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  background: var(--color-gradient-1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  opacity: 0.7;
`;

const ProjectContent = styled.div`
  padding: var(--spacing-lg);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const ProjectTitle = styled.h3`
  font-size: var(--text-xl);
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
`;

const MoreHeader = styled(motion.div)`
  text-align: center;
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
  margin-top: var(--spacing-lg);
`;

const CategoryLabel = styled.h4`
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent-primary);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
`;

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`;

const CompactCard = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(29, 78, 216, 0.06);
  }
`;

const CompactTop = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const CompactEmoji = styled.span`
  font-size: 1.3rem;
  line-height: 1;
`;

const CompactName = styled.h5`
  font-size: var(--text-base);
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
`;

const LiveDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--text-xs);
  color: #22c55e;
  font-weight: 500;

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
  }
`;

const CompactDesc = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.55;
  margin: 0;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: var(--spacing-xs);
`;

const Tag = styled.span`
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 2px 8px;
  font-family: ${(p) => (p.$mono ? 'var(--font-mono, ui-monospace, monospace)' : 'inherit')};
`;

const CompactLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xs);
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--text-xs);
  color: var(--color-accent-primary);
  font-weight: 500;
  min-height: 36px;

  svg { transition: transform 0.2s ease; }

  &:hover {
    text-decoration: underline;
    svg { transform: translateX(3px); }
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
    fallbackIcon: '🎯',
    stats: [
      { icon: <FaRocket />, text: 'Live SaaS · adbrain.vanshul.com' },
      { icon: <FaCode />, text: 'Next.js 16 · React 19 · Supabase' },
    ],
    link: 'https://adbrain.vanshul.com',
  },
  {
    id: 2,
    title: 'Tiny Arcade — 11 Browser Games',
    role: 'Solo Developer',
    description: 'Eleven instant-play browser games — reflex, memory, typing, mental maths, ear training, Wordle and more — built in TypeScript + Vite with a shared model/view architecture, cloud leaderboards and full SEO. No frameworks, no backend.',
    image: '/images/projects/tiny-arcade.webp',
    fallbackIcon: '🎮',
    stats: [
      { icon: <FaRocket />, text: '11 instant-play games' },
      { icon: <FaCode />, text: 'TypeScript + Vite' },
    ],
    link: 'https://games.vanshul.com',
  },
  {
    id: 3,
    title: 'NASA Human Exploration Rover Challenge',
    role: 'Team Lead',
    description: 'Led a team of 6 to design and manufacture a human-powered rover for NASA HERC 2023. Achieved top 20 global ranking and engaged 12,000+ students in STEM activities.',
    image: '/images/projects/nasa-herc.webp',
    fallbackIcon: '🚀',
    stats: [
      { icon: <MdGroups />, text: '12k+ students reached for STEM' },
      { icon: <BiMoney />,  text: '$30,000 raised via govt & private sources' },
    ],
    link: 'https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge/',
  },
];

// Compact second tier — grouped so breadth shows without clutter.
const moreProjects = [
  {
    category: 'Live products & tools',
    items: [
      { emoji: '☀️', title: 'Solaride', desc: 'A rooftop-solar business site with a savings calculator, lead capture and full local SEO — a real business I help run.', tags: ['Business', 'SEO'], live: 'https://solaride.in' },
      { emoji: '🧩', title: 'ctx', desc: 'An MCP server that turns any GitHub repo into agent-ready context — pack or search a whole repo for the lines that matter.', tags: ['MCP', 'Cloudflare'], live: 'https://ctx.vanshul.com', repo: 'https://github.com/vanshulgoyal101/ctx' },
      { emoji: '📖', title: 'mcp', desc: 'An MCP server that reads the live web as clean Markdown for AI agents.', tags: ['MCP', 'Cloudflare'], live: 'https://mcp.vanshul.com', repo: 'https://github.com/vanshulgoyal101/mcp' },
      { emoji: '🧰', title: 'Dev Tools', desc: 'A privacy-first, offline developer toolbox — 19 utilities plus a Smart Paste box, all in the browser.', tags: ['PWA', 'Offline'], live: 'https://tools.vanshul.com', repo: 'https://github.com/vanshulgoyal101/tools' },
    ],
  },
  {
    category: 'Open source & packages',
    items: [
      { emoji: '🧠', title: 'SemCache', desc: 'A zero-cost, tiered semantic cache for LLMs using local ONNX embeddings — sub-30ms matches at $0.', tags: ['npm i semcache'], repo: 'https://github.com/vanshulgoyal101/semCache' },
      { emoji: '🔐', title: 'Agent Vault', desc: "A cryptographic policy firewall that vets an AI DeFi agent's transactions before signing.", tags: ['pip install agent-vault-py'], repo: 'https://github.com/vanshulgoyal101/agent-vault' },
      { emoji: '📬', title: 'Agent Mailroom', desc: 'Machine-to-machine identity and micro-payments for AI agents — DIDs and off-chain channels.', tags: ['pip install agent-mailroom'], repo: 'https://github.com/vanshulgoyal101/agent-mailroom' },
      { emoji: '🛠️', title: 'depshift', desc: 'Detects breaking API changes between Python package versions and auto-suggests migration patches.', tags: ['pip install depshift'], repo: 'https://github.com/vanshulgoyal101/autopatch' },
      { emoji: '👁️', title: 'AgentWatch', desc: 'Local-first observability and step-by-step trace replay for multi-agent LLM systems.', tags: ['Python', 'SQLite'], repo: 'https://github.com/vanshulgoyal101/agentwatch' },
      { emoji: '🧱', title: 'Lego', desc: 'Zero-dependency, copy-paste code blocks — 327 crash-proof components across 23 categories.', tags: ['CLI', 'Zero-dep'], repo: 'https://github.com/vanshulgoyal101/lego' },
      { emoji: '🤖', title: 'Agent Team', desc: 'An autonomous AI software-engineering team that plans, writes and tests code from GitHub Actions.', tags: ['Agents', 'CI'], repo: 'https://github.com/vanshulgoyal101/agent-team' },
    ],
  },
  {
    category: 'Interactive experiments',
    items: [
      { emoji: '⚖️', title: 'The Dialectic', desc: 'Two AI personas debate any topic while a live D3 graph maps their concepts and where they clash.', tags: ['React', 'D3', 'Gemini'], repo: 'https://github.com/vanshulgoyal101/the-dialectic' },
      { emoji: '🌌', title: 'Cosmic Zoom', desc: 'A "powers of ten" physics sandbox — zoom across 44 orders of magnitude with real Matter.js physics.', tags: ['React', 'Matter.js'], repo: 'https://github.com/vanshulgoyal101/cosmic-zoom' },
      { emoji: '📑', title: 'Lexis', desc: 'Typography and readability analytics for long-form Markdown — Flesch, Kincaid and Gunning Fog scoring.', tags: ['React', 'TypeScript'], repo: 'https://github.com/vanshulgoyal101/lexis' },
      { emoji: '🗄️', title: 'Memova', desc: 'Ask multiple databases questions in plain English via Gemini. FastAPI + React.', tags: ['FastAPI', 'React'], repo: 'https://github.com/vanshulgoyal101/memova' },
    ],
  },
  {
    category: 'Space & earlier',
    items: [
      { emoji: '🌍', title: 'NASA Space Apps Collective', desc: 'Selected among 30 global space leaders; built weather-visualisation tools for Zimbabwean farmers from open NASA data.', tags: ['NASA', 'Data'], live: 'https://www.spaceappschallenge.org/collective/' },
      { emoji: '🖥️', title: 'GoRemote', desc: 'My B.Tech major project — a virtual-office platform for remote teams (Phaser, React, Redux, PeerJS, Colyseus).', tags: ['MERN', 'Phaser'], repo: 'https://github.com/vanshulgoyal101/GoRemote' },
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
    <ProjectsSection id="projects">
      <Container>
        <SectionHeader
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <SectionTitle>Featured Projects</SectionTitle>
          <SectionSubtitle>
            From space exploration to software development — projects that define my journey
          </SectionSubtitle>
        </SectionHeader>

        <ProjectsGrid>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{ y: -5 }}
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

        <MoreProjects>
          <MoreHeader
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <MoreTitle>More things I&apos;ve built</MoreTitle>
            <MoreSubtitle>Live products, open-source packages and interactive experiments.</MoreSubtitle>
          </MoreHeader>

          {moreProjects.map((group) => (
            <CategoryGroup key={group.category}>
              <CategoryLabel>{group.category}</CategoryLabel>
              <CompactGrid>
                {group.items.map((item, i) => (
                  <CompactCard
                    key={item.title}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <CompactTop>
                      <CompactEmoji aria-hidden="true">{item.emoji}</CompactEmoji>
                      <CompactName>{item.title}</CompactName>
                      {item.live && <LiveDot>Live</LiveDot>}
                    </CompactTop>
                    <CompactDesc>{item.desc}</CompactDesc>
                    {item.tags && item.tags.length > 0 && (
                      <TagRow>
                        {item.tags.map((t) => (
                          <Tag key={t} $mono={/\s|install/.test(t)}>{t}</Tag>
                        ))}
                      </TagRow>
                    )}
                    {(item.live || item.repo) && (
                      <CompactLinks>
                        {item.live && (
                          <IconLink href={item.live} target="_blank" rel="noopener noreferrer">
                            Visit <FaExternalLinkAlt size={10} />
                          </IconLink>
                        )}
                        {item.repo && (
                          <IconLink href={item.repo} target="_blank" rel="noopener noreferrer">
                            <FaGithub size={13} /> Code
                          </IconLink>
                        )}
                      </CompactLinks>
                    )}
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