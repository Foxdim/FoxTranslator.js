/*
//How to Use: https://cdn.foxdim.com/repo/foxdim/libs/translate/
//Original CDN: https://cdn.foxdim.com/repo/foxdim/libs/translate/translator.js
//Original MIN JS CDN: https://cdn.foxdim.com/repo/foxdim/libs/translate/translator.min.js

FoxLang Widget Usage Examples

1) Basic usage:
<div data-type="foxLang" data-value="TR,EN,DE" data-class="foxLang"></div>

2) Advanced usage:
<div
    data-type="foxLang"
    data-value="TR,EN,DE,FR"
    data-theme="auto"
    data-selectoption="flag,iso2,name,en-name"
    data-listoption="flag,iso2,name,en-name"
    data-option="yes-auto-translate,yes-first-lang-browser"
    data-class="foxLang"
></div>

Theme source examples (for auto mode):
<html theme="dark">
<html data-theme="dark">
<html data-bs-theme="dark">

Attribute descriptions:
- data-type="foxLang": Widget initializer selector.
- data-value="TR,EN,DE": "Quick Select" languages.
- data-class="foxLang": CSS class prefix and localStorage key prefix.
- data-theme="light|dark|auto": Widget theme mode.
    - auto: Reads theme from html[theme] → html[data-theme] → html[data-bs-theme] → html class → system theme, in order.
- data-selectoption: Display order in closed selector.
- data-listoption: Display order in modal list.
- data-option:
    - no-flags: Hides flags.
    - yes-auto-translate: Uses browser language on first load.
    - yes-first-lang-browser: Puts browser language at the top of quick list.

Supported template tokens: flag, iso2, name, en-name
*/

// Shared flag SVG pool. Languages using the same flag reference here to reduce file size.
const F = {
    // Indonesia type — red/white horizontal (id, ban, btx, bts, bbc, bew, jw, mad, mak, min, su)
  ID:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#CE1126'/><rect y='8' width='24' height='8' fill='#fff'/></svg>",

    // India type — with Ashoka wheel (as, awa, bho, doi, gom, gu, hi, kn, mai, ml, mr, mni-Mtei, or, pa, sa, sat, ta, te)
  IN_C: "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#FF9933'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#138808'/><circle cx='12' cy='8' r='2.5' fill='none' stroke='#000080' stroke-width='0.8'/></svg>",

    // India type — without wheel (kha, lus, mwr, sat-Latn, tcy, trp)
  IN:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#FF9933'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#138808'/></svg>",

    // Russia type — white/blue/red horizontal (ba, bua, chm, kv, ru, sah, udm)
  RU:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#fff'/><rect y='5.33' width='24' height='5.33' fill='#0039A6'/><rect y='10.66' width='24' height='5.34' fill='#D52B1E'/></svg>",

    // South Africa type — green + arrow stripe (nr, nso, ts, ve, xh, zu)
  ZA:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#007A4D'/><rect y='6' width='24' height='4' fill='#FFD100'/><rect y='7' width='24' height='2' fill='#000'/><polygon points='0,0 10,8 0,16' fill='#000'/><polygon points='0,1.5 7.5,8 0,14.5' fill='#FFD100'/></svg>",

    // Philippines type — blue/red + white triangle (bik, ceb, hil, ilo, pag, pam, war)
  PH:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#0038A8'/><rect y='8' width='24' height='8' fill='#CE1126'/><polygon points='0,0 10,8 0,16' fill='#fff'/></svg>",

    // Congo type — blue + yellow arrow (kg, ktu, ln, lua)
  CD:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#007FFF'/><polygon points='0,0 24,8 0,16' fill='#CE1021'/><polygon points='0,0 10,8 0,16' fill='#F7D618'/></svg>",

    // Ghana type — green/yellow/red + black star (ak, ee, fon, gaa)
  GH:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#006B3F'/><rect y='5.33' width='24' height='5.33' fill='#FCD116'/><rect y='10.66' width='24' height='5.34' fill='#CE1126'/><circle cx='12' cy='8' r='2' fill='#000'/></svg>",

    // Italy type — green/white/red vertical (fur, it, lij, lmo, vec)
  IT:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#009246'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#CE2B37'/></svg>",

    // Ethiopia type — green/yellow/red + blue badge (am, om)
  ET:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#078930'/><rect y='5.33' width='24' height='5.33' fill='#FCDD09'/><rect y='10.66' width='24' height='5.34' fill='#DA121A'/><circle cx='12' cy='8' r='3' fill='#0F47AF'/></svg>",

    // Ivory Coast type — orange/white/green vertical (bci, dyu)
  CI:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#F77F00'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#009A44'/></svg>",

    // Mali type — green/yellow/red vertical (alz, bm)
  ML:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#14B53A'/><rect x='8' width='8' height='16' fill='#FCD116'/><rect x='16' width='8' height='16' fill='#CE1126'/></svg>",

    // Bolivia type — red/yellow/green vertical (ay)
  BO:   "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#D52B1E'/><rect x='8' width='8' height='16' fill='#F5E11D'/><rect x='16' width='8' height='16' fill='#007A3D'/></svg>",
};

