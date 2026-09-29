# ayvi-aero

Portfolio of Viacheslav Zhenikhov, [ayvi-aero.dev](https://ayvi-aero.dev).

A single page made of five full-screen scenes over an animated WebGL
background of glass shards. French by default, with an English toggle.

## Stack

| | |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite |
| Styles | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Background | Hand-written WebGL2, [earcut](https://github.com/mapbox/earcut) for triangulation |
| Lint | oxlint |

There is no router, state library or i18n library. Each of these is a few
dozen lines of our own code, described below.

## Getting started

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev       # dev server on http://localhost:5173
npm run build     # type-check, then build static files into dist/
npm run preview   # serve dist/ locally to check the production build
npm run lint
```

## Project structure

```
public/
  shards.svg             Background artwork (see "Background")
  projects/              Project screenshots
  cv/                    Downloadable CV
src/
  main.tsx               Entry point, mounts <App> inside <LangProvider>
  App.tsx                Wires the route, the input and the scenes together
  index.css              Tailwind import, design tokens, crystal layer styles
  content/
    types.ts             The Content type every language must satisfy
    fr.ts, en.ts         All user-facing text, one file per language
  i18n/                  Language state, persisted in localStorage
  navigation/
    route.ts             Current view <-> URL hash
    useSceneInput.ts     Wheel and keyboard -> scene steps
  scenes/                Hero, About, Path, Projects, Contact + the <Scene> wrapper
  overlays/              Pages opened over the scenes: project detail, legal notice
  components/
    ui.tsx               Panel, Button, Tag, Heading, Label, CrystalList
    Crystal.tsx          The glass look shared by every block and button
    shapes.ts            Crystal outlines (polygons computed from element size)
    glare.ts             The page-wide glare that crosses all crystals
    Chrome.tsx           Fixed controls: language switch, scene dots
    ShardBackground.tsx  React wrapper around the WebGL renderer
  webgl/
    renderer.ts          Render loop, resize, intensity easing
    shaders.ts           GLSL for the glass fill and the glowing edges
    shards.ts            SVG polygons -> vertex buffers
    gl.ts                Small WebGL helpers
```

## How it works

### Views and URLs

Every view has a hash, so it can be linked and the Back button works.

| Hash | View |
|---|---|
| *(none)* | Hero |
| `#about` | About |
| `#path` | Parcours (education and experience) |
| `#projects` | Projects |
| `#contact` | Contact and availability |
| `#project/<id>` | Project detail (`limics`, `d3`, `motus`) |
| `#legal` | Legal notice |

Moving between scenes *replaces* the history entry. Opening an overlay
*pushes* one, so Back closes it. See `navigation/route.ts`.

### Changing scenes

All scenes stay mounted. The inactive ones are faded out and marked
`inert`, so they cannot be focused or read by screen readers.

- **Dots.** A row of diamond buttons (`Chrome.tsx`) jumps to any scene.
  They sit on the right on desktop and at the bottom on phones.
- **Wheel and trackpad** (`useSceneInput.ts`). A scene's content lives in
  an element marked `data-scroll-area`. While it can still scroll in the
  wheel's direction, the wheel scrolls it. Only at its top or bottom does
  the wheel change scene. After a change, wheel events are ignored until
  they pause for 180 ms and 650 ms have passed, so one trackpad flick moves
  one scene.
- **Keyboard.** ↓, PageDown, Space and ↑, PageUp, Shift+Space step. Home
  and End jump to the first and last scene. Escape closes an overlay.
- **Touch.** Swipes are not used for navigation. On phones a swipe only
  scrolls the current scene, and scenes are changed with the dots.

On phones the scroll areas fade out at the top and bottom edges (a CSS mask
in the `scroll-area` utility), so content never slides under the language
switch or the dots.

### Text and languages

Components never contain copy. They read it from `useLang().t`, which is
`content/fr.ts` or `content/en.ts`. Both files are typed as `Content`, so a
field added to `types.ts` without a translation fails the build.

To add a project, add an entry to `projects.items` in **both** language
files, add its id to `ProjectId` in `types.ts` and to `PROJECT_IDS` in
`navigation/route.ts`, and put its screenshot in `public/projects/`.

### Background

`public/shards.svg` contains `<polygon class="shard">` elements. At start-up
`webgl/shards.ts` turns each polygon into two meshes.

- A **fill** mesh, triangulated with earcut and drawn with normal alpha
  blending as tinted translucent glass.
- An **edge** mesh, one thin quad per side, drawn with additive blending as
  a gold glint that travels along the edges.

The artwork is scaled to *cover* the screen at any aspect ratio, and the
edge width is set in pixels in the vertex shader, so nothing is stretched
on phones or ultrawide screens.

`renderer.setIntensity(0..1)` fades the whole effect, and `App.tsx` sets it
per scene (`SCENE_INTENSITY`). With `prefers-reduced-motion` the animation
freezes on one frame. Without WebGL2 the canvas is hidden and the plain
background remains.

To change the composition, edit `shards.svg`. Any tool that exports
polygons works, as long as the polygons keep `class="shard"` and the file
has a `viewBox`.

### Colour and glass

The palette is black (`ink`) and white (`paper`), defined in the `@theme`
block of `index.css`. Colour never appears on text or fills. It only shows
up as light on glass, in the background and in the glare on UI crystals.

Every block, button and tag is a **crystal** (`components/Crystal.tsx`), a
slab of glass lit from the top-left. Its outline comes from
`components/shapes.ts` and is computed from the element's measured size, so
cuts and thickness keep the same size at any width. Narrow panels (phones)
get smaller cuts. Layers, bottom to top:

1. **Shadow** (clear glass). A blurred copy of the slab, cut out under the
   glass so it only shows around it.
2. **Slab**. The thickness, i.e. the outline extruded toward the
   bottom-right (`depth` prop). Only that strip is filled, in the face's
   grey, so the face stays see-through.
3. **Face**. A translucent grey tint (`.crystal-body`) or black glass
   (`.crystal-body-dark`). There is no `backdrop-filter`, because blurring
   the pale shards turns the glass into a flat white block.
4. **Glare** (`components/glare.ts`). One page-wide streak of light, pale
   gold with a short rainbow trail, that crosses the viewport from the
   bottom-right to the top-left every 90 s. Every crystal shows it on its
   thickness strip and on a 3 px ring along its face edges, so it reads as
   a single light passing over all the glass. One `requestAnimationFrame`
   loop moves a shared background gradient in every layer, offset by the
   layer's screen position, and skips layers in hidden scenes. Strength is
   `--glare-edge-opacity` in `index.css`. With `prefers-reduced-motion` the
   streak is drawn once and stays still.
5. **Glint** (buttons). A band of light that crosses the face on hover.
6. **Light**. On clear glass, a wide white stroke along the top and left
   sides only, heavily blurred and faded by a radial gradient from the
   top-left corner (`GLOW_*` constants). No crisp lines, since they read as
   a border. Black glass gets a white highlight, a faint prism fringe and
   hairlines instead.

## Deployment

The build output is static, so the server only needs nginx.

```bash
npm run build
rsync -avz --delete --chmod=D755,F644 dist/ ubuntu@54.37.157.147:/var/www/ayvi-aero/dist/
```

`--chmod` makes every uploaded file readable by nginx (which runs as
`www-data`), whatever the permissions of the local copies. Without it, a
file that is private on the local machine is uploaded private too, and
nginx answers 403 for it.

The nginx config lives in `deploy/nginx-ayvi-aero.conf`. To change it, edit
that file, then:

```bash
scp deploy/nginx-ayvi-aero.conf ubuntu@54.37.157.147:~/
ssh ubuntu@54.37.157.147
sudo cp ~/nginx-ayvi-aero.conf /etc/nginx/sites-available/ayvi-aero
sudo nginx -t && sudo systemctl reload nginx
```
