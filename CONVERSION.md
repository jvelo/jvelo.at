# Conversion Critique

## Goal

Optimize the site to convert more freelance and consulting leads.

## Current Assessment

The site has real substance and strong technical credibility, but it currently reads more like a thoughtful personal portfolio than a focused client-acquisition site.

The strongest asset is the work itself.

The weakest part is how little of that gets translated into a clear offer for a prospective client.

## Main Findings

### 1. Positioning is too vague at the top of the funnel

The homepage and global framing say variations of:

- "Product engineer"
- "Software creative"
- "I design and build software products"

That is directionally correct, but it does not tell a prospect:

- who you help
- what kind of problems you solve
- what outcomes you drive
- why they should contact you now

Notes:

- "Software creative" is elegant but commercially weak.
- The site should lead with buyer-relevant positioning, not identity labels.

Relevant files:

- `content/home/index.md`
- `src/components/Sidebar.tsx`
- `src/components/Layout.tsx`

### 2. There is no explicit service offer

The site shows expertise, but it does not turn that into a clear offer.

Right now a buyer has to infer what hiring you would look like.

Problems:

- no visible services page
- services nav is commented out
- about page is hidden from navigation
- expertise section stays generic

A buyer should quickly understand whether you are a fit for:

- early-stage product builds
- hands-on senior engineering
- technical leadership
- platform redesign
- rescuing complex systems

Relevant files:

- `src/components/Sidebar.tsx`
- `src/components/Expertise.tsx`
- `src/components/Layout.tsx`

### 3. Case studies show technical depth, but not hiring outcomes quickly enough

The work pages contain strong material, especially technical substance and credibility.

The issue is framing.

They currently spend more energy on architecture and principles than on the commercial questions a prospective client cares about first:

- what was the business problem
- what was your role
- what constraints existed
- what did you ship
- what changed because of your work

Specific notes:

- `BiomeOS` is the closest to an effective client-facing case study and should become the template.
- `Typebar` is interesting, but reads more like an engineering essay or product exploration than a trust-building freelance case study.
- The homepage project cards use descriptive copy, but not outcome-oriented copy.

Relevant files:

- `content/pages/biomeos.md`
- `content/pages/typebar.md`
- `src/components/SelectedWorks.tsx`

### 4. The CTA path has unnecessary friction

The current call to action is present, but vague.

The modal contact form does not set expectations about:

- what kinds of projects you want
- what engagement format you offer
- how quickly you reply
- what happens after someone contacts you

The contact page is also sparse and privacy-oriented rather than conversion-oriented.

That is not wrong, but it is suboptimal for freelance lead generation.

Relevant files:

- `src/components/ReachOut.tsx`
- `public/contact-form.js`
- `content/pages/connect.md`

### 5. Trust signals exist, but are not surfaced where they matter

The hidden about page contains strong credibility material:

- long experience on the web
- open source history
- XWiki
- Mayocat
- Agricool
- co-founding Orius
- production systems used in the real world
- space-agency-adjacent credibility

That material should not be buried.

The homepage currently lacks obvious trust markers such as:

- years of experience
- notable companies
- systems in production
- scale indicators
- testimonials
- logos
- concise proof statements

Relevant files:

- `content/pages/about.md`

## Priority Changes

### 1. Rewrite the hero around a buyer and an outcome

The homepage should immediately answer:

- who you help
- what you help them achieve
- what type of engagement you offer

Example direction:

> I help startups and product teams design and ship complex software products.

Example subhead:

> Hands-on product engineering and technical leadership for early-stage builds, platform work, and difficult systems.

### 2. Add a clear services section

Three offers is enough.

Suggested framing:

- Build a new product
- Lead a complex implementation
- Stabilize or evolve an existing system

Each one should explain:

- when to hire you
- what you do
- what outcome to expect

### 3. Reframe case studies with a summary box near the top

Each featured project should quickly surface:

- client or company
- your role
- business or product problem
- what you shipped
- outcome, scale, or durability

This summary should appear before the deeper technical narrative.

### 4. Put credibility on the homepage

Add a short proof section or strip with statements like:

- 20 years building on the web
- Former XWiki core contributor
- Co-founder / head of software at Orius
- Systems running in production across 3 continents

This is the fastest way to improve trust without adding much complexity.

