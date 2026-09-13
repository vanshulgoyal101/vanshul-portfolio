# Hooks

Custom hooks live in `src/hooks/`. Two additional hooks used across the app
(`useToast` and react-router's hooks) are documented here for completeness.

---

## useContactForm

**Location**: [`src/hooks/useContactForm.js`](../src/hooks/useContactForm.js)

Encapsulates all state and logic for the contact form: field state, inline email
validation, submission to [Formspree](https://formspree.io/), and success/error
toasts.

```javascript
const {
  formState,      // { name, email, message }
  isSubmitting,   // boolean — true while the request is in flight
  emailError,     // string — inline validation message ('' when valid)
  handleChange,   // (event) => void — controlled-input change handler
  handleSubmit,   // (event) => Promise<void> — submits to Formspree
} = useContactForm(initialState);
```

**Behaviour**

- `handleChange` updates the field and, for the `email` field, validates against
  a simple regex, setting `emailError` when invalid (empty is not treated as
  invalid).
- `handleSubmit` calls `preventDefault`, validates all required fields using trimmed values,
  POSTs normalized JSON to the Formspree endpoint, and shows a success or
  error toast. On success it resets the form; on failure or network error it
  keeps the entered values so the user can retry.
- An in-flight ref prevents duplicate requests before React renders the disabled
  button. Unmount aborts the client request and suppresses late toasts/state updates.
  Aborting the client does not guarantee a message already received by the server
  was not delivered; no server-side idempotency guarantee is claimed.
- `useToast()` provides the toast callbacks, so the component using this hook
  must be rendered inside `<ToastProvider>`.

---

## useSeo

Runtime route metadata replaces prerendered `script[data-route-seo]` nodes and
article tags while the route is active, preserving the global site identity graph.
The hook updates canonical, Open Graph, and Twitter URLs together. Home mounts its
own metadata so navigating from a directly loaded subpage cannot leave that
subpage's original HTML title/canonical on Home. Missing posts use `noindex, follow`.
Cleanup restores the previous head state for the next route's hook to replace.

## useBlogViews / useBlogView

Optional view requests return empty/null UI states when unavailable or rejected.
Effect guards ignore late responses, and clearing or changing a slug clears the
previous post's count. Tests do not write to the live Supabase database.

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

- **`useNavigate`** — programmatic navigation, e.g. `navigate('/')` before
  scrolling to a section from a blog route.
- **`useLocation`** — reads `pathname`/`hash` to decide between same-page
  scrolling and cross-page navigation, and to keep the "blog" nav item active on
  `/blog/*` routes.

```javascript
const navigate = useNavigate();
const location = useLocation();

if (location.pathname === '/') {
  scrollToSection(id);           // already home → scroll
} else {
  navigate(`/#${id}`);
}
```

The route hash helper waits for intro completion and fonts, tolerates malformed
percent encoding, and applies measured header clearance and focus. Lazy page
targets must also exist before restoration; fixed-delay navigation is not used.
