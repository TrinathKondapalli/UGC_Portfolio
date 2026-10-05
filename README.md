# Tzinr

AI UGC ad studio website. Astro + plain CSS + GSAP, content managed via Decap CMS, forms via Netlify Forms.

## Local setup

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Deploy

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**, point it at the repo.
   Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
3. In Netlify site settings, enable **Identity** and **Git Gateway** — this is what lets
   `/admin` (Decap CMS) authenticate and commit content changes back to the repo.
4. Invite yourself as an Identity user so you can log in at `/admin`.

## Edit contact details

Open [`src/config.ts`](src/config.ts) and set:

- `whatsapp` — country code + number, no `+`, no spaces (e.g. `919876543210`)
- `whatsappText` — the prefilled WhatsApp message
- `email` — your inbox
- `instagram` — your handle (no `@`)

Every WhatsApp, email and Instagram link on the site reads from this one file.

## Add a new ad

**Option A — from the browser:** go to `/admin`, log in, open **Work → New Work**, fill in
the fields and publish. Decap commits a new Markdown file to `src/content/work/` and
Netlify rebuilds the site automatically.

**Option B — by hand:** add a file to `src/content/work/your-slug.md`:

```markdown
---
title: "Brand product name"
niche: "Beauty"            # Beauty | Fashion | Fitness
thumb: "/work/your-slug.jpg"
loop: "/work/your-slug.mp4"   # optional — omit if you don't have a loop yet
instagramUrl: ""              # leave blank until the Reel is live
date: 2026-10-05
featured: false                # true = eligible for the homepage hero fan
---
```

Drop the matching image/video into `public/work/`.

### Exporting media

Thumbnail — 9:16 JPG, 540×960, under 120KB:

```bash
ffmpeg -i source.mp4 -vf "scale=540:960:force_original_aspect_ratio=increase,crop=540:960" \
  -frames:v 1 -q:v 4 public/work/your-slug.jpg
```

Loop — muted, 3–4s, under 1.2MB (MP4 + a matching WebM; the site prefers WebM and falls
back to MP4 automatically):

```bash
ffmpeg -i source.mp4 -t 4 -an -vf "scale=540:960:force_original_aspect_ratio=increase,crop=540:960" \
  -c:v libx264 -crf 28 -preset veryslow -movflags +faststart public/work/your-slug.mp4

ffmpeg -i source.mp4 -t 4 -an -vf "scale=540:960:force_original_aspect_ratio=increase,crop=540:960" \
  -c:v libvpx-vp9 -crf 32 -b:v 0 public/work/your-slug.webm
```

### How "latest 5" and "Coming soon" work

The homepage rail always shows the 5 most recent items by `date`, newest first. Any item
with an empty `instagramUrl` renders as a non-clickable "Coming soon" card instead of a
link. If there are fewer than 5 items total, a marigold "Your product could be next" card
fills the remaining slot(s) and links to the sample request form.

The hero's three-phone fan pulls from items marked `featured: true` (newest three).

## Where submissions go

The sample request form posts to Netlify Forms (form name `sample-request`). Submissions
appear under **Site settings → Forms** in the Netlify dashboard. To get notified by email,
go to **Forms → Settings and usage → Form notifications → Add notification → Email
notification** and add your address.
