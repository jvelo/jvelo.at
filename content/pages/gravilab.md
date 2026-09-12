---
title: Gravilab
type: work
subtitle: A gravity simulator for plant biology, built with the French space agency.
description: Control software and embedded Linux platform for Gravilab, a random positioning machine that simulates lunar, Martian, and microgravity conditions for living samples on Earth.
image: /images/gravilab-plant.jpg
technologies:
  - Python
  - FastAPI
  - CAN bus
  - Modbus
  - Lit
  - Embedded Linux
years: 2024–2026
yearsLabel: Years on project
---

## Context

On a lunar or Martian base, gravity is not a parameter you can tune. [Gravilab](https://space.orius.co/engineering/gravilab/#explore) lets researchers experiment with crops and other living organisms under simulated gravity on Earth. Built by Orius with CNES, the French space agency, it is a random positioning machine: a two-axis frame that continuously reorients a living sample along a computed path, so the gravity felt on average settles at a chosen target. Standard scenarios simulate microgravity and the partial gravities of the Moon and Mars.

I designed and developed Gravilab’s runtime and control software and packaged it as an embedded Linux application. The mechanics and trajectory science are the work of my colleagues at Orius. Gravilab was presented at the 2026 International Conference on Environmental Systems in a [paper](https://ttu-ir.tdl.org/items/09d24262-e043-4319-a9cd-0aad0e60331c) I co-authored.

<image-gallery ratio="3/2" align="top">
<img src="/images/gravilab.jpg" alt="The Gravilab two-axis frame with a plant tray under LED lighting" />
<img src="/images/gravilab-sample-mount.jpg" alt="A sample mounted in the two-axis frame" />
<img src="/images/gravilab-seedling.jpg" alt="Seedlings growing in the Gravilab chamber" />
<figcaption>The two-axis frame, a sample mount, and seedlings growing under altered gravity</figcaption>
</image-gallery>

## Running an experiment

**A week-long experiment as a player**. A scenario typically represents days or weeks of 
continuous motion. The controls follow the familiar model of a media player: the operator chooses a scenario, then starts, pauses, and follows the run from one screen. The emergency stop remains available from every screen. The run can also be recorded, allowing the motors’ actual positions to be compared with the scenario’s target positions for QA and validation. Scenarios are imported from CSV, stored in SQLite, and can be exported and replayed.

**One application for the whole experiment**. Around the motion, the same application can schedule irrigation valves, run lighting programs, and capture camera stills on a timer. Each function can be enabled through feature flags to match the hardware installed on a unit. The interface can be used from the touchscreen next to the machine, a phone, or a lab computer. The runtime is composable and can be extended to integrate additional laboratory equipment when needed.

<figure>
<img src="/images/gravilab-dashboard.png" alt="The Gravilab control interface with a Mars scenario loaded on both axes and the camera feed from the rig" />
<figcaption>The control interface on a Gravilab unit: a 168-hour Mars scenario loaded on both axes, with live position and speed, and the camera feed from the rig</figcaption>
</figure>

**Validation and tuning**. In addition to position data, the recorder captures bus voltage and motor current throughout a run. The exported data is used to measure the control lag of the mechanical chain and tune motor settings.

## Development and deployment

The whole hardware layer has a simulated counterpart: a virtual CAN bus, virtual motors, and virtual sensors backed by a small physics model. The application can run on a laptop with no hardware attached, so most development and testing does not require access to an actual physical device.

During playback, the runtime reads the scenario from a sliding window so that memory stays flat no matter how long the run is, and sends each motor a new setpoint over CAN at a configurable frequency. The interface is built from Lit web components and served by the device itself. It receives the full system state over a WebSocket.

On the machine, the application runs on a Raspberry Pi Compute Module mounted on an industrial carrier board. It ships as a container image and runs under Podman as a systemd user service, with direct access to the CAN interface and the RS-485 port used for irrigation.

## Status

Gravilab units run at Orius and in several laboratories and research facilities around the world,
where they are used for experiments on living organisms under simulated lunar, Martian, and microgravity conditions.
