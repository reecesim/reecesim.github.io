import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as topojson from "topojson-client";

// SouthernUSMap Widget - ES6 Module Version
function SouthernUSMap(containerId, options = {}) {
  this.containerId = containerId;
  this.container = document.getElementById(containerId);
  this.options = Object.assign(
    {
      defaultZoom: 6,
      minZoom: 5,
      maxZoom: 7,
      // Mobile performance options
      updateWhenIdle: false, // Load tiles continuously during panning (better UX, more network requests)
      keepBuffer: 2, // Number of tile rows/columns to keep around the viewport
      updateWhenZooming: true, // Update map during zoom animation
      // Alternative performance mode for slower devices
      performanceMode: false, // When true, uses more conservative settings
    },
    options
  );

  if (!this.container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  // Inject CSS
  this.injectCSS();

  // Initialize map
  this.initMap();

  // Create modal
  this.createModal();

  // Load data
  this.loadMapData();
}

SouthernUSMap.prototype.injectCSS = function () {
  if (document.getElementById("southern-us-map-styles")) return;

  const style = document.createElement("style");
  style.id = "southern-us-map-styles";
  style.textContent = `

      .southern-us-map {
        height: 100%;
        width: 100%;
        font-family: "Gotham", sans-serif;
        font-weight: 400;
        perspective: 1000px;
        transform-style: preserve-3d;
      }
      
      .southern-us-map .leaflet-container svg {
        perspective: 1000px;
        transform-style: preserve-3d;
      }

      .southern-us-map .state-label {
        font-size: 14px;
        font-weight: 700;
        color: #001b31;
        background: transparent;
        text-align: center;
        transition: color 0.3s ease;
        pointer-events: none;
      }

      .southern-us-map .city-label {
        font-size: 11px;
        background: transparent;
        color: #414b54;
        pointer-events: none;
      }

      .southern-us-modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        font-family: "Gotham", sans-serif;
        font-weight: 400;
      }

      .southern-us-modal-content {
        background-color: #fefefe;
        margin: 5% auto;
        padding: 0;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
      }

      @keyframes modalSlideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .southern-us-modal-header {
        background: #00437a;
        color: white;
        padding: 20px;
        border-radius: 10px 10px 0 0;
        text-align: center;
        position: relative;
      }

      .southern-us-modal-header h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }

      .southern-us-modal-close {
        position: absolute;
        right: 20px;
        top: 20px;
        color: white;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        line-height: 1;
      }

      .southern-us-modal-close:hover {
        opacity: 0.7;
      }

      .southern-us-modal-body {
        padding: 30px;
      }

      .southern-us-flag-section {
        text-align: center;
        margin-bottom: 20px;
      }

      .southern-us-state-flag {
        width: 100px;
        height: 67px;
        border: 2px solid #ddd;
        border-radius: 5px;
        object-fit: cover;
      }

      .southern-us-description-section {
        margin-bottom: 20px;
      }

      .southern-us-description-section h3 {
        color: #00437a;
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 700;
        text-transform: none;
      }

      .southern-us-description-section p {
        line-height: 1.6;
        color: #414b54;
        margin: 0;
      }

      .southern-us-music-section {
        margin-bottom: 30px;
      }

      .southern-us-music-section h3 {
        color: #00437a;
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 700;
        text-transform: none;
      }

      .southern-us-artists-section {
        margin-bottom: 25px;
      }

      .southern-us-artists-section h3 {
        color: #00437a;
        margin-bottom: 15px;
        font-size: 18px;
        font-weight: 700;
        text-transform: none;
      }

      .southern-us-artists-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-start;
      }

      .southern-us-artist-pill {
        background: transparent;
        color: #414b54;
        border: 1px solid #00437a;
        padding: 8px 16px;
        border-radius: 100px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        display: inline-block;
      }

      .southern-us-cta-section {
        text-align: center;
      }

      .southern-us-cta-button {
        background: #fbba00;
        color: #00437a;
        border: none;
        padding: 14px 32px;
        font-size: 18px;
        border-radius: 100px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        font-weight: 700;
        text-transform: uppercase;
      }

      .southern-us-cta-button:hover {
        background: #fcc833;
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .southern-us-modal-content {
          margin: 3% auto;
          width: 95%;
          max-width: none;
          max-height: 90vh;
          overflow-y: auto;
        }

        .southern-us-modal-header {
          padding: 15px 20px;
        }

        .southern-us-modal-header h2 {
          font-size: 20px;
        }

        .southern-us-modal-close {
          right: 20px;
          top: 15px;
        }

        .southern-us-modal-body {
          padding: 18px;
        }

        .southern-us-flag-section {
          margin-bottom: 12px;
        }

        .southern-us-state-flag {
          width: 80px;
          height: 53px;
        }

        .southern-us-description-section {
          margin-bottom: 12px;
        }

        .southern-us-description-section h3,
        .southern-us-music-section h3,
        .southern-us-artists-section h3 {
          font-size: 17px;
          margin-bottom: 8px;
        }

        .southern-us-description-section p {
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 0;
        }

        .southern-us-music-section {
          margin-bottom: 18px;
        }

        .southern-us-artists-section {
          margin-bottom: 18px;
        }

        .southern-us-artist-pill {
          padding: 6px 12px;
          font-size: 13px;
        }

        .southern-us-cta-button {
          padding: 14px 28px;
          font-size: 16px;
        }
      }
    `;
  document.head.appendChild(style);
};

SouthernUSMap.prototype.initMap = function () {
  // Set up container - add our class without removing existing ones
  this.container.classList.add("southern-us-map");

  // Create map with performance options
  const mapOptions = {
    minZoom: this.options.minZoom,
    maxZoom: this.options.maxZoom,
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    maxBounds: [
      [28, -95], // SW
      [37, -75], // NE
    ],
    // Performance settings - adjust based on performanceMode
    updateWhenIdle: this.options.performanceMode
      ? true
      : this.options.updateWhenIdle,
    updateWhenZooming: this.options.updateWhenZooming,
  };

  this.map = L.map(this.container, mapOptions).setView(
    [33, -85],
    this.options.defaultZoom
  );

  // Add base map with performance optimizations
  const tileOptions = {
    attribution: "&copy; OpenStreetMap contributors",
    // Performance settings for better mobile experience
    keepBuffer: this.options.keepBuffer,
    updateWhenIdle: this.options.performanceMode
      ? true
      : this.options.updateWhenIdle,
    updateWhenZooming: this.options.updateWhenZooming,
    // Additional tile loading optimizations
    reuseTiles: true,
    unloadInvisibleTiles: !this.options.performanceMode, // Keep tiles in memory for faster panning unless in performance mode
  };

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png",
    tileOptions
  ).addTo(this.map);
};

