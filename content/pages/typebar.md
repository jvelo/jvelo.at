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

## Problem space

How do you build a rich-text editor that can handle editing large, novel-sized documents
without dropping frames, and run in native desktop or mobile apps as well as a web browser?
Typebar grows out of this need and addresses the challenge by providing a fully-featured,
extensible rich-text editor framework, built from scratch on top of the Canvas API, free of any
third-party dependencies.

## Philosophy

Most rich-text editors for the web are built on top of the browser's own text rendering. That
gives you a lot for free — the browser handles layout, selection, cursor behavior — but it also
means you're constrained by what it was designed to do. Things like keeping the active line
centered on screen, animating viewport transitions, or even just drawing a custom caret become
convoluted or outright impossible when the browser owns the rendering.

There's also a performance ceiling. Large documents mean thousands of DOM nodes to maintain,
style, and lay out. It gets slow, and there's not much you can do about it.

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