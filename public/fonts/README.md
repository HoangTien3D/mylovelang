# Custom Local Font Directory (Darumadrop One)

You can place your own custom local font file here!

The application is configured to load the font locally using the following filenames in order of preference:

1. `DarumadropOne-Regular.woff2` (Recommended web format)
2. `DarumadropOne-Regular.ttf`
3. `DarumadropOne.ttf`
4. `darumadrop.ttf`

### How to use:
- Simply copy your custom `.ttf` or `.woff2` font file into this folder (`public/fonts/` or `/fonts/`) and name it one of the filenames above (e.g. `darumadrop.ttf` or `DarumadropOne-Regular.ttf`).
- The CSS `@font-face` rule automatically prioritizes these local files before falling back to web fonts.
- Any changes will immediately apply to all headings, title banners, and UI elements across the app!
