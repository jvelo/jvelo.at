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

I started Mayocat Shop because I wanted to build an open-source product of my own. At the time,
most e-commerce platforms were designed around a single store. Supporting several merchants or
building a marketplace often meant running separate installations or working against the
platform's underlying model.

Mayocat Shop treated multi-tenancy as part of the foundation. The same platform could run an
independent storefront, several branded stores, or a multi-vendor marketplace, with a back office
that non-technical merchants could operate. I designed and built most of it, with help on the
back-office UX and a few contributions from the open-source community.

## What it does

Mayocat Shop brings the whole store into one application: catalog, cart, checkout, payment,
shipping, taxes, orders, and invoicing, all managed from its back office. A CMS for pages,
articles, and home page curation sits alongside the catalog, so content and commerce do not have
to be split across systems.

Themes control more than the storefront's appearance. They can declare additional fields, such as
selects, color pickers, or dates, in YAML. Mayocat Shop adds them to the back office, stores and
indexes their values, and makes them available to templates without application code. Content and
configuration can also be localized for each storefront.

The back office, storefront, and REST API ship together. Webhooks and search provide integration
points for more tailored projects.

<figure>
<img src="/images/mayocat-backoffice2.png" alt="Mayocat Shop back-office — order management" />
<figcaption>Order management with status tracking, line items, and shipping details</figcaption>
</figure>

## Architecture

**A modular monolith:** Mayocat Shop is built on Dropwizard, a lightweight Java framework for
building web applications. Its code is separated into a reusable platform, the e-commerce domain,
and CMS features, then packaged as a single application. The platform provides accounts,
configuration, storage, search, themes, and other shared services without depending on either of
the two domains built on top of it.

**Multi-tenancy throughout:** the tenant is resolved from the hostname or request path and carried
through configuration and data access. Defaults, theme settings, and per-tenant overrides are
merged together, allowing a marketplace operator to set the common ground while each storefront
keeps its own configuration and data.

**Storefront and back office:** storefronts are rendered from Handlebars themes, while the
AngularJS back office uses the same REST API exposed to integrations. Postgres stores the core
data and Elasticsearch powers search. The whole platform ships as a single JAR.

## In production

A few storefronts that ran on the platform, each with its own theme, branding, and content:

<image-gallery ratio="16/10" align="top">
<img src="/images/mayocat-doolishop.png" alt="Doolittle — children's magazine and shop" />
<img src="/images/mayocat-thisisnotamap.png" alt="This is not a map — travel photography books" />
<img src="/images/mayocat-aristide.png" alt="Aristide — cat hotel in Paris" />
<figcaption><strong>Doolittle</strong> (children's magazine), <strong>This is not a map</strong> (travel photography books), <strong>Aristide</strong> (cat hotel in Paris)</figcaption>
</image-gallery>

While Mayocat Shop is no longer actively developed, there are production websites that still run on 
the platform today.
