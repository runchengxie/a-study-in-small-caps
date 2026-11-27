# Wave themes and lateral motion

Follow the existing light, dark and system theme selection. Keep the original emerald palette in dark mode; use warm paper, forest-green lettering and muted green particles in light mode. This palette is an implementation choice consistent with the publication body. Use alpha blending in light mode so particles remain visible against paper. Preserve one WebGL context and one draw per frame.

Add a gentle rightward phase shift to the existing terrain, preserving pointer deformation, camera and scroll interactions. Pause and reduced-motion settings stop the shift. Existing source snapshots and licence remain unchanged; document integration changes.

## Approaches

Changing only the background leaves additive particles washed out. A separate canvas duplicates work and lifecycle management. Reuse the existing renderer with theme-specific colour and blending options, and add a horizontal phase offset to the existing shader. No new dependency or post-processing pass is needed.

Validate switching while paused, system preference changes, context restoration, WebGL fallback and mobile readability. Inspect both rendered palettes. The additional arithmetic is small; do not claim a hardware frame-rate guarantee.
