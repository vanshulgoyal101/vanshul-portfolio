import styled from 'styled-components';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL, AUTHOR_NAME, AUTHOR_SAME_AS, HOME_DESCRIPTION } from '../constants/siteConfig';
import { PROFILE } from '../constants/profile';
import { HOME_PATH } from '../constants/routes';
import { homeJsonLd } from '../../scripts/lib/structuredData.mjs';
import Navigation from '../components/Navigation/Navigation';
import ErrorBoundary from '../components/ErrorBoundary';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Work from '../components/Work/Work';
import Projects from '../components/Projects/Projects';
import Blog from '../components/Blog/Blog';
import Contact from '../components/Contact/Contact';

const MainContent = styled.main`
  position: relative;
  z-index: 2;
`;

const SectionWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const HOME_JSON_LD = JSON.stringify(homeJsonLd({
  site: SITE_URL, authorName: AUTHOR_NAME, authorSameAs: AUTHOR_SAME_AS, profile: PROFILE,
}));

const Home = ({ sceneEnabled }) => {
  useSeo({ title: AUTHOR_NAME, description: HOME_DESCRIPTION, path: HOME_PATH, jsonLd: HOME_JSON_LD });

  return (
    <>
      <Navigation />
      <MainContent>
        <ErrorBoundary>
          <SectionWrapper id="home">
            <Hero sceneEnabled={sceneEnabled} />
          </SectionWrapper>
        </ErrorBoundary>
        <ErrorBoundary>
          <SectionWrapper id="projects">
            <Projects />
          </SectionWrapper>
        </ErrorBoundary>
        <ErrorBoundary>
          <SectionWrapper id="about">
            <About />
          </SectionWrapper>
        </ErrorBoundary>
        <ErrorBoundary>
          <SectionWrapper id="work">
            <Work />
          </SectionWrapper>
        </ErrorBoundary>
        <ErrorBoundary>
          <SectionWrapper id="blog">
            <Blog />
          </SectionWrapper>
        </ErrorBoundary>
        <ErrorBoundary>
          <SectionWrapper id="contact">
            <Contact />
          </SectionWrapper>
        </ErrorBoundary>
      </MainContent>
    </>
  );
};

export default Home;
