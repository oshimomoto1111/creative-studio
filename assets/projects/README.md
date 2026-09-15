# VISION STUDIO // MEDIA DROPZONES

This directory contains the project media assets for the live portfolio.

## Folder Structure

```
assets/projects/
├── duke-city-fencing/
│   ├── poster.svg          <-- Vector editorial poster (default fallback)
│   ├── hero.mp4            <-- (Optional) Drop your video reel here (H.264/MP4, ~10-30s loop, muted)
│   └── cover.jpg           <-- (Optional) Drop high-res photography here
├── parkingly/
│   ├── poster.svg          <-- Vector editorial poster (default fallback)
│   ├── app-preview.mp4     <-- (Optional) Drop interactive app capture / walkthrough
│   └── cover.jpg           <-- (Optional) Drop product UI stills
├── gastronomy/
│   ├── poster.svg          <-- Vector editorial poster (default fallback)
│   ├── culinary.mp4        <-- (Optional) Drop kitchen/plating video footage
│   └── cover.jpg           <-- (Optional) Drop haute-cuisine photography
└── motion-reel/
    ├── poster.svg          <-- Vector editorial poster (default fallback)
    ├── reel.mp4            <-- (Optional) Drop 60/120fps commercial showreel
    └── still-1.jpg         <-- (Optional) Drop cinema stills
```

## Supported Media
- **Video**: `.mp4` / `.webm` (Recommended: 1080p, 60fps, Web-optimized, no audio track for background loops).
- **Images**: `.jpg` / `.png` / `.webp` / `.svg` (Recommended: 2400px wide for Retina displays).

The website markup will automatically display your uploaded videos or high-res photography if placed in these folders, with the handcrafted editorial posters acting as graceful instantaneous fallbacks.
