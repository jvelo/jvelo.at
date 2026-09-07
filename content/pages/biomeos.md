---
title: BiomeOS
type: work
subtitle: A controlled-environment agriculture platform for indoor farms and research facilities.
description: Software platform for operating indoor farms — environment control, real-time monitoring, safety systems, and agronomic protocol management. Runs dozens of facilities across three time zones.
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

[Orius](https://www.orius.co/) is a botanical ingredients company that combines horticultural 
innovation with advanced  production technologies to serve the cosmetic, nutraceutical, space, 
and pharmaceutical industries. The company leverages highly controlled environments to 
fast-track plant research and create raw materials rich in active compounds and free from 
contaminants.

BiomeOS is the software platform that runs these research and production facilities, for Orius 
and for its customers. As co-founder and head of software engineering at Orius, I designed and 
built the BiomeOS platform, from a single prototype chamber to several facilities running across 
three time zones.

## Design principles

Every R&D experiment or production run represents weeks of work and significant cost. The 
platform's design reflects that:

**Reliability first.** Protocols must execute and crops must be protected, regardless of network 
conditions, operator availability, or hardware failures. The system runs locally on embedded 
hardware, failsafes engage automatically, and no single point of failure can compromise a 
growing cycle.

**Data for science.** Every measurement is collected, contextualized, and persisted in a 
format the science teams can query directly from their notebooks — no pipeline in
between.

**Legibility.** A cultivation chamber can have dozens of sensors, actuators, and scheduled 
operations interacting simultaneously. The platform is designed to make that complexity 
readable: clear dashboards, structured alerts and traceable state changes. Operators and 
scientists should always understand what the system is doing and why.

## The platform

Each growing chamber — whether a 2m² phytotron or a full cultivation room — runs a BiomeOS instance
on embedded hardware, managing its entire environment: temperature, humidity, CO2, irrigation,
lighting, air renewal. Operators define agronomic protocols (including light settings, climate 
targets, irrigation schedules), and the system executes them autonomously, adjusting actuators 
in real time.

Cloud services provide remote access and centralized monitoring, but the system 
doesn't depend on them — if the network goes down, protocols keep running, data keeps recording,
and crops stay protected.

<figure>
<img src="/images/biomeos-dashboard.png" alt="BiomeOS dashboard showing climate charts, sensor readings, and protocol status" />
<figcaption>The BiomeOS dashboard for a cultivation chamber — climate telemetry, tank levels, irrigation scheduling, lighting configuration, and protocol status at a glance</figcaption>
</figure>

The platform is instrumented like a data center. Every sensor reading is collected, stored, and
tracked against expected conditions — temperature, humidity, CO2, tank levels, light spectrum.
Prometheus, Grafana, and Loki provide the monitoring and alerting stack. When conditions deviate
from protocol targets, safety systems react automatically: failsafes engage, operators get 
notified, and the system logs exactly what happened and when.

Specialized subsystems handle the domains where precision matters most: nutrient mixing with pH and 
conductivity feedback loops, and LED lighting calibration that translates between raw channel power
and photobiologically meaningful properties like PAR and red-to-blue ratio.

## Architecture

The platform is built as a plugin-based async Python server exposing a GraphQL API. The server interfaces with industrial field devices over Modbus — temperature probes, solenoid valves, PLCs, LED drivers — and feeds readings into reactive streams (ReactiveX), where real-time transformations, safety checks, and persistence compose into a single pipeline. Extensions plug in at 
runtime via Python entry points — an LED calibration library that uses R-tree spatial indexing 
to find optimal light setpoints, Prometheus instrumentation for metrics export — each discovered 
and loaded automatically.

The frontend is a set of Lit web components shared across a browser-based dashboard and a 
touch-optimized panel application installed directly on farm hardware. Both connect to the local 
server via GraphQL subscriptions for real-time updates.

## Status

BiomeOS is in active production. Several dozen phytotrons and cultivation chambers run the platform across facilities in France, the United States, and at CIRAD in Martinique.
