# Pink Elephant Jungle Dash — First Impressions (2026-05-25)

## What feels good already
- Strong visual identity (pink elephant + jungle vibe).
- Good first-run clarity with start screen and settings.
- Nice amount of quality-of-life work already done for mobile/PWA.

## Highest-priority issues to address next
1. **Performance + load size**
   - Current production JS bundle is large (~931 kB minified), which can slow first load on phones.
   - Priority: split heavy code and reduce startup work.

2. **Mobile gameplay readability during action**
   - Important HUD info and controls can still compete for screen space on smaller landscape devices during intense moments.
   - Priority: simplify active-run HUD further and keep center lane even cleaner.

3. **Onboarding in first 10 seconds**
   - New players may not immediately understand charge + steer + timing.
   - Priority: add a tiny guided first-run hint flow that disappears once learned.

4. **Difficulty ramp fairness**
   - Runs can feel swingy if hazard patterns spike early.
   - Priority: smooth early progression and improve "I lost because I made a mistake" feeling.

5. **Accessibility baseline polish**
   - Continue improving readable text contrast and minimum touch targets everywhere.
   - Priority: finish a simple pass using one checklist and lock it in.

## Suggested order of work
1. Performance (bundle + frame stability)
2. HUD/control clarity on phone landscape
3. First-run tutorial hints
4. Difficulty ramp tuning
5. Accessibility final pass
