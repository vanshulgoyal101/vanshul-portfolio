# Hooks

Custom hooks live in `src/hooks/`. Two additional hooks used across the app
(`useToast` and react-router's hooks) are documented here for completeness.

---

## useContactForm

**Location**: [`src/hooks/useContactForm.js`](../src/hooks/useContactForm.js)

Encapsulates all state and logic for the contact form: field state, validation,
submission to [Formspree](https://formspree.io/), and success/error toasts.

```javascript
const {
  formState,      // { name, email, message }
  isSubmitting,   // boolean — true while the request is in flight
  errors,         // { name?, email?, message? } — per-field messages ('' or absent when valid)
  emailError,     // string — errors.email, or '' when valid
  handleChange,   // (event) => void — controlled-input change handler
  handleSubmit,   // (event) => Promise<void> — validates, then submits
} = useContactForm(initialState); // default { name: '', email: '', message: '' }
```

**Endpoint**: `VITE_CONTACT_ENDPOINT` when set at build time, otherwise the
site's Formspree form (`https://formspree.io/f/xgvzkqob`).

**Behaviour**

- `handleChange` updates the field. For `email` it checks the format against a
  simple regex as you type (an empty value is not flagged); for the other
  fields it clears that field's existing error.
- `handleSubmit` calls `preventDefault` and validates all three fields on
  trimmed values: each is required and the email must look like an address.
  If any field is invalid it sets `errors`, moves focus to the first invalid
  field (name, then email, then message) and shows a "Not quite ready for
  launch" error toast without sending anything.
- A valid form POSTs JSON with the trimmed fields plus `_replyto` (the email)
  and `_subject` (`Portfolio Contact: <name>`). Success shows a "Message
  launched 🚀" toast and resets the form; an error response ("Houston, we have
  a problem") or a network failure ("Lost signal") shows an error toast and
  keeps the entered values so the user can retry.
- An in-flight ref prevents duplicate requests before React renders the disabled
  button. Unmount aborts the client request and suppresses late toasts/state updates.
  Aborting the client does not guarantee a message already received by the server
  was not delivered; no server-side idempotency guarantee is claimed.
- `useToast()` provides the toast callbacks, so the component using this hook
  must be rendered inside `<ToastProvider>`.

---

## useSeo

**Location**: [`src/hooks/useSeo.js`](../src/hooks/useSeo.js) (named and
default export)

Sets the document head for the active route and restores it on unmount.

```javascript
useSeo({
  title,        // document.title, og:title, twitter:title, og:image:alt
  description,  // description, og:description, twitter:description
  path,         // canonical, og:url and twitter:url = SITE_URL + path (default '/')
  image,        // og:image and twitter:image (default DEFAULT_OG_IMAGE)
  type,         // og:type (default 'website')
  jsonLd,       // pre-serialized JSON-LD string, added as script[data-route-seo]
  robots,       // default 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  article,      // { publishedTime, modifiedTime, author, section, tags } when type is 'article'
});
```

It also sets `og:image:width` 1200 and `og:image:height` 630. Existing tags from
`index.html` are updated in place (created only when missing), so there are
never duplicate title or description tags.

Runtime route metadata replaces prerendered `script[data-route-seo]` nodes and
`article:*` tags (one `article:tag` per entry in `tags`) while the route is active; every JSON-LD block the build
emits carries `data-route-seo`, so none leaks onto another route.
The hook updates canonical, Open Graph, and Twitter URLs together. Home mounts its
own metadata so navigating from a directly loaded subpage cannot leave that
subpage's original HTML title/canonical on Home. Missing posts use `noindex, follow`.
Cleanup restores the previous head state for the next route's hook to replace.
Used by `HomeMetadata` in `App.jsx` and by every page in `src/pages/`.

---

## useBlogViews / useBlogView

**Location**: [`src/hooks/useBlogViews.js`](../src/hooks/useBlogViews.js)

```javascript
const views = useBlogViews();     // { [slug]: views } for the published posts; {} until loaded
const count = useBlogView(slug);  // records a view (once per session), returns the count or null
```

- `useBlogViews()` fetches the counts of the published slugs once on mount
  (`getAllBlogViews`). The homepage writing preview and the archive use it.
- `useBlogView(slug)` calls `recordBlogView(slug)` whenever the slug changes;
  `BlogPost` passes `null` for an unknown post, which records nothing.

Optional view requests return empty/null UI states when unavailable or rejected.
Effect guards ignore late responses, and clearing or changing a slug clears the
previous post's count. Tests do not write to the live Supabase database. See
[data.md](data.md#view-counts-supabase) for the counting rules.

---

## useIdle

**Location**: [`src/hooks/useIdle.js`](../src/hooks/useIdle.js)

Returns `false` until the browser goes idle after first paint, then `true`. Used
to defer non-critical, decorative work (3D background, telemetry) so it never
competes with the initial render.

```javascript
const ready = useIdle(1200); // delay/timeout in ms (default 1500)
if (!ready) return null;
return <Suspense fallback={null}>{/* heavy decorative elements */}</Suspense>;
```

Implementation: uses `requestIdleCallback` when available (with a `timeout`
fallback), otherwise `setTimeout`; cleans up on unmount.

---

## useKonamiCode

**Location**: [`src/hooks/useKonamiCode.js`](../src/hooks/useKonamiCode.js)

```javascript
useKonamiCode(() => showInfo('Cheat code accepted 🎮'));
```

Calls the callback each time ↑ ↑ ↓ ↓ ← → ← → B A (`KONAMI_SEQUENCE`) is typed,
matching the last ten keys case-insensitively. Keys pressed with Ctrl, Meta or
Alt, or inside inputs, textareas, selects and editable content, are ignored.
It never calls `preventDefault`, so the arrows still scroll. The latest
callback is always used; the window listener is removed on unmount.

---

## useAwayTitle

**Location**: [`src/hooks/useAwayTitle.js`](../src/hooks/useAwayTitle.js)

```javascript
useAwayTitle(); // defaults to AWAY_TITLES from constants/wit.js
```

On `visibilitychange` to hidden, saves `document.title` and sets a random away
title. On return it restores the saved title, but only if the away title is
still showing, so a title set meanwhile (by `useSeo` on a route change) is kept.
Unmounting removes the listener and restores the title the same way.

---

## useToast

**Location**: exported from [`src/components/Toast/ToastProvider.jsx`](../src/components/Toast/ToastProvider.jsx)

Accesses the global toast notification system. Must be used within
`<ToastProvider>` — it throws `"useToast must be used within ToastProvider"`
otherwise.

```javascript
const { showSuccess, showError, showInfo, removeToast } = useToast();

showSuccess('Message Sent!', 'I will get back to you soon.');
showError('Network Error', 'Please try again.');
const id = showInfo('Heads up', 'Something informational', 0); // duration 0 = no auto-dismiss
removeToast(id);
```

- Each `show*` call returns the created toast's `id`.
- `duration` defaults to `5000` ms; pass `0` to disable auto-dismiss.
- Toasts render in a fixed, stacked container and animate in/out via Framer
  Motion `AnimatePresence`.

---

## react-router hooks (used in Navigation)

- **`useNavigate`** — every plain click on a navigation link calls
  ``navigate(`/#${id}`)``, from the homepage and from any other route. Clicks
  with a modifier key or a non-primary button keep the browser default.
- **`useLocation`** — `pathname` decides the active item (scroll-spy on `/`,
  "Blog" on `/blog*` and `/reading-list`, "Projects" on `/projects/*`,
  nothing elsewhere) and re-runs the
  scroll-spy effect after route changes.

```javascript
const handleNavClick = (event, sectionId) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  setIsMobileMenuOpen(false);
  navigate(`/#${sectionId}`); // ScrollToHash in App.jsx scrolls and focuses
};
```

The route hash helper (`ScrollToHash` in `App.jsx`) waits for intro completion
and fonts, tolerates malformed percent encoding, and applies measured header
clearance and focus. Lazy page targets must also exist before restoration;
fixed-delay navigation is not used.