SouthernUSMap.prototype.createModal = function () {
  // Remove existing modal if it exists
  const existing = document.getElementById("southern-us-state-modal");
  if (existing) {
    existing.remove();
  }

  const modal = document.createElement("div");
  modal.id = "southern-us-state-modal";
  modal.className = "southern-us-modal";
  modal.innerHTML = `
      <div class="southern-us-modal-content">
        <div class="southern-us-modal-header">
          <span class="southern-us-modal-close">&times;</span>
          <h2 id="southern-us-modal-title">State Name</h2>
        </div>
        <div class="southern-us-modal-body">
          <div class="southern-us-flag-section">
            <img id="southern-us-state-flag" class="southern-us-state-flag" src="" alt="State Flag" />
          </div>
          <div class="southern-us-description-section">
            <h3>About</h3>
            <p id="southern-us-state-description"></p>
          </div>
          <div class="southern-us-music-section">
            <h3>Musical Heritage</h3>
            <div id="southern-us-state-artists" class="southern-us-artists-container"></div>
          </div>
          <div class="southern-us-artists-section">
            <h3>Must-Visit Attractions</h3>
            <div id="southern-us-state-attractions" class="southern-us-artists-container"></div>
          </div>
          <div class="southern-us-cta-section">
            <button id="southern-us-cta-button" class="southern-us-cta-button">Plan Your Visit</button>
          </div>
        </div>
      </div>
    `;

  document.body.appendChild(modal);
  this.modal = modal;

  // Set up event listeners
  const closeBtn = modal.querySelector(".southern-us-modal-close");
  const ctaButton = modal.querySelector("#southern-us-cta-button");

  closeBtn.onclick = () => this.closeModal();
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      this.closeModal();
    }
  });

  ctaButton.onclick = () => {
    const stateName = document.getElementById(
      "southern-us-modal-title"
    ).textContent;
    alert(
      `Planning your visit to ${stateName}! This would redirect to a travel planning service.`
    );
  };
};

SouthernUSMap.prototype.openStateModal = function (stateId) {
  const state = this.stateData[stateId];
  if (!state) return;

  // Populate modal content
  document.getElementById("southern-us-modal-title").textContent = state.name;
  document.getElementById("southern-us-state-flag").src = state.flag;
  document.getElementById(
    "southern-us-state-flag"
  ).alt = `Flag of ${state.name}`;
  document.getElementById("southern-us-state-description").textContent =
    state.description;

  // Populate artists pills
  const artistsContainer = document.getElementById("southern-us-state-artists");
  artistsContainer.innerHTML = "";
  state.artists.forEach((artist) => {
    const pill = document.createElement("div");
    pill.className = "southern-us-artist-pill";
    pill.textContent = artist;
    artistsContainer.appendChild(pill);
  });

  // Populate attractions pills
  const attractionsContainer = document.getElementById(
    "southern-us-state-attractions"
  );
  attractionsContainer.innerHTML = "";
  state.attractions.forEach((attraction) => {
    const pill = document.createElement("div");
    pill.className = "southern-us-artist-pill";
    pill.textContent = attraction;
    attractionsContainer.appendChild(pill);
  });

  document.getElementById(
    "southern-us-cta-button"
  ).textContent = `Plan Your Visit to ${state.name}`;

  // Show modal
  this.modal.style.display = "block";
};

