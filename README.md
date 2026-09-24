# reecesim.com
Static personal site for Reece Sim (HubSpot CMS developer, founder of Themespot): plain HTML + `/css/main.css`, no build step.
Add a case study: copy a `work/<slug>/index.html`, edit its copy, image (`/img/`, 1200x630) and meta tags, then add a card to `index.html` and `work/index.html`, fix the prev/next links, and list the URL in `sitemap.xml`.
Styles come from the Claude Design export (monochrome, `ywc-*` classes); site-specific additions live at the end of `css/main.css`.
GitHub Pages deploys from the `main` branch root; the custom domain is set by `CNAME`.