### 5. Make the CTA concrete

Replace generic CTA phrasing with more specific language such as:

- Tell me about your project
- Book an intro call
- Usually replies within 2 business days

If you do not want to offer calendar booking, at least clarify the next step after contact.

## Practical Copy Direction

The site should shift from identity-driven copy to buyer-driven copy.

Less of this:

- Product engineer
- Software creative
- I design and build software products

More of this:

- I help startups and product teams ship ambitious software products
- Hands-on engineering and technical leadership for complex builds
- From prototype to production, including architecture, implementation, and technical direction

## What To Preserve

The current site already does a few things well and those should remain:

- strong taste and personality
- credible technical depth
- substantial project pages
- clear visual identity
- evidence of real experience rather than generic portfolio filler

The goal is not to make the site more generic.

The goal is to make its strengths easier for a prospective client to understand and act on.

## Suggested Next Iteration

If updating the site, the best order is:

1. Rewrite homepage hero and CTA
2. Add a services section
3. Surface trust signals on the homepage
4. Rework selected works copy to emphasize outcomes
5. Add top summaries to each case study
6. Improve the contact page and contact modal language

## Implementation Plan

### Objective

Increase the number of qualified freelance and consulting inquiries by making the site clearer, more credible, and easier to act on.

### Success Criteria

After this work, a first-time visitor should be able to answer these questions within a few seconds:

- Who is this for?
- What kind of work does he do?
- Why is he credible?
- What should I do next if I want to hire him?

### Guiding Principle

Do not turn the site into a generic consultant landing page.

Keep the existing taste, technical depth, and personality, but make the buying path explicit.

## Phase 1: Homepage Repositioning

### Goal

Clarify the offer immediately on the homepage.

### Changes

#### 1. Replace the current homepage framing

Rewrite the top-level copy so it leads with:

- target audience
- type of work
- outcome

Current direction is too identity-based.

New direction should be buyer-based.

Example structure:

- headline
- supporting paragraph
- primary CTA
- secondary trust line

Example homepage message:

- Headline: "I help startups and product teams design and ship complex software products."
- Supporting copy: "Hands-on product engineering and technical leadership for early-stage builds, platform work, and difficult systems."
- CTA: "Tell me about your project"
- Trust line: "20 years building on the web. Systems in production across three continents."

#### 2. Unify language across header, sidebar, metadata, and CTA

The following should all tell the same story:

- page title and description
- header subtitle
- sidebar subtitle
- homepage CTA copy

Avoid mixed framing like:

- product engineer
- software creative
- freelance and consulting work

Pick one clear commercial narrative and repeat it consistently.

### Files to update

- `content/home/index.md`
- `src/components/Layout.tsx`
- `src/components/Sidebar.tsx`
- `src/components/ReachOut.tsx`

## Phase 2: Add an Explicit Services Section

### Goal

Make it obvious what someone can hire you for.

### Changes

Add a homepage section for services or engagement types.

Keep it concise. Three offers is enough.

Suggested structure:

- **Build a product**
  For founders or teams starting something new and needing senior hands-on execution.
- **Lead a complex implementation**
  For teams that need architecture, technical direction, and delivery on a difficult product.
- **Stabilize and evolve an existing system**
  For products that need refactoring, scaling, better delivery practices, or senior ownership.

Each card should answer:

- when to hire you
- what you actually do
- what outcome they get

### Recommended CTA under services

- "Not sure which fits? Tell me about your project."

### Files to update

- `src/routes.tsx`
- new component, likely `src/components/Services.tsx`
- `public/styles.css`

## Phase 3: Surface Trust Signals Earlier

### Goal

Move credibility from deep pages into the homepage scanning path.

### Changes

Add a compact trust section below the hero or below services.

Possible content:

- 20 years building on the web
- Former XWiki core contributor
- Co-founder and head of software at Orius
- Production systems used across multiple continents
- Experience spanning product engineering and technical leadership

This section can be:

- a proof strip
- a short bio block
- a list of credibility statements

Do not over-design it. It should scan quickly.

### Optional extension

Bring back the About page in navigation and tighten it so it supports hiring rather than just biography.

### Files to update

- `content/pages/about.md`
- `src/components/Layout.tsx`
- homepage component structure in `src/routes.tsx`

