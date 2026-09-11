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
license: Commercial
---

## Motivation

Most web editors build on the browser's own text rendering. This provides layout, selection, and
text input out of the box, but it also means working within behaviour designed for web pages rather
than editing products. Interactions such as typewriter mode, animated navigation, or a custom caret
become difficult, while very large documents leave the browser maintaining thousands of DOM nodes.

I built Typebar to give applications control over the entire editing surface. It is a TypeScript
editing engine with its own document model, layout, selection, and rendering pipeline, drawn
entirely on an HTML canvas. This architecture makes richer interactions possible while keeping the
editor responsive as documents grow, including documents containing several million words.

Typebar now powers [Savannah](/savannah), but it is not limited to conventional writing
applications. Its document and rendering model can also serve richer or more spatial interfaces
where text is only one part of a canvas.

<figure>
<img src="/images/typebar-savannah.png" alt="Typebar used in a desktop Writer application" />
<figcaption>Typebar used in a desktop Writer application</figcaption>
</figure>

## Architecture

Typebar takes a different approach: render everything on a canvas. The document is a data 
structure, the screen is a drawing surface, and the editor owns everything in between. That 
means writing things browsers normally handle for you — a layout engine, text measurement, caret 
geometry, selection rectangles, a scrollbar. But it also means native-like control over every 
pixel, and predictable performance regardless of document size.

<figure>
<img src="/images/typebar-performance.png" alt="Typebar used in a " />
<figcaption>Typebar does not sweat FPS, even while typing in documents with 
several million words</figcaption>
</figure>

> Zero dependencies. The editor owns every pixel.

- **A layout engine**. Each block in the document (paragraph, heading, list item, blockquote) 
  produces a layout — measured text broken into lines, positioned on the canvas.
- **Text measurement** Font metrics, word widths, line breaks — all computed via the Canvas text 
  measurement API. A custom TextMeasurer abstraction keeps this testable and swappable.
- **Input without a text field** Canvas elements don't accept keyboard input. A hidden textarea 
  captures keystrokes and IME composition, then the editor translates those into document 
  mutations. Full composition support for non-Latin input methods.

## API

The API offered allows for customization while providing sensible defaults

```typescript
const editor = new Typebar<T>(this._canvas, this.document, {
  debugOptions: this.options?.debugOptions,
  listeners: {
    debug: this._boundDebugListener,
    stateChange: this._handleStateChange.bind(this),
    documentUpdate: this._handleDocumentUpdate.bind(this),
    changes: this._handleChanges.bind(this),
    findChange: this._handleFindChange.bind(this),
  },
  requests: {
    find: (args) => this._handleFindRequest(args),
  },
  meta: this.options?.meta,
  stylesheet: this.options?.stylesheet,
  stage: this.options?.stage,
  readOnly: this.options?.readOnly,
});
```
