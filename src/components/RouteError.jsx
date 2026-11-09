import { useEffect } from 'react';
import styled from 'styled-components';
import { HiArrowLeft } from 'react-icons/hi';
import PageLayout from './ui/PageLayout';
import PageHeader from './ui/PageHeader';
import { Button, ButtonLink } from './ui/Button';
import { HOME_PATH } from '../constants/routes';
import { shouldRetry } from '../utils/routeRetry';

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
`;

// Fallback for a whole page that failed to load or render. It keeps the site
// navigation, so visitors are never stranded on a blank screen.
const RouteError = () => {
  useEffect(() => {
    if (shouldRetry()) window.location.reload();
  }, []);

  return (
    <PageLayout>
      <PageHeader
        label="Something went wrong"
        title="This page didn't load"
        lede="A dropped connection or a new release can interrupt loading. Reloading usually fixes it."
      >
        <Actions>
          <Button type="button" onClick={() => window.location.reload()}>Reload page</Button>
          <ButtonLink to={HOME_PATH} $variant="secondary">
            <HiArrowLeft aria-hidden="true" data-arrow="back" />
            Back home
          </ButtonLink>
        </Actions>
      </PageHeader>
    </PageLayout>
  );
};

export default RouteError;
