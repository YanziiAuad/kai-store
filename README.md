# Kai Store

A one-page store site for Kai Store: shop phones, book repairs and contact support. The motion is built with [anime.js](https://animejs.com) v4.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the build
```

`dist/` is a static site, so you can host it anywhere (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Make it yours

Everything store-specific is in **`src/data.js`**:

- **`store`** has the phone, email, address, city, opening hours and the currency prefix.
  - **`whatsapp`**: set this to a number in international format, digits only. Orders and support messages then open WhatsApp already filled in with the customer's details. Leave it empty and the forms only show a confirmation, so nothing is sent.
- **`products`** has the name, brand, condition, photo, colours, storage and `price` for each phone.
  - Set `price` to a number, or leave it as `null` to show "Price on request".
- **`repairs`** lists the repair services.
- **`credits`** holds the photo credits, which the Creative Commons licences require. If you swap in your own photos, remove their credits.

To use your own photos, put them in `public/img/` and point each product's `img` at them.

## Where the motion lives

| File | What it does |
| --- | --- |
| `src/intro.js` | Loader timeline (the phone outline draws itself, a counter runs, the curtain lifts), the hero fly-in, idle floating, orbit motion path, mouse parallax |
| `src/scroll.js` | Hero exit, marquee that speeds up with scroll, word-by-word statement, pinned horizontal lineup, repair rows, footer wordmark |
| `src/shop.js` | 3D card tilt, filter transitions, product dialog timeline, fly-to-bag, bag drawer, checkout |
| `src/cursor.js` | Trailing cursor ring with hover labels |
| `src/motion.js` | Shared helpers: split-text reveals, magnetic buttons, link roll |

If a visitor has "reduce motion" turned on, the site skips the loader and the motion and shows everything at once.

## Photos

Product photos come from Wikimedia Commons under CC BY / CC BY-SA licences. They're credited in the footer under "Photo credits", and in `src/data.js`.
