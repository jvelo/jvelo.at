---
title: BiomeOS
type: work
subtitle: A controlled-environment agriculture platform for indoor farms and research facilities.
description: Software platform for operating indoor farms — environment control, real-time monitoring, safety systems, and agronomic protocol management. Runs dozens of facilities across three continents.
image: /images/biomeos-touchscreen.png
technologies:
  - Python
  - React
  - GraphQL
  - Prometheus
  - Ansible
  - Modbus
years: 2021–present
---

## Context

Orius is a botanical ingredients company that grows plants indoors for the pharmaceutical and cosmetic industries. Clients like Pierre Fabre, Chanel, and Givaudan need raw materials rich in active compounds and free from contaminants — which means precise environment control, not just a greenhouse with sensors.

BiomeOS is the software platform that runs these farms. As co-founder and primary developer at Orius, I designed and built the platform from a single prototype chamber to dozens of production facilities in France, the US, and Martinique.

## What it does

Each growing chamber — whether a 2m² phytotron or a full cultivation room — runs a BiomeOS instance that manages its entire environment: temperature, humidity, CO2, irrigation, lighting, air renewal. Operators define agronomic protocols (photoperiod, climate targets, irrigation schedules), and the system executes them autonomously, adjusting actuators in real time.

<figure>
<img src="/images/biomeos-dashboard.png" alt="BiomeOS dashboard showing climate charts, sensor readings, and protocol status" />
<figcaption>The BiomeOS dashboard for a cultivation chamber — climate telemetry, tank levels, irrigation scheduling, lighting configuration, and protocol status at a glance</figcaption>
</figure>

Beyond day-to-day operation, BiomeOS handles the things that make indoor farming hard in practice: safety alarms and failsafes that protect crops when sensors go out of range, nutrient mixing with pH and conductivity feedback loops, and LED lighting calibration that translates between raw channel percentages and photobiologically meaningful properties like PAR and red-to-blue ratio.

## Architecture

The platform is built as a plugin-based async Python server exposing a GraphQL API. Three runtimes ship from the same codebase:

- **BiomeOS** — the generic IoT layer: sensors, actuators, scheduling, data persistence, safety alarms
- **BiomeBox** — the farm-specific layer: irrigation protocols, lighting control, climate regulation, Slack alerts for operators
- **Mixmaster** — a nutrient mixing subsystem: pH/conductivity probes, dosing pumps, injection scheduling

Extensions plug in at runtime via Python entry points — a PostgreSQL gateway that persists system state, an LED calibration library that uses R-tree spatial indexing to find optimal light setpoints, each discovered and loaded automatically.

The frontend is a set of Lit web components shared across a browser-based dashboard and a touch-optimized panel application installed directly on farm hardware. Both connect to the local server via GraphQL subscriptions for real-time updates.

## Status

BiomeOS is in active production. Several dozen phytotrons and cultivation chambers run the platform across facilities in France, the United States, and at CIRAD in Martinique.
