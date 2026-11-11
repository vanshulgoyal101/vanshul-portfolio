import { Fragment, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { HiArrowUpRight } from 'react-icons/hi2';
import { FaGithub } from 'react-icons/fa';

import PageLayout from '../components/ui/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { TextLink } from '../components/ui/Button';
import { eyebrow } from '../components/ui/typography';
import NotFound from './NotFound';
import { CASE_STUDY_FIELDS } from '../constants/projects';
import { PROJECT_PAGES, getProjectPage } from '../constants/projectStories';
import { SITE_URL, AUTHOR_NAME, AUTHOR_SAME_AS } from '../constants/siteConfig';
import { homeSectionPath } from '../constants/routes';
import { projectJsonLd } from '../../scripts/lib/structuredData.mjs';
import { useSeo } from '../hooks/useSeo';

const Back = styled(TextLink)`
  margin-bottom: 1.5rem;
`;

const Article = styled.article`
  overflow-wrap: anywhere;
`;

// Same 8:5 frame and crop as the homepage cards, so the image reads the same.
const Figure = styled.figure`
  position: relative;
  aspect-ratio: 8 / 5;
  margin: 0 0 clamp(2.5rem, 6vw, 3.5rem);
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-tertiary);

  img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center bottom;
  }
`;

const Section = styled.section`
  padding: 2rem 0;
  border-top: 1px solid var(--color-hairline);

  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  p {
    max-width: 65ch;
    font-size: 1.0625rem;
    line-height: 1.75;
  }

  p + p {
    margin-top: 1rem;
  }
`;

const Facts = styled.ul`
  display: grid;
  gap: 0.75rem;
  list-style: none;

  li {
    padding-left: 1.25rem;
    border-left: 2px solid var(--color-accent-primary);
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-text-primary);
  }
`;

const CaseStudy = styled.dl`
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: 1rem 2rem;

  dt {
    ${eyebrow}
    padding-top: 0.3rem;
  }

  dd {
    font-size: 1.0625rem;
    line-height: 1.7;
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.375rem;

    dd + dt {
      margin-top: 1rem;
    }
  }
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  padding: 2rem 0;
  border-top: 1px solid var(--color-hairline);

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 48px;
    font-weight: 600;
    color: var(--color-accent-primary);
  }
`;

const More = styled.nav`
  padding-top: 2rem;
  border-top: 1px solid var(--color-ink);

  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    line-height: 1.2;
  }

  ul {
    margin-bottom: 1.5rem;
    list-style: none;
  }

  li + li {
    border-top: 1px solid var(--color-hairline);
  }
`;

const MoreLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 48px;
  padding: 0.875rem 0;
  color: var(--color-ink);
  text-decoration: none;

  span {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  svg {
    flex-shrink: 0;
    color: var(--color-text-muted);
    transition: transform var(--duration-fast) var(--ease-out);
  }

  &:hover {
    color: var(--color-accent-primary);

    svg {
      color: var(--color-accent-primary);
      transform: translateX(3px);
    }
  }
`;

const ProjectStory = ({ page }) => {
  const { story } = page;
  const jsonLd = useMemo(
    () => JSON.stringify(projectJsonLd(page, { site: SITE_URL, authorName: AUTHOR_NAME, authorSameAs: AUTHOR_SAME_AS })),
    [page],
  );
  useSeo({ title: page.pageTitle, description: story.description, path: page.path, jsonLd });

  const others = PROJECT_PAGES.filter((other) => other.id !== page.id);
  const facts = [...page.stats.map((stat) => stat.text), ...story.facts];

  return (
    <PageLayout width="reading">
      <Back to={homeSectionPath('projects')}>
        <HiArrowLeft aria-hidden="true" data-arrow="back" /> All projects
      </Back>
      <Article>
        <PageHeader label={page.role} title={page.title} lede={story.summary} />
        <Figure>
          <img src={page.image} alt={page.title} decoding="async" />
        </Figure>

        <Section aria-labelledby="facts-heading">
          <h2 id="facts-heading">Key facts</h2>
          <Facts>
            {facts.map((fact) => <li key={fact}>{fact}</li>)}
          </Facts>
        </Section>

        <Section aria-labelledby="case-study-heading">
          <h2 id="case-study-heading">In short</h2>
          <CaseStudy>
            {CASE_STUDY_FIELDS.map(([field, label]) => (
              <Fragment key={field}>
                <dt>{label}</dt>
                <dd>{page.caseStudy[field]}</dd>
              </Fragment>
            ))}
          </CaseStudy>
        </Section>

        {story.sections.map((section, index) => (
          <Section key={section.heading} aria-labelledby={`story-${index}`}>
            <h2 id={`story-${index}`}>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </Section>
        ))}

        <Links>
          <a href={page.link} target="_blank" rel="noopener noreferrer">
            {story.linkLabel} <HiArrowUpRight aria-hidden="true" />
          </a>
          {story.repo && (
            <a href={story.repo} target="_blank" rel="noopener noreferrer">
              <FaGithub aria-hidden="true" /> Source code
            </a>
          )}
        </Links>
      </Article>

      <More aria-labelledby="more-projects-heading">
        <h2 id="more-projects-heading">More projects</h2>
        <ul>
          {others.map((other) => (
            <li key={other.id}>
              <MoreLink to={other.path}>
                <div>
                  {other.title}
                  <span>{other.role}</span>
                </div>
                <HiArrowRight aria-hidden="true" />
              </MoreLink>
            </li>
          ))}
        </ul>
        <TextLink to={homeSectionPath('projects')}>
          <HiArrowLeft aria-hidden="true" data-arrow="back" /> Back to all projects
        </TextLink>
      </More>
    </PageLayout>
  );
};

const ProjectPage = () => {
  const { id } = useParams();
  const page = getProjectPage(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return page ? <ProjectStory page={page} /> : <NotFound />;
};

export default ProjectPage;
