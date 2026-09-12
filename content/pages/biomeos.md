---
title: BiomeOS
type: work
subtitle: A controlled-environment agriculture platform for indoor farms and research facilities.
description: Software platform for operating indoor farms — environment control, real-time monitoring, safety systems, and agronomic protocol management. Runs dozens of facilities across three time zones.
image: /images/biomeos-touchscreen.png
technologies:
  - Python
  - Lit
  - GraphQL
  - Prometheus
  - Ansible
  - Modbus
  - Embedded Linux
years: 2021–2026
yearsLabel: Years on project
---

## Context

[Orius](https://www.orius.co/) uses controlled-environment agriculture to research and produce
botanical ingredients for cosmetics, nutrition, and pharmaceuticals, as well as for space-agriculture
research. Each experiment or production run depends on maintaining precise environmental conditions
over several weeks.

BiomeOS is the software platform that runs these research and production facilities, both for Orius
and its customers. As co-founder and head of software engineering, I designed and built the platform.
It first ran on a single prototype chamber and now operates across several facilities in three time
zones.

## Design principles

Every R&D experiment or production run represents weeks of work and significant cost. The 
platform's design reflects that:

**Reliability first.** Protocols must execute and crops must be protected, regardless of network 
conditions, operator availability, or hardware failures. The system runs locally on embedded 
hardware, failsafes engage automatically, and no single point of failure can compromise a 
growing cycle.

**Data for science.** Every measurement is collected, contextualized, and persisted in a 
format the science teams can query directly from their notebooks, with no pipeline in between.

**Legibility.** A cultivation chamber can have dozens of sensors and actuators, with scheduled and
manual operations happening at the same time. The platform is designed to make that complexity 
readable: clear dashboards, structured alerts and traceable state changes. Operators and 
scientists should always understand what the system is doing and why.

## The platform

Each cultivation chamber runs its own BiomeOS instance on embedded hardware, whether it is a 2 m²
research chamber or a full cultivation room. Rather than driving devices individually, operators define
agronomic protocols describing how light, climate, irrigation, and other conditions should evolve
during a growing cycle. BiomeOS executes those protocols autonomously, translating them into
schedules and real-time control of sensors and actuators.

Everything required to run a chamber stays local: protocol execution, control loops, data
collection, and failsafes. Cloud services provide remote access and a central view across
facilities, but the chambers do not depend on them. If the network goes down, protocols continue
running and data continues recording.

<figure>
<img src="/images/biomeos-dashboard.png" alt="BiomeOS dashboard showing climate charts, sensor readings, and protocol status" />
<figcaption>The BiomeOS dashboard for a cultivation chamber — climate telemetry, tank levels, irrigation scheduling, lighting configuration, and protocol status at a glance</figcaption>
</figure>

The dashboard brings the whole growing cycle into one place: current conditions, protocol progress,
irrigation schedules, tank levels, lighting, and alerts. It is available on the touchscreen
installed beside the chamber as well as remotely through a browser.

BiomeOS treats a chamber as an observable system. Measurements are checked against expected
conditions, and when something drifts, failsafes can react locally, operators are notified, and the
event remains traceable.

Some parts of the system require more specialized controls. Nutrient mixing uses pH and
conductivity feedback loops, while lighting calibration translates raw LED channel power into
properties that matter to plant science, such as PAR and red-to-blue ratio.

## Architecture

The platform has three tiers: a BiomeOS runtime for each chamber, a gateway at each facility, and
central cloud services shared across the fleet. Control and safety stay close to the hardware;
aggregation and remote access are handled at the facility and cloud levels.

**At the chamber:** each runtime is an asynchronous Python server on embedded Linux. A common device
model and plugins connect sensors and actuators over protocols such as Modbus, MQTT, or HTTP.
ReactiveX streams compose control loops, safety checks, and persistence, while a GraphQL API
exposes live state and commands.

**At the facility:** the on-site gateway collects chamber data in PostgreSQL and aggregates it into
time series, even without an internet connection.

**In the cloud:** the gateway synchronizes aggregates, configuration, and settings with central
services. A private network mesh provides authenticated remote access to each facility.

**Across the fleet:** declarative configuration and plugins let the same core support different
hardware, monitoring, and specialized controls such as LED calibration. The interface is built
with Lit, while Prometheus, Grafana, Loki, and Ansible support monitoring and deployment.

## Status

BiomeOS is in active production. Several dozen phytotrons and cultivation chambers run the platform across facilities in France, the United States, and at CIRAD in Martinique.