## Phase 4: Rework Selected Works for Conversion

### Goal

Turn portfolio items into client-facing proof.

### Changes

Rewrite the short project card descriptions so they emphasize:

- the kind of problem solved
- the level of complexity
- evidence of production use

Instead of:

- what the software is

Prefer:

- why the work matters
- what role you played
- what it proves about you

Example directions:

- `BiomeOS`: emphasize production criticality, embedded control, real-world operations, international deployment
- `Mayocat Shop`: emphasize long-term durability, product ownership, e-commerce complexity, multi-tenant architecture
- `Typebar`: emphasize deep frontend systems work and unusual technical execution

### Files to update

- `src/components/SelectedWorks.tsx`

## Phase 5: Add Summary Blocks to Case Studies

### Goal

Help prospects understand each project before they commit to reading the full technical story.

### Changes

At the top of each work page, add a short summary block with:

- company or project
- your role
- problem
- solution
- outcome or current status

Recommended labels:

- Role
- Scope
- Challenge
- What I built
- Outcome

This should come before the long-form narrative.

### Notes by project

#### BiomeOS

Strongest case study already.

Promote:

- co-founder and head of software
- designed and built the platform
- used in production across multiple geographies
- reliability and operational stakes

#### Mayocat Shop

Clarify:

- it was your own platform
- it powered real storefronts
- some sites still run on it years later

#### Typebar

Clarify why this matters commercially.

It currently proves technical depth, but needs translation into:

- advanced frontend systems design
- performance-sensitive UI architecture
- unusual product engineering capability

### Files to update

- `content/pages/biomeos.md`
- `content/pages/mayocat-shop.md`
- `content/pages/typebar.md`
- `src/components/WorkPage.tsx`

## Phase 6: Improve the Contact Path

### Goal

Reduce friction and make contacting you feel safe and worthwhile.

### Changes

Rewrite CTA copy and contact language so visitors know:

- what kinds of inquiries are welcome
- whether freelance and consulting are both accepted
- what happens after they send a message
- how fast you usually reply

Suggested additions:

- "Tell me what you're building, where you're stuck, and what kind of help you need."
- "I usually reply within 2 business days."
- "Available for freelance product engineering and technical leadership engagements."

### Contact page improvements

The current contact page is minimal.

Expand it slightly with:

- a short welcome line
- preferred project types
- expected response time
- direct email as fallback

PGP can stay, but should not be the visible focus for buyers.

### Contact modal improvements

Add one short explanatory sentence above the form so it feels intentional instead of just functional.

### Files to update

- `content/pages/connect.md`
- `public/contact-form.js`
- `src/components/ReachOut.tsx`
- `public/styles.css`

## Phase 7: Restore Supporting Navigation

### Goal

Make key supporting pages easier to discover.

### Changes

Restore or add navigation links for:

- About
- Selected work or Work
- Contact

If a services section becomes its own page later, add Services as well.

Right now too much useful supporting material is hidden.

### Files to update

- `src/components/Layout.tsx`
- `src/components/Sidebar.tsx`

## Recommended Rollout Order

### Pass 1: Highest leverage, lowest effort

1. Rewrite homepage top copy
2. Rewrite CTA copy
3. Add trust strip
4. Rework project card descriptions

### Pass 2: Structural improvements

1. Add services section
2. Restore About in navigation
3. Improve contact page copy

### Pass 3: Deeper proof improvements

1. Add summary blocks to all case studies
2. Tighten About page around credibility and relevance to clients
3. Add testimonials or client quotes if available

## Optional Additions

These are useful, but not required for the first iteration:

- a scheduler link for intro calls
- testimonials
- client logos
- a dedicated services page
- a short "Who I work best with" section
- a short "Engagements I do not take" section

## Recommended Content Hierarchy for Homepage

The homepage should roughly read in this order:

1. Clear positioning
2. Trust and proof
3. Services
4. Selected work
5. Final CTA

This is a better sales sequence than the current order.

## Definition of Done

The implementation is in a good state when:

- the homepage clearly states who you help and what you do
- at least one CTA is concrete and expectation-setting
- services are explicit
- trust signals are visible without scrolling too deeply
- portfolio cards and work pages explain outcomes, not just systems
- contact feels easy and intentional
