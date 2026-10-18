---
title: Writer’s Cut
type: work
subtitle: A writing agent that leaves final cut to the author.
description: A demo of a writing agent built on Typebar. The agent’s edits arrive as proposals layered over the document, and the writer reviews, accepts, edits or discusses each one.
image: /images/writers-cut.png
badge: demo
technologies:
  - TypeScript
  - Typebar
  - React
  - Anthropic API
  - OpenRouter
years: 2026–present
license: Commercial
---

I designed and built Writer’s Cut, a demo of a writing agent on top of the [Typebar](/typebar) editing engine. The agent never changes the document. It proposes, and the writer decides.

## Motivation

Most AI writing tools either rewrite your text and leave you to compare, or answer in a chat and leave you to copy what you want. Either way, deciding what to keep happens outside the document.

Writer’s Cut puts that decision at the center. Every edit from the agent is a proposal, shown in place, that you can accept, reject or discuss. You can also edit it right there in the text, like any other sentence, and accept your own version of it. The document stays yours until you say otherwise.

## What it does

**Proposals over a clean document.** The agent’s edits show in the text as they arrive, painted as insertions and deletions. They live in a layer over the document, not in it: the document itself, and anything saved or exported from it, only ever holds the text you have accepted. You can hide the proposals at any time and write in peace.

**Proposals that keep up with your edits.** You can keep writing while proposals are pending. Each one is anchored to the text it changes and follows it when you type around it, split a paragraph, merge two or move one. You can also edit the proposed text itself: what you type becomes part of the proposal. A proposal that no longer applies is set aside instead of landing in the wrong place.

**Ask at the right scope.** An ask covers the whole document, a section, a paragraph or a selection. Selecting text opens a small menu with one-click asks: fix, tighten, expand, rephrase, translate. While the agent works, the scope stays marked and the rest of the text fades.

<figure>
<img src="/images/writers-cut-scope.png" alt="Writer’s Cut during a run on a passage of two paragraphs: the passage is outlined and marked Asked, and the rest of the text is faded" />
<figcaption>An ask on a passage of two paragraphs. The scope stays outlined while the agent works.</figcaption>
</figure>

**Review one by one.** A review sheet lists the pending proposals in the order of the text and walks through them with the keyboard: Enter accepts, Backspace rejects. Proposals are sorted into fixes, style and content, so you can accept all the typo fixes at once and take your time on the rest. Accepting is a single undo step.

<figure>
<img src="/images/writers-cut-review.png" alt="The review sheet of Writer’s Cut, listing nine proposals in the order of the text, with the current one open on two sides, Original and Proposed" />
<figcaption>The review sheet, with the current proposal open on two sides.</figcaption>
</figure>

**Discuss a proposal.** If a proposal is close but not right, you can talk about it with the agent. Its answer may be a new version of the proposal, which takes the place of the first one. Earlier versions stay one click away, and a rejected or replaced proposal can be brought back.

**Every run is traced.** Each answer shows the tokens it spent and what they cost. A transcript shows the whole run: the system prompt, the tools, and for each round trip what the model received, what it answered and what its tool calls returned.

<figure>
<img src="/images/writers-cut-transcript.png" alt="The model transcript of a run in Writer’s Cut, with the tokens and cost of the round trip, the tool calls of the agent and what each one returned" />
<figcaption>The transcript of a run, with tokens and cost for each round trip.</figcaption>
</figure>

## Under the hood

Writer’s Cut is written in TypeScript. The editor is [Typebar](/typebar); the interface around it is built with React.

**The proposal layer.** Typebar lets an application put its own layer between the document and the editing surface. Writer’s Cut uses it to compose the document and the pending proposals into what the writer sees, and to route every edit to the right place: the document, or the proposal that owns the edited text. Nothing pending ever reaches the document model.

**The agent loop.** I wrote the loop instead of using an agent framework. The model does not produce text to paste: it calls tools such as “propose a replacement in this block”, quoting the text it wants to change. The loop checks every call before anything shows. A quote that does not match the document, or a proposal that overlaps another one from the same run, is refused and sent back to the model with the reason.

**Anchoring.** The writer can keep editing while the agent works and while proposals are pending. Each proposal is anchored to the text it changes, and follows every edit until it is decided.

## Status

Writer’s Cut is a working demo, in active development. For now it runs locally, with your own API key. If you would like to see it in action, drop me [an email](#contact).
