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
  - Yjs
  - CRDT
years: 2025–present
license: Commercial
---

## Motivation

Most web editors build on the browser's own text rendering. This provides layout, selection, and
text input out of the box, but it also means working within behaviour designed for web pages rather
than applications where editing is central.

Typebar takes a different route. It is a TypeScript editing engine with its own document model,
layout, selection, and rendering pipeline, drawn entirely on an HTML canvas. That makes room for
experiences such as a typewriter mode that anchors the active line, effects and decorations applied
directly to text and embedded objects, or multiple editable areas inside a larger spatial canvas.

Owning the editing surface also avoids maintaining thousands of DOM nodes as documents grow.
Typebar remains responsive on documents containing several million words. It now powers
[Savannah](/savannah), and its extensible block types, marks, views, and effects allow the same
foundation to support other kinds of editor.

<figure>
<img src="/images/typebar-savannah.png" alt="Typebar used in a desktop Writer application" />
<figcaption>Typebar used in a Savannah, a desktop Writer application</figcaption>
</figure>

## Architecture

Not using the DOM as the editing surface means Typebar has to provide much of the machinery a
browser editor would normally inherit. The engine separates that work into a document model, a
layout and rendering pipeline, and an input layer.

**Document model and changes:** documents are made of blocks such as paragraphs, headings, lists,
and embedded objects. Positions are indexed for fast lookup, while edits go through a mutation and
command system that provides atomic changes, undo and redo, and deltas that the host application
can persist.

**Layout and rendering:** each block type turns its content into measured lines and other views
ready to be drawn. Layouts are cached at block level, so an edit does not require laying out the
whole document again, and the viewport only paints what is visible.

<figure>
<img src="/images/typebar-performance.png" alt="Typebar editing a document containing several million words" />
<figcaption>Typebar remains responsive while editing a document containing several million words</figcaption>
</figure>

**Input and composition:** a hidden textarea captures keyboard input and IME composition, which
Typebar translates into document changes. Navigation follows grapheme boundaries. Typebar
maintains its own selection model and converts copy and paste operations between the document and
the system clipboard.

**Extensions:** applications can provide their own block types, marks, views, text effects, and
inline patterns. Features such as spellchecking, find and replace, and focus mode sit on the same
plugin system rather than being built into the core.

**Offline-first sync:** Typebar includes an optional sync layer that connects the editor to a
replicated document model without prescribing a transport or persistence layer. Its Yjs backend
uses a CRDT to preserve concurrent text edits and let clients converge after working offline.

## Status

Typebar is currently in beta. If you are interested in learning more or integrating it into your
own application, [get in touch](#contact).
