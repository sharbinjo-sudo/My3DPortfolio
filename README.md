# Sharbin Joe J S - Interactive 3D Portfolio

An interactive portfolio built with React, TypeScript, Vite, and React Three Fiber.  
The experience combines a lightweight 3D world with a readable portfolio interface where visitors can move between sections such as Home, About, Skills, Experience, Projects, and Contact.

## Overview

This project presents Sharbin Joe J S as an Android and full-stack developer through a portfolio that is both visual and practical:

- a 3D exploration layer for a more memorable experience
- a section panel for clear reading and quick scanning
- guided and explore modes for different browsing styles
- direct access to GitHub, LinkedIn, and a downloadable resume

The content currently highlights Android development, full-stack work, portfolio projects, and basic reverse-engineering practice.

## Features

- Interactive 3D scene powered by Three.js
- Character-based travel between portfolio destinations
- Guided mode for structured navigation
- Explore mode for freer movement
- Portfolio sections for:
  - Home
  - About
  - Skills
  - Experience
  - Projects
  - Contact
- Downloadable resume PDF
- Centralized profile data for easier updates

## Tech Stack

- React 19
- TypeScript
- Vite
- Three.js
- React Three Fiber
- React Three Drei
- Zustand
- CSS

## Requirements

This project declares:

- Node.js `>=22.12.0`
- npm `>=10.0.0`

Check your environment:

```powershell
node -v
npm -v
```

The repo also includes `.nvmrc` for local version alignment.

## Getting Started

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Then open the local URL printed by Vite, typically:

```text
http://localhost:5173
```

## Available Scripts

- `npm run dev`  
  Starts the Vite development server.

- `npm run build`  
  Runs TypeScript build checks and creates a production build in `dist/`.

- `npm run preview`  
  Serves the production build locally.

- `npm run serve`  
  Runs Vite preview on `0.0.0.0`.

## Project Structure

```text
src/
  components/   UI controls, welcome screen, navigation, content panels
  data/         Profile details and destination definitions
  store/        Zustand state for movement and experience mode
  world/        3D world, camera, character, paths, and environment
  App.tsx       Main application shell
  main.tsx      React bootstrap
  styles.css    Global styles

public/
  models/       3D assets
  resume/       Resume PDF
  _redirects    Static hosting redirect rules
```

## Important Files

- `src/data/profile.ts`  
  Main profile content: summary, education, skills, projects, certifications, and contact links.

- `src/data/destinations.ts`  
  Section identifiers and 3D destination positions.

- `src/store/usePortfolioStore.ts`  
  State for navigation mode, active section, movement input, and panel visibility.

- `src/world/PortfolioCanvas.tsx`  
  Main 3D canvas entry point.

- `src/world/CharacterController.tsx`  
  Character movement and travel logic.

- `src/world/YBotCharacter.tsx`  
  Character model integration used in the scene.

- `src/components/SectionPanel.tsx`  
  Main content panel shown for the active section.

- `public/models/portfolio-ybot.glb`  
  Current character model asset.

- `public/resume/Sharbin-Joe-JS-Resume.pdf`  
  Downloadable resume asset.

## Customizing the Portfolio

Most updates can be made without changing scene logic.

### Update personal content

Edit:

- `src/data/profile.ts`

This file controls:

- name
- role
- summary
- education
- skills
- projects
- certifications
- contact links

### Update 3D section destinations

Edit:

- `src/data/destinations.ts`

Use this when adjusting:

- section names
- layout positions
- travel targets

### Replace the character model

Relevant files:

- `src/world/YBotCharacter.tsx`
- `public/models/portfolio-ybot.glb`

If you replace the model, keep scale, orientation, and animation expectations in sync with the controller.

## Build and Preview

Create a production build:

```powershell
npm run build
```

Preview it locally:

```powershell
npm run preview
```

## Deployment Notes

The repo already includes:

- `netlify.toml`
- `public/_redirects`

That makes it suitable for static deployment workflows such as Netlify.

Typical deployment flow:

1. Install dependencies
2. Run `npm run build`
3. Deploy the generated `dist/` directory

## Current Content Focus

The portfolio currently emphasizes:

- Android development
- full-stack application development
- Flutter and Django integration
- Spring Boot familiarity
- client project experience
- basic Android reverse engineering and APK analysis

## Notes

- This repository is a personal portfolio application, not a reusable design system.
- The 3D layer supports the portfolio narrative, but the content remains accessible through the UI panel.
- Keep the resume PDF and `src/data/profile.ts` aligned so the portfolio stays consistent.
