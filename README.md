# Office Render 8-Bit

Local Vite app with a minimal 8-bit interface for approving a cinematic luxury-office image, attaching local audio, and exporting browser-generated media.

## What It Does

- Cycles through the generated office stills in `public/assets`.
- Requires image approval before video export.
- Exports a 1920x1080 PNG still from the approved scene.
- Exports a WEBM video with the approved still and looped or mixed audio.
- Exports audio-only WEBM from the selected local audio files.
- Lets the operator choose duration, size, FPS, and sequential or simultaneous audio behavior.

## Run Locally

```powershell
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Build

```powershell
npm ci
npm run build
```

Generated folders such as `node_modules` and `dist` are not source artifacts. Recreate them locally when needed, then remove them before archiving or moving the workspace.

## Operations

See `RUNBOOK.md` for a short smoke checklist, safe verification commands, export boundaries, and cleanup notes.
