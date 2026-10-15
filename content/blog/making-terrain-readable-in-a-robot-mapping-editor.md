---
title: "Making terrain readable in a robot mapping editor"
date: 2026-11-11
description: "Operators planning routes for autonomous industrial robots couldn't read the terrain. I split elevation data into map layers by geographic coordinates, across a React editor and a Python API."
tags: ["case study", "geospatial", "react", "work"]
draft: true
---

From January to October 2023 I worked as a Senior Full Stack Engineer at Gorilla Logic, embedded on the team of an autonomous-vehicle company. The product was a mapping editor. Operators used it to configure routes for autonomous industrial robots, the kind that move through warehouses and industrial sites. I'm keeping the details generic on purpose. The client's data and code are theirs, so this post covers the problem, the approach, and what I learned.

## The problem in one paragraph

Operators planning routes could not read the terrain. The elevation data existed, but it was not usable in the editor. A route that looks fine on a flat map can cross a slope or a step that matters to a robot. The operator had no good way to see that while drawing the route.

[fill in: what the elevation source looked like (format, resolution, where it was stored) and how operators worked around not being able to read it]

## The pieces, for a web developer who has never touched maps

I came into this as a web developer. I had never built anything on a map. Here is the stack in the terms I wish someone had given me on day one.

**GeoJSON** is JSON for shapes on the Earth. A file holds features. Each feature has a geometry (a point, a line, a polygon) and a bag of properties. The geometry is a list of coordinates in longitude and latitude, not pixels. If you can read JSON, you can read GeoJSON.

**Mapbox** draws the base map: the tiles, the streets, the satellite imagery. It handles panning, zooming and the camera.

**deck.gl** draws your data on top of that map. You give it layers. Each layer takes an array of data and a few accessor functions, like "where is this item" and "what color is it". deck.gl renders everything on the GPU. Layers stack, so you can turn one on, turn one off, or reorder them without touching the others. For a React developer, a layer feels a lot like a component: props in, pixels out.

**nebula.gl** adds editing on top of deck.gl. deck.gl shows shapes. nebula.gl lets a user draw, move and reshape them, and hands you back updated GeoJSON. In a route editor, that is the part the operator actually touches.

**Why "by geographic coordinates" matters.** Screen space changes every time the user pans or zooms. A pixel at (400, 300) is a different place on the ground after one scroll. Geographic coordinates do not move. If you split data by longitude and latitude, each piece stays attached to the same patch of ground at every zoom level. It also stays aligned with the routes, which are stored in the same coordinates. If you split by pixels, you have to redo the work whenever the camera moves, and the result only lines up with the view you computed it for.

> **LLM:** The trap I'd warn any newcomer about is coordinate order. GeoJSON stores positions as longitude first, then latitude. Most people say "lat, long" out loud, and plenty of APIs take them in that order. Swap them and nothing throws an error. Your data just renders in the wrong place, sometimes in the ocean, sometimes close enough to look almost right.

## Decomposing elevation into layers

The core idea was to stop treating elevation as one big surface and break it into pieces the editor could show and operators could work with.

I decomposed the elevation data by geographic coordinates. Each piece covered a known area of the site and carried its elevation information as properties. That meant each piece could become its own deck.gl layer, or part of one, and sit directly under the routes the operator was editing. Because every piece lived in the same coordinate system as the routes, the terrain and the route lined up without any conversion in between.

[fill in: how the data was split, e.g. number of layers or elevation bands, tile or grid size, and how those were chosen]

[fill in: how operators interacted with the layers, e.g. toggling them, color by elevation, selecting a region while drawing a route]

## Where the work split between the editor and the API

The work crossed two codebases: the React editor on the front end and Python API endpoints behind it.

On the React side, the job was rendering and interaction: turning elevation data into deck.gl layers and making them work alongside the nebula.gl editing flow the operators already used. On the Python side, the job was serving that data through API endpoints in a shape the editor could use. GeoJSON was the contract between the two.

[fill in: which side did the decomposition itself and why, e.g. data size, reuse by other clients, an earlier attempt in the browser that was too slow]

## Learning the stack from scratch

I picked up the geospatial stack for this project. I had written TypeScript, React and Python before. I had not written anything that knew the Earth was round.

[fill in: a resource, example or person that helped you get productive with deck.gl and nebula.gl]

[fill in: a specific thing that tripped you up, e.g. a bug, a projection or precision issue, a layer that would not update]

> **LLM:** While drafting this, I left a marker everywhere a real detail belonged instead of a plausible one. A case study about terrain data is easy to fill with numbers that sound right. The markers are the parts only Avram can write, and they are the parts a reader will trust.

## What changed for the operators

The terrain became something operators could read and work with inside the editor, in the same view where they configured routes. They no longer had to treat elevation as a separate problem from the route itself.

[fill in: a concrete outcome, e.g. feedback from operators, fewer route corrections, time to configure a route, render performance]

## What I would do differently

[fill in: one or two things you would change, e.g. agree on the data contract earlier, add visual regression tests for the layers, measure performance from the start]

The broader lesson holds for other projects too. When a domain is new to you, find the format everything passes through and learn it first. For this project it was GeoJSON. Once I could read it, the rest of the stack was layers, props and endpoints, which I already knew how to work with.
