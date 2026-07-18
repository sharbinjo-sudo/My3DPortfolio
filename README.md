# Sharbin Joe J S - Interactive 3D Portfolio

A resume-based React and Three.js portfolio where a temporary 3D character
travels between portfolio sections.

## Included sections

- Home
- About
- Skills
- Experience
- Projects
- Contact
- Downloadable resume PDF
- Basic Android reverse-engineering skills
- APK decompilation with JADX and apktool
- HxD hex inspection, Smali, ADB, ELF basics and UPX checks

## Current technology

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Zustand
- WebGL

## Requirements

Vite 8 requires Node.js 20.19+ or Node.js 22.12+.

```powershell
node -v
npm -v
```

## Run

Open PowerShell inside the folder containing `package.json`:

```powershell
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Production check

```powershell
npm run build
npm run preview
```

## Important files

- `src/data/profile.ts` - resume details, skills, experience and projects.
- `src/data/destinations.ts` - 3D destination names and positions.
- `src/components/SectionPanel.tsx` - visible portfolio content.
- `src/world/TemporaryCharacter.tsx` - automatic character movement.
- `src/world/NavigationPaths.tsx` - glowing paths in the 3D environment.
- `public/resume/Sharbin-Joe-JS-Resume.pdf` - downloadable resume.

## Next milestone

Replace the temporary geometry character with a GLB model containing
Idle, Walk, Run, Wave and Interact animations.
