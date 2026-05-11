# Codex Recovery Checklist

Generated: 2026-05-10

Project: `luxury-office-studio-8bit`

Current promoted path: `C:\Users\David\OneDrive\Desktop\Programas_funcionando\luxury-office-studio-8bit`

This checklist is evidence-based. It records the local promoted working copy
present in `Programas_funcionando`; it does not claim a full manual UX,
security, deployment, or long-render review.

## Checked Facts

- [x] README present.
- [x] Root `package.json` present.
- [x] Root `package-lock.json` present.
- [x] Vite dependency was available locally during verification; `npm run build` exited `0`.
- [x] Production build output was generated under `dist` during verification.
- [x] Generated/dependency folders `node_modules` and `dist` were removed from the active source tree after the build check.
- [x] Source files present under `src`.
- [x] Three cinematic office PNG assets present under `public\assets`.
- [x] Four verification screenshots present in the project root.
- [x] Local `.git` directory is present as of the 2026-05-11 maintenance pass.
- [x] Git `origin` is `https://github.com/davidluky/luxury-office-studio-8bit.git`.

## 2026-05-10 Cleanup Verification

- [x] `npm run build` completed successfully.
- [x] Vite transformed 4 modules and wrote `dist\index.html`,
  `dist\assets\index-Db9k2Jmh.css`, and `dist\assets\index-T7Bmr5LC.js`.
- [x] The build also copied the three office image assets into `dist\assets`.
- [x] Added this checklist because the project was present in the promoted
  working root but missing recovery docs and a manifest row.
- [x] Removed `node_modules` and `dist` from the active root after verification
  so the project remains a maintainable source snapshot.

## 2026-05-11 Maintenance Pass

- [x] Added `RUNBOOK.md` with setup, build, short manual smoke, audit, cleanup,
  and export-boundary notes.
- [x] Added `MAINTENANCE.md` with flight-recorder and retro notes.
- [x] Rewrote `README.md` in ASCII to remove restored encoding artifacts and
  point operators at the runbook.
- [x] Rechecked Git provenance; local branch tracks GitHub `origin`.
- [x] Ran `npm ci`; command exited `0`.
- [x] Ran `npm run build`; command exited `0`.
- [x] Ran `npm audit --omit=dev`; command exited `0`.
- [x] Removed generated `node_modules` and `dist` after verification.

## Not Claimed

- [ ] Production deployment.
- [ ] Full manual UX review.
- [ ] Security review.
- [ ] Long video/audio export validation.
- [ ] Browser compatibility beyond the local build evidence above.

## Evidence Sources

- `README.md`
- `package.json`
- `package-lock.json`
- `src\main.js`
- `src\styles.css`
- `public\assets\office-cinematic-1.png`
- `public\assets\office-cinematic-2.png`
- `public\assets\office-cinematic-3.png`
- `verification-screenshot*.png`
