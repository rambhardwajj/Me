# Ram Bhardwaj — Portfolio

An editorial, single-page portfolio for product and strategy roles. Built with Next.js 16, React 19, Framer Motion and plain CSS.

## Sections

1. **Hero** — positioning statement, availability, and four headline metrics that count up.
2. **Journey** — school → college → enterprise → startups → MBA, with a pinned year and a scroll-drawn timeline.
3. **Selected work** — case studies in a problem → approach → outcome format, opened one at a time.
4. **Recognition** — awards and selections, plus capabilities.
5. **Contact** — email, links, location and live local time.

## Editing content

All content lives in [`lib/data.ts`](lib/data.ts). Lines marked `TODO` still need your input, for example the résumé link and the wording of the case-study problem statements.

Images go in `public/images/`. To add a résumé, drop it at `public/resume.pdf` and set `PROFILE.resume` to `'/resume.pdf'`.

## Running locally

```bash
npm install
npm run dev
```

Light and dark themes follow the visitor's system setting. Animations respect "reduce motion".