SouthernUSMap.prototype.closeModal = function () {
  this.modal.style.display = "none";
};

SouthernUSMap.prototype.loadMapData = function () {
  // State data
  this.stateNames = {
    "01": "Alabama",
    22: "Louisiana",
    28: "Mississippi",
    37: "North Carolina",
    45: "South Carolina",
    47: "Tennessee",
  };

  this.stateData = {
    "01": {
      name: "Alabama",
      flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Alabama.svg",
      description:
        "Known as the Heart of Dixie, Alabama is famous for its rich Civil Rights history, beautiful Gulf Coast beaches, and southern hospitality.",
      artists: ["The Red Clay Strays", "Muscadine Bloodline", "Jason Isbell"],
      attractions: [
        "Gulf State Park",
        "U.S. Space & Rocket Center",
        "Historic Selma",
      ],
    },
    22: {
      name: "Louisiana",
      flag: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_Louisiana.svg",
      description:
        "Louisiana captivates visitors with its unique Creole and Cajun culture, world-renowned cuisine, vibrant festivals, and the historic charm of New Orleans.",
      artists: ["Lucky Daye", "Jon Batiste", "Aaron Neville"],
      attractions: ["French Quarter", "Garden District", "Bourbon Street"],
    },
    28: {
      name: "Mississippi",
      flag: "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mississippi.svg",
      description:
        "Mississippi is the birthplace of blues music, home to literary legends, and offers rich Delta culture along the mighty Mississippi River.",
      artists: ['Christone "Kingfish" Ingram', "Charlie Worsham", "KIRBY"],
      attractions: ["Blues Trail", "Vicksburg Battlefield", "Natchez Trace"],
    },
    37: {
      name: "North Carolina",
      flag: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg",
      description:
        "North Carolina boasts stunning Blue Ridge Mountains, beautiful Outer Banks coastline, vibrant cities, and a perfect blend of mountain and coastal culture.",
      artists: ["Rhiannon Giddens", "Chatham County Line", "MJ Lenderman"],
      attractions: [
        "Blue Ridge Parkway",
        "Outer Banks",
        "Great Smoky Mountains",
      ],
    },
    45: {
      name: "South Carolina",
      flag: "https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_South_Carolina.svg",
      description:
        "South Carolina offers stunning coastal beauty, historic Charleston, beautiful plantations, and a perfect blend of Southern tradition and coastal living.",
      artists: ["Darius Rucker", "Edwin McCain", "Ranky Tanky"],
      attractions: [
        "Historic Charleston",
        "Myrtle Beach",
        "Magnolia Plantation",
      ],
    },
    47: {
      name: "Tennessee",
      flag: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Tennessee.svg",
      description:
        "Tennessee is the heart of country music, home to Nashville and Memphis, offering rich musical heritage, stunning Smoky Mountains, and vibrant cultural attractions.",
      artists: ["Damien Horne", "David Tolliver", "Maura Streppa"],
      attractions: [
        "Nashville Music Row",
        "Graceland",
        "Great Smoky Mountains",
      ],
    },
  };

  // Load TopoJSON and create states
  fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
    .then((res) => res.json())
    .then((topoData) => {
      const geojson = topojson.feature(topoData, topoData.objects.states);

      const stateCentroids = {
        "01": [32.7396, -86.8435], // Alabama
        22: [31.0, -92.0], // Louisiana
        28: [32.6, -89.4], // Mississippi
        37: [35.5, -79.0], // North Carolina
        45: [33.8, -80.9], // South Carolina
        47: [35.8, -86.4], // Tennessee
      };

      // Create custom SVG renderer with padding for better state line visibility
      const svgRenderer = L.svg({ padding: 0.5 });

      L.geoJSON(geojson, {
        filter: (feature) =>
          Object.keys(this.stateNames).includes(feature.id.toString()),
        style: {
          color: "#00437a",
          weight: 1,
          fillOpacity: 0.15,
          fillColor: "#00437a",
        },
        // Performance optimization for vector layers
        renderer: svgRenderer, // Use custom renderer with padding
        pane: "overlayPane", // Use a specific pane for better rendering control
        interactive: true,
        onEachFeature: (feature, layer) => {
          // Add hover effects with lifting animation
          layer.on("mouseover", (e) => {
            const layer = e.target;

            layer.setStyle({
              weight: 4,
              color: "#00437a",
              fillOpacity: 0.25,
              fillColor: "#00437a",
            });
            layer.bringToFront();

            // Add lifting effect - move up and left with shadow
            if (layer._path) {
              // Temporarily disable transitions to reset without animation
              const originalTransition = layer._path.style.transition;
              layer._path.style.transition = "none";

              // Reset to baseline immediately
              layer._path.style.transform = "translate(0px, 0px) scale(1)";
              layer._path.style.filter = "none";

              // Force reflow to ensure reset is applied
              layer._path.offsetHeight;

              // Re-enable transitions and animate to hover state
              layer._path.style.transition = originalTransition;
              layer._path.style.transform =
                "translate(-24px, -16px) scale(1.03)";
              layer._path.style.filter =
                "drop-shadow(6px 8px 16px rgba(0, 67, 122, 0.4))";
            }
          });

          layer.on("mouseout", (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 1,
              color: "#00437a",
              fillOpacity: 0.15,
              fillColor: "#00437a",
            });

            // Reset lifting effect
            if (layer._path) {
              layer._path.style.transform = "translate(0px, 0px) scale(1)";
              layer._path.style.filter = "none";
            }
          });

          // Add click effect
          layer.on("click", (e) => {
            this.openStateModal(feature.id);
          });

          // Add cursor pointer on hover
          layer.on("mouseover", () => {
            this.map.getContainer().style.cursor = "pointer";
          });

          layer.on("mouseout", () => {
            this.map.getContainer().style.cursor = "";
          });
        },
      }).addTo(this.map);

      // Initialize smooth transitions for all states after they're added to the map
      setTimeout(() => {
        this.map.eachLayer((layer) => {
          if (
            layer._path &&
            layer.feature &&
            this.stateNames[layer.feature.id]
          ) {
            // Set consistent, smooth transition for hover effects
            layer._path.style.transition =
              "all 0.35s cubic-bezier(0.35, 0.65, 0.3, 0.9)";
            layer._path.style.transform = "translate(0px, 0px) scale(1)";
            layer._path.style.filter = "none";
          }
        });
      }, 100);

      // Add state labels
      for (const id in stateCentroids) {
        L.marker(stateCentroids[id], {
          icon: L.divIcon({
            className: "southern-us-map state-label",
            html: this.stateNames[id],
            iconSize: [100, 20],
          }),
        }).addTo(this.map);
      }

      // Add manually-specified cities
      const cities = [
        { name: "Birmingham, AL", coords: [33.5186, -86.8104] },
        { name: "New Orleans, LA", coords: [29.9511, -90.0715] },
        { name: "Jackson, MS", coords: [32.2988, -90.1848] },
        { name: "Charlotte, NC", coords: [35.2271, -80.8431] },
        { name: "Charleston, SC", coords: [32.7765, -79.9311] },
        { name: "Nashville, TN", coords: [36.1627, -86.7816] },
      ];

      cities.forEach((city) => {
        L.marker(city.coords, {
          icon: L.divIcon({
            className: "southern-us-map city-label",
            html: city.name,
            iconSize: [100, 20],
          }),
        }).addTo(this.map);
      });
    });
};

