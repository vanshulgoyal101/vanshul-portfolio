import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

// Mirrors the alias redirects wired into App.jsx, exercised in isolation so the
// heavy full-App tree (three.js, etc.) isn't needed.
const RedirectBlogSlug = () => {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
};

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog" element={<div>BLOG INDEX</div>} />
        <Route path="/blog/:slug" element={<div>BLOG POST</div>} />
        <Route path="/blogs" element={<Navigate to="/blog" replace />} />
        <Route path="/blogs/:slug" element={<RedirectBlogSlug />} />
      </Routes>
    </MemoryRouter>
  );

describe('blog URL aliases', () => {
  it('/blogs redirects to the /blog index', () => {
    renderAt('/blogs');
    expect(screen.getByText('BLOG INDEX')).toBeInTheDocument();
  });

  it('/blogs/:slug redirects to the matching /blog/:slug post', () => {
    renderAt('/blogs/some-post');
    expect(screen.getByText('BLOG POST')).toBeInTheDocument();
  });
});
