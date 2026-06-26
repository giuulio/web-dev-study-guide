# CSS

CSS (Cascading Style Sheets) is the presentation/aesthetic layer of a web page. It decides how the HTML structure looks and where it sits. It's "cascading" because many rules can target the same element, so CSS resolves the conflicts through a predictable system of origin, specificity, and source order.

## Notes

### CSS fundamentals & selectors

- CSS styles HTML; the two are kept in separate files by convention (easier to maintain)
- **rule set** = selector + declaration block; **declaration** = `property: value;`
- three ways to apply CSS:
  - external: `<link href="style.css" rel="stylesheet" type="text/css">` in `<head>` (preferred)
  - internal: rules inside `<style>` tags in `<head>`
  - inline: `style="..."` attribute on an element (highest specificity; avoid)
- **selectors**:
  - type / tag: `p { }` matches all `<p>` (no angle brackets)
  - class: `.column { }` matches `class="column"`; reusable across many elements
  - id: `#first-item { }` matches `id="first-item"`; unique per page
  - descendant combinator: `div p { }` (space) matches `<p>` nested anywhere inside `<div>`
  - chaining: `h3.section-heading` matches elements that are *both* `<h3>` and `.section-heading`
  - grouping: `h1, h2 { }` applies one rule set to multiple selectors
- **the cascade & specificity**: when rules conflict, the most specific selector wins
  - specificity ranking: id > class > type
  - tie broken by source order (later rule wins)
  - inline styles and `!important` override normal specificity (use sparingly)
- an element can carry multiple classes: `class="value1 value2 value3"` (space-separated)

> **Beyond the cheatsheets**
> - `:has()` is the long-awaited "parent selector"; style an element based on its children, e.g. `figure:has(figcaption) { }` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:has))
> - child `>`, adjacent-sibling `+`, general-sibling `~` combinators go beyond the descendant combinator ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Combinators))
> - attribute selectors: `[type="text"]`, `[href^="https"]` (starts-with), `[class*="btn"]` (contains) ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors))
> - `:is()` and `:where()` shorten long selector lists; `:where()` adds zero specificity ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:is))

### Visual & text styling

- **colors** (the `color` and `background-color` properties take these):
  - keywords: `aqua`, `khaki`, etc.
  - hex: `#ff0000` (RRGGBB, each pair 0-255 in base-16); shorthand `#00f` when pairs repeat
  - `rgb(0, 255, 0)`: red/green/blue, each 0-255
  - `rgba(0, 255, 0, 0.5)`: adds alpha (0.0 transparent to 1.0 opaque)
  - `hsl(200, 70%, 50%)`: hue (0-360), saturation %, lightness %; more intuitive to adjust
  - `hsla(...)`: hue/saturation/lightness + alpha
  - `transparent` keyword = fully see-through
- **typography**:
  - `font-family`: typeface(s) in priority order; later names are fallbacks; quote multi-word names
  - `font-weight`: `normal`/`bold` or numeric 100-900 (400 = normal, 700 = bold)
  - `font-style`: `italic`, `normal`
  - `line-height`: vertical spacing between lines; unitless number (ratio of font size) is best practice
  - `text-align`: `left` / `right` / `center`
  - **web fonts** (load fonts not on the user's machine):
    - `<link>` a hosted font (e.g. Google Fonts) in the HTML, then name it in `font-family`
    - `@font-face` rule imports a font file (web URL or local path) directly in CSS

> **Beyond the cheatsheets**
> - `oklch()` is the modern perceptually-uniform color system; lightness/chroma/hue that stays visually consistent across hues, with a wider gamut than RGB. Increasingly the default for design systems: `color: oklch(70% 0.15 200)` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch), [oklch.com picker](https://oklch.com))
> - `currentColor` keyword reuses the element's `color` value for borders, backgrounds, SVG fills ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword))
> - **CSS custom properties** (variables): `:root { --brand: oklch(60% 0.2 25); }` then `color: var(--brand);`; the real foundation of theming in modern CSS ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties))
> - variable fonts pack many weights/widths into one file, animatable via `font-variation-settings` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide))
> - `font-display: swap;` inside `@font-face` avoids invisible text while a web font loads ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display))

### The box model

- every element is a rectangular box: content, wrapped by **padding**, then **border**, then **margin**. This is the mental model for sizing and spacing everything
- `box-sizing`:
  - `content-box` (default): `width`/`height` size the content only; padding & border add on top
  - `border-box`: `width`/`height` include padding & border (far more predictable; common reset)
