# HTML

HTML (HyperText Markup Language) is the structural layer of a web page: it marks up *what content is* (a heading, a paragraph, a list), not how it looks (CSS) or how it behaves (JS). Browsers parse the markup into a tree of elements (the DOM) and render it.

## Notes

### Document structure & boilerplate

- HTML describes content *structure* via nested elements; rendering/styling is CSS's job
- **tag** = `<name>`; **element** = opening tag + content + closing tag `</name>`
  - empty/void elements (`<img>`, `<br>`) have no content and no closing tag
- **attributes** = `name="value"` in the opening tag; configure or alter an element
- `<!DOCTYPE html>`: required first line; declares HTML5 to the browser
- `<html>`: root element; wraps everything; follows the doctype
- `<head>`: metadata container; not rendered on the page
- `<title>`: tab / title-bar text; lives only inside `<head>`
- `<body>`: the rendered content; one per document
- **nesting** = parent / child / sibling relationships (a family tree)
  - indent ~2 spaces per level for readability (whitespace itself is ignored)
- `id`: unique identifier for one element; targetable by CSS & JS
- comments = `<!-- ... -->`; ignored by the browser; single- or multi-line

### Text content

- **block vs inline**: block elements stack vertically (`<p>`, `<div>`); inline elements sit within a line (`<em>`, `<span>`)
- `<h1>`-`<h6>`: six heading levels; `<h1>` most important, one per page is conventional
- `<p>`: paragraph of text (block)
- `<br>`: line break; void element
- **semantic emphasis** (meaning, not just looks):
  - `<em>`: stress emphasis; italic by default
  - `<strong>`: strong importance; bold by default
- **generic containers** (no semantic meaning; use when no better element fits):
  - `<div>`: block-level grouping ("division")
  - `<span>`: inline grouping, e.g. to style a run of text
- **lists**:
  - `<ol>`: ordered (numbered)
  - `<ul>`: unordered (bulleted)
  - `<li>`: list item; child of `<ol>` or `<ul>`

### Links & images

- hyperlinks are what make the web "hyper": they connect documents
- `<a>`: anchor element; `href` sets the destination
  - `href` can point to: an external URL, a file on the same server, or a spot on the current page
  - `target="_blank"`: opens link in a new tab/window
  - **fragment link**: `href="#some-id"` jumps to the element with that `id`
- **paths**:
  - absolute: full URL, e.g. `https://example.com/page`
  - relative: location relative to the current file; `./` = current directory
- `<img>`: embeds an image; void element
  - `src`: image source (required)
  - `alt`: text shown if the image fails + read aloud by screen readers (accessibility)

### Semantic HTML

- **semantic** = the element name describes the *role* of its content, unlike a generic `<div>`
- why it matters: clearer code, better accessibility (screen readers), better SEO (search engines understand structure)
- **layout / sectioning elements**:
  - `<header>`: introductory content for a page or section (logo, nav, title)
  - `<nav>`: block of navigation links
  - `<main>`: the dominant, unique content of the page (one per page)
  - `<footer>`: closing content (author, copyright, links)
  - `<section>`: thematic grouping, usually with a heading
  - `<article>`: self-contained content that'd make sense on its own (blog post, comment)
  - `<aside>`: tangential content (sidebar, callout)
- **media elements**:
  - `<figure>`: wraps self-contained media (image, diagram, code snippet)
  - `<figcaption>`: caption for a `<figure>`; stays attached to it
  - `<video>`: `src` sets source; `controls` shows play/pause UI; inner content is fallback text
  - `<audio>`: embeds sound; `src`; needs a closing tag
  - `<embed>`: embeds external/any media; void element

### Tables

- for **tabular data** (rows × columns), *not* for page layout (anti-pattern; use CSS)
- `<table>`: the table container
- `<tr>`: table row; holds the cells
- `<th>`: header cell (column or row title); bold + centered by default
- `<td>`: standard data cell
- **row groups** (structure + lets you style/scroll sections):
  - `<thead>`: header rows
  - `<tbody>`: body rows
  - `<tfoot>`: footer/summary rows
- **spanning cells**:
  - `colspan="n"`: cell spans n columns (default 1)
  - `rowspan="n"`: cell spans n rows (default 1)

### Forms

- forms collect user input and send it somewhere (a server) for processing
- `<form>`: wraps the inputs
  - `action`: URL that receives the submitted data
  - `method`: HTTP verb (`GET` appends data to URL; `POST` sends in request body)
- `<input>`: the workhorse field; `type` decides how it renders & behaves
  - `name`: becomes the **key** in the submitted key-value pair; no `name` means not submitted
  - `type="text"`: single-line text
  - `type="password"`: masks characters on screen (value still sent as-is)
  - `type="number"`: numeric input
  - `type="checkbox"`: multiple selections; shared `name` groups them
  - `type="radio"`: one selection per shared-`name` group
  - `type="range"`: slider; `min` / `max` / `step`
  - `type="submit"`: submit button; `value` sets its label
- `<label>`: describes a field; `for="inputId"` links them so clicking the label focuses the input (accessibility)
- `<textarea>`: multi-line text; `rows` / `cols` set initial size; has a closing tag
- `<select>` + `<option>`: dropdown menu; the chosen `<option>`'s `value` is submitted
- `<datalist>`: list of suggestions for an input; input's `list` matches the datalist `id`; still allows free text
- **client-side validation** (attributes on `<input>`):
  - `required`: field must be filled
  - `min` / `max`: numeric bounds
  - `minlength` / `maxlength`: character-count bounds
  - `pattern`: regex the value must match

## Cheatsheet links

1. [Learn HTML: Fundamentals](https://www.codecademy.com/learn/learn-html-fundamentals/modules/html-elements-and-structure/cheatsheet)
2. [Learn HTML](https://www.codecademy.com/learn/learn-html/modules/learn-html-elements/cheatsheet) / duplicate: [Learn HTML](https://www.codecademy.com/learn/learn-html-web-dev-path/modules/learn-html-elements/cheatsheet)
3. [Learn HTML: Semantic HTML](https://www.codecademy.com/learn/learn-html-semantic-html/modules/html-semantic-html/cheatsheet)
4. [Learn HTML: Forms](https://www.codecademy.com/learn/learn-html-forms/modules/html-forms/cheatsheet)
5. [Learn HTML: Tables](https://www.codecademy.com/learn/learn-html-tables/modules/html-tables/cheatsheet)
6. [HTML: Tables and Forms](https://www.codecademy.com/learn/premium-html-tables-and-forms/modules/premium-learn-html-tables/cheatsheet)
