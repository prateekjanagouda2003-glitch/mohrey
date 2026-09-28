# Mohrey — Wholesale Ordering Site (UI prototype)

Customers browse the current catalogue and place wholesale orders directly, instead of picking designs from WhatsApp.

Open `index.html` in a browser — no build step.

## Structure
- `data/products.js` — the catalogue (designs, prices, set sizes, stock). **The only file that changes when stock changes.** Will move to an admin panel + database later; the UI keeps reading the same shape.
- `css/styles.css` — brand tokens (maroon / cream / gold) and all styling.
- `js/app.js` — filtering, order sheet, quick order, checkout.

## Key UX decisions
- **Design no. is front and centre** (search, card tag, quick order) — customers already think in codes.
- **Order in sets, not pieces** — matches how wholesale is sold; stepper is capped at stock.
- **Quick order** — paste `2417 x 3` lines, just like a WhatsApp message.
- **Stock is visible** — New / Only N sets / Sold out badges; sold-out items stay listed with "Notify when back".
- **Minimum order bar** in the order sheet so customers know how far they are from the wholesale minimum.
- **WhatsApp as backup** — after placing the order, one tap sends the same order summary on WhatsApp.

Product images are CSS placeholder swatches until real photos are added.