- **margin collapse**: adjacent vertical margins combine into the larger of the two (not the sum); horizontal margins never collapse
- `margin: auto;` horizontally centers a block within its container (splits leftover space)
- `overflow`: how content too big for its box behaves; `visible` (default) / `hidden` / `scroll`
- `min-width` / `min-height` / `max-width` / `max-height`: clamp box dimensions
- `visibility: hidden;` hides an element but keeps its space in the layout (vs. `display: none`, which removes it entirely)

> **Beyond the cheatsheets**
> - a near-universal reset: `*, *::before, *::after { box-sizing: border-box; }` ([CSS-Tricks](https://css-tricks.com/box-sizing/))
> - logical properties replace physical ones for internationalization: `margin-inline`, `padding-block`, `inset` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values))

### Display & positioning

- `display` sets how an element renders:
  - `block`: full width, line breaks before/after, sizable (e.g. `<div>`, `<p>`)
  - `inline`: only as wide as content, flows in text, width/height ignored (e.g. `<span>`)
  - `inline-block`: flows inline but accepts width/height
  - `none`: removed from layout entirely
- `position`:
  - `static` (default): normal document flow
  - `relative`: offset from its normal spot via `top`/`right`/`bottom`/`left`; original space preserved
  - `absolute`: removed from flow; positioned relative to nearest positioned ancestor
  - `fixed`: pinned to the viewport; stays put on scroll (classic sticky navbar)
- `z-index`: stacking order for overlapping elements; higher integer = nearer the front; needs a non-static `position`
- `float`: `left` / `right` pulls an element to one side and lets content wrap around it (legacy layout tool)
- `clear`: `left` / `right` / `both` stops an element from sitting beside a float

> **Beyond the cheatsheets**
> - `position: sticky;` is the modern pin: scrolls normally until it hits a threshold, then sticks ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky))
> - `float` is largely obsolete for layout now; reach for flexbox or grid instead

### Flexbox

- one-dimensional layout: arranges items along a single axis (a row *or* a column)
- **main axis** = the direction items flow; **cross axis** = perpendicular to it. Most flex properties are "align along main" vs. "align along cross"
- set on the **container**:
  - `display: flex;` (block-level) or `inline-flex;` (inline); children become flex items
  - `flex-direction`: `row` (default) / `column` / `*-reverse`; sets the main axis
  - `justify-content`: distributes items along the main axis (`flex-start`, `center`, `space-between`, `space-around`, etc.)
  - `align-items`: aligns items along the cross axis
  - `flex-wrap`: `wrap` lets items flow onto new lines instead of shrinking
  - `align-content`: spaces multiple rows along the cross axis (only with wrapping)
  - `flex-flow`: shorthand for `flex-direction` + `flex-wrap`
- set on the **items**:
  - `flex-grow`: how much an item grows to fill space (default 0)
  - `flex-shrink`: how much it shrinks when space is tight (default 1)
  - `flex-basis`: starting size before grow/shrink
  - `flex`: shorthand for grow/shrink/basis, e.g. `flex: 2 1 150px;`

> **Beyond the cheatsheets**
> - `gap` works in flexbox (not just grid); the clean way to space items without margins: `gap: 1rem;` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/gap))
> - `place-items` / `place-content` are shorthands for the `align-*` + `justify-*` pair ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/place-items))

### Grid

- two-dimensional layout: rows *and* columns at once. Use grid for overall page structure, flexbox for one-directional component layout
- set on the **container**:
  - `display: grid;` or `inline-grid;`
  - `grid-template-columns` / `grid-template-rows`: define track sizes, e.g. `20px 20% 60%`
  - `fr` unit: a fraction of leftover space, e.g. `1fr 60px 1fr`
  - `minmax(min, max)`: a track that flexes between bounds
  - `grid-gap` (or `gap`): space between tracks; `grid-row-gap` / `grid-column-gap` individually
  - `grid-template-areas`: name regions and lay them out visually in the CSS
  - `grid-auto-flow`: `row` / `column` / `dense`; how auto-placed items fill in
  - `grid-auto-rows` / `grid-auto-columns`: size implicitly-created tracks
  - container alignment: `justify-items` / `align-items` (per item within cell), `justify-content` / `align-content` (whole grid within container)
- set on the **items**:
  - `grid-row` / `grid-column`: shorthand for start/end lines, e.g. `grid-row: 1 / span 2;`
  - `grid-row-start` / `grid-row-end` (+ column equivalents): place/span by line number, `span n` keyword
  - `grid-area`: shorthand for all four start/end lines, or a name from `grid-template-areas`
  - `justify-self` / `align-self`: override container alignment for one item

