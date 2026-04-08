# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static portfolio website for Wicked Nice, a creative studio in Prague. Vanilla HTML/CSS/JS — no build system, no dependencies, no package manager.

## Development

Open any HTML file directly in a browser, or serve with any static HTTP server (e.g. `python3 -m http.server`). No build or test steps exist.

When shared an image as part of a prompt, always view it for context to the user's message.

Never add yourself as a contributor or as having worked on the code in any manner when pushing to any external service like GitHub.

## Architecture

When writing copy use regular long dashes – and not - or —

## Architecture

- **3 HTML pages**: `index.html` (homepage), `projects.html` (portfolio), `contact.html` — all share the same CSS and JS
- **`styles.css`**: Single stylesheet. Desktop-first base (1920px), then `@media (max-width: 1919px) and (min-width: 769px)` for laptop (vw units), then `@media (max-width: 768px)` for mobile. Any layout change must be applied across all three breakpoints.
- **`script.js`**: All interactivity — accordions (services + projects), smooth scroll nav, hamburger/mobile nav, marquee strips, star rotation, IntersectionObserver for active nav highlighting
- **`public/`**: `images/` for site assets, `fonts/` for self-hosted Archivo, `projects/` for portfolio content (each subfolder = one project with images/videos + TEXT.txt)

## Key Patterns

- **State via CSS classes**: `.active` on accordion items, `.is-open` on mobile nav/hamburger, `.menu-link--current` on nav links
- **Accordion behavior**: Only one item open at a time within a group. Services use `.service-item`, projects use `.proj-item`. Both share the same toggle pattern.
- **Responsive values**: Desktop uses px, laptop uses vw (base_px / 1920 * 100), mobile uses px at smaller scales. Borders go from 5px (desktop) → 5px (laptop) → 3px (mobile).
- **Project thumbnails**: `flex` inline style on `.proj-thumb` divs controls relative width in the strip. Value represents aspect-ratio-derived width weight.
- **Project detail gallery**: 3-column CSS grid (`375px | 1fr | 463px`). Images use inline `height` styles with `object-fit: cover`. On mobile, collapses to single column.
- **Color scheme**: Background `#f2f2f2`, accent `#fe330a` (menu bar, footer, hover states), text `#000`
- **Font**: Archivo (self-hosted, weights 600/700/800), uppercase throughout

## Cross-Page Consistency

All pages must have matching: sticky menu markup, hamburger button, mobile nav panel, footer structure (`.footer-socials` with LinkedIn/Instagram, `.footer-contact` with email, `.footer-logo`, `.footer-copyright`). When changing shared components, update all three HTML files.
