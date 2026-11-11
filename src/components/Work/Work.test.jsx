import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Work from './Work';
import { EXPERIENCE, EARLIER_EXPERIENCE } from '../../constants/experience';

describe('Work', () => {
  it('renders the section heading', () => {
    render(<Work />);
    expect(screen.getByRole('heading', { name: 'Work Experience' })).toBeInTheDocument();
  });

  it('renders each work experience entry', () => {
    render(<Work />);
    expect(screen.getByText('Associate Analyst')).toBeInTheDocument();
    expect(screen.getAllByText(/United Airlines/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Software Development Engineer Intern')).toBeInTheDocument();
    expect(screen.getAllByText(/zHealth/i).length).toBeGreaterThan(0);
  });

  it('lists earlier roles compactly, without adding role headings', () => {
    const { container } = render(<Work />);
    const earlier = screen.getByRole('list', { name: 'Earlier' });
    const items = within(earlier).getAllByRole('listitem');
    expect(items).toHaveLength(EARLIER_EXPERIENCE.length);
    EARLIER_EXPERIENCE.forEach((role, i) => {
      expect(items[i]).toHaveTextContent(role.title);
      expect(items[i]).toHaveTextContent(role.company);
      expect(items[i]).toHaveTextContent(role.duration);
      expect(items[i]).toHaveTextContent(role.summary);
    });
    expect(earlier.querySelector('h3, h4, a')).toBeNull();
    expect([...container.querySelectorAll('h3')].map((heading) => heading.textContent)).toEqual(EXPERIENCE.map((job) => job.title));
  });
});
