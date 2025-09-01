# Southern US Interactive Map Widget

A beautiful, interactive map widget showcasing the Southern United States with hover effects, state information modals, and musical heritage details. Built with Leaflet.js and bundled as a single JavaScript file.

## 🚀 Quick Start

### For Developers

```bash
# Install dependencies
npm install

# Make changes to the source
# Edit: src/southern-us-map.js

# Build the widget
npx webpack

# Test your changes
# Open: examples/widget-demo.html
```

### For Users

```html
<!-- Single script file - CSS is included! -->
<script src="southern-us-map-bundle.js"></script>

<!-- Create container and initialize -->
<div id="map" style="height: 500px;"></div>
<script>
  const map = new SouthernUSMap("map");
</script>
```

## 📁 Project Structure

```
├── src/
│   └── southern-us-map.js       # ← EDIT THIS FILE
├── build/
│   └── southern-us-map-bundle.js # ← GENERATED BUNDLE
├── examples/
│   ├── widget-demo.html         # ← TEST HERE
│   └── original-demo.html       # Full page version
├── fonts/                       # Gotham font files
├── index.html                   # Original implementation
├── webpack.config.js            # Build configuration
└── package.json                 # Dependencies
```

## 🔧 Development Workflow

1. **Edit**: Modify `src/southern-us-map.js`
2. **Build**: Run `npx webpack`
3. **Test**: Open `examples/widget-demo.html`
4. **Ship**: Deliver `build/southern-us-map-bundle.js`

## 📦 Usage Examples

### Basic Usage

```javascript
const map = new SouthernUSMap("container-id");
```

### With Options

```javascript
const map = new SouthernUSMap("container-id", {
  defaultZoom: 6,
  minZoom: 5,
  maxZoom: 7,
});
```

### Cleanup

```javascript
map.destroy(); // Removes map and modal from DOM
```

## 🎨 Features

- ✅ **Interactive States**: Hover and click effects with 3D animations
- ✅ **Modal Popups**: State information with flags and descriptions
- ✅ **Musical Heritage**: Featured artists for each state (pills)
- ✅ **Tourist Attractions**: Must-visit locations (pills)
- ✅ **Responsive Design**: Adapts to container size
- ✅ **Self-Contained**: Single JS file with CSS bundled
- ✅ **Clean API**: Simple constructor with options

## 🗺️ States Included

- **Alabama** - The Red Clay Strays, Muscadine Bloodline, Jason Isbell
- **Louisiana** - Lucky Daye, Jon Batiste, Aaron Neville
- **Mississippi** - Christone "Kingfish" Ingram, Charlie Worsham, KIRBY
- **North Carolina** - Rhiannon Giddens, Chatham County Line, MJ Lenderman
- **South Carolina** - Darius Rucker, Edwin McCain, Ranky Tanky
- **Tennessee** - Damien Horne, David Tolliver, Maura Streppa

## 🛠️ Technical Details

- **Framework**: Vanilla JavaScript (ES6 modules)
- **Mapping**: Leaflet.js + TopoJSON
- **Fonts**: Gotham (Book/Bold) - included in widget
- **Build**: Webpack + Babel + CSS bundling
- **Size**: ~400KB bundled and minified
- **Browser Support**: Modern browsers (ES6+)

## 🐛 Troubleshooting

### Map looks broken/unstyled

- ✅ CSS is bundled in the JS file, but make sure the bundle built correctly with `npx webpack`

### Container has no height

- ✅ Set explicit height: `<div id="map" style="height: 500px;"></div>`

### Build fails

- ✅ Run `npm install` first
- ✅ Check that `src/southern-us-map.js` has valid ES6 syntax

### Modal doesn't appear

- ✅ Check browser console for JavaScript errors
- ✅ Ensure container ID exists before initializing widget

## 📝 Customization

### Adding States

1. Add state data to `stateData` object in `src/southern-us-map.js`
2. Add state name to `stateNames` object
3. Add state centroid to `stateCentroids` object
4. Rebuild with `npx webpack`

### Styling Changes

1. Modify CSS in `injectCSS()` function in `src/southern-us-map.js`
2. Update font paths if needed
3. Rebuild with `npx webpack`

### Animation Tweaks

1. Find hover effects in `onEachFeature` function
2. Modify `transform`, `filter`, or `transition` properties
3. Rebuild with `npx webpack`

## 🤖 For Future LLM Sessions

- **Source code**: `src/southern-us-map.js` (this is the main file to edit)
- **Build command**: `npx webpack` (run after any changes)
- **Test file**: `examples/widget-demo.html` (open in browser to test)
- **Output**: `build/southern-us-map-bundle.js` (this is what gets delivered)
- **Dependencies**: All dependencies (including CSS) are bundled into the single JS file
- **Key functions**: Look for `SouthernUSMap.prototype` methods for main functionality
