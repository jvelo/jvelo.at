---
title: Typebar
type: work
subtitle: A text editor framework built on HTML canvas.
description: A rich-text editor framework for building delightful writing experiences. Built on the HTML canvas element, written in TypeScript with zero dependencies.
image: /images/typebar.png
badge: private beta
technologies:
  - TypeScript
  - Canvas API
years: 2025–present
---

## Philosophy

DOM-based editors represent text as a tree of HTML elements. The browser handles layout, selection, and rendering — which is convenient until you want to do something it wasn't designed for. A typewriter mode that keeps the active line centered. A custom caret that animates. Smooth viewport transitions. Per-line background effects. These range from convoluted to impossible when the browser owns the rendering.

There's also a performance ceiling. Large documents mean thousands of DOM nodes to maintain, style, and lay out. It gets slow, and there's not much you can do about it.

<figure>
<img src="/images/typebar.png" alt="Typebar editor with inspector panel open" />
<figcaption>The editor <strong>does not sweat</strong> FPS, even while typing in a document with several million words</figcaption>
</figure>

## Architecture

Typebar takes a different approach: render everything on a canvas. The document is a data structure, the screen is a drawing surface, and the editor owns everything in between. That means writing things browsers normally handle for you — a layout engine, text measurement, caret geometry, selection rectangles, a scrollbar. But it also means native-like control over every pixel, and predictable performance regardless of document size.

> No rendering library, no framework, no text measurement polyfill

- **A layout engine**. Each block in the document (paragraph, heading, list item, blockquote) produces a layout — measured text broken into lines, positioned on the canvas.
- **Text measurement** Font metrics, word widths, line breaks — all computed via the Canvas text measurement API. A custom TextMeasurer abstraction keeps this testable and swappable.
- **Input without a text field** Canvas elements don't accept keyboard input. A hidden textarea captures keystrokes and IME composition, then the editor translates those into document mutations. Full composition support for non-Latin input methods.

