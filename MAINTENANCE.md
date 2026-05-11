# Maintenance Notes

## Flight Recorder

### 2026-05-11 Runbook And Provenance Pass

- Finding: recovery docs still said no `.git` directory was present, but the promoted copy now has local Git metadata and an `origin` remote at `https://github.com/davidluky/luxury-office-studio-8bit.git`.
  - Risk: future maintenance could treat the project as a loose snapshot instead of a synced Git repo.
  - Action: updated recovery and functionality docs to record current GitHub-backed provenance.

- Finding: README text had restored encoding artifacts and only listed basic run/build commands.
  - Risk: handoff quality was lower than the rest of the workspace, and safe media-smoke boundaries were not obvious.
  - Action: rewrote README in ASCII and added `RUNBOOK.md` with setup, build, short smoke, audit, cleanup, and boundary notes.

- Verification: `npm ci`, `npm run build`, and `npm audit --omit=dev` passed on 2026-05-11. Generated `node_modules` and `dist` were removed afterward.

## Retro

### 2026-05-11

Went well:

- The app is small and source-clean, so the maintenance pass could stay focused on documentation and verification.
- `npm ci` and `npm run build` gave a clean rebuild from the lockfile.
- The project already had generated verification screenshots and static assets present.

Could improve:

- The stale no-Git note should have been corrected when the GitHub repo was created.
- A short runbook should exist for every local media/export tool, especially when manual smoke is the main validation path.

Lesson:

- For small browser tools with no tests, the most useful maintenance artifact is a precise manual smoke checklist plus build/audit commands and cleanup boundaries.
