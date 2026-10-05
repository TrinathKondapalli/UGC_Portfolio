# Tzinr website

## 1. Before you deploy (2 minutes)
Open `index.html`, scroll to the `CONFIG` block near the bottom, and set:
- `whatsapp`: 91 + your 10-digit number (no +, no spaces)
- `email`: your work email
- `instagram`: tzinr.ugc (already set)

## 2. Deploy on Netlify (free)
1. Go to app.netlify.com → Add new site → Deploy manually.
2. Drag the whole `tzinr-site` folder onto the page.
3. Domain settings → add your own domain if you have one.

## 3. Update the Instagram top 5 (every time you post)
1. On Instagram: open the Reel → ⋯ → Copy link.
2. Save a 9:16 thumbnail (JPG, about 540×960) into the `work/` folder.
3. In `index.html`, edit the `WORK` list (newest first):
   `{ title: "Product name", niche: "Beauty", thumb: "work/file.jpg", url: "https://www.instagram.com/reel/XXXX/" },`
4. Leave `url: ""` to show a card as "Coming soon" (not clickable).
5. Only the first 5 items show. If you have fewer than 5, a "Your product could be next" card fills the row.
6. Re-upload the folder to Netlify (drag and drop again).

## 4. Optional
- Logo: put `logo.svg` in `assets/` and replace the TZINR text in the nav (see the comment in the HTML).
- The first 3 items in `WORK` also appear in the hero fan.
