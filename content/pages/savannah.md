---
title: Savannah
type: work
subtitle: A quiet desktop app for long-form writing.
description: A minimalist desktop text editor for long-form writing. Journals, essays, novels. Built on Typebar with Electron, with full-text search, typewriter mode, and native spellcheck.
image: /images/typebar-savannah.png
badge: private alpha
technologies:
  - TypeScript
  - Electron
  - React
  - SQLite
  - Typebar
years: 2025–present
license: Commercial
---

## Motivation

I designed and built Savannah as a desktop app for writers who want to stay close to their words. It follows in the tradition of calm, distraction-free writing tools pioneered by WriteRoom and iA Writer, but doesn’t pursue minimalism for its own sake. The interface stays quiet without limiting what the editor can do. You can use AI for a close edit, a critical second reading, or to explore the ideas around your work.

Savannah runs on [Typebar](/typebar), the pure TypeScript canvas-based editing engine I built for this kind of
application. It gives Savannah control over the document model and the whole writing surface while remaining fast on novel-length documents.

## What it does

**A quiet place to write**. The interface can disappear entirely, leaving only the words on screen. Typewriter and focus modes go further, keeping only the current sentence in focus at the center of the screen. Search, the outline, word count, and spellcheck remain close at hand when needed.

**A library instead of files.** Naming a file, or giving a title to a piece that barely exists yet, is exactly the kind of friction Savannah removes. A new document opens ready for writing, and every edit is stored as it happens, with no save button involved. Documents live in a local library, ordered by recent activity. Full-text search and quick-open keep any document a shortcut away, while Markdown import and export keep documents portable.

**AI on the writer’s terms.** I’m integrating AI into Savannah as a copy editor and sparring partner, not something that writes for you. It can question a passage or help you look at a problem another way. You decide when to bring it in and what, if anything, to amend in your prose.

## Under the hood

Savannah is an Electron application written in TypeScript. The editor surface is based on [Typebar](/typebar), and stays responsive even on documents containing millions of words. The rest of the interface, including navigation and settings, is built with React. Documents are stored in SQLite, with a full-text index for search and a small migration system.

The save path is designed around document integrity. Typebar emits document changes as deltas; Savannah queues them in order and applies each batch in a single SQLite transaction, using Typebar’s write planner to keep block ordering consistent. A fuzz suite runs random editing sessions through this pipeline to make sure the stored document never drifts from what is on screen.
## Status

Savannah is in private alpha, with a new build available every few weeks. If you are interested in joining the alpha, drop me [an email](/contact).