class FoxLangSelect {
    constructor() {
        this.registry = {};
        this.supportedLangs = {
    'tr':      { name: 'Türkçe',             enName: 'Turkish',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#e30a17'/><circle cx='10' cy='8' r='5' fill='#fff'/><circle cx='11' cy='8' r='4' fill='#e30a17'/><path fill='#fff' d='M13.5 8l-2.5 1.5V6.5z'/></svg>` },
    'ab':      { name: 'Аԥсуа',              enName: 'Abkhaz',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#079E60'/><rect y='4' width='24' height='2' fill='#fff'/><rect y='8' width='24' height='2' fill='#fff'/><rect y='12' width='24' height='2' fill='#fff'/><rect width='9' height='8' fill='#CE1126'/><circle cx='4.5' cy='4' r='2' fill='#fff'/></svg>` },
    'ace':     { name: 'Basa Acèh',          enName: 'Acehnese',               svg: F.ID },
    'ach':     { name: 'Acholi',             enName: 'Acholi',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#000'/><rect y='5.33' width='24' height='5.33' fill='#FCD116'/><rect y='10.66' width='24' height='5.34' fill='#DE3831'/></svg>` },
    'aa':      { name: 'Qafar af',           enName: 'Afar',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#12AD2B'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#0066CC'/><polygon points='0,0 8,8 0,16' fill='#CE1126'/></svg>` },
    'af':      { name: 'Afrikaans',          enName: 'Afrikaans',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#007A4D'/><polygon points='0,0 10,8 0,16' fill='#000'/><polygon points='0,0 9,0 9,16 0,16' fill='#FFB612'/><rect y='6.5' width='24' height='3' fill='#fff'/><polygon points='0,0 8,8 0,16' fill='#DE3831'/></svg>` },
    'de':      { name: 'Deutsch',            enName: 'German',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#000'/><rect y='5.33' width='24' height='5.33' fill='#DD0000'/><rect y='10.66' width='24' height='5.34' fill='#FFCE00'/></svg>` },
    'alz':     { name: 'Dho-Alur',          enName: 'Alur',                   svg: F.ML },
    'ar':      { name: 'العربية',            enName: 'Arabic',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#007A3D'/><rect y='6' width='24' height='4' fill='#fff'/><rect y='0' width='24' height='3' fill='#000'/><rect y='13' width='24' height='3' fill='#CE1126'/></svg>` },
    'sq':      { name: 'Shqip',             enName: 'Albanian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#E41E20'/><text x='12' y='12' font-size='10' text-anchor='middle' fill='#000'>🦅</text></svg>` },
    'as':      { name: 'অসমীয়া',           enName: 'Assamese',               svg: F.IN_C },
    'av':      { name: 'Авар',              enName: 'Avar',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#009A44'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#CE1126'/></svg>` },
    'awa':     { name: 'अवधी',              enName: 'Awadhi',                 svg: F.IN_C },
    'ay':      { name: 'Aymar aru',         enName: 'Aymara',                 svg: F.BO },
    'az':      { name: 'Azərbaycan',        enName: 'Azerbaijani',            svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#0092BC'/><rect y='5.33' width='24' height='5.33' fill='#E8192C'/><rect y='10.66' width='24' height='5.34' fill='#00B050'/><circle cx='13' cy='8' r='2.5' fill='#fff'/><circle cx='14' cy='8' r='2' fill='#E8192C'/></svg>` },
    'ban':     { name: 'Basa Bali',         enName: 'Balinese',               svg: F.ID },
    'bm':      { name: 'Bamanankan',        enName: 'Bambara',                svg: F.ML },
    'bci':     { name: 'Baoulé',            enName: 'Baoulé',                 svg: F.CI },
    'eu':      { name: 'Euskara',           enName: 'Basque',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#D52B1E'/><text x='12' y='12' font-size='8' text-anchor='middle' fill='#fff' font-weight='bold'>EUS</text></svg>` },
    'ba':      { name: 'Башҡортса',         enName: 'Bashkir',                svg: F.RU },
    'btx':     { name: 'Batak Karo',        enName: 'Batak Karo',             svg: F.ID },
    'bts':     { name: 'Batak Simalungun',  enName: 'Batak Simalungun',       svg: F.ID },
    'bbc':     { name: 'Batak Toba',        enName: 'Batak Toba',             svg: F.ID },
    'bew':     { name: 'Betawi',            enName: 'Betawi',                 svg: F.ID },
    'be':      { name: 'Беларуская',        enName: 'Belarusian',             svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CF101A'/><rect y='11' width='24' height='5' fill='#009B3A'/><rect width='3.5' height='16' fill='#fff'/></svg>` },
    'bal':     { name: 'بلوچی',             enName: 'Balochi',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#01411C'/><circle cx='12' cy='8' r='4' fill='#fff'/></svg>` },
    'bem':     { name: 'Ichibemba',         enName: 'Bemba',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#198A00'/><rect y='5' width='24' height='6' fill='#000'/><rect y='6.5' width='24' height='3' fill='#EF7D00'/><polygon points='0,0 6,8 0,16' fill='#DE2010'/></svg>` },
    'bn':      { name: 'বাংলা',             enName: 'Bengali',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006A4E'/><circle cx='11' cy='8' r='5' fill='#F42A41'/></svg>` },
    'ber-Latn':{ name: 'Tamaziɣt',         enName: 'Berber (Latin)',          svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006233'/><rect y='5.33' width='24' height='5.33' fill='#FFD100'/></svg>` },
    'ber':     { name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ',       enName: 'Berber (Tifinagh)',       svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006233'/><rect y='5.33' width='24' height='5.33' fill='#FFD100'/></svg>` },
    'bho':     { name: 'भोजपुरी',           enName: 'Bhojpuri',               svg: F.IN_C },
    'bik':     { name: 'Bikol',             enName: 'Bikol',                  svg: F.PH },
    'bs':      { name: 'Bosanski',          enName: 'Bosnian',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#003DA5'/><polygon points='4,0 20,16 4,16' fill='#FFCD00'/><circle cx='6' cy='2' r='1.2' fill='#fff'/><circle cx='9' cy='5' r='1.2' fill='#fff'/><circle cx='12' cy='8' r='1.2' fill='#fff'/><circle cx='15' cy='11' r='1.2' fill='#fff'/><circle cx='18' cy='14' r='1.2' fill='#fff'/></svg>` },
    'br':      { name: 'Brezhoneg',         enName: 'Breton',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect y='0' width='24' height='2.29' fill='#000'/><rect y='4.57' width='24' height='2.29' fill='#000'/><rect y='9.14' width='24' height='2.29' fill='#000'/><rect y='13.71' width='24' height='2.29' fill='#000'/><rect width='9' height='9' fill='#000'/></svg>` },
    'bg':      { name: 'Български',         enName: 'Bulgarian',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#fff'/><rect y='5.33' width='24' height='5.33' fill='#00966E'/><rect y='10.66' width='24' height='5.34' fill='#D62612'/></svg>` },
    'my':      { name: 'မြန်မာဘာသာ',       enName: 'Burmese',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#FECB00'/><rect y='5.33' width='24' height='5.33' fill='#34B233'/><rect y='10.66' width='24' height='5.34' fill='#EA2839'/><polygon points='12,1 13.5,6 18,6 14.5,9 15.8,14 12,11 8.2,14 9.5,9 6,6 10.5,6' fill='#fff'/></svg>` },
    'bua':     { name: 'Буряад',            enName: 'Buryat',                 svg: F.RU },
    'jw':      { name: 'Basa Jawa',         enName: 'Javanese',               svg: F.ID },
    'ch':      { name: 'Chamoru',           enName: 'Chamorro',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#003DA5'/><rect y='6' width='24' height='4' fill='#CE1126'/></svg>` },
    'chk':     { name: 'Chuukese',          enName: 'Chuukese',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#6AB2E7'/><rect y='6' width='24' height='4' fill='#fff'/></svg>` },
    'ce':      { name: 'Нохчийн',           enName: 'Chechen',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#fff'/><rect y='5.33' width='24' height='5.33' fill='#0039A6'/><rect y='10.66' width='24' height='5.34' fill='#009A44'/></svg>` },
    'cs':      { name: 'Čeština',           enName: 'Czech',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#fff'/><rect y='8' width='24' height='8' fill='#D7141A'/><polygon points='0,0 10,8 0,16' fill='#11457E'/></svg>` },
    'ny':      { name: 'Chichewa',          enName: 'Chichewa',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='4' fill='#000'/><rect y='4' width='24' height='4' fill='#CE1126'/><rect y='8' width='24' height='4' fill='#339E35'/><rect y='12' width='24' height='4' fill='#EF7C00'/></svg>` },
    'zh-CN':   { name: '中文 (简体)',         enName: 'Chinese (Simplified)',   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#DE2910'/><polygon points='3,2 4,5 7,5 4.5,7 5.5,10 3,8 0.5,10 1.5,7 -1,5 2,5' fill='#FFDE00' transform='translate(3,1) scale(0.7)'/></svg>` },
    'zh-TW':   { name: '中文 (繁體)',         enName: 'Chinese (Traditional)', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#FE0000'/><rect width='10' height='7' fill='#000095'/><polygon points='4,1 4.8,3.5 7.5,3.5 5.3,4.9 6.1,7.5 4,6 1.9,7.5 2.7,4.9 0.5,3.5 3.2,3.5' fill='#FFFF00' transform='translate(0.5,0) scale(0.85)'/></svg>` },
    'cv':      { name: 'Чӑвашла',           enName: 'Chuvash',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#C8102E'/><polygon points='5,2 7,7 12,7 8,10 9.5,15 5,12 0.5,15 2,10 -2,7 3,7' fill='#FFD700' transform='translate(7,1) scale(0.65)'/></svg>` },
    'da':      { name: 'Dansk',             enName: 'Danish',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#C60C30'/><rect x='7' width='3' height='16' fill='#fff'/><rect y='6.5' width='24' height='3' fill='#fff'/></svg>` },
    'fa-AF':   { name: 'دری',              enName: 'Dari',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#000'/><rect y='5.33' width='24' height='5.33' fill='#CE1126'/><rect y='10.66' width='24' height='5.34' fill='#009A44'/></svg>` },
    'dv':      { name: 'ދިވެހި',            enName: 'Divehi',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#D21034'/><rect x='4' y='3' width='16' height='10' fill='#007E3A'/><circle cx='12' cy='8' r='3' fill='#fff'/></svg>` },
    'din':     { name: 'Thuɔŋjäŋ',         enName: 'Dinka',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#078930'/><rect y='6' width='24' height='4' fill='#fff'/><polygon points='0,0 10,8 0,16' fill='#CE1126'/></svg>` },
    'doi':     { name: 'डोगरी',             enName: 'Dogri',                  svg: F.IN_C },
    'dov':     { name: 'Dombe',             enName: 'Dombe',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#009A44'/><rect y='5.33' width='24' height='5.33' fill='#000'/><rect y='10.66' width='24' height='5.34' fill='#CE1126'/></svg>` },
    'dyu':     { name: 'Dyula',             enName: 'Dyula',                  svg: F.CI },
    'dz':      { name: 'རྫོང་ཁ',            enName: 'Dzongkha',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='12' height='16' fill='#FF8000'/><rect x='12' width='12' height='16' fill='#C8102E'/><polygon points='12,0 24,16 0,16' fill='#fff' opacity='0.9'/></svg>` },
    'id':      { name: 'Indonesia',         enName: 'Indonesian',             svg: F.ID },
    'hy':      { name: 'Հայերեն',           enName: 'Armenian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#D90012'/><rect y='5.33' width='24' height='5.33' fill='#0033A0'/><rect y='10.66' width='24' height='5.34' fill='#F2A800'/></svg>` },
    'eo':      { name: 'Esperanto',         enName: 'Esperanto',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect width='24' height='8' fill='#009A44'/><rect width='12' height='8' fill='#009A44'/><text x='3' y='7' font-size='7' fill='#fff' font-weight='bold'>★</text></svg>` },
    'et':      { name: 'Eesti',             enName: 'Estonian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#0072CE'/><rect y='5.33' width='24' height='5.33' fill='#000'/><rect y='10.66' width='24' height='5.34' fill='#fff'/></svg>` },
    'ee':      { name: 'Eʋegbe',            enName: 'Ewe',                    svg: F.GH },
    'fo':      { name: 'Føroyskt',          enName: 'Faroese',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect x='7' width='4' height='16' fill='#003580'/><rect y='6' width='24' height='4' fill='#003580'/><rect x='8' width='2' height='16' fill='#CE1126'/><rect y='7' width='24' height='2' fill='#CE1126'/></svg>` },
    'fa':      { name: 'فارسی',             enName: 'Persian',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#239F40'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#DA0000'/></svg>` },
    'nl':      { name: 'Nederlands',        enName: 'Dutch',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#AE1C28'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#21468B'/></svg>` },
    'fj':      { name: 'Vosa Vakaviti',     enName: 'Fijian',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 60 40'><rect width='60' height='40' fill='#68BFE5'/><rect width='30' height='20' fill='#012169'/><path d='M0,0 L30,20 M30,0 L0,20' stroke='#fff' stroke-width='5'/><path d='M0,0 L30,20 M30,0 L0,20' stroke='#CF142B' stroke-width='3'/><path d='M15,0 V20 M0,10 H30' stroke='#fff' stroke-width='8'/><path d='M15,0 V20 M0,10 H30' stroke='#CF142B' stroke-width='5'/></svg>` },
    'tl':      { name: 'Filipino',          enName: 'Filipino',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#0038A8'/><rect y='8' width='24' height='8' fill='#CE1126'/><polygon points='0,0 10,8 0,16' fill='#fff'/><circle cx='3.5' cy='8' r='1.5' fill='#FCD116'/></svg>` },
    'fi':      { name: 'Suomi',             enName: 'Finnish',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect x='6' width='4' height='16' fill='#003580'/><rect y='6' width='24' height='4' fill='#003580'/></svg>` },
    'fon':     { name: 'Fɔ̀ngbè',           enName: 'Fon',                    svg: F.GH },
    'fr':      { name: 'Français',          enName: 'French',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#0055A4'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#EF4135'/></svg>` },
    'fr-CA':   { name: 'Français (Canada)', enName: 'French (Canada)',        svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#FF0000'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#FF0000'/><rect x='11' y='4' width='2' height='8' fill='#FF0000'/><rect x='9' y='6' width='6' height='2' fill='#FF0000'/></svg>` },
    'fy':      { name: 'Frysk',             enName: 'Frisian',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#003DA5'/><rect y='4' width='24' height='4' fill='#fff'/><rect y='10' width='24' height='3' fill='#fff'/><circle cx='6' cy='4' r='2' fill='#fff'/><circle cx='6' cy='10' r='2' fill='#fff'/><circle cx='6' cy='16' r='2' fill='#fff'/></svg>` },
    'ff':      { name: 'Fulfulde',          enName: 'Fulfulde',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#3A7728'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#E8112D'/></svg>` },
    'fur':     { name: 'Furlan',            enName: 'Friulian',               svg: F.IT },
    'gaa':     { name: 'Gã',               enName: 'Ga',                     svg: F.GH },
    'cy':      { name: 'Cymraeg',           enName: 'Welsh',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#fff'/><rect y='8' width='24' height='8' fill='#00AB39'/><path d='M8,2 Q10,0 12,2 Q14,4 12,6 Q11,8 10,8 Q9,8 8,6 Q6,4 8,2z' fill='#CF142B'/><path d='M12,6 L14,8 L12,10 L16,8 z' fill='#CF142B'/></svg>` },
    'gl':      { name: 'Galego',            enName: 'Galician',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect y='5' width='24' height='6' fill='#009FE3'/></svg>` },
    'gn':      { name: "Avañe'ẽ",           enName: 'Guarani',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#D52B1E'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#009247'/></svg>` },
    'gu':      { name: 'ગુજરાતી',           enName: 'Gujarati',               svg: F.IN_C },
    'ka':      { name: 'ქართული',          enName: 'Georgian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect x='10' width='4' height='16' fill='#FF0000'/><rect y='6' width='24' height='4' fill='#FF0000'/></svg>` },
    'am':      { name: 'አማርኛ',             enName: 'Amharic',                svg: F.ET },
    'ht':      { name: 'Kreyòl ayisyen',    enName: 'Haitian Creole',         svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#00209F'/><rect y='8' width='24' height='8' fill='#D21034'/></svg>` },
    'cnh':     { name: 'Hakha Chin',        enName: 'Hakha Chin',             svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006B3F'/><rect y='6' width='24' height='4' fill='#FFD100'/></svg>` },
    'ha':      { name: 'Hausa',             enName: 'Hausa',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#008751'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#008751'/></svg>` },
    'haw':     { name: 'ʻŌlelo Hawaiʻi',   enName: 'Hawaiian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect y='0' width='24' height='2' fill='#fff'/><rect y='2' width='24' height='2' fill='#ED2939'/><rect y='4' width='24' height='2' fill='#fff'/><rect y='6' width='24' height='2' fill='#ED2939'/><rect y='8' width='24' height='2' fill='#fff'/><rect y='10' width='24' height='2' fill='#ED2939'/><rect y='12' width='24' height='2' fill='#fff'/><rect y='14' width='24' height='2' fill='#ED2939'/><rect width='10' height='8' fill='#002868'/></svg>` },
    'hr':      { name: 'Hrvatski',          enName: 'Croatian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#FF0000'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#0000CD'/><rect x='9' y='4' width='6' height='8' fill='#fff'/><rect x='9' y='4' width='2' height='2' fill='#FF0000'/><rect x='11' y='4' width='2' height='2' fill='#fff'/><rect x='13' y='4' width='2' height='2' fill='#FF0000'/><rect x='9' y='6' width='2' height='2' fill='#fff'/><rect x='11' y='6' width='2' height='2' fill='#FF0000'/><rect x='13' y='6' width='2' height='2' fill='#fff'/></svg>` },
    'hil':     { name: 'Hiligaynon',        enName: 'Hiligaynon',             svg: F.PH },
    'hi':      { name: 'हिन्दी',             enName: 'Hindi',                  svg: F.IN_C },
    'hmn':     { name: 'Hmoob',             enName: 'Hmong',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#003DA5'/><rect y='6' width='24' height='4' fill='#CE1126'/></svg>` },
    'xh':      { name: 'isiXhosa',          enName: 'Xhosa',                  svg: F.ZA },
    'hrx':     { name: 'Hunsrik',           enName: 'Hunsrik',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#009C3B'/><rect x='8' width='8' height='16' fill='#FEDF00'/><rect x='16' width='8' height='16' fill='#009C3B'/></svg>` },
    'ilo':     { name: 'Ilokano',           enName: 'Iloko',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#0038A8'/><rect y='8' width='24' height='8' fill='#CE1126'/><polygon points='0,0 10,8 0,16' fill='#fff'/><circle cx='3.5' cy='8' r='1.5' fill='#FCD116'/></svg>` },
    'iba':     { name: 'Jaku Iban',         enName: 'Iban',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CC0001'/><rect y='5.33' width='24' height='5.33' fill='#FFD100'/><rect y='10.66' width='24' height='5.34' fill='#000'/></svg>` },
    'ig':      { name: 'Igbo',              enName: 'Igbo',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='12' height='16' fill='#008000'/><rect x='12' width='12' height='16' fill='#fff'/></svg>` },
    'iw':      { name: 'עברית',             enName: 'Hebrew',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect y='2' width='24' height='2.5' fill='#0038B8'/><rect y='11.5' width='24' height='2.5' fill='#0038B8'/><polygon points='12,5 14.5,9.5 9.5,9.5' fill='none' stroke='#0038B8' stroke-width='1'/><polygon points='12,11 9.5,6.5 14.5,6.5' fill='none' stroke='#0038B8' stroke-width='1'/></svg>` },
    'en':      { name: 'English',           enName: 'English',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 19 10'><rect width='19' height='10' fill='#B22234'/><rect y='1.54' width='19' height='1.54' fill='#fff'/><rect y='3.08' width='19' height='1.54' fill='#B22234'/><rect y='4.62' width='19' height='1.54' fill='#fff'/><rect y='6.16' width='19' height='1.54' fill='#B22234'/><rect y='7.70' width='19' height='1.54' fill='#fff'/><rect y='9.24' width='19' height='0.76' fill='#B22234'/><rect width='7.5' height='5.4' fill='#3C3B6E'/></svg>` },
    'iu':      { name: 'ᐃᓄᒃᑎᑐᑦ',          enName: 'Inuktitut (Syllabics)',  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CE1126'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#CE1126'/><circle cx='12' cy='8' r='2.5' fill='#FFD700'/></svg>` },
    'iu-Latn': { name: 'Inuktitut',         enName: 'Inuktitut (Latin)',      svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CE1126'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#CE1126'/><circle cx='12' cy='8' r='2.5' fill='#FFD700'/></svg>` },
    'ga':      { name: 'Gaeilge',           enName: 'Irish',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#169B62'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#FF883E'/></svg>` },
    'gd':      { name: 'Gàidhlig',          enName: 'Scots Gaelic',           svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#003DA5'/><path d='M0,0 L24,16 M24,0 L0,16' stroke='#fff' stroke-width='4'/></svg>` },
    'es':      { name: 'Español',           enName: 'Spanish',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#c60b1e'/><rect y='3.5' width='24' height='9' fill='#ffc400'/></svg>` },
    'sv':      { name: 'Svenska',           enName: 'Swedish',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006AA7'/><rect x='7' width='4' height='16' fill='#FECC02'/><rect y='6' width='24' height='4' fill='#FECC02'/></svg>` },
    'it':      { name: 'Italiano',          enName: 'Italian',                svg: F.IT },
    'is':      { name: 'Íslenska',          enName: 'Icelandic',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#003897'/><rect x='6' width='4' height='16' fill='#fff'/><rect y='6' width='24' height='4' fill='#fff'/><rect x='7' width='2' height='16' fill='#D72828'/><rect y='7' width='24' height='2' fill='#D72828'/></svg>` },
    'jam':     { name: 'Patois',            enName: 'Jamaican Patois',        svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#000'/><polygon points='0,0 24,0 12,8' fill='#FFD700'/><polygon points='0,16 24,16 12,8' fill='#FFD700'/><polygon points='0,0 0,16 12,8' fill='#009B3A'/><polygon points='24,0 24,16 12,8' fill='#009B3A'/></svg>` },
    'ja':      { name: '日本語',             enName: 'Japanese',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><circle cx='12' cy='8' r='5' fill='#BC002D'/></svg>` },
    'kac':     { name: 'Jingpho',           enName: 'Jingpo',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CE1126'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#CE1126'/></svg>` },
    'kl':      { name: 'Kalaallisut',       enName: 'Kalaallisut',            svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='8' fill='#fff'/><rect y='8' width='24' height='8' fill='#CE1126'/><circle cx='12' cy='8' r='5' fill='#CE1126'/><circle cx='12' cy='8' r='5' fill='none' stroke='#fff' stroke-width='1'/><circle cx='12' cy='8' r='4' fill='#fff'/><circle cx='12' cy='8' r='3' fill='#CE1126'/></svg>` },
    'km':      { name: 'ភាសាខ្មែរ',         enName: 'Khmer',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#032EA1'/><rect y='4' width='24' height='8' fill='#E00025'/><rect y='5' width='24' height='6' fill='#fff'/></svg>` },
    'kn':      { name: 'ಕನ್ನಡ',             enName: 'Kannada',                svg: F.IN_C },
    'yue':     { name: '廣東話',             enName: 'Cantonese',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#DE2910'/><circle cx='12' cy='8' r='4.5' fill='#fff'/><circle cx='12' cy='8' r='3.5' fill='#DE2910'/><circle cx='12' cy='4.5' r='1' fill='#fff'/><circle cx='15.2' cy='6.5' r='1' fill='#fff'/><circle cx='14' cy='10.3' r='1' fill='#fff'/><circle cx='10' cy='10.3' r='1' fill='#fff'/><circle cx='8.8' cy='6.5' r='1' fill='#fff'/></svg>` },
    'kr':      { name: 'Kanuri',            enName: 'Kanuri',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#009A44'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#CE1126'/></svg>` },
    'pam':     { name: 'Kapampangan',       enName: 'Kapampangan',            svg: F.PH },
    'ca':      { name: 'Català',            enName: 'Catalan',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#FCDD09'/><rect y='2' width='24' height='2' fill='#DA121A'/><rect y='6' width='24' height='2' fill='#DA121A'/><rect y='10' width='24' height='2' fill='#DA121A'/><rect y='14' width='24' height='2' fill='#DA121A'/></svg>` },
    'kk':      { name: 'Қазақша',           enName: 'Kazakh',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#00AFCA'/><circle cx='8' cy='8' r='3' fill='#FFE000'/><path d='M13,4 Q18,8 13,12' stroke='#FFE000' stroke-width='1.5' fill='none'/></svg>` },
    'kek':     { name: "Q'eqchi'",          enName: 'Kekchi',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#009F4D'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#CE1126'/></svg>` },
    'kha':     { name: 'Khasi',             enName: 'Khasi',                  svg: F.IN },
    'ky':      { name: 'Кыргызча',          enName: 'Kyrgyz',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#E8112D'/><circle cx='12' cy='8' r='5' fill='#FFCB00'/><circle cx='12' cy='8' r='2.5' fill='#E8112D'/></svg>` },
    'crh':     { name: 'Къырымтатар',       enName: 'Crimean Tatar (Cyrillic)',svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#1496D0'/><rect y='10' width='24' height='6' fill='#F7D618'/><circle cx='8' cy='7' r='3' fill='#fff'/><circle cx='9.2' cy='7' r='2.3' fill='#1496D0'/></svg>` },
    'crh-Latn':{ name: 'Qırımtatar',        enName: 'Crimean Tatar (Latin)',  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#1496D0'/><rect y='10' width='24' height='6' fill='#F7D618'/></svg>` },
    'cgg':     { name: 'Rukiga',            enName: 'Kiga',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='4' fill='#000'/><rect y='4' width='24' height='4' fill='#FFD700'/><rect y='8' width='24' height='4' fill='#DE3831'/><rect y='12' width='24' height='4' fill='#006B3F'/></svg>` },
    'ktu':     { name: 'Kituba',            enName: 'Kituba',                 svg: F.CD },
    'trp':     { name: 'Kokborok',          enName: 'Kokborok',               svg: F.IN },
    'kv':      { name: 'Коми',              enName: 'Komi',                   svg: F.RU },
    'kg':      { name: 'Kikongo',           enName: 'Kikongo',                svg: F.CD },
    'gom':     { name: 'कोंकणी',            enName: 'Konkani',                svg: F.IN_C },
    'ko':      { name: '한국어',             enName: 'Korean',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><circle cx='12' cy='8' r='5' fill='#CD2E3A'/><path d='M7,5 Q12,3 17,8 Q12,13 7,11 Q12,9 7,5z' fill='#003478'/></svg>` },
    'co':      { name: 'Corsu',             enName: 'Corsican',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><circle cx='10' cy='8' r='4' fill='#000'/></svg>` },
    'kri':     { name: 'Krio',              enName: 'Krio',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#1EB53A'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#1EB53A'/><rect y='6' width='24' height='4' fill='#003DA5'/><polygon points='0,0 10,8 0,16' fill='#000'/></svg>` },
    'ku':      { name: 'Kurdî',             enName: 'Kurdish (Kurmanji)',     svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#EF3340'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#009A44'/><circle cx='12' cy='8' r='2.5' fill='#F5C816'/></svg>` },
    'ckb':     { name: 'کوردی',             enName: 'Kurdish (Sorani)',       svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#EF3340'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#009A44'/><circle cx='12' cy='8' r='2.5' fill='#F5C816'/></svg>` },
    'lo':      { name: 'ລາວ',              enName: 'Lao',                    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='4' fill='#CE1126'/><rect y='4' width='24' height='8' fill='#002868'/><rect y='12' width='24' height='4' fill='#CE1126'/><circle cx='12' cy='8' r='3' fill='#fff'/></svg>` },
    'ltg':     { name: 'Latgalīšu',         enName: 'Latgalian',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#9E3039'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#9E3039'/></svg>` },
    'la':      { name: 'Latina',            enName: 'Latin',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#9F2B00'/><text x='12' y='11' font-size='7' text-anchor='middle' fill='#FFD700' font-weight='bold'>SPQR</text></svg>` },
    'pl':      { name: 'Polski',            enName: 'Polish',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#fff'/><rect y='8' width='24' height='8' fill='#DC143C'/></svg>` },
    'lv':      { name: 'Latviešu',          enName: 'Latvian',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#9E3039'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#9E3039'/></svg>` },
    'lij':     { name: 'Ligure',            enName: 'Ligurian',               svg: F.IT },
    'li':      { name: 'Limburgs',          enName: 'Limburgan',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#AE1C28'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#21468B'/></svg>` },
    'ln':      { name: 'Lingála',           enName: 'Lingala',                svg: F.CD },
    'lt':      { name: 'Lietuvių',          enName: 'Lithuanian',             svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#FDB913'/><rect y='5.33' width='24' height='5.33' fill='#006A44'/><rect y='10.66' width='24' height='5.34' fill='#C1272D'/></svg>` },
    'lmo':     { name: 'Lombard',           enName: 'Lombard',                svg: F.IT },
    'lg':      { name: 'Luganda',           enName: 'Ganda (Luganda)',        svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#000'/><rect y='5.33' width='24' height='5.33' fill='#FCD116'/><rect y='10.66' width='24' height='5.34' fill='#DE3831'/><circle cx='12' cy='8' r='3' fill='#fff'/></svg>` },
    'luo':     { name: 'Dholuo',            enName: 'Luo',                    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#006600'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#CE1126'/><rect y='3' width='24' height='2.5' fill='#000'/></svg>` },
    'lb':      { name: 'Lëtzebuergesch',    enName: 'Luxembourgish',          svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#EF3340'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#00A3E0'/></svg>` },
    'hu':      { name: 'Magyar',            enName: 'Hungarian',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#CE2939'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#477050'/></svg>` },
    'mad':     { name: 'Madhurâ',           enName: 'Madurese',               svg: F.ID },
    'mai':     { name: 'मैथिली',            enName: 'Maithili',               svg: F.IN_C },
    'mak':     { name: 'Basa Mangkasara',   enName: 'Makassar',               svg: F.ID },
    'mk':      { name: 'Македонски',        enName: 'Macedonian',             svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CE2028'/><circle cx='12' cy='8' r='3' fill='#F7E400'/><line x1='12' y1='0' x2='12' y2='16' stroke='#F7E400' stroke-width='2'/><line x1='0' y1='8' x2='24' y2='8' stroke='#F7E400' stroke-width='2'/><line x1='0' y1='0' x2='24' y2='16' stroke='#F7E400' stroke-width='1.5'/><line x1='24' y1='0' x2='0' y2='16' stroke='#F7E400' stroke-width='1.5'/></svg>` },
    'ml':      { name: 'മലയാളം',           enName: 'Malayalam',              svg: F.IN_C },
    'ms':      { name: 'Bahasa Melayu',     enName: 'Malay',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='2.29' fill='#CC0001'/><rect y='2.29' width='24' height='2.29' fill='#fff'/><rect y='4.57' width='24' height='2.29' fill='#CC0001'/><rect y='6.86' width='24' height='2.29' fill='#fff'/><rect y='9.14' width='24' height='2.29' fill='#CC0001'/><rect y='11.43' width='24' height='2.29' fill='#fff'/><rect y='13.71' width='24' height='2.29' fill='#CC0001'/><rect width='11' height='8' fill='#010066'/><circle cx='4.5' cy='4' r='2.5' fill='#FC0'/><circle cx='5.5' cy='4' r='2' fill='#010066'/></svg>` },
    'ms-Arab': { name: 'بهاس ملايو',        enName: 'Malay (Jawi)',           svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='2.29' fill='#CC0001'/><rect y='2.29' width='24' height='2.29' fill='#fff'/><rect y='4.57' width='24' height='2.29' fill='#CC0001'/><rect y='6.86' width='24' height='2.29' fill='#fff'/><rect y='9.14' width='24' height='2.29' fill='#CC0001'/><rect y='11.43' width='24' height='2.29' fill='#fff'/><rect y='13.71' width='24' height='2.29' fill='#CC0001'/><rect width='11' height='8' fill='#010066'/></svg>` },
    'mg':      { name: 'Malagasy',          enName: 'Malagasy',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='8' height='16' fill='#fff'/><rect x='8' y='0' width='16' height='8' fill='#FC3D32'/><rect x='8' y='8' width='16' height='8' fill='#007E3A'/></svg>` },
    'mt':      { name: 'Malti',             enName: 'Maltese',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='12' height='16' fill='#fff'/><rect x='12' width='12' height='16' fill='#CF142B'/><rect x='1' y='1' width='5' height='5' fill='none' stroke='#AAAAAA' stroke-width='0.5'/></svg>` },
    'mam':     { name: 'Mam',               enName: 'Mam',                    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#009F4D'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#CE1126'/></svg>` },
    'gv':      { name: 'Gaelg',             enName: 'Manx',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CF142B'/><text x='12' y='12' font-size='10' text-anchor='middle' fill='#FFD700'>☸</text></svg>` },
    'mi':      { name: 'Te Reo Māori',      enName: 'Maori',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 60 40'><rect width='60' height='40' fill='#00247D'/><path d='M0,0 L30,20 M30,0 L0,20' stroke='#fff' stroke-width='5'/><path d='M0,0 L30,20 M30,0 L0,20' stroke='#CF142B' stroke-width='3'/><path d='M15,0 V20 M0,10 H30' stroke='#fff' stroke-width='8'/><path d='M15,0 V20 M0,10 H30' stroke='#CF142B' stroke-width='5'/><rect x='30' width='30' height='40' fill='#00247D'/></svg>` },
    'mr':      { name: 'मराठी',             enName: 'Marathi',                svg: F.IN_C },
    'mh':      { name: 'Kajin M̧ajeļ',      enName: 'Marshallese',            svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#003893'/><polygon points='0,16 24,0 24,3 3,16' fill='#fff'/><polygon points='0,13 21,0 24,0 0,16' fill='#fff'/></svg>` },
    'mwr':     { name: 'मारवाड़ी',          enName: 'Marwadi',                svg: F.IN },
    'mni-Mtei':{ name: 'মৈতৈলোন্',         enName: 'Meiteilon (Manipuri)',   svg: F.IN_C },
    'min':     { name: 'Baso Minangkabau',  enName: 'Minang',                 svg: F.ID },
    'lus':     { name: 'Mizo ṭawng',        enName: 'Mizo',                   svg: F.IN },
    'mn':      { name: 'Монгол',            enName: 'Mongolian',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='8' height='16' fill='#C4272F'/><rect x='8' width='8' height='16' fill='#015197'/><rect x='16' width='8' height='16' fill='#C4272F'/></svg>` },
    'mfe':     { name: 'Morisyen',          enName: 'Morisyen',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#EA2839'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#00A551'/></svg>` },
    'nhe':     { name: 'Nahuatl',           enName: 'Nahuatl (Eastern Huasteca)', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#009F4D'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#CE1126'/></svg>` },
    'ndc-ZW':  { name: 'Ndau',              enName: 'Ndau',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='4' fill='#006400'/><rect y='4' width='24' height='3' fill='#FFD200'/><rect y='7' width='24' height='2' fill='#000'/><rect y='9' width='24' height='3' fill='#CE1126'/><rect y='12' width='24' height='4' fill='#000'/><polygon points='0,0 10,8 0,16' fill='#000'/><polygon points='0,1 8,8 0,15' fill='#fff'/><polygon points='1,3.5 6,8 1,12.5' fill='#CE1126'/></svg>` },
    'nr':      { name: 'isiNdebele',        enName: 'Ndebele (South)',        svg: F.ZA },
    'new':     { name: 'नेपाल भाषा',        enName: 'Nepalbhasa (Newari)',    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><polygon points='0,0 14,8 0,16' fill='#003893'/><polygon points='0,0 12,7 0,14' fill='#DC143C'/></svg>` },
    'ne':      { name: 'नेपाली',            enName: 'Nepali',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><polygon points='0,0 14,8 0,16' fill='#003893'/><polygon points='0,0 12,7 0,14' fill='#DC143C'/></svg>` },
    'bm-Nkoo': { name: 'ߒߞߏ',             enName: 'NKo',                    svg: F.ML },
    'no':      { name: 'Norsk',             enName: 'Norwegian',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#EF2B2D'/><rect x='6' width='4' height='16' fill='#fff'/><rect y='6' width='24' height='4' fill='#fff'/><rect x='7' width='2' height='16' fill='#002868'/><rect y='7' width='24' height='2' fill='#002868'/></svg>` },
    'nus':     { name: 'Thok Nath',         enName: 'Nuer',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#078930'/><rect y='6' width='24' height='4' fill='#fff'/><polygon points='0,0 10,8 0,16' fill='#CE1126'/></svg>` },
    'or':      { name: 'ଓଡ଼ିଆ',            enName: 'Odia',                   svg: F.IN_C },
    'oc':      { name: 'Occitan',           enName: 'Occitan',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#FF0000'/><circle cx='12' cy='8' r='5' fill='#FFD700'/></svg>` },
    'om':      { name: 'Oromoo',            enName: 'Oromo',                  svg: F.ET },
    'os':      { name: 'Ирон',              enName: 'Ossetian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#fff'/><rect y='5.33' width='24' height='5.33' fill='#FF0000'/><rect y='10.66' width='24' height='5.34' fill='#FFD700'/></svg>` },
    'chm':     { name: 'Марий йылме',       enName: 'Meadow Mari',            svg: F.RU },
    'uz':      { name: "O'zbek",            enName: 'Uzbek',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#1EB53A'/><rect y='5.33' width='24' height='0.8' fill='#fff'/><rect y='6.13' width='24' height='3.74' fill='#CE1126'/><rect y='9.87' width='24' height='0.8' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#1EB53A'/><circle cx='4' cy='2.5' r='1.5' fill='#fff'/></svg>` },
    'pag':     { name: 'Pangasinan',        enName: 'Pangasinan',             svg: F.PH },
    'pap':     { name: 'Papiamentu',        enName: 'Papiamento',             svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#003DA5'/><polygon points='0,0 24,0 0,16' fill='#FFD100'/><polygon points='0,0 14,0 0,8' fill='#C8102E'/></svg>` },
    'pa':      { name: 'ਪੰਜਾਬੀ',            enName: 'Punjabi',                svg: F.IN_C },
    'pa-Arab': { name: 'پنجابی',            enName: 'Punjabi (Shahmukhi)',    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='6' height='16' fill='#fff'/><rect x='6' width='18' height='16' fill='#01411C'/><circle cx='14' cy='8' r='4' fill='#fff'/><circle cx='15.5' cy='8' r='3.2' fill='#01411C'/></svg>` },
    'ps':      { name: 'پښتو',              enName: 'Pashto',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#000'/><rect y='3' width='24' height='10' fill='#D32011'/><rect y='5' width='24' height='6' fill='#000'/><circle cx='12' cy='8' r='2.5' fill='#fff'/></svg>` },
    'pt':      { name: 'Português (Brasil)',   enName: 'Portuguese (Brazil)',   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006600'/><rect x='9' width='15' height='16' fill='#FF0000'/><circle cx='9' cy='8' r='4' fill='#FFD700' stroke='#000' stroke-width='0.5'/></svg>` },
    'pt-PT':   { name: 'Português (Portugal)', enName: 'Portuguese (Portugal)', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006600'/><rect x='9' width='15' height='16' fill='#FF0000'/><circle cx='9' cy='8' r='4' fill='#FFD700' stroke='#000' stroke-width='0.5'/></svg>` },
    'qu':      { name: 'Runasimi',          enName: 'Quechua',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#D91023'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#D91023'/></svg>` },
    'rom':     { name: 'Romani',            enName: 'Romani',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#197BBD'/><rect y='8' width='24' height='8' fill='#3EB849'/><circle cx='12' cy='8' r='4' fill='#C8102E'/></svg>` },
    'ro':      { name: 'Română',            enName: 'Romanian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#002B7F'/><rect x='8' width='8' height='16' fill='#FCD116'/><rect x='16' width='8' height='16' fill='#CE1126'/></svg>` },
    'rw':      { name: 'Kinyarwanda',       enName: 'Kinyarwanda',            svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#20603D'/><rect y='8' width='24' height='5' fill='#FAD201'/><rect y='13' width='24' height='3' fill='#FAD201'/><circle cx='19' cy='4' r='3' fill='#FAD201'/></svg>` },
    'rn':      { name: 'Kirundi',           enName: 'Rundi',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CE1126'/><rect y='5' width='24' height='6' fill='#1EB53A'/><circle cx='12' cy='8' r='3' fill='#fff'/><rect x='10.5' y='6.5' width='3' height='3' fill='#CE1126' transform='rotate(45 12 8)'/></svg>` },
    'ru':      { name: 'Русский',           enName: 'Russian',                svg: F.RU },
    'ceb':     { name: 'Cebuano',           enName: 'Cebuano',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#0038A8'/><rect y='8' width='24' height='8' fill='#CE1126'/><polygon points='0,0 10,8 0,16' fill='#fff'/><circle cx='3.5' cy='8' r='1.5' fill='#FCD116'/></svg>` },
    'se':      { name: 'Davvisámegiella',   enName: 'Northern Sami',          svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#EF2B2D'/><rect x='6' width='4' height='16' fill='#fff'/><rect y='6' width='24' height='4' fill='#fff'/><rect x='7' width='2' height='16' fill='#002868'/><rect y='7' width='24' height='2' fill='#002868'/></svg>` },
    'sm':      { name: 'Gagana Samoa',      enName: 'Samoan',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 60 40'><rect width='60' height='40' fill='#CE1126'/><rect width='30' height='20' fill='#002B7F'/><circle cx='5' cy='5' r='2' fill='#fff'/><circle cx='15' cy='3' r='2' fill='#fff'/><circle cx='22' cy='10' r='2' fill='#fff'/><circle cx='15' cy='17' r='2' fill='#fff'/><circle cx='8' cy='13' r='2' fill='#fff'/></svg>` },
    'sg':      { name: 'Sängö',             enName: 'Sango',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='4' fill='#003082'/><rect y='4' width='24' height='4' fill='#fff'/><rect y='8' width='24' height='4' fill='#289728'/><rect y='12' width='24' height='4' fill='#FFCB00'/><rect x='10' width='4' height='16' fill='#CE1126'/><polygon points='0,5 4,8 0,11' fill='#FFD100'/></svg>` },
    'sa':      { name: 'संस्कृतम्',         enName: 'Sanskrit',               svg: F.IN_C },
    'sat-Latn':{ name: 'Santali',           enName: 'Santali (Latin)',        svg: F.IN },
    'sat':     { name: 'ᱥᱟᱱᱛᱟᱲᱤ',         enName: 'Santali',                svg: F.IN_C },
    'nso':     { name: 'Sesotho sa Leboa',  enName: 'Northern Sotho',         svg: F.ZA },
    'st':      { name: 'Sesotho',           enName: 'Sesotho',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#009A44'/><rect y='4' width='24' height='8' fill='#fff'/><rect y='6' width='24' height='4' fill='#003580'/><polygon points='0,0 10,8 0,16' fill='#000'/></svg>` },
    'si':      { name: 'සිංහල',            enName: 'Sinhala',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='4' height='16' fill='#FF8000'/><rect x='4' width='4' height='16' fill='#006B3F'/><rect x='8' width='16' height='16' fill='#8D153A'/><polygon points='16,3 18,3 22,8 18,13 16,13 18,8' fill='#FFD100'/></svg>` },
    'crs':     { name: 'Seselwa Kreol',     enName: 'Seychellois Creole',     svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><polygon points='0,16 24,0 24,16' fill='#003F87'/><polygon points='0,16 18,0 24,0' fill='#FCD116'/><polygon points='0,16 12,0 18,0' fill='#D62828'/><polygon points='0,16 6,0 12,0' fill='#fff'/><polygon points='0,16 0,0 6,0' fill='#007A3D'/></svg>` },
    'shn':     { name: 'ဘာသာ​ရှမ်း',       enName: 'Shan',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#FECB00'/><rect y='5.33' width='24' height='5.33' fill='#34B233'/><rect y='10.66' width='24' height='5.34' fill='#EA2839'/></svg>` },
    'sn':      { name: 'chiShona',          enName: 'Shona',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='3.2' fill='#006400'/><rect y='3.2' width='24' height='3.2' fill='#FFD200'/><rect y='6.4' width='24' height='3.2' fill='#D21034'/><rect y='9.6' width='24' height='3.2' fill='#000'/><rect y='12.8' width='24' height='3.2' fill='#006400'/><polygon points='0,0 10,8 0,16' fill='#000'/><polygon points='0,1 8,8 0,15' fill='#fff'/><polygon points='2,4 6,8 2,12' fill='#D21034'/></svg>` },
    'sr':      { name: 'Српски',            enName: 'Serbian',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#C6363C'/><rect y='5.33' width='24' height='5.33' fill='#0C4076'/><rect y='10.66' width='24' height='5.34' fill='#fff'/></svg>` },
    'scn':     { name: 'Sicilianu',         enName: 'Sicilian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#CE2B37'/><rect y='8' width='24' height='8' fill='#FFD700'/></svg>` },
    'szl':     { name: 'Ślōnski',           enName: 'Silesian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#fff'/><rect y='8' width='24' height='8' fill='#FFD700'/></svg>` },
    'sd':      { name: 'سنڌي',              enName: 'Sindhi',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#01411C'/><circle cx='12' cy='8' r='5' fill='#fff'/><circle cx='12' cy='8' r='4' fill='#01411C'/></svg>` },
    'sk':      { name: 'Slovenčina',        enName: 'Slovak',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#fff'/><rect y='5.33' width='24' height='5.33' fill='#0B4EA2'/><rect y='10.66' width='24' height='5.34' fill='#D91023'/><rect width='9' height='10' rx='1' fill='#D91023' x='1' y='3'/><rect x='3.5' y='3' width='2' height='10' fill='#fff'/><rect x='1' y='7' width='9' height='2' fill='#fff'/><circle cx='5.5' cy='5' r='1.5' fill='#003DA5'/></svg>` },
    'sl':      { name: 'Slovenščina',       enName: 'Slovenian',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#fff'/><rect y='5.33' width='24' height='5.33' fill='#003DA5'/><rect y='10.66' width='24' height='5.34' fill='#D91023'/><polygon points='2,2 5,2 5,7 3.5,9 2,7' fill='#003DA5'/><circle cx='3.5' cy='4' r='1' fill='#FFD700'/></svg>` },
    'so':      { name: 'Soomaali',          enName: 'Somali',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#4189DD'/><polygon points='12,4 13.2,7.5 17,7.5 14,9.8 15.1,13.5 12,11.2 8.9,13.5 10,9.8 7,7.5 10.8,7.5' fill='#fff'/></svg>` },
    'su':      { name: 'Basa Sunda',        enName: 'Sundanese',              svg: F.ID },
    'sus':     { name: 'Sosoxui',           enName: 'Susu',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#CE1126'/><rect x='8' width='8' height='16' fill='#FFD100'/><rect x='16' width='8' height='16' fill='#009460'/></svg>` },
    'sw':      { name: 'Kiswahili',         enName: 'Swahili',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='4' fill='#006600'/><rect y='4' width='24' height='4' fill='#FFD700'/><rect y='8' width='24' height='4' fill='#D21034'/><rect y='12' width='24' height='4' fill='#000'/><polygon points='0,0 10,8 0,16' fill='#000'/><polygon points='0,1 8,8 0,15' fill='#fff'/></svg>` },
    'ss':      { name: 'SiSwati',           enName: 'Swati',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#3E5EB9'/><rect y='5.33' width='24' height='5.33' fill='#FFD900'/><rect y='10.66' width='24' height='5.34' fill='#B10C0C'/></svg>` },
    'tg':      { name: 'Тоҷикӣ',           enName: 'Tajik',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#CC0000'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#006600'/><rect y='6.5' width='24' height='3' fill='#fff'/></svg>` },
    'ty':      { name: 'Reo Tahiti',        enName: 'Tahitian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#CE1126'/><rect y='5.33' width='24' height='5.33' fill='#fff'/></svg>` },
    'ta':      { name: 'தமிழ்',             enName: 'Tamil',                  svg: F.IN_C },
    'tt':      { name: 'Татарча',           enName: 'Tatar',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006A4E'/><rect y='0' width='24' height='5' fill='#006A4E'/><rect y='5' width='24' height='6' fill='#fff'/><rect y='11' width='24' height='5' fill='#CE1126'/></svg>` },
    'th':      { name: 'ภาษาไทย',           enName: 'Thai',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#A51931'/><rect y='3' width='24' height='10' fill='#fff'/><rect y='5.5' width='24' height='5' fill='#2D2A4A'/></svg>` },
    'te':      { name: 'తెలుగు',            enName: 'Telugu',                 svg: F.IN_C },
    'tet':     { name: 'Tetun',             enName: 'Tetum',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#DC241F'/><polygon points='0,0 14,8 0,16' fill='#000'/><polygon points='0,1.5 10,8 0,14.5' fill='#fff'/><polygon points='1,4.5 6,8 1,11.5' fill='#FFD700'/></svg>` },
    'bo':      { name: 'བོད་སྐད།',           enName: 'Tibetan',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='8' fill='#FF0000'/><rect y='8' width='24' height='8' fill='#FFD700'/><rect width='24' height='2' fill='#003087'/><rect y='14' width='24' height='2' fill='#003087'/></svg>` },
    'ti':      { name: 'ትግርኛ',              enName: 'Tigrinya',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#4189DD'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#4FBB38'/><polygon points='0,0 10,8 0,16' fill='#FBD116'/></svg>` },
    'tiv':     { name: 'Tiv',               enName: 'Tiv',                    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#008751'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#000'/></svg>` },
    'tpi':     { name: 'Tok Pisin',         enName: 'Tok Pisin',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='12' height='8' fill='#000'/><rect x='12' width='12' height='8' fill='#CE1126'/><rect y='8' width='12' height='8' fill='#CE1126'/><rect x='12' y='8' width='12' height='8' fill='#000'/><polygon points='3,1 3.8,3.5 6.5,3.5 4.3,4.9 5.1,7.5 3,6 0.9,7.5 1.7,4.9 -0.5,3.5 2.2,3.5' fill='#fff' transform='translate(1,0.5) scale(0.8)'/></svg>` },
    'to':      { name: 'Lea fakatonga',     enName: 'Tongan',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#C10000'/><rect width='10' height='8' fill='#fff'/><rect x='3.5' width='3' height='8' fill='#C10000'/><rect y='2.5' width='10' height='3' fill='#C10000'/></svg>` },
    'lua':     { name: 'Tshiluba',          enName: 'Tshiluba',               svg: F.CD },
    'ts':      { name: 'Xitsonga',          enName: 'Tsonga',                 svg: F.ZA },
    'tn':      { name: 'Setswana',          enName: 'Tswana',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#75AADB'/><rect y='5.5' width='24' height='5' fill='#000'/><rect y='6.5' width='24' height='3' fill='#fff'/></svg>` },
    'tcy':     { name: 'ತುಳು',              enName: 'Tulu',                   svg: F.IN },
    'tum':     { name: 'chiTumbuka',        enName: 'Tumbuka',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='4' fill='#000'/><rect y='4' width='24' height='4' fill='#CE1126'/><rect y='8' width='24' height='4' fill='#339E35'/><rect y='12' width='24' height='4' fill='#EF7C00'/></svg>` },
    'tyv':     { name: 'Тыва дыл',         enName: 'Tuvan',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#009A44'/><rect y='5.33' width='24' height='5.33' fill='#FFD100'/><rect y='9' width='24' height='5.34' fill='#fff'/></svg>` },
    'tk':      { name: 'Türkmen',           enName: 'Turkmen',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#509E2F'/><rect x='3' width='5' height='16' fill='#C8102E'/><circle cx='5.5' cy='4' r='1.2' fill='#fff'/><circle cx='5.5' cy='8' r='1.2' fill='#fff'/><circle cx='5.5' cy='12' r='1.2' fill='#fff'/></svg>` },
    'ak':      { name: 'Twi',              enName: 'Twi (Akan)',              svg: F.GH },
    'udm':     { name: 'Удмурт',           enName: 'Udmurt',                  svg: F.RU },
    'uk':      { name: 'Українська',       enName: 'Ukrainian',               svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='8' fill='#005BBB'/><rect y='8' width='24' height='8' fill='#FFD500'/></svg>` },
    'ur':      { name: 'اردو',             enName: 'Urdu',                    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='6' height='16' fill='#fff'/><rect x='6' width='18' height='16' fill='#01411C'/><circle cx='14' cy='8' r='4' fill='#fff'/><circle cx='15.5' cy='8' r='3.2' fill='#01411C'/></svg>` },
    'ug':      { name: 'ئۇيغۇرچە',        enName: 'Uyghur',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#002FA7'/><circle cx='8' cy='8' r='4' fill='#fff'/><circle cx='9.5' cy='8' r='3.2' fill='#002FA7'/><polygon points='13,5.5 14,8 13,10.5 15.5,9 18,10 16.5,7.5 18,5 15.5,6' fill='#fff'/></svg>` },
    'war':     { name: 'Winaray',          enName: 'Waray',                   svg: F.PH },
    've':      { name: 'Tshivenḓa',        enName: 'Venda',                   svg: F.ZA },
    'vec':     { name: 'Vèneto',           enName: 'Venetian',                svg: F.IT },
    'vi':      { name: 'Tiếng Việt',       enName: 'Vietnamese',              svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#DA251D'/><polygon points='12,3 13.5,7.5 18,7.5 14.5,10 15.8,14.5 12,12 8.2,14.5 9.5,10 6,7.5 10.5,7.5' fill='#FFFF00'/></svg>` },
    'wo':      { name: 'Wolof',            enName: 'Wolof',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#00853F'/><rect x='8' width='8' height='16' fill='#FDEF42'/><rect x='16' width='8' height='16' fill='#E31B23'/><circle cx='12' cy='8' r='2' fill='#00853F'/></svg>` },
    'sah':     { name: 'Саха тыла',        enName: 'Yakut',                   svg: F.RU },
    'yi':      { name: 'ייִדיש',            enName: 'Yiddish',                svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#fff'/><rect y='2' width='24' height='2.5' fill='#0038B8'/><rect y='11.5' width='24' height='2.5' fill='#0038B8'/><polygon points='12,5 14.5,9.5 9.5,9.5' fill='none' stroke='#0038B8' stroke-width='1'/><polygon points='12,11 9.5,6.5 14.5,6.5' fill='none' stroke='#0038B8' stroke-width='1'/></svg>` },
    'yo':      { name: 'Yorùbá',           enName: 'Yoruba',                  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect y='0' width='24' height='5.33' fill='#008751'/><rect y='5.33' width='24' height='5.33' fill='#fff'/><rect y='10.66' width='24' height='5.34' fill='#008751'/></svg>` },
    'yua':     { name: "Màaya T'àan",      enName: 'Yucatec Maya',            svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='24' height='16' fill='#006847'/><rect y='6' width='24' height='4' fill='#fff'/><circle cx='12' cy='8' r='2' fill='#CE1126'/></svg>` },
    'el':      { name: 'Ελληνικά',         enName: 'Greek',                   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 27 18'><rect width='27' height='18' fill='#0D5EAF'/><rect y='0' width='27' height='2' fill='#fff'/><rect y='4' width='27' height='2' fill='#fff'/><rect y='8' width='27' height='2' fill='#fff'/><rect y='12' width='27' height='2' fill='#fff'/><rect y='16' width='27' height='2' fill='#fff'/><rect width='11' height='10' fill='#0D5EAF'/><rect x='4' width='3' height='10' fill='#fff'/><rect y='3.5' width='11' height='3' fill='#fff'/></svg>` },
    'zap':     { name: 'Diidxazá',         enName: 'Zapotec',                 svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='14' viewBox='0 0 24 16'><rect width='8' height='16' fill='#009F4D'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#CE1126'/></svg>` },
    'zu':      { name: 'isiZulu',          enName: 'Zulu',                    svg: F.ZA },
        };
        this.flagSvgPool = this.createFlagSvgPool();
        this.initAll();
    }

    createFlagSvgPool() {
        const pool = Object.create(null);
        Object.keys(this.supportedLangs).forEach(langKey => {
            const item = this.supportedLangs[langKey];
            if (!item || typeof item.svg !== 'string') return;
            const svg = item.svg.trim();
            if (!svg) return;
            if (!pool[svg]) pool[svg] = svg;
            item.svg = pool[svg];
        });
        return pool;
    }

    resolveLang(raw) {
        if (!raw) return null;
        if (this.supportedLangs[raw]) return raw;
        const lower = raw.toLowerCase();
        const found = Object.keys(this.supportedLangs).find(k => k.toLowerCase() === lower);
        if (found) return found;
        const base = lower.split('-')[0];
        return Object.keys(this.supportedLangs).find(k => k.toLowerCase() === base) || null;
    }

    resolveTheme(themeRaw) {
        const t = String(themeRaw || 'auto').trim().toLowerCase();
        if (t === 'light' || t === 'dark') return t;
        const html = document.documentElement;
        const attrTheme = String(
            html.getAttribute('theme') || html.getAttribute('data-theme') || html.getAttribute('data-bs-theme') || ''
        ).trim().toLowerCase();
        if (attrTheme === 'light' || attrTheme === 'dark') return attrTheme;
        const htmlClass = String(html.className || '').toLowerCase();
        if (/\bdark\b/.test(htmlClass)) return 'dark';
        if (/\blight\b/.test(htmlClass)) return 'light';
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    }

    initAll() {
        document.querySelectorAll('[data-type="foxLang"]').forEach(el => this.initOne(el));
    }

    initOne(el) {
        let primaryLangs    = (el.getAttribute('data-value') || 'tr,en').split(',').map(l => this.resolveLang(l.trim())).filter(Boolean);
        const options       = (el.getAttribute('data-option') || '').split(',').map(o => o.trim());
        const normalizeParts = (raw, fallback) => (raw || fallback).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
        const selectedParts  = normalizeParts(el.getAttribute('data-selectoption') || el.getAttribute('data-select'), 'flag,name');
        const listParts      = normalizeParts(el.getAttribute('data-listoption') || el.getAttribute('data-select'), 'flag,name,en-name');
        const uniqSelectedParts = Array.from(new Set(selectedParts));
        const compactSelected =
            uniqSelectedParts.length === 2 &&
            uniqSelectedParts.includes('flag') &&
            uniqSelectedParts.includes('iso2');
        const noFlag         = options.includes('no-flags');
        const autoTranslate  = options.includes('yes-auto-translate');
        const firstLangBrowser = options.includes('yes-first-lang-browser');
        const themePref      = (el.getAttribute('data-theme') || 'auto').trim().toLowerCase();
        const prefix         = el.getAttribute('data-class') || 'foxLang';
        const storageKey     = 'foxLangSel_' + prefix;

        const htmlNode = document.documentElement;
        const htmlLangRaw = String((htmlNode && htmlNode.getAttribute('lang')) || '').trim();
        if (!htmlLangRaw && htmlNode && typeof htmlNode.setAttribute === 'function') {
            htmlNode.setAttribute('lang', 'en');
        }
        const htmlLang    = this.resolveLang(htmlLangRaw || 'en') || 'en';

        if (firstLangBrowser) {
            const browserLang = this.resolveLang(navigator.language || 'en');
            if (browserLang && primaryLangs[0] !== browserLang) {
                primaryLangs = primaryLangs.filter(l => l !== browserLang);
                primaryLangs.unshift(browserLang);
            }
        }

        // Resolve initial lang only for the first instance of this prefix
        if (!this.registry[prefix]) {
            const savedLang = localStorage.getItem(storageKey);
            let selectedLang;
            let pendingAutoLang = null;
            const resolvedSaved = savedLang ? this.resolveLang(savedLang) : null;
            if (resolvedSaved) {
                // yes-auto-translate: saved pref exists → show it; FoxdimTranslate.applyStoredLang()
                // handles the actual page translation automatically on load.
                selectedLang = resolvedSaved;
            } else if (firstLangBrowser) {
                // yes-first-lang-browser + no saved pref (first visitor):
                // display doc lang now, then auto-translate to browser lang after 1s and save it.
                selectedLang = primaryLangs.includes(htmlLang) ? htmlLang : primaryLangs[0];
                const browserLang = this.resolveLang(navigator.language || 'en');
                if (browserLang && browserLang !== htmlLang) {
                    pendingAutoLang = browserLang;
                }
            } else {
                selectedLang = primaryLangs.includes(htmlLang) ? htmlLang : primaryLangs[0];
            }
            this.registry[prefix] = {
                selectedLang,
                pendingAutoLang,
                autoTranslateFired: false,
                storageKey,
                renderers: [],
                overlay: null,
                setActive: null,
                openModal: null,
                closeModal: null,
                activeBtn: null
            };
        }
        const shared = this.registry[prefix];
        const selectedLang = shared.selectedLang;

        el.innerHTML = '';

        const styleId = prefix + '-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .${prefix}-select-wrapper { display:inline-block; position:relative; font-family:inherit; }
                .${prefix}-select {
                    --fd-select-border: rgba(255,255,255,0.12);
                    --fd-select-bg: rgba(255,255,255,0.05);
                    --fd-select-text: #e2e8f0;
                    --fd-select-hover-border: rgba(255,255,255,0.28);
                    --fd-select-hover-bg: rgba(255,255,255,0.10);
                    --fd-select-open-border: rgba(139,92,246,0.6);
                    --fd-select-open-bg: rgba(139,92,246,0.08);

                    cursor:pointer; display:flex; align-items:center; gap:7px;
                    border:1px solid var(--fd-select-border); border-radius:8px;
                    padding:5px 10px; background:var(--fd-select-bg);
                    color:var(--fd-select-text); font-size:13px; font-weight:500; user-select:none;
                    transition:border-color .2s, background .2s;
                }
                .${prefix}-select.${prefix}-theme-dark {
                    --fd-select-border: rgba(255,255,255,0.12);
                    --fd-select-bg: rgba(255,255,255,0.05);
                    --fd-select-text: #e2e8f0;
                    --fd-select-hover-border: rgba(255,255,255,0.28);
                    --fd-select-hover-bg: rgba(255,255,255,0.10);
                    --fd-select-open-border: rgba(139,92,246,0.6);
                    --fd-select-open-bg: rgba(139,92,246,0.08);
                }
                .${prefix}-select.${prefix}-theme-light {
                    --fd-select-border: rgba(15,23,42,0.15);
                    --fd-select-bg: rgba(15,23,42,0.03);
                    --fd-select-text: #0f172a;
                    --fd-select-hover-border: rgba(15,23,42,0.25);
                    --fd-select-hover-bg: rgba(15,23,42,0.06);
                    --fd-select-open-border: rgba(124,58,237,0.45);
                    --fd-select-open-bg: rgba(124,58,237,0.08);
                }
                .${prefix}-select:hover { border-color:var(--fd-select-hover-border); background:var(--fd-select-hover-bg); }
                .${prefix}-select.open { border-color:var(--fd-select-open-border); background:var(--fd-select-open-bg); }
                .${prefix}-select.${prefix}-compact { padding:4px 8px; gap:5px; }
                .${prefix}-selected { display:inline-flex; align-items:center; gap:6px; }
                .${prefix}-selected.${prefix}-compact { gap:4px; }
                .${prefix}-flag { line-height:0; display:inline-flex; align-items:center; flex-shrink:0; }
                .${prefix}-flag svg { display:block; }
                .${prefix}-iso2 {
                    display:inline-flex; align-items:center; justify-content:center;
                    min-width:26px; padding:1px 6px; border-radius:999px;
                    font-size:10px; line-height:1.3; letter-spacing:.4px; font-weight:700;
                    color:#c4b5fd; background:rgba(139,92,246,0.16);
                    border:1px solid rgba(139,92,246,0.35);
                    text-transform:uppercase; flex-shrink:0;
                }
                .${prefix}-overlay {
                    --fd-overlay-bg: rgba(0,0,0,0.6);
                    display:none; position:fixed; inset:0; z-index:99998;
                    background:var(--fd-overlay-bg); backdrop-filter:blur(3px);
                    align-items:center; justify-content:center;
                    animation:${prefix}FadeIn .15s ease;
                }
                .${prefix}-overlay.${prefix}-theme-light { --fd-overlay-bg: rgba(15,23,42,0.22); }
                .${prefix}-overlay.${prefix}-theme-dark { --fd-overlay-bg: rgba(0,0,0,0.6); }
                .${prefix}-overlay.active { display:flex; }
                @keyframes ${prefix}FadeIn { from{opacity:0} to{opacity:1} }
                .${prefix}-modal {
                    --fd-modal-bg: #1e1e2e;
                    --fd-modal-border: rgba(255,255,255,0.10);
                    --fd-modal-header-border: rgba(255,255,255,0.07);
                    --fd-modal-title: #e2e8f0;
                    --fd-modal-close: rgba(255,255,255,0.4);
                    --fd-modal-close-hover: #fff;
                    --fd-search-bg: rgba(255,255,255,0.07);
                    --fd-search-border: rgba(255,255,255,0.12);
                    --fd-search-focus: rgba(139,92,246,0.5);
                    --fd-search-text: #e2e8f0;
                    --fd-search-placeholder: rgba(255,255,255,0.28);
                    --fd-sep: rgba(255,255,255,0.07);
                    --fd-option-text: #cbd5e1;
                    --fd-option-hover-bg: rgba(139,92,246,0.15);
                    --fd-option-hover-text: #fff;
                    --fd-option-active-bg: rgba(139,92,246,0.22);
                    --fd-option-active-text: #a78bfa;
                    --fd-no-results: rgba(255,255,255,0.28);
                    --fd-group-label: rgba(255,255,255,0.25);

                    background:var(--fd-modal-bg); border:1px solid var(--fd-modal-border);
                    border-radius:14px; box-shadow:0 24px 60px rgba(0,0,0,0.7);
                    width:520px; max-width:calc(100vw - 32px);
                    max-height:80vh; display:flex; flex-direction:column;
                    overflow:hidden;
                    animation:${prefix}SlideUp .18s ease;
                }
                .${prefix}-modal.${prefix}-theme-light {
                    --fd-modal-bg: #ffffff;
                    --fd-modal-border: rgba(15,23,42,0.10);
                    --fd-modal-header-border: rgba(15,23,42,0.08);
                    --fd-modal-title: #0f172a;
                    --fd-modal-close: rgba(15,23,42,0.45);
                    --fd-modal-close-hover: #0f172a;
                    --fd-search-bg: rgba(15,23,42,0.03);
                    --fd-search-border: rgba(15,23,42,0.12);
                    --fd-search-focus: rgba(124,58,237,0.4);
                    --fd-search-text: #0f172a;
                    --fd-search-placeholder: rgba(15,23,42,0.35);
                    --fd-sep: rgba(15,23,42,0.08);
                    --fd-option-text: #334155;
                    --fd-option-hover-bg: rgba(124,58,237,0.10);
                    --fd-option-hover-text: #111827;
                    --fd-option-active-bg: rgba(124,58,237,0.14);
                    --fd-option-active-text: #6d28d9;
                    --fd-no-results: rgba(15,23,42,0.45);
                    --fd-group-label: rgba(15,23,42,0.45);
                }
                @keyframes ${prefix}SlideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
                .${prefix}-modal-header {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:14px 16px 10px; border-bottom:1px solid var(--fd-modal-header-border);
                    flex-shrink:0;
                }
                .${prefix}-modal-title { font-size:13px; font-weight:600; color:var(--fd-modal-title); letter-spacing:0.3px; }
                .${prefix}-modal-close {
                    cursor:pointer; font-size:18px; line-height:1; color:var(--fd-modal-close);
                    background:none; border:none; padding:0 4px; transition:color .15s;
                }
                .${prefix}-modal-close:hover { color:var(--fd-modal-close-hover); }
                .${prefix}-search-wrap { padding:10px 12px 6px; flex-shrink:0; }
                .${prefix}-search {
                    width:100%; box-sizing:border-box;
                    background:var(--fd-search-bg); border:1px solid var(--fd-search-border);
                    border-radius:8px; color:var(--fd-search-text); font-size:13px; padding:8px 12px;
                    outline:none;
                }
                .${prefix}-search:focus { border-color:var(--fd-search-focus); }
                .${prefix}-search::placeholder { color:var(--fd-search-placeholder); }
                .${prefix}-list {
                    list-style:none; margin:0; padding:4px 0 8px;
                    overflow-y:auto; flex:1; min-height:0;
                    scrollbar-width:thin;
                    scrollbar-color:rgba(139,92,246,0.35) transparent;
                }
                .${prefix}-list::-webkit-scrollbar { width:4px; }
                .${prefix}-list::-webkit-scrollbar-track { background:transparent; }
                .${prefix}-list::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.35); border-radius:99px; }
                .${prefix}-list::-webkit-scrollbar-thumb:hover { background:rgba(139,92,246,0.6); }
                .${prefix}-sep { border:none; border-top:1px solid var(--fd-sep); margin:4px 0; list-style:none; padding:0; }
                .${prefix}-option {
                    display:flex; align-items:center; gap:10px;
                    padding:9px 16px; cursor:pointer; font-size:13px; font-weight:500;
                    color:var(--fd-option-text); transition:background .12s, color .12s;
                }
                .${prefix}-option:hover { background:var(--fd-option-hover-bg); color:var(--fd-option-hover-text); }
                .${prefix}-option.${prefix}Active { background:var(--fd-option-active-bg); color:var(--fd-option-active-text); font-weight:600; }
                .${prefix}-option.${prefix}Active::after { content:'✓'; margin-left:auto; font-size:12px; opacity:0.8; flex-shrink:0; }
                .${prefix}-option-original { font-weight:600; }
                .${prefix}-original-badge {
                    margin-left:8px;
                    padding:1px 6px;
                    border-radius:999px;
                    font-size:10px;
                    font-weight:600;
                    letter-spacing:.2px;
                    opacity:.78;
                    border:1px solid var(--fd-search-border);
                    background:var(--fd-search-bg);
                    color:var(--fd-option-text);
                    line-height:1.5;
                    flex-shrink:0;
                }
                .${prefix}-en-name { font-size:11px; opacity:0.42; margin-left:2px; font-weight:400; }
                .${prefix}-no-results { padding:14px 16px; font-size:12px; color:var(--fd-no-results); list-style:none; }
                .${prefix}-group-label {
                    padding:6px 16px 4px; font-size:10px; font-weight:700; letter-spacing:0.8px;
                    text-transform:uppercase; color:var(--fd-group-label); list-style:none;
                }
                .${prefix}-modal-footer {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:8px 14px; border-top:1px solid var(--fd-modal-header-border);
                    flex-shrink:0; gap:8px;
                }
                .${prefix}-modal-footer-brand {
                    display:flex; align-items:center; gap:5px;
                    font-size:10px; font-weight:600; opacity:0.38; letter-spacing:0.3px;
                    color:var(--fd-modal-title); text-decoration:none; user-select:none;
                }
                .${prefix}-modal-footer-brand img { border-radius:3px; display:block; }
                .${prefix}-modal-footer-sep {
                    width:1px; height:12px; background:var(--fd-modal-header-border); flex-shrink:0;
                }
            `;
            document.head.appendChild(style);
        }

        const wrapper = document.createElement('div');
        wrapper.className = prefix + '-select-wrapper';

        const selectBtn = document.createElement('div');
        selectBtn.className = prefix + '-select';
        if (compactSelected) selectBtn.classList.add(prefix + '-compact');
        const selectedLabel = document.createElement('span');
        selectedLabel.className = prefix + '-selected notranslate';
        if (compactSelected) selectedLabel.classList.add(prefix + '-compact');
        selectedLabel.setAttribute('translate', 'no');

        const getIso2 = (lng) => {
            const parts = String(lng || '').split('-');
            const raw = parts.length > 1 ? parts[parts.length - 1] : parts[0];
            return (raw || '').toUpperCase();
        };

        const renderSelected = (lng) => {
            const info = this.supportedLangs[lng];
            if (!info) { selectedLabel.textContent = lng; return; }
            selectedLabel.innerHTML = '';
            const parts = selectedParts.length ? selectedParts : ['flag', 'name'];
            parts.forEach(part => {
                if (part === 'flag' && !noFlag) {
                    const flag = document.createElement('span');
                    flag.className = prefix + '-flag';
                    flag.innerHTML = info.svg;
                    selectedLabel.appendChild(flag);
                } else if (part === 'iso2') {
                    const iso = document.createElement('span');
                    iso.className = prefix + '-iso2';
                    iso.textContent = getIso2(lng);
                    selectedLabel.appendChild(iso);
                } else if (part === 'name') {
                    const name = document.createElement('span');
                    name.textContent = info.name;
                    selectedLabel.appendChild(name);
                } else if (part === 'en-name' && info.enName && info.enName !== info.name) {
                    const en = document.createElement('span');
                    en.className = prefix + '-en-name';
                    en.textContent = '(' + info.enName + ')';
                    selectedLabel.appendChild(en);
                }
            });
        };
        renderSelected(selectedLang);
        shared.renderers.push(renderSelected);
        selectBtn.appendChild(selectedLabel);

        // Apply theme to selectBtn only (overlay/modal are shared)
        const applyThemeToBtn = (themeName) => {
            selectBtn.classList.remove(prefix + '-theme-dark', prefix + '-theme-light');
            selectBtn.classList.add(prefix + '-theme-' + themeName);
        };
        applyThemeToBtn(this.resolveTheme(themePref));
        if (themePref === 'auto') {
            const refreshBtnTheme = () => applyThemeToBtn(this.resolveTheme('auto'));
            if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver(refreshBtnTheme);
                observer.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['theme', 'data-theme', 'data-bs-theme', 'class']
                });
            }
            if (window.matchMedia) {
                const media = window.matchMedia('(prefers-color-scheme: dark)');
                if (typeof media.addEventListener === 'function') {
                    media.addEventListener('change', refreshBtnTheme);
                } else if (typeof media.addListener === 'function') {
                    media.addListener(refreshBtnTheme);
                }
            }
        }

        // Build shared modal only once per prefix
        if (!shared.overlay) {
        const overlay = document.createElement('div');
        overlay.className = prefix + '-overlay';
        const modal = document.createElement('div');
        modal.className = prefix + '-modal';

        const applyThemeClasses = (themeName) => {
            [overlay, modal].forEach(node => {
                node.classList.remove(prefix + '-theme-dark', prefix + '-theme-light');
                node.classList.add(prefix + '-theme-' + themeName);
            });
        };
        applyThemeClasses(this.resolveTheme(themePref));
        if (themePref === 'auto') {
            const refreshModalTheme = () => applyThemeClasses(this.resolveTheme('auto'));
            if (typeof MutationObserver !== 'undefined') {
                const obs = new MutationObserver(refreshModalTheme);
                obs.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['theme', 'data-theme', 'data-bs-theme', 'class']
                });
            }
            if (window.matchMedia) {
                const media = window.matchMedia('(prefers-color-scheme: dark)');
                if (typeof media.addEventListener === 'function') {
                    media.addEventListener('change', refreshModalTheme);
                } else if (typeof media.addListener === 'function') {
                    media.addListener(refreshModalTheme);
                }
            }
        }

        const modalHeader = document.createElement('div');
        modalHeader.className = prefix + '-modal-header';
        const modalTitle = document.createElement('span');
        modalTitle.className = prefix + '-modal-title';
        modalTitle.textContent = 'Select Language';
        const closeBtn = document.createElement('button');
        closeBtn.className = prefix + '-modal-close';
        closeBtn.innerHTML = '✕';
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeBtn);
        const searchWrap = document.createElement('div');
        searchWrap.className = prefix + '-search-wrap';
        const searchInput = document.createElement('input');
        searchInput.className   = prefix + '-search';
        searchInput.type        = 'text';
        searchInput.placeholder = '🔍 Search language...';
        searchWrap.appendChild(searchInput);
        const list = document.createElement('ul');
        list.className = prefix + '-list';
        modal.appendChild(modalHeader);
        modal.appendChild(searchWrap);
        modal.appendChild(list);

        // Branding footer
        const modalFooter = document.createElement('div');
        modalFooter.className = prefix + '-modal-footer';
        modalFooter.setAttribute('translate', 'no');
        const brandMaker = document.createElement('span');
        brandMaker.className = prefix + '-modal-footer-brand';
        brandMaker.innerHTML = `<img src="https://cdn.foxdim.com/repo/foxdim/files/uploads/logos/foxdim_logo_webp.webp" width="14" height="14" alt="FOXDIM">FOXDIM`;
        const footerSep = document.createElement('span');
        footerSep.className = prefix + '-modal-footer-sep';
        const brandProvider = document.createElement('span');
        brandProvider.className = prefix + '-modal-footer-brand';
        brandProvider.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Google Translate`;
        modalFooter.appendChild(brandProvider);
        modalFooter.appendChild(footerSep);
        modalFooter.appendChild(brandMaker);
        modal.appendChild(modalFooter);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const setActive = (lng) => {
            list.querySelectorAll('.' + prefix + '-option').forEach(li => {
                li.classList.toggle(prefix + 'Active', li.dataset.lang === lng);
            });
        };
        shared.setActive = setActive;

        const closeModal = () => {
            overlay.classList.remove('active');
            if (shared.activeBtn) {
                shared.activeBtn.classList.remove('open');
                shared.activeBtn = null;
            }
        };
        shared.closeModal = closeModal;

        const openModal = (btn) => {
            shared.activeBtn = btn;
            overlay.classList.add('active');
            btn.classList.add('open');
            searchInput.value = '';
            list.querySelectorAll('.' + prefix + '-option').forEach(li => li.style.display = 'flex');
            if (originalLabel) originalLabel.style.display = '';
            if (originalSep) originalSep.style.display = '';
            primaryLabel.style.display = sep.style.display = allLabel.style.display = '';
            noResults.style.display = 'none';
            const active = list.querySelector('.' + prefix + 'Active');
            if (active) setTimeout(() => active.scrollIntoView({ block:'nearest' }), 50);
            setTimeout(() => searchInput.focus(), 50);
        };
        shared.openModal = openModal;
        shared.overlay = overlay;

        const buildOption = (lng, isOriginal = false) => {
            const info = this.supportedLangs[lng];
            if (!info) return null;
            const li = document.createElement('li');
            li.className    = prefix + '-option notranslate';
            li.setAttribute('translate', 'no');
            if (isOriginal) li.classList.add(prefix + '-option-original');
            li.dataset.lang = lng;
            li.dataset.name = (info.name + ' ' + (info.enName || '') + ' ' + getIso2(lng)).toLowerCase();
            const parts = listParts.length ? listParts : ['flag', 'name', 'en-name'];
            let appendedAny = false;
            parts.forEach(part => {
                if (part === 'flag' && !noFlag) {
                    const svg = document.createElement('span');
                    svg.className = prefix + '-flag';
                    svg.innerHTML = info.svg;
                    li.appendChild(svg);
                    appendedAny = true;
                } else if (part === 'iso2') {
                    const isoSpan = document.createElement('span');
                    isoSpan.className = prefix + '-iso2';
                    isoSpan.textContent = getIso2(lng);
                    li.appendChild(isoSpan);
                    appendedAny = true;
                } else if (part === 'name') {
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = info.name;
                    li.appendChild(nameSpan);
                    appendedAny = true;
                } else if (part === 'en-name' && info.enName && info.enName !== info.name) {
                    const enSpan = document.createElement('span');
                    enSpan.className   = prefix + '-en-name';
                    enSpan.textContent = '(' + info.enName + ')';
                    li.appendChild(enSpan);
                    appendedAny = true;
                }
            });
            if (!appendedAny) {
                const nameSpan = document.createElement('span');
                nameSpan.textContent = info.name;
                li.appendChild(nameSpan);
            }
            if (isOriginal) {
                const badge = document.createElement('span');
                badge.className = prefix + '-original-badge';
                badge.textContent = 'Original';
                li.appendChild(badge);
            }
            if (lng === selectedLang) li.classList.add(prefix + 'Active');
            li.onclick = () => {
                shared.selectedLang = lng;
                shared.renderers.forEach(fn => fn(lng));
                shared.setActive(lng);
                shared.closeModal();
                localStorage.setItem(shared.storageKey, lng);
                this.onChange(lng);
            };
            return li;
        };

        const primaryLabel = document.createElement('li');
        primaryLabel.className = prefix + '-group-label';
        primaryLabel.textContent = 'Quick Select';
        const originalLang = htmlLang;
        const hasOriginalLang = !!this.supportedLangs[originalLang];
        let originalLabel = null;
        let originalSep = null;
        if (hasOriginalLang) {
            originalLabel = document.createElement('li');
            originalLabel.className = prefix + '-group-label';
            originalLabel.textContent = 'Original Document Language';
            list.appendChild(originalLabel);

            const originalOption = buildOption(originalLang, true);
            if (originalOption) list.appendChild(originalOption);

            originalSep = document.createElement('li');
            originalSep.className = prefix + '-sep';
            list.appendChild(originalSep);
        }
        list.appendChild(primaryLabel);
        primaryLangs.forEach(lng => {
            if (hasOriginalLang && lng === originalLang) return;
            const li = buildOption(lng);
            if (li) list.appendChild(li);
        });

        const sep = document.createElement('li');
        sep.className = prefix + '-sep';
        list.appendChild(sep);

        const allLabel = document.createElement('li');
        allLabel.className = prefix + '-group-label';
        allLabel.textContent = 'All Languages';
        list.appendChild(allLabel);

        Object.keys(this.supportedLangs).forEach(lng => {
            if (hasOriginalLang && lng === originalLang) return;
            if (primaryLangs.includes(lng)) return;
            const li = buildOption(lng);
            if (!li) return;
            li.dataset.secondary = '1';
            list.appendChild(li);
        });

        const noResults = document.createElement('li');
        noResults.className   = prefix + '-no-results';
        noResults.textContent = 'No results found';
        noResults.style.display = 'none';
        list.appendChild(noResults);

        searchInput.addEventListener('input', () => {
            const q = searchInput.value.trim().toLowerCase();
            let totalVisible = 0;
            list.querySelectorAll('.' + prefix + '-option').forEach(li => {
                const match = !q || li.dataset.name.includes(q);
                li.style.display = match ? 'flex' : 'none';
                if (match) totalVisible++;
            });
            if (originalLabel) originalLabel.style.display = q ? 'none' : '';
            if (originalSep) originalSep.style.display = q ? 'none' : '';
            primaryLabel.style.display = q ? 'none' : '';
            sep.style.display          = q ? 'none' : '';
            allLabel.style.display     = q ? 'none' : '';
            noResults.style.display    = (q && totalVisible === 0) ? 'block' : 'none';
        });
        searchInput.addEventListener('click', e => e.stopPropagation());
        searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') shared.closeModal(); e.stopPropagation(); });

        closeBtn.onclick  = (e) => { e.stopPropagation(); shared.closeModal(); };
        overlay.onclick   = (e) => { if (e.target === overlay) shared.closeModal(); };
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') shared.closeModal(); });

        } // end: shared modal creation

        selectBtn.onclick = (e) => { e.stopPropagation(); shared.openModal(selectBtn); };

        wrapper.appendChild(selectBtn);
        el.appendChild(wrapper);

        // Fire pending auto-translate once (after widget is fully built)
        // 1000ms delay: let the page render in the original language first
        if (shared.pendingAutoLang && !shared.autoTranslateFired) {
            shared.autoTranslateFired = true;
            const target = shared.pendingAutoLang;
            setTimeout(() => {
                shared.selectedLang = target;
                shared.renderers.forEach(fn => fn(target));
                if (shared.setActive) shared.setActive(target);
                localStorage.setItem(shared.storageKey, target);
                this.onChange(target);
            }, 1000);
        }
    }

    onChange(lang) {
        if (window.FoxdimTranslate && typeof window.FoxdimTranslate.setLang === 'function') {
            window.FoxdimTranslate.setLang(lang);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.FoxLangSelect = new FoxLangSelect();
});

// Legacy Google Translate helper functions
var foxdim_started_page_lang="";
var body_style_g_trns="";
var g_script_controller=false;
var current_translated_lang="";
var g_script_loaded=false;
var inter_val_select_cnt=false;

function generate_lang_select_foxdim(elmx=document.body) {
    if(inter_val_select_cnt==false){
        inter_val_select_cnt=true;
        var current_select_lang="";
        var inter_val_select=setInterval(function(){
            try{
                var selectElement=document.getElementsByClassName("goog-te-combo")[0];
                if(selectElement!=null){
                    var foxdim_g_select_elem=document.getElementById("foxdim_g_select");
                    if(foxdim_g_select_elem==null){
                        var selectOptions=selectElement.options;
                        if(selectOptions.length>=1){
                            if(foxdim_started_page_lang!=get_page_browser_lng_foxdim()["page_lang"])
                            {current_page_lang=get_page_browser_lng_foxdim()["page_lang"];}
                            var html_code=`<select id="foxdim_g_select" class="foxdim_g_select" onchange="translate_page_lang_change_foxdim(this.value)">`;
                            html_code+=`<option value='restore'>Varsayılan</option>`;
                            for(var i=0;i<selectOptions.length;i++){
                                if(selectOptions[i].value.length>=1){
                                    html_code+=`<option value='`+selectOptions[i].value+`'>`+selectOptions[i].innerText+`</option>`;
                                }
                            }
                            html_code+=`</select>`;
                            insertHtmlG_translate(elmx,html_code);
                        }
                    } else {
                        if(selectElement.value!=null){
                            if(current_select_lang==""){
                                try{
                                    if(selectElement.value.length>=1){
                                        current_select_lang=selectElement.value;
                                        foxdim_g_select_elem.value=selectElement.value;
                                        clearInterval(inter_val_select);
                                    }
                                }catch(err){}
                            }
                        }
                    }
                }
            }catch(err){};
        }, 100);
    }
}

function foxdim_translate_page_restore() {
    try{var iframe=document.getElementById(':1.container').contentWindow.document.getElementById(":1.restore").click();}catch(err){}
}

function generate_translate_code_foxdim(page_lang="tr") {
    if(foxdim_started_page_lang=="")foxdim_started_page_lang=page_lang;
    if(page_lang==null){page_lang=get_page_browser_lng_foxdim()["page_lang"];}
    body_style_g_trns=document.body.getAttribute('style');
    if(body_style_g_trns==null)body_style_g_trns="";
    if(g_script_controller==false){
        g_script_controller=true;
        g_script_loaded=true;
        var html_code=`<style>.skiptranslate{display: none !important;}</style> <div id="g_translate_element" style="display:none;"></div>`;
        insertHtmlG_translate(document.body,html_code);
        addScriptG_translate(document.body,'//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',null);
        addScriptG_translate(document.body,null,`function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: '`+page_lang+`'}, 'g_translate_element');}`);
        change_page_lang_controller_fnc();
    }
}

function translate_page_lang_change_foxdim(translated_lang="tr") {
    if(translated_lang=="restore"){foxdim_translate_page_restore();return "restore";}
    current_translated_lang=translated_lang;
    generate_translate_code_foxdim();
    try{
        var inter_valx=setInterval(function(){
            var selectElement=document.getElementsByClassName("goog-te-combo")[0];
            if(selectElement!=null){
                var selectOptions=selectElement.options;
                if(selectOptions.length>=1){
                    clearInterval(inter_valx);
                    selectElement.value=translated_lang;
                    var event=new Event('change',{bubbles:true,cancelable:true});
                    selectElement.dispatchEvent(event);
                }
            }
        }, 50);
    }catch(err){}
}

var hide_g_topbar_cnt=false;
function change_page_lang_controller_fnc() {
    if(hide_g_topbar_cnt==false){
        hide_g_topbar_cnt=true;
        var counter_interval=0;
        var inter_val=setInterval(function(){
            var elemxt=document.getElementsByClassName("skiptranslate")[0];
            if(elemxt!=null){
                counter_interval++;
                document.getElementsByClassName("skiptranslate")[0].style.display="none";
                document.body.setAttribute('style',body_style_g_trns);
                if(counter_interval>=20){clearInterval(inter_val);}
            }
        }, 100);
    }
}

function get_page_browser_lng_foxdim() {
    var page_lang=document.documentElement.lang;
    var browser_lang=navigator.language;
    if(browser_lang==null)browser_lang="en";
    if(page_lang==null)page_lang="en";
    page_lang=page_lang.toLowerCase();
    browser_lang=browser_lang.toLowerCase();
    return {"page_lang":page_lang,"browser_lang":browser_lang};
}

function translate_page_lang_change_foxdim_auto() {
    var langs=get_page_browser_lng_foxdim();
    translate_page_lang_change_foxdim(langs["browser_lang"]);
}

function addScriptG_translate(el=document.body,src,code) {
    var s=document.createElement('script');
    s.type="text/javascript";
    if(src!=null)s.setAttribute('src',src);
    if(code!=null){s.innerHTML=code;}
    el.appendChild(s);
}

function insertHtmlG_translate(el=document.body,html) {
    let div=document.createElement('div');
    div.innerHTML=html;
    el.appendChild(div);
    let codes=div.getElementsByTagName("script");
    for(let i=0;i<codes.length;i++){eval(codes[i].innerHTML);}
}

// FoxdimTranslate class
class FoxdimTranslate {
    constructor() {
        this.supportedLangs = {
            tr: { name: 'Türkçe',   svg: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'><rect width='24' height='16' fill='#e30a17'/><circle cx='10' cy='8' r='5' fill='#fff'/><circle cx='11' cy='8' r='4' fill='#e30a17'/><path fill='#fff' d='M13.5 8l-2.5 1.5V6.5z'/></svg>` },
            en: { name: 'English',  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'><rect width='24' height='16' fill='#00247d'/><path fill='#fff' d='M0 0h24v16H0z'/><path fill='#cf142b' d='M0 0h24v16H0z'/><path fill='#fff' d='M0 0l24 16M24 0L0 16'/><path fill='#cf142b' d='M0 0l24 16M24 0L0 16' stroke-width='2'/></svg>` },
            de: { name: 'Deutsch',  svg: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'><rect width='24' height='16' fill='#ffce00'/><rect width='24' height='10.67' y='0' fill='#000'/><rect width='24' height='5.33' y='10.67' fill='#dd0000'/></svg>` },
            fr: { name: 'Français', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'><rect width='8' height='16' fill='#0055a4'/><rect x='8' width='8' height='16' fill='#fff'/><rect x='16' width='8' height='16' fill='#ef4135'/></svg>` }
        };
        this.pageLang   = this.getPageLang();
        this.currentLang = this.pageLang;
        this.bodyStyle  = document.body.getAttribute('style') || "";
        this.scriptLoaded = false;
        this.init();
    }

    updateFlag(lang) {
        const flagSpan = document.getElementById('foxdimLangFlag');
        if (flagSpan && this.supportedLangs[lang]) {
            flagSpan.innerHTML = this.supportedLangs[lang].svg;
        }
    }

    init() {
        this.hideGoogleTopbar();
        this.attachSelectListener();
        this.applyStoredLang();
    }

    applyStoredLang() {
        let storedLang = null;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('foxLangSel_')) { storedLang = localStorage.getItem(key); break; }
        }
        if (!storedLang) return;
        const targetBase = storedLang.split('-')[0];
        const pageBase   = this.pageLang.split('-')[0];
        if (targetBase === pageBase) {
            // Saved lang == doc lang: clear any stale googtrans cookie so GT doesn't auto-apply
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname + ';';
            return;
        }
        const gtCookie = this.getGoogTransCookie();
        if (gtCookie && gtCookie.endsWith('/' + targetBase)) { this.injectGoogleTranslate(this.pageLang); return; }
        this.setLang(storedLang);
    }

    getGoogTransCookie() {
        const match = document.cookie.match(/googtrans=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }

    injectGoogleTranslate(pageLang) {
        if (this.scriptLoaded) return;
        this.scriptLoaded = true;
        let html_code = `<style>.skiptranslate{display: none !important;}</style> <div id="g_translate_element" style="display:none;"></div>`;
        this.insertHtml(document.body, html_code);
        const self = this;
        window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({ pageLanguage: pageLang }, 'g_translate_element');
            if (self._pendingLang) {
                const lang = self._pendingLang;
                self._pendingLang = null;
                setTimeout(() => {
                    const sel = document.getElementsByClassName('goog-te-combo')[0];
                    if (sel) self._applyGT(sel, lang);
                }, 800);
            }
        };
        this.addScript(document.body, '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit', null);
    }

    setLang(lang) {
        this.currentLang = lang;
        this.updateFlag(lang);
        const targetBase = lang.split('-')[0];
        const pageBase   = this.pageLang.split('-')[0];
        if (targetBase === pageBase) { this.restorePage(); return; }
        this.translateTo(lang);
    }

    restorePage() {
        try {
            const iframe = document.getElementById(':1.container');
            if (iframe) { iframe.contentWindow.document.getElementById(':1.restore').click(); return; }
        } catch(e) {}
        try {
            const select = document.getElementsByClassName('goog-te-combo')[0];
            if (select) { select.value = this.pageLang; select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })); }
        } catch(e) {}
        try {
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname + ';';
            location.reload();
        } catch(e) {}
    }

    translateTo(lang) {
        if (this._applyGTTimer) { clearTimeout(this._applyGTTimer); this._applyGTTimer = null; }
        if (!this.scriptLoaded) { this._pendingLang = lang; this.injectGoogleTranslate(this.pageLang); return; }
        let pollAttempts = 0;
        const pollInterval = setInterval(() => {
            pollAttempts++;
            const sel = document.getElementsByClassName('goog-te-combo')[0];
            if (sel) { clearInterval(pollInterval); this._applyGT(sel, lang); }
            else if (pollAttempts > 200) { clearInterval(pollInterval); }
        }, 50);
    }

    _applyGT(sel, gtLang) {
        if (this._applyGTTimer) { clearTimeout(this._applyGTTimer); this._applyGTTimer = null; }
        if (sel.value === gtLang) return;
        sel.value = gtLang;
        sel.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        this._applyGTTimer = setTimeout(() => {
            this._applyGTTimer = null;
            const currentSel = document.getElementsByClassName('goog-te-combo')[0];
            if (!currentSel) return;
            if (currentSel.value !== gtLang) {
                currentSel.value = gtLang;
                currentSel.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            }
        }, 1200);
    }

    hideGoogleTopbar() {
        let self = this;
        let counter = 0;
        let interval = setInterval(function() {
            let elem = document.getElementsByClassName("skiptranslate")[0];
            if (elem) {
                counter++;
                elem.style.display = "none";
                document.body.setAttribute('style', self.bodyStyle);
                if (counter >= 20) clearInterval(interval);
            }
        }, 100);
    }

    getPageLang() {
        let page_lang = "en";
        if (document && document.documentElement && typeof document.documentElement.getAttribute === 'function') {
            page_lang = String(document.documentElement.getAttribute('lang') || '').trim() || "en";
            if (!document.documentElement.getAttribute('lang')) {
                document.documentElement.setAttribute('lang', 'en');
            }
        }
        return page_lang.toLowerCase();
    }

    addScript(el, src, code) {
        let s = document.createElement('script');
        s.type = "text/javascript";
        if (src) s.setAttribute('src', src);
        if (code) s.innerHTML = code;
        el.appendChild(s);
    }

    insertHtml(el, html) {
        let div = document.createElement('div');
        div.innerHTML = html;
        el.appendChild(div);
        let codes = div.getElementsByTagName("script");
        for (let i = 0; i < codes.length; i++) { eval(codes[i].innerHTML); }
    }

    attachSelectListener() {
        const select = document.getElementById('foxdimLangSelect');
        if (select) {
            this.updateFlag(select.value);
            select.addEventListener('change', (e) => { this.setLang(e.target.value); });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.FoxdimTranslate = new FoxdimTranslate();
});