> **Beyond the cheatsheets**
> - `repeat()` avoids repetition: `grid-template-columns: repeat(3, 1fr);` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat))
> - the responsive-grid one-liner (auto-fitting columns, no media queries): `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));` ([CSS-Tricks](https://css-tricks.com/snippets/css/complete-guide-grid/))
> - [CSS-Tricks' "Complete Guide to Grid"](https://css-tricks.com/snippets/css/complete-guide-grid/) and [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) are the canonical references for both systems

### Responsive design

- goal: one site that adapts to any screen size (phone to desktop)
- **media queries** apply rules conditionally on device characteristics:
  - `@media only screen and (max-width: 480px) { ... }` targets small screens
  - combine conditions with `and`: `(min-width: 480px) and (max-width: 600px)`
  - **breakpoints** = the widths where layout shifts
- **relative units** scale with context instead of fixed pixels:
  - `em`: relative to the current element's font size
  - `rem`: relative to the root (`<html>`) font size; more predictable than `em`
  - `%`: relative to the parent's dimension
- `background-size: cover;` scales a background image to fill its container, keeping proportions

> **Beyond the cheatsheets**
> - **container queries** style elements based on their *container's* size, not the viewport; the big recent shift toward truly modular components: `@container (min-width: 400px) { ... }` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries))
> - `clamp(min, preferred, max)` for fluid sizing without breakpoints: `font-size: clamp(1rem, 2.5vw, 2rem);` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp))
> - viewport units `vw` / `vh`, plus dynamic `dvh` / `svh` / `lvh` that account for mobile browser chrome ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths))
> - `@media (prefers-reduced-motion)` and `(prefers-color-scheme: dark)` respond to user preferences ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion))

### Transitions & animations

- **transitions** animate a property smoothly between two states (e.g. on `:hover`) instead of snapping
- four components:
  - `transition-property`: which property animates (`all` = every changing property)
  - `transition-duration`: how long (default `0s`, i.e. no animation)
  - `transition-timing-function`: the acceleration curve (`ease-in`, `ease-out`, `ease-in-out`, `linear`)
  - `transition-delay`: pause before starting (`s` or `ms`)
- `transition` shorthand bundles all four; comma-separate to transition multiple properties differently

> **Beyond the cheatsheets**
> - the Codecademy sheet stops at transitions; the other half is **keyframe animations** for multi-step, looping, or self-starting motion:
>   - `@keyframes name { 0% { ... } 100% { ... } }` defines the sequence
>   - `animation: name 1s ease infinite;` applies it ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations))
> - `transform` (`translate`, `scale`, `rotate`) and `opacity` are the cheapest properties to animate (GPU-accelerated); prefer them over animating layout properties like `width`/`top` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transform))

### Links, buttons & interaction states

- styling that signals interactivity; how a control tells the user it can be clicked
- **signifiers**: visual cues that hint how to interact with something (an underline says "link", a raised edge says "button")
- the **user agent stylesheet** is the browser's built-in default styling (e.g. links default to blue + underlined); your CSS overrides it
- **link states** (style each for clear feedback):
  - normal (unclicked), `:hover` (cursor over), `:active` (being clicked), `:visited` (previously visited)
- **pseudo-classes** style an element in a particular state: `a:hover { }`, `button:active { }`
- `cursor` property: changes the mouse pointer on hover (`pointer`, `default`, `not-allowed`, etc.)
- **anchor text**: the visible text of a link; descriptive text improves usability, accessibility, and SEO
- `title` attribute: extra advisory text on any element; surfaces as a **tooltip** near the cursor
- **design idioms** (two contrasting visual languages):
  - skeuomorphism: UI imitates real-world objects (3D buttons, textures, shadows)
  - flat design: simple 2D, minimal ornament; state changes shown via color shifts
- hover states do not exist on touch devices (no cursor); never rely on `:hover` alone for essential info

> **Beyond the cheatsheets**
> - `:focus-visible` styles keyboard focus without showing rings on mouse click; key for accessible, non-ugly focus states ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible))
> - always keep a visible focus indicator for keyboard navigation; don't `outline: none` without a replacement ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus))

### CSS-in-JS

- writes CSS inside JavaScript, scoped to components; common in React. Libraries shown here are Emotion and styled-components
- **the `css` prop** (Emotion) styles an element inline, via object or tagged template:
  ```jsx
  <div css={{ backgroundColor: 'rebeccapurple' }}>Content</div>
  ```
- **styled components** create a React component with styles baked in:
  ```jsx
  const ContentWrapper = styled.div`
    width: 100vw;
    display: grid;
  `
  ```
- **composition**: build a new styled component from an existing one, overriding some styles
  ```jsx
  const CornflowerButton = styled(Button)`
    color: cornflowerblue;
  `
  ```