// Method to toggle performance mode
SouthernUSMap.prototype.setPerformanceMode = function (enabled) {
  this.options.performanceMode = enabled;

  // Update map options
  const newUpdateWhenIdle = enabled ? true : this.options.updateWhenIdle;

  // Update map settings
  this.map.options.updateWhenIdle = newUpdateWhenIdle;

  // Update tile layer settings if needed
  this.map.eachLayer((layer) => {
    if (layer._url) {
      // This is a tile layer
      layer.options.updateWhenIdle = newUpdateWhenIdle;
      layer.options.unloadInvisibleTiles = !enabled;
    }
  });

  console.log(
    `Performance mode ${enabled ? "enabled" : "disabled"}. ${
      enabled
        ? "More conservative tile loading for slower devices."
        : "Optimized for smooth panning experience."
    }`
  );
};

// Method to get current performance settings
SouthernUSMap.prototype.getPerformanceSettings = function () {
  return {
    performanceMode: this.options.performanceMode,
    updateWhenIdle: this.options.updateWhenIdle,
    keepBuffer: this.options.keepBuffer,
    updateWhenZooming: this.options.updateWhenZooming,
  };
};

SouthernUSMap.prototype.destroy = function () {
  if (this.map) {
    this.map.remove();
  }
  if (this.modal) {
    this.modal.remove();
  }
};

// Export the class as default
export default SouthernUSMap;
