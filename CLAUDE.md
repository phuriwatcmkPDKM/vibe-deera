# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `ng serve` (defaults to http://localhost:4200)
- **Build for production**: `ng build`
- **Build for development with watch**: `ng build --watch --configuration development`
- **Run unit tests**: `ng test`
- **Generate components**: `ng generate component component-name`

## Project Architecture

This is an Angular 20 application using the modern standalone component architecture:

- **Entry point**: `src/main.ts` bootstraps the app using `bootstrapApplication`
- **Root component**: `src/app/app.ts` (exported as `App` class)
- **Configuration**: `src/app/app.config.ts` provides application-wide configuration including routing and zone change detection
- **Routing**: `src/app/app.routes.ts` defines route configuration (currently empty)
- **Styling**: Global styles in `src/styles.css`, component-specific styles use `.css` files

### Key Architectural Notes

- Uses standalone components (no NgModules)
- Component naming follows the pattern: `app.ts` exports `App` class with selector `app-root`
- Template and style files are separate: `.html` and `.css` files alongside `.ts` components
- Modern Angular features enabled: event coalescing in zone change detection, browser global error listeners
- Build configuration includes bundle size budgets: 500kB warning/1MB error for initial bundle, 4kB/8kB for component styles

### Testing Setup

- Uses Karma test runner with Jasmine
- Test files follow `.spec.ts` naming convention
- Configured for Angular-specific testing with zone.js/testing polyfill