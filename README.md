<div align="center">

# HOTMESS PASS®

**the official identity document for people who are not okay but look amazing.**

*not a real document. a real feeling.*

`HTML` · `CSS` · `vanilla JS` · `GSAP` · `Canvas` · `Web Audio` · `real barcodes`

</div>

---

**HOTMESS PASS** is a concept website for a fake magazine and a fake government office at the same time: the **Bureau of Emotional Identity**, which issues ID cards for feelings.

You take a number, fill in a form, get stamped, get classified (*hot mess, delulu, situationship, main character* or *ghost(ed)*), and walk out with a laminated pass whose barcode is **real** — you can scan it with your phone.

The whole site is built like a stack of posters lifted from a moodboard: halftone photocopies, spray paint, torn paper, tape, smudged faces, MISSING flyers and a lot of hot pink.

> Personal portfolio project · concept, design & code by **ghostly.grl** ♥

---

## ✦ The pages

### 01 · Home — *Issue 00: the identity issue*
An identity-check loader (*verifying subject… measuring delulu levels… ACCESS GRANTED\*  \*barely*), then the issue opens as **full-bleed posters that slide over each other** while the one underneath sinks into the dark.

- **The cover** — a masthead that stretches as you stay on it and an `xoxo` tag that sprays itself on.
- **Party girl** — a photo out of focus that pulls into focus as you scroll, while *HOT MESS\** draws itself in outline.
- **The pass** — the front and back of the ID card lie on a cutting mat with a polaroid, tape and a VOID stamp. Everything is draggable. The card starts blank: **write your name on the post-it** and it prints on the card letter by letter.
- **YOU ARE THE PRODUCT** — a photocopied poster with a scannable barcode. Every time you scan it, the MISSING girl next to it gets **found**, then **sold**, one price tag at a time.
- **MISSING** — a washed-out flyer with the face smudged away. **Rub it with your cursor** and the toner drags under your finger.
- **Verified.** — a photo cut into strips that slide back together.
- **Identity** — you zoom *into* the word until it swallows the screen: *identity is just a feeling with a barcode.*

### 02 · Apply — *form HM-00*
Pull a ticket from a red dispenser and watch the *now serving* board count up to your number. Fill in the form one page at a time (the X's are drawn in ballpoint), then the office **stamps** it: RECEIVED → REVIEWED → JUDGED → APPROVED\*. You get your class, your pass (front and back, with thorns) and a **personal barcode** that encodes your ticket, your name and your class. Download both sides as a PNG.

### 03 · Scanner — *scan yourself*
A Y2K camera viewfinder (REC, ISO, focus brackets, laser). Point it at any barcode — the camera, an uploaded photo, or just type the code — and a **thermal printer** prints a receipt with a verdict: your pass is *identity verified\* (\*as a hot mess)*, the poster is *product confirmed*, a bag of chips is *not a person. probably.*

### 04 · Issues — *we started counting backwards*
Six covers from **−5 to 00**, each in a different mood (ghost, delulu, 3AM, situationship, main character). Dig through a **draggable pile**, browse them in an **iPod-style coverflow** with reflections, then open one: it's a **real flip book** with 3D page turns — editor's letter, contents, feature, list, classifieds and a back cover with a barcode.

### 05 · Registry — *lost & found*
A concrete wall with a mugshot taped next to the title (*booked 03:12AM · charge: being too much*), covered in paste-ups: MISSING flyers with **phone tabs you can tear off**, FOUND notes, lost passes and **unclaimed feelings you can claim**. Search, filter, then **make your own flyer** with a live preview and paste it on the wall.

### 06 · Fine print — *terms of feeling*
A cookie banner you can't really reject, highlighter that swipes in as you read, redacted lines that reveal on hover, and clauses that shrink until you need the **magnifier**. The *I agree* box runs away from you four times. Then you sign with your mouse or finger and get stamped **BOUND BY FEELINGS**.

### 07 · Photo booth — *booth 03*
A velvet curtain opens on a PHOTO·MATIC. Four filters drawn live on canvas (**xerox** halftone, pink **flash**, **digicam** with the orange date, **smudge**), a 3-2-1 countdown, a flash and a shutter, four poses — and a strip that prints out of the slot, ready to download. No camera? *Borrow a face.*

### 404 — *this page has been ghosted*
✓✓ seen just now · no reply.

---

## ✦ Easter eggs

*(spoilers. obviously.)*

| | how | what happens |
|---|---|---|
| 🕒 | visit between **3 and 4 AM** (or add `?3am` to any URL) | the whole site goes red, an LED clock appears and the bureau tells you to go to sleep |
| ☎ | click any **333-333-333** — the MISSING flyer, the footer, a torn tab | it rings, then a **voicemail** plays with a live waveform and a transcript that types itself. The message changes. |
| ✦ | type **`hotmess`** anywhere (not in a field) | graffiti tags spray themselves all over the page and your cursor leaves **glitter** for 15 seconds |
| ▌▌▐ | the tiny barcode next to the signature in **every footer** | scan it with the scanner → a secret receipt: *CREATOR DETECTED* |
| 💤 | don't touch anything for **60 seconds** | screensaver: the pass bounces around like the DVD logo. Wait for the corner hit. |
| 🖱 | **right click** anywhere | a custom menu: *copy your identity, report a feeling, undo last text, call the bureau, view source of pain* (shift + right click for the boring one) |
| ⌨ | open the **console** | a note, a barcode and all the hints |
| 🔍 | read the **fine print of the fine print** | it tells you about the others |
| 🎟 | scan **HM-0666** | window 3 is still waiting for you |

---

## ✦ How it works

- **Real barcodes.** Every barcode on the site is a valid Code 128 generated with [JsBarcode](https://github.com/lindell/JsBarcode), with a proper quiet zone, so phones can read them. The pass barcode is built from your answers.
- **Scanning.** The scanner uses the browser's `BarcodeDetector` when it exists and loads [ZXing](https://github.com/zxing-js/library) as a fallback.
- **Poster stack.** Each poster is a `position: sticky` frame inside a tall section; the next one overlaps it with a negative margin, and GSAP ScrollTrigger scales and darkens the one underneath.
- **Canvas everything.** The MISSING smudge, the rubbing, the booth filters (halftone dots, flash, date stamp, smear), the printed passes and photo strips are all drawn on `<canvas>`.
- **Web Audio.** Beeps, the stamp thud, the printer, the shutter and the voicemail are synthesised live — there are no audio files.
- **Image slots.** Every photo is a slot with `data-img` (plus an optional `data-pos` for framing). Drop a file with the right name in `img/<PAGE>/` and it appears; until then a labelled placeholder shows the expected file name and ratio.

## ✦ Privacy

Nothing leaves the browser. There is no server, no analytics and no tracking. The camera stream is never stored; uploaded photos, your flyers, claimed feelings and the scan log stay on your device in `localStorage` (keys start with `hm-`). **Names are never pre-filled** — you write yourself onto the pass every time.

## ✦ Run it locally

The camera only works on `localhost` or `https`, so serve the folder instead of opening the file:

```bash
python3 -m http.server 5173
```

then open <http://localhost:5173>. Any static server works — there is no build step.

## ✦ Structure

```
index.html · apply.html · scan.html · issues.html
registry.html · fine-print.html · booth.html · 404.html

css/   core.css (shared: nav, slots, card, poster stack, eggs) + one file per page
js/    core.js  (shared: smooth scroll, slots, barcodes, cursor, toast, spray, thorns)
       eggs.js  (all the easter eggs)
       + one file per page
img/   INDEX · APPLY · SCAN · ISSUES · REGISTRY
VIBES/ the moodboard
```

## ✦ Built with

- Plain **HTML, CSS and JavaScript** — no framework, no build step
- [GSAP 3](https://gsap.com/) + ScrollTrigger + Draggable · [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- [JsBarcode](https://github.com/lindell/JsBarcode) · `BarcodeDetector` / [ZXing](https://github.com/zxing-js/library)
- Canvas 2D · Web Audio API · `getUserMedia`
- Google Fonts: Anton, Inter Tight, Instrument Serif, Space Mono, Silkscreen, Pinyon Script, Reenie Beanie, Sedgwick Ave Display

Designed for desktop and mobile. Respects `prefers-reduced-motion`.

## ✦ Credits

Concept, design & code — **ghostly.grl** ♥
Photos in `img/` and `VIBES/` are moodboard references and belong to their authors; they're used here for a non-commercial portfolio project.

---

<div align="center">

▌▌▐▌▌▐▐▌▌▐▌▐▐▌▌▌▐▌▐▐▌▌▐

**U ARE THE PRODUCT**

</div>
