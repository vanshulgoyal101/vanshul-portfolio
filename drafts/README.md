# Drafts

Unpublished essays. Nothing in this folder is built or deployed: the site only
reads posts from `src/blogs/`.

These six were drafted in November 2026 from my own notes and taken off the
site to be rewritten in my own words:

- `agents-write-faster-than-i-can-check.md`
- `software-for-people-without-desks.md`
- `the-trap-of-basics-first.md`
- `two-yc-rejections.md`
- `what-building-adbrain-taught-me.md`
- `who-indian-tech-builds-for.md`

## Publishing one

1. Rewrite it until it sounds like me.
2. Set `date` to the day it goes out (frontmatter rules:
   [documentation/data.md](../documentation/data.md#frontmatter-schema)).
3. Move it to `src/blogs/` with `git mv`, run `npm run check`, then push.

Some drafts link to each other (the YC essay links to the AdBrain one). Remove
or keep those links depending on what is published.
