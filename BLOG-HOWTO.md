# Adding a blog post

The Blog page (`Blog.html`) is an index of post cards, newest first. Each post
lives on its own page in `blog/`. No build step: plain HTML, served by GitHub Pages.

## 1. Make the post page

1. Copy the template: `cp blog/_post-template.html blog/<slug>.html`
   (slug = short, lowercase, hyphens, e.g. `dns-txt-rollout`).
2. Replace every ALL-CAPS placeholder:
   - `POST TITLE` (appears in `<title>`, og/twitter title and the `<h1>`)
   - `ONE-SENTENCE SUMMARY` (meta description, og/twitter description; 100–160 characters)
   - `POST-SLUG` (canonical URL, og:url, article id)
   - `YYYY-MM-DD` and `Month D, YYYY` (dates)
3. Write the body inside `<article class="blog-post">`. Use `<h4>` for section
   headings and `<p>` for text. Media goes in `media/` and is referenced as
   `../media/<file>` (the post page is one folder down).
4. The og/twitter image is the site card
   (`og-james-fischer-mosaic-2026-11-14-1200x630.jpg`); leave it unless a new card is made.

## 2. Link the neighbours (prev/next)

At the bottom of each post is `<nav class="post-nav">`:

- In the **new** post: set the "← Older" item to a link to the previous newest
  post (uncomment the `<a class="post-nav-prev">` line and delete the disabled
  `<span>`). Keep "Newer →" as the disabled span.
- In the **previous newest** post: replace its disabled "Newer →" span with
  `<a class="post-nav-next" href="<new-slug>.html"><small>Newer →</small>New post title</a>`.

## 3. Add the card to Blog.html

Copy one `<li class="post-card">` block inside `<ol id="post-list">` and paste
it at the **top** of the list (newest first). Update:

- `data-slug` and the `href` (`blog/<slug>.html`)
- thumbnail `src` (path from the site root, e.g. `media/<file>.webp`), or swap the
  `<figure>` for `<figure class="post-thumb post-thumb--none"><span>NO SIGNAL</span></figure>` if the post has no image
- the number in `<span class="cap-index">` (count up: the newest post has the highest number)
- title, date and the excerpt (the post's first sentence or two)

The index shows 9 cards per page (5 on phones); past that, Newer/Older page buttons appear on their own.

## 4. Check before pushing

```bash
python3 -m http.server 8765   # from the site folder
```

Open `http://localhost:8765/Blog.html`, click the new card, check back/prev/next,
and take the 390px and 1440px screenshots the site rules ask for.

## Rules

- Keep Band for Band posts and Skull World easter-egg content off the site.
- Drafts stay in `_drafts/` (not published) until James approves them.
