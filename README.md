# LOVERBOY Neighborhood Coffee — Nob Hill, Albuquerque, NM

> **"Grab, Sip & Fall in Love."**  
> A 70s/80s vintage pop walk-up order window in historic Nob Hill, Albuquerque, New Mexico.

---

## 1. Brand DNA & Design System

- **Brand Name**: LOVERBOY Neighborhood Coffee
- **Physical Concept**: Walk-up order window (grab-and-go) with deep black and cherry red facade, exterior waiting benches, glowing neon lips sign with a rose between the teeth, and an interactive "Selfie Mirror" for community social connection.
- **Brand Vibe**: Vintage pop 70s/80s, passionate romance, rebellious, in love, playful, and highly shareable.

### CSS Design Tokens
```css
:root {
  /* Core Colors */
  --bg-dark: #0f0a0a;             /* Negro carbón / fondo principal */
  --color-cherry-red: #D81E34;    /* Rojo cereza intenso */
  --color-burgundy: #4A0E17;      /* Borgoña / Vino oscuro */
  --color-hot-pink: #FF4081;      /* Rosa chicle / Neón pop */
  --color-cream: #F8F2E2;         /* Blanco crema vintage / Lino */

  /* Accents */
  --neon-glow: 0 0 15px rgba(255, 64, 129, 0.7), 0 0 30px rgba(216, 30, 52, 0.5);

  /* Typography */
  --font-display: 'Shrikhand', 'Cooper Black', cursive, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
}
```

---

## 2. High-Resolution Brand Assets

Stored in `assets/brand/`:
- `assets/brand/logo-arched.jpg`: Primary arched bubble 3D typography logo.
- `assets/brand/graphic-lips.jpg`: Neon lips biting red rose with Japanese katakana `コーヒー`.
- `assets/brand/graphic-heart.jpg`: Anatomical heart pierced by Cupid's arrow with coffee sprouts held by hand.

---

## 3. Four Core Components

1. **Component 1: Hero Section (The Window Experience)**:
   - Deep carbon background with retro grain and halftone pattern.
   - Live Albuquerque MST window status pill.
   - Pulsing neon headline: *"Grab, Sip & Fall in Love."*
   - Primary action buttons: `[View Window Menu]` & `[Find the Window / Get Directions]`.
   - Floating badge: `"Walk-up Window • Nob Hill, ABQ"`.
2. **Component 2: The Vibe & "Selfie Mirror" (Interactive / Social Proof)**:
   - Dedicated digital replica of the physical exterior mirror.
   - *"Check your reflection, tag @loverboycoffee, spread the love."*
   - Interactive camera activation (`navigator.mediaDevices.getUserMedia`) with mirror reflection, fun retro sticker stamps (`💋`, `☕`, `🌹`, `💖`, `✨`), and automatic Polaroid snapshot download.
   - Community Polaroid gallery with Nob Hill street moments.
3. **Component 3: The Window Menu (Grab & Go Classics)**:
   - Vintage diner chalkboard format on deep burgundy background:
     - **Espresso Bar**: Double Shot, Americano, Cortado, Vanilla Bean Latte, Dark Mocha.
     - **Cold Favorites**: Flash Cold Brew, Espresso Tonic, **Strawberry Cream Iced Latte** (Signature Drink).
     - **Bites & Bakery**: Daily Pastries, Authentic New Mexico Hatch Green Chile Breakfast Burritos.
   - Accessible `<dialog>` detail modal with ingredients and window preparation notes.
4. **Component 4: Visit Us & Live Hours (Footer)**:
   - Real-time window hours calculator (`America/Denver` Mountain Time):
     - Mon – Fri: 7:00 AM – 3:00 PM MST
     - Sat – Sun: 7:30 AM – 4:00 PM MST
   - Central Ave & Richmond Dr SE Route 66 location with 1-click Google Maps & Apple Maps navigation.
   - **Loverboy Window Jams**: Built-in 70s yacht rock / disco soul ambient audio synthesizer.
   - Social channels: `@loverboycoffee`.

---

## 4. Local Development & Deployment

- **Live URL**: [https://oshimomoto1111.github.io/creative-studio/](https://oshimomoto1111.github.io/creative-studio/)
- **Local Testing**:
  Open `index.html` in any modern web browser or serve with:
  ```bash
  npx serve .
  ```

© 2026 LOVERBOY NEIGHBORHOOD COFFEE. ALL RIGHTS RESERVED.
