---
title: Mayocat Shop
type: work
subtitle: Open source e-commerce and marketplace platform on the JVM.
description: A self-contained e-commerce platform with multi-tenancy, theming, and marketplace support. Ships as a single JAR — back-office, storefront, and REST API included.
image: /images/mayocat-shop.png
technologies:
  - Java
  - PostgreSQL
  - Angular
  - Elasticsearch
years: 2012–2017
license: MPL 2.0
source: https://github.com/jvelo/mayocat-shop
---

## Motivation

Running an online store or a multi-vendor marketplace shouldn't require a monolithic CMS or assembling a dozen services. Mayocat Shop is a self-contained platform that one person can deploy and a non-technical merchant can operate.

It ships as a single JAR pointed at a PostgreSQL database, with a theme dropped in to get a store running — back-office, storefront, and REST API included.

## What it does

Products with variants, collections, cart, checkout, payment, shipping, taxes, orders, invoicing. A full CMS alongside the catalog — pages, blog, home page curation. Multi-language content. Declarative theme addons that let theme authors define custom fields (selects, color pickers, dates) in YAML without writing code.

<figure>
<img src="/images/mayocat-backoffice2.png" alt="Mayocat Shop back-office — order management" />
<figcaption>Order management with status tracking, line items, and shipping details</figcaption>
</figure>

## Architecture

About 50,000 lines of Java across 40+ modules, organized in three layers:

- **Platform** — reusable infrastructure: accounts, multi-tenancy, configuration, theming, search, storage, webhooks, image processing, mail, PDF generation, localization. This layer knows nothing about e-commerce — it could host a different application entirely.
- **Shop** — the e-commerce domain: catalog, cart, checkout, payment (PayPal and extensible), billing, shipping (flat rate, weight-based, price-based), taxes, marketplace.
- **CMS** — content management: pages, news/blog, contact forms, home page curation.

Multi-tenancy is structural, not a filter on queries. It runs through configuration (merging defaults, theme settings, and per-tenant overrides), request handling (tenant resolution from hostname or path), and data access. A marketplace operator sets global defaults; each tenant customizes from there.

## In production

A few storefronts that ran on the platform — each with its own theme, branding, and content:

<image-gallery ratio="16/10" align="top">
<img src="/images/mayocat-doolishop.png" alt="Doolittle — children's magazine and shop" />
<img src="/images/mayocat-thisisnotamap.png" alt="This is not a map — travel photography books" />
<img src="/images/mayocat-aristide.png" alt="Aristide — cat hotel in Paris" />
<figcaption><strong>Doolittle</strong> (children's magazine), <strong>This is not a map</strong> (travel photography books), <strong>Aristide</strong> (cat hotel in Paris)</figcaption>
</image-gallery>

## Status

Retired as of 2017. No longer actively developed, though production sites ran on it for years after. The codebase remains as a reference — roughly 1,700 commits, primarily authored by me with contributions from Louis Béziau (back-office UX design), Johann Pardanaud (localization system), and Vincent Velociter.