- **theming**: a `ThemeProvider` exposes shared values (colors, spacing) as `props.theme` in any styled block
- **`keyframes` helper**: defines animations in JS, returns an object usable in style blocks
- cross-reference: see the **Ecosystem** section below for where CSS-in-JS sits among other styling approaches

> **Beyond the cheatsheets**
> - runtime CSS-in-JS (styled-components, Emotion) has fallen out of favor for performance; zero-runtime options that extract real CSS at build time are now preferred: Vanilla Extract, Linaria, or just CSS Modules ([styled-components docs](https://styled-components.com/docs), [Emotion docs](https://emotion.sh/docs/introduction))

### Ecosystem: tools, frameworks & supersets

> This section is background, not core CSS syntax; raw hand-written CSS is increasingly rare in production, so it helps to recognize the common tools and what category each falls into.

- **Preprocessors** (a superset that compiles to CSS):
  - **Sass / SCSS**: adds variables, nesting, mixins, functions, partials. Predates native CSS variables/nesting and is still widespread, though native features have closed much of the gap ([sass-lang.com](https://sass-lang.com))
  ```scss
  $brand: #6b46ff;
  .card { color: $brand; &:hover { opacity: 0.8; } }
  ```
- **Utility-first frameworks**:
  - **Tailwind CSS**: compose designs from atomic utility classes in your markup, no separate stylesheet, no naming things. Distinctive "class soup" look; pairs with a build step that strips unused classes ([tailwindcss.com](https://tailwindcss.com))
  ```html
  <button class="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">
    Save
  </button>
  ```
- **Component frameworks** (pre-styled, opinionated UI kits):
  - **Bootstrap**: ships a grid system and ready-made components with its own recognizable look; fast to stand up, harder to make not look like Bootstrap ([getbootstrap.com](https://getbootstrap.com))
- **Headless / unstyled component libraries** (behavior & accessibility, you bring the styles):
  - **shadcn/ui**: not a dependency; you copy component source (built on Radix primitives + Tailwind) into your project and own it. Hugely popular in the React/Next.js world ([ui.shadcn.com](https://ui.shadcn.com), [GitHub](https://github.com/shadcn-ui/ui))
  - **Radix UI** / **Headless UI**: accessible, unstyled primitives (dialogs, dropdowns, tabs) you style yourself ([radix-ui.com](https://www.radix-ui.com), [headlessui.com](https://headlessui.com))
- **CSS-in-JS**: covered in its own section above; styles live in JS, scoped per component (Emotion, styled-components)

## Cheatsheet links

7. [Learn CSS](https://www.codecademy.com/learn/learn-css/modules/syntax-and-selectors/cheatsheet) / duplicate: [Learn CSS: Introduction](https://www.codecademy.com/learn/learn-css-introduction/modules/syntax-and-selectors/cheatsheet)
8. [Learn CSS: Box Model and Layout](https://www.codecademy.com/learn/learn-css-box-model-and-layout/modules/learn-css-box-model/cheatsheet)
9. [Learn CSS: Flexbox and Grid](https://www.codecademy.com/learn/learn-css-flexbox-and-grid/modules/layout-with-flexbox/cheatsheet) / duplicate: [Learn Intermediate CSS](https://www.codecademy.com/learn/learn-intermediate-css/modules/layout-with-flexbox/cheatsheet)
10. [Intermediate CSS: CSS Grid](https://www.codecademy.com/learn/premium-intermediate-css-css-grid/modules/premium-learn-css-grid/cheatsheet)
11. [Learn CSS: Colors](https://www.codecademy.com/learn/learn-css-colors/modules/css-colors/cheatsheet)
12. [Learn CSS: Typography and Fonts](https://www.codecademy.com/learn/learn-css-typography-and-fonts/modules/learn-css-typography-mod/cheatsheet)
13. [Learn CSS: Transitions and Animations](https://www.codecademy.com/learn/learn-css-transitions-and-animations/modules/learn-css-transitions/cheatsheet)
14. [Learn CSS: Responsive Design](https://www.codecademy.com/learn/learn-responsive-design/modules/learn-responsive-design-module/cheatsheet)
15. [Responsive Design](https://www.codecademy.com/learn/premium-responsive-design/modules/premium-learn-responsive-design/cheatsheet)
16. [Learn CSS-in-JS](https://www.codecademy.com/learn/learn-css-in-js/modules/css-in-js-styling-your-applications/cheatsheet)
17. [Learn Navigation Design](https://www.codecademy.com/learn/learn-navigation-design/modules/learn-links-and-buttons/cheatsheet)
