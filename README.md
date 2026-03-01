# FoxTranslator.js
Lightweight language selector widget with Google Translate integration


# FoxTranslator.js

> 🌍 A lightweight, zero-dependency language selector widget powered by Google Translate.  
> Drop a single `<div>` into any HTML page — no frameworks, no build step required.

![Version](https://img.shields.io/badge/version-1.0.0-7c3aed)
![License](https://img.shields.io/badge/license-MIT-34d399)
![Vanilla JS](https://img.shields.io/badge/vanilla-JS-f5a623)
![Powered by](https://img.shields.io/badge/powered%20by-Google%20Translate-4285F4)

---

## ✨ Features

- 🚀 Zero dependencies — pure vanilla JavaScript
- 🎌 250+ languages with SVG flag icons built-in
- 🔍 Searchable language modal
- 🌗 Auto dark/light theme detection (Bootstrap, Tailwind, custom attributes)
- 💾 Remembers user language preference via `localStorage`
- 🔗 Multiple synced widgets on the same page
- 🤖 Auto-translate to browser language on first visit
- 🧩 Fully configurable via HTML `data-` attributes

---

## 📦 Installation

Include the script before `</body>`:

```html
<!-- Docs CDN (development) -->
<script src="https://cdn.foxdim.com/repo/foxdim/libs/translate/"></script>
```

```html
<!-- Minified (recommended) -->
<script src="https://cdn.foxdim.com/repo/foxdim/libs/translate/translator.min.js"></script>
```

```html
<!-- Full (development) -->
<script src="https://cdn.foxdim.com/repo/foxdim/libs/translate/translator.js"></script>
```

No npm, no bundler, no setup. Just drop it in.

---

## 🚀 Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<body>

  <div
    data-type="foxLang"
    data-value="EN,TR,DE,FR"
    data-class="foxLang"
  ></div>

  <script src="https://cdn.foxdim.com/repo/foxdim/libs/translate/translator.min.js"></script>
</body>
</html>
```

That's it. The widget renders a button with the current language flag. Clicking it opens a searchable modal with all 250+ supported languages.

---

## ⚙️ Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `data-type="foxLang"` | ✅ | — | Marks the element as a FoxLang widget |
| `data-value` | ✅ | `tr,en` | Comma-separated language codes shown in Quick Select (e.g. `TR,EN,DE,FR`) |
| `data-class` | ✅ | `foxLang` | CSS class prefix and localStorage key. Widgets with the same value share one modal |
| `data-theme` | — | `auto` | Color scheme: `light`, `dark`, or `auto` |
| `data-selectoption` | — | `flag,name` | Tokens shown on the **closed selector button** |
| `data-listoption` | — | `flag,name,en-name` | Tokens shown in each **modal list row** |
| `data-option` | — | — | Comma-separated behavior flags |

---

## 🎨 Display Tokens

Tokens control what is rendered in the selector button and modal list.

| Token | Description |
|-------|-------------|
| `flag` | Country/language flag SVG |
| `iso2` | 2-letter code badge (e.g. **TR**, **EN**) |
| `name` | Native name (e.g. Türkçe, Deutsch) |
| `en-name` | English name in parentheses (e.g. (Turkish)) |

```html
<!-- Compact: flag + iso2 badge -->
<div data-type="foxLang" data-value="TR,EN,DE"
     data-selectoption="flag,iso2"
     data-listoption="flag,iso2,name,en-name"
     data-class="foxLang"></div>

<!-- Full detail -->
<div data-type="foxLang" data-value="TR,EN,DE"
     data-selectoption="flag,iso2,name,en-name"
     data-class="foxLang"></div>
```

> 💡 When `data-selectoption` is exactly `flag,iso2`, the button automatically switches to **compact style** — perfect for tight navigation bars.

---

## 🔧 Options (`data-option`)

| Flag | Description |
|------|-------------|
| `no-flags` | Hides all flag SVGs |
| `yes-auto-translate` | On first load, auto-translates to the visitor's browser language |
| `yes-first-lang-browser` | Moves browser language to the top of Quick Select |

```html
<div data-type="foxLang"
     data-value="TR,EN,DE,FR"
     data-option="yes-auto-translate,yes-first-lang-browser"
     data-class="foxLang"></div>
```

---

## 🌗 Theming

Set `data-theme` to `light`, `dark`, or `auto` (default).

In `auto` mode, the widget reads the theme from the page and updates live:

```html
<html theme="dark">
<html data-theme="dark">
<html data-bs-theme="dark">   <!-- Bootstrap 5 -->
<html class="dark">
```

Detection priority: `html[theme]` → `html[data-theme]` → `html[data-bs-theme]` → `html.classList` → system `prefers-color-scheme`.

---

## 🔗 Multiple Synced Widgets

Widgets with the same `data-class` share one modal and one localStorage key. Selecting a language updates all of them instantly.

```html
<!-- Navbar: compact -->
<div data-type="foxLang" data-value="TR,EN,DE"
     data-selectoption="flag,iso2"
     data-class="foxLang"></div>

<!-- Sidebar: full name — same class, stays in sync -->
<div data-type="foxLang" data-value="TR,EN,DE"
     data-selectoption="flag,name"
     data-class="foxLang"></div>
```

---

## 🧠 JavaScript API

Both classes are exposed on `window` after `DOMContentLoaded`.

### `window.FoxLangSelect`

| Method / Property | Description |
|-------------------|-------------|
| `.registry` | Shared state for each widget group (keyed by `data-class`) |
| `.resolveLang(raw)` | Normalizes a language string to internal key |
| `.resolveTheme(raw)` | Returns `"dark"` or `"light"` based on current page theme |
| `.onChange(lang)` | Called after every language change — override for custom behavior |

### `window.FoxdimTranslate`

| Method | Description |
|--------|-------------|
| `.setLang(lang)` | Translates the page to given language code |
| `.restorePage()` | Restores original page content |
| `.getPageLang()` | Returns current `<html lang>` value |

```js
// Custom analytics hook
window.FoxLangSelect.onChange = function(lang) {
  gtag('event', 'language_change', { language: lang });
};

// Manual trigger
window.FoxdimTranslate.setLang('de');   // Translate to German
window.FoxdimTranslate.restorePage();   // Restore original
```

---

## 📄 Full Production Example

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>

<header>
  <nav>
    <a href="/" class="nav-logo">MyApp</a>
    <div class="nav-links">
      <a href="/">Features</a>
      <a href="/pricing">Pricing</a>
    </div>
    <!-- Language switcher -->
    <div
      data-type="foxLang"
      data-theme="auto"
      data-value="EN,TR,DE,FR,ES,AR,RU,ZH-CN"
      data-selectoption="flag,iso2"
      data-listoption="flag,iso2,name,en-name"
      data-option="yes-auto-translate,yes-first-lang-browser"
      data-class="foxLang"
      translate="no"
      class="notranslate"
    ></div>
  </nav>
</header>

<main>
  <h1>Welcome to MyApp</h1>
  <p>A multilingual product — now available in your language.</p>
</main>

<!-- Load before </body> -->
<script src="https://cdn.foxdim.com/repo/foxdim/libs/translate/translator.min.js"></script>
</body>
</html>
```

---

## 🌐 Supported Languages

250+ languages supported including regional variants (`zh-CN`, `zh-TW`, `fr-CA`, `fa-AF`, etc.)

The library automatically normalizes: `en-US` → `en`, `de-AT` → `de`.

Common codes: `af ak am ar as ay az ba be bg bn bs ca cs cy da de el en eo es et eu fa fi fr fy ga gl gu he hi hr ht hu hy id ig is it ja ka kk km kn ko ku ky la lb lg ln lo lt lv mg mi mk ml mn mr ms mt my ne nl no ny or pa pl ps pt qu ro ru rw sa sd si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn tr ts tt ug uk ur uz ve vi wo xh yi yo zh-CN zh-TW zu`

---

## 📝 License

MIT © [FOXDIM](https://www.foxdim.com)

Translation powered by [Google Translate](https://translate.google.com).

---

<p align="center">
  Made with ❤️ by <a href="https://www.foxdim.com">FOXDIM</a>
</p>
