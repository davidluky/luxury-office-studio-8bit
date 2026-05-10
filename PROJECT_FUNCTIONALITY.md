# Project Functionality

Project: `luxury-office-studio-8bit`

Updated: 2026-05-10

This document describes behavior found in the local source, README, package
metadata, image assets, and build output. It does not claim production
deployment, security review, full manual UX review, or long media-render
validation.

## Purpose

`luxury-office-studio-8bit` is a local Vite web app for approving a cinematic
luxury-office still image, attaching audio files, and exporting media from the
browser.

## Main Capabilities

- Shows a 1920x1080 office image preview on a canvas.
- Lets the user cycle through three generated office image assets.
- Requires image approval before video rendering.
- Exports a PNG still image from the approved canvas.
- Accepts multiple local audio files.
- Supports video or audio-only output modes.
- Supports duration controls with hours and minutes.
- Supports video width, height, and FPS controls.
- Supports sequential-loop or simultaneous-mix audio behavior.
- Produces downloadable browser blobs for generated media.

## Commands And Interfaces

Root scripts:

- `npm run dev`
- `npm run build`
- `npm run preview`

Local app entry:

- `index.html`
- `src\main.js`
- `src\styles.css`

Static assets:

- `public\assets\office-cinematic-1.png`
- `public\assets\office-cinematic-2.png`
- `public\assets\office-cinematic-3.png`

## Verification Performed

- Local dependencies were already present during verification.
- `npm run build` exited `0` on 2026-05-10.
- The build produced `dist\index.html`, CSS, JavaScript, and copied the office
  image assets.
- After verification, `node_modules` and `dist` were removed from the active
  source tree. Recreate them with `npm install` / `npm run build`.
- No test script is defined in `package.json`.

## Known Limits And Not Claimed

- No `.git` directory is present, so this promoted copy has no local branch,
  remote, or history evidence.
- No automated test suite is defined.
- No production deployment is claimed.
- No full browser/media compatibility matrix is claimed.
- No long-duration render, large-audio-file, or memory-pressure validation is
  claimed.
- No security review is claimed.

## Evidence Sources

- `README.md`
- `package.json`
- `package-lock.json`
- `index.html`
- `src\main.js`
- `src\styles.css`
- `public\assets`
- Build output can be recreated with `npm run build`.
