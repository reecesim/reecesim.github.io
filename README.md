# reecesim.com

Static GitHub Pages site.

- `/` — the current site (formerly reviewed at `/v2/`): `index.html`, `work/` (case studies), `privacy/`, with styles in `css/` and images in `img/`. Indexed and listed in `sitemap.xml`.
- `/legacy/` — word-for-word static snapshot of the former yourwebconsultant.com (HubSpot Elevate theme), taken 2026-09-24, with every asset localised under `/legacy/assets/`. Kept for reference only: every page is noindex and `/legacy/` is disallowed in `robots.txt`. HubSpot form, meetings and tracking embeds stay external.
- Redirect stubs — GitHub Pages has no server-side redirects, so each former URL is a small noindex HTML page with a meta refresh, a canonical and a fallback link:
  - `/consulting/` → `/`, `/contact/` → `/#contact`, `/book-a-call/` → the HubSpot meetings link
  - `/portfolio/` → `/work/`, and each `/portfolio/<old-slug>/` → its `/work/<slug>/` page
  - `/v2/`, `/v2/privacy/`, `/v2/work/**` → their root equivalents
- `404.html` — not-found page in the current design.
