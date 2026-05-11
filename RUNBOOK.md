# Luxury Office Studio 8-Bit Runbook

Updated: 2026-05-11

This app is a local browser media tool. It has no backend, no credentials, and no production deployment target in the promoted copy.

## Safe Setup

```powershell
cd C:\Users\David\OneDrive\Desktop\Programas_funcionando\luxury-office-studio-8bit
npm ci
npm run build
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Five-Minute Operator Smoke

1. Confirm the page loads and the office image appears.
2. Cycle through all three office assets.
3. Approve one image.
4. Export a PNG and confirm the browser downloads it.
5. Add a small local audio file.
6. Use a short duration, such as one minute.
7. Export audio-only WEBM.
8. Export WEBM video after image approval.

Keep the first media smoke short. Long-duration exports and large audio mixes depend on browser memory and are not claimed by the recovery docs.

## Safe Verification Commands

```powershell
npm ci
npm run build
npm audit --omit=dev
```

`npm audit --omit=dev` is expected to report no production dependencies for this app unless runtime dependencies are added later.

## Cleanup

After verification, remove generated folders before workspace backup or move:

```powershell
Remove-Item -LiteralPath .\node_modules -Recurse -Force
Remove-Item -LiteralPath .\dist -Recurse -Force
```

Check `git status --short` before committing.

## Boundaries

- No automated browser test suite is defined.
- No long-render, large-file, or cross-browser compatibility matrix is claimed.
- No production deployment is claimed.
- Do not commit generated downloads, `node_modules`, `dist`, or local audio files.
