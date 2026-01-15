# International Tournament 2026 Simulator

Interactive international tournament simulator built with React, TypeScript, and Tailwind CSS. Select qualifiers, simulate group and knockout stages, and explore the full match schedule with predictions.

Live site: https://wc-simulator.web.app

## Features

- Qualifier selection for undecided teams
- Group stage simulation with live standings
- Knockout bracket progression to final and third place
- Match schedule grid with venues and dates
- Prediction engine that runs multiple simulations

## Getting started

Install dependencies:

```
npm install
```

Run the dev server:

```
npm run dev
```

Build for production:

```
npm run build
```

Preview the production build:

```
npm run preview
```

## Project structure

- `src/App.tsx`: App shell and tab navigation
- `src/context/TournamentContext.tsx`: Tournament state and simulation actions
- `src/components/`: UI components for qualifiers, groups, bracket, schedule
- `src/data/`: Static data for teams, groups, venues, and bracket
- `src/utils/`: Simulation and prediction logic

## Notes

- Predictions run a large number of simulations and may take a few seconds.
- Team, group, and schedule data live in `src/data/` and can be edited directly.

## Disclaimer

This project is a fan-made simulation for entertainment and educational purposes. It is not affiliated with, endorsed by, or connected to any tournament organizer or governing body.
