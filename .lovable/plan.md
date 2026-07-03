## Luna Flow — Major Feature Update

Big scope, so here's the plan before I build.

### 1. Profile editing + 4-digit PIN lock
- **Settings page**: add inline "Edit" for name, place, phone. Save updates via `updateState`.
- **PIN setup**: first time entering `/app/settings`, prompt user to create a 4-digit PIN (stored in state).
- **PIN gate**: any subsequent visit to `/app/settings` requires entering the PIN before edit mode unlocks. Also asked once at login (after successful signin) to confirm identity.
- Stored in `AppState.pin` (localStorage). No server needed.

### 2. Reels — Instagram-style full-screen scrolling + session timer
- Rebuild `/app/reels` as a vertical full-screen snap scroller (`snap-y snap-mandatory`, one reel per viewport).
- Each reel: background gradient/emoji video-like card, auto-plays its music when in view, pauses others (IntersectionObserver).
- Right-rail actions: like, comment (bottom sheet input), save, share. Comments persist in local state.
- **15-minute timer**: on entering reels, start a countdown; when it hits 0, `navigate({ to: "/app" })` and speak "Time to take a break, love." Small countdown chip visible top-right.

### 3. Dance & Music — full-screen YouTube-style
- **Dance**: rework `/app/dance` — tapping a move opens a full-screen player card (gradient bg, big emoji animation, looping) with **numbered step instructions** targeting cramp relief. Close button returns to grid.
- **Music**: rework `/app/music` — add a **headphones icon** header, tapping a track opens a full-screen "now playing" view (album art gradient, track title, play/pause, mute). Uses existing HTML5 Audio.

### 4. Voice — young girl only
- Update `pickFemaleVoice()` preference order to prioritize young/light female voices: "Google UK English Female", "Samantha", "Karen", "Microsoft Aria", plus higher pitch (1.25) and slightly faster rate (1.0) so it reads as youthful, not adult male. Filter out any voice whose name matches `/male|man|david|mark|guy|alex/i`.

### 5. Pregnancy Care mode
- **Mode toggle** in home page + settings: "Period mode" ↔ "Pregnancy mode" (stored in `AppState.mode`).
- **Pregnancy onboarding** (`/app/pregnancy/onboarding`): asks mic access first, then:
  1. How many months since last period? (number picker)
  2. Yes/No symptom questions (dizziness, nausea, fatigue, tender breasts, food cravings, mood swings, back pain, frequent urination) — voice reads each, buttons only.
- **Pregnancy dashboard** (`/app/pregnancy`): mirrors period home — shows week estimate, streak, and cards linking to shared meals/dance/music/thoughts/reels (all reused). A dedicated `/app/pregnancy/meals` reuses meal logging but with pregnancy-safe protein range (higher: ~71g/day per guidelines) and flags foods to avoid (raw fish, unpasteurized, high-mercury).
- Nav bar shows either Period or Pregnancy icon set based on `mode`.

### 6. Data model additions (`src/lib/storage.ts`)
```ts
type AppState = {
  ...existing,
  pin?: string;                    // 4-digit
  mode: "period" | "pregnancy";
  pregnancy?: {
    monthsMissed: number;
    symptoms: Record<string, boolean>;
    startedAt: string;             // ISO
  };
};
```

### Files to create
- `src/components/PinLock.tsx` — reusable PIN entry/create modal
- `src/routes/app.pregnancy.tsx` (layout)
- `src/routes/app.pregnancy.index.tsx` (dashboard)
- `src/routes/app.pregnancy.onboarding.tsx`
- `src/routes/app.pregnancy.meals.tsx`

### Files to edit
- `src/lib/storage.ts` — add `pin`, `mode`, `pregnancy`, pregnancy meal helpers
- `src/lib/voice.ts` — younger voice selection, higher pitch
- `src/routes/app.settings.tsx` — edit name/place/phone, PIN gate, PIN create
- `src/routes/login.tsx` — PIN check after login
- `src/routes/app.reels.tsx` — full-screen snap scroll + 15-min timer
- `src/routes/app.dance.tsx` — full-screen player + step instructions
- `src/routes/app.music.tsx` — headphones icon + full-screen player
- `src/routes/app.index.tsx` — mode switcher card
- `src/components/AppLayout.tsx` — mode-aware nav
