import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as topojson from "topojson-client";

// Import artist images
// Alabama
import redClayStraysImg from "./assets/images/artists/alabama/the-red-clay-strays.jfif";
import muscadineBloodlineImg from "./assets/images/artists/alabama/muscadine-bloodline.jfif";
import jasonIsbellImg from "./assets/images/artists/alabama/jason-isbell.jfif";

// Louisiana
import luckyDayeImg from "./assets/images/artists/louisiana/lucky-daye.jfif";
import jonBatisteImg from "./assets/images/artists/louisiana/jon-batiste.jfif";
import aaronNevilleImg from "./assets/images/artists/louisiana/aaron-neville.jfif";

// Mississippi
import kingfishIngramImg from "./assets/images/artists/mississippi/christone-kingfish-ingram.jfif";
import charlieWorshamImg from "./assets/images/artists/mississippi/charlie-worsham.jfif";
import kirbyImg from "./assets/images/artists/mississippi/kirby.jfif";
import bigKritImg from "./assets/images/artists/mississippi/big-krit.jfif";

// North Carolina
import rhiannonGiddensImg from "./assets/images/artists/north-carolina/rhiannon-giddens.jfif";
import chathamCountyLineImg from "./assets/images/artists/north-carolina/chatham-county-line.jfif";
import mjLendermanImg from "./assets/images/artists/north-carolina/mj-lenderman.jfif";
import avettBrothersImg from "./assets/images/artists/north-carolina/the-avett-brothers.jfif";

// South Carolina
import dariusRuckerImg from "./assets/images/artists/south-carolina/darius-rucker.jfif";
import edwinMccainImg from "./assets/images/artists/south-carolina/edwin-mccain.jfif";
import rankyTankyImg from "./assets/images/artists/south-carolina/ranky-tanky.jfif";

// Tennessee
import damienHorneImg from "./assets/images/artists/tennessee/damien-horne.jfif";
import davidTolliverImg from "./assets/images/artists/tennessee/david-tolliver.jfif";
import mauraStreppaImg from "./assets/images/artists/tennessee/maura-streppa.jfif";

// SouthernUSMap Widget - ES6 Module Version
function SouthernUSMap(containerId, options = {}) {
  this.containerId = containerId;
  this.container = document.getElementById(containerId);
  // Detect mobile device
  const isMobile =
    window.innerWidth <= 768 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  console.log("Mobile Detection Debug:");
  console.log("- window.innerWidth:", window.innerWidth);
  console.log("- isMobile:", isMobile);
  console.log("- User Agent:", navigator.userAgent);

  // Clean options setup with mobile detection
  this.options = Object.assign(
    {
      defaultZoom: isMobile ? 5 : 6, // Mobile: 5, Desktop: 6
      minZoom: 5,
      maxZoom: 7,
      performanceMode: isMobile, // Enable performance mode on mobile
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

  // Initialize city markers array
  this.cityMarkers = [];

  // Load data
  this.loadMapData();

  // Enable performance mode on mobile devices
  if (isMobile) {
    console.log("Enabling performance mode for mobile device");
    this.setPerformanceMode(true);
  }

  console.log("Final options:", this.options);
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
        font-size: 1rem;
        font-weight: 700;
        color: white;
        background: transparent;
        text-align: center;
        line-height: 1.2;
        transition: color 0.3s ease;
        pointer-events: none;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .southern-us-map .state-label span {
        transition: font-size 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .southern-us-map .city-label {
        font-size: 0.7rem;
        background: rgba(255, 255, 255, 0.9);
        color: #001b31;
        border: 1px solid #00437a;
        border-radius: 12px;
        padding: 3px 8px;
        font-weight: 400;
        line-height: 1.2;
        cursor: pointer;
        transition: all 0.2s ease;
        pointer-events: auto;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        white-space: nowrap;
        display: inline-block;
        text-align: center;
        width: auto !important;
        height: auto !important;
      }

      .southern-us-map .city-label:hover {
        background: #fbba00;
        color: #001b31;
        transform: scale(1.1);
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

      .southern-us-modal.show {
        display: flex;
        align-items: center;
      }

      .southern-us-modal-content {
        background-color: #fefefe;
        margin: 5% auto;
        padding: 0;
        border-radius: 10px;
        width: 90%;
        max-width: 700px;
        max-height: 90svh;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
        display: flex;
        flex-direction: column;
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
        flex-shrink: 0;
      }

      .southern-us-modal-header h2 {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
        line-height: 1.3;
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
        overflow-y: auto;
        flex: 1;
      }

      .southern-us-flag-section {
        text-align: center;
        margin-bottom: 18px;
      }

      .southern-us-state-flag {
        width: 100px;
        height: 67px;
        border: 2px solid #ddd;
        border-radius: 5px;
        object-fit: cover;
      }

      .southern-us-section {
        margin-bottom: 18px;
      }

      .southern-us-section h3 {
        color: #00437a;
        margin-bottom: 12px;
        font-size: 1.2rem;
        font-weight: 700;
        line-height: 1.5;
        text-transform: none;
        margin-block-start: 1em;
        margin-block-end: 1em;
      }
        .southern-us-section h4 {
        color: #00437a;
        margin-bottom: 12px;
        font-size: 1.1rem;
        font-weight: 700;
        line-height: 1.3;
        text-transform: none;
        margin-block-start: 1em;
        margin-block-end: 1em;
      }


      .southern-us-section p {
        font-size: 1rem;
        line-height: 1.6;
        color: #414b54;
        margin: 0;
      }

      .southern-us-artist-pill {
        background: transparent;
        color: #414b54;
        border: 1px solid #00437a;
        padding: 8px;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.4;
        text-align: center;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 5px;
        transition: all 0.2s ease;
      }

      .southern-us-artist-pill img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .southern-us-cta-section {
        text-align: center;
        padding: 20px 0;
      }

      .southern-us-cta-button {
        background: #fbba00;
        color: #001b31;
        border: none;
        padding-top: .875rem;
        padding-bottom: .875rem;
        padding-left: 2rem;
        padding-right: 2rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 100px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        font-weight: 700;
        text-transform: uppercase;
        font-family: "Gotham", sans-serif;
        text-decoration: none;
        display: inline-block;
      }

      .southern-us-cta-button:hover {
        background: #fcc833;
      }

      /* Large desktop optimizations - 1280px and up */
      @media (min-width: 1280px) {
            .southern-us-artist-pill img {
        width: 45px;
        height: 45px;
      }
        .southern-us-section h3 {
          font-size: 1.5rem;
        }

        .southern-us-section h4 {
          font-size: 1.375rem;
        }

        .southern-us-section p {
          font-size: 1.25rem;
        }

        .southern-us-modal-header h2 {
          font-size: 1.875rem;
        }

        .southern-us-map .state-label {
          font-size: 1.25rem;
        }

        .southern-us-map .city-label {
          font-size: 0.875rem;
        }
      }

      /* Mobile and tablet optimizations - below 1280px */
      @media (max-width: 1279px) {
        .southern-us-modal-content {
          margin: 3% auto;
          width: 95%;
          max-width: none;
          max-height: 90vh;
        }

        .southern-us-modal-header {
          padding: 15px 20px;
        }

        .southern-us-modal-header h2 {
          font-size: 1.3rem;
        }

        .southern-us-modal-close {
          right: 20px;
          top: 15px;
        }

        .southern-us-modal-body {
          padding: 18px;
        }

        .southern-us-section {
          margin-bottom: 12px;
        }

        .southern-us-state-flag {
          width: 80px;
          height: 53px;
        }


        .southern-us-artist-pill {
          padding: 6px;
        }

        .southern-us-cta-button {
          padding: 14px 28px;
        }
      }
    `;
  document.head.appendChild(style);
};

SouthernUSMap.prototype.initMap = function () {
  // Set up container - add our class without removing existing ones
  this.container.classList.add("southern-us-map");

  // Create map
  const mapOptions = {
    minZoom: this.options.minZoom,
    maxZoom: this.options.maxZoom,
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: true,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: true,
    maxBounds: [
      [26, -98], // SW - expanded slightly south and west
      [39, -72], // NE - expanded slightly north and east
    ],
  };

  console.log("Initializing map with zoom:", this.options.defaultZoom);
  console.log("Performance mode enabled:", this.options.performanceMode);

  this.map = L.map(this.container, mapOptions).setView(
    [33, -85],
    this.options.defaultZoom
  );

  console.log("Map initialized. Current zoom:", this.map.getZoom());

  // Add zoom level and performance logging on pan/move events
  this.map.on("moveend", () => {
    console.log("Pan/Move Event - Current zoom level:", this.map.getZoom());
    console.log(
      "Pan/Move Event - Performance mode:",
      this.options.performanceMode
    );
  });

  // Add zoom event listener for dynamic state label sizing and city marker visibility
  this.map.on("zoomend", () => {
    this.updateStateLabelSizes();
    this.updateCityMarkerVisibility();
  });

  // Add base map
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap contributors",
    }
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
          <div class="southern-us-flag-section southern-us-section">
            <img id="southern-us-state-flag" class="southern-us-state-flag" src="" alt="State Flag" />
          </div>
          <div class="southern-us-description-section southern-us-section">
            <h3>About</h3>
            <p id="southern-us-state-description"></p>
          </div>
          <div class="southern-us-music-section southern-us-section">
            <h3>Musical Heritage</h3>
            <div id="southern-us-state-artists" class="southern-us-artists-container"></div>
          </div>
          <div class="southern-us-artists-section southern-us-section">
            <h3>Must-Visit Attractions</h3>
            <div id="southern-us-state-attractions" class="southern-us-artists-container"></div>
          </div>
          <div class="southern-us-cta-section">
            <a id="southern-us-cta-button" class="southern-us-cta-button" href="#" target="_blank" rel="nofollow noopener noreferrer">Plan Your Visit</a>
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

  // CTA button href will be updated when modal content is populated
};

SouthernUSMap.prototype.openStateModal = function (stateId) {
  const state = this.stateData[stateId];
  if (!state) return;

  // Show all sections for states
  document.querySelector(".southern-us-flag-section").style.display = "block";
  document.querySelector(".southern-us-music-section").style.display = "block";

  // Populate modal content
  document.getElementById("southern-us-modal-title").textContent = state.name;
  document.getElementById("southern-us-state-flag").src = state.flag;
  document.getElementById(
    "southern-us-state-flag"
  ).alt = `Flag of ${state.name}`;
  document.getElementById("southern-us-state-description").textContent =
    state.description;

  // Populate music section with intro and artists
  const artistsContainer = document.getElementById("southern-us-state-artists");
  artistsContainer.innerHTML = `
    <p class="southern-us-state-description">
      ${
        state.musicIntro ||
        `Discover the rich musical heritage that makes ${state.name} a cornerstone of Southern sound.`
      }
    </p>
    <h4>Sounds of the South Featured Artists</h4>
    <div class="southern-us-artists-pills"></div>
  `;

  const pillsContainer = artistsContainer.querySelector(
    ".southern-us-artists-pills"
  );
  state.artists.forEach((artist) => {
    const pill = document.createElement("div");
    pill.className = "southern-us-artist-pill";

    // Create pill content with optional image
    if (artist.image) {
      pill.innerHTML = `<img src="${artist.image}" alt="${artist.name}" /><span>${artist.name}</span>`;
    } else {
      pill.innerHTML = `<span>${artist.name}</span>`;
    }

    pillsContainer.appendChild(pill);
  });

  // Update attractions section title and make it a paragraph
  document.querySelector(".southern-us-artists-section h3").textContent =
    "Must-Visit Attractions";
  const attractionsContainer = document.getElementById(
    "southern-us-state-attractions"
  );
  attractionsContainer.innerHTML = `<p style="color: #414b54; line-height: 1.6; margin: 0;">${
    state.attractionsText || state.attractions.join(", ")
  }</p>`;

  // Update CTA button text and link
  const ctaButton = document.getElementById("southern-us-cta-button");
  ctaButton.textContent = `Plan Your Visit to ${state.name}`;

  // Create URL-friendly state name and set href
  const urlStateName = state.name.toLowerCase().replace(/\s+/g, "-");
  const haysTravelUrl = `https://www.haystravel.co.uk/destinations/americas/the-south/${urlStateName}`;
  ctaButton.href = haysTravelUrl;

  // Show modal
  this.modal.classList.add("show");
};

SouthernUSMap.prototype.closeModal = function () {
  this.modal.classList.remove("show");
};

SouthernUSMap.prototype.openCityModal = function (city) {
  // Populate modal content for city
  document.getElementById(
    "southern-us-modal-title"
  ).textContent = `${city.name}, ${city.state}`;

  // Hide flag section for cities
  document.querySelector(".southern-us-flag-section").style.display = "none";

  document.getElementById("southern-us-state-description").textContent =
    city.description;

  // Hide music section for cities
  document.querySelector(".southern-us-music-section").style.display = "none";

  // Update attractions section for cities
  document.querySelector(".southern-us-artists-section h3").textContent =
    "Top Places to Visit";
  const attractionsContainer = document.getElementById(
    "southern-us-state-attractions"
  );
  attractionsContainer.innerHTML = `<p style="color: #414b54; line-height: 1.6; margin: 0;">${city.attractions}</p>`;

  // Update CTA button text and link for cities
  const ctaButton = document.getElementById("southern-us-cta-button");
  ctaButton.textContent = `Plan Your Visit to ${city.name}`;

  // Create URL-friendly city name and set href
  const urlCityName = city.name.toLowerCase().replace(/\s+/g, "-");
  const haysTravelUrl = `https://www.haystravel.co.uk/destinations/americas/the-south/${urlCityName}`;
  ctaButton.href = haysTravelUrl;

  // Show modal
  this.modal.classList.add("show");
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
      artists: [
        { name: "The Red Clay Strays", image: redClayStraysImg },
        { name: "Muscadine Bloodline", image: muscadineBloodlineImg },
        { name: "Jason Isbell", image: jasonIsbellImg },
      ],
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
      artists: [
        { name: "Lucky Daye", image: luckyDayeImg },
        { name: "Jon Batiste", image: jonBatisteImg },
        { name: "Aaron Neville", image: aaronNevilleImg },
      ],
      attractions: ["French Quarter", "Garden District", "Bourbon Street"],
    },
    28: {
      name: "Mississippi",
      flag: "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mississippi.svg",
      description:
        "Mississippi is the birthplace of blues music, home to literary legends, and offers rich Delta culture along the mighty Mississippi River.",
      artists: [
        { name: 'Christone "Kingfish" Ingram', image: kingfishIngramImg },
        { name: "Charlie Worsham", image: charlieWorshamImg },
        { name: "KIRBY", image: kirbyImg },
        { name: "Big K.R.I.T.", image: bigKritImg },
      ],
      attractions: ["Blues Trail", "Vicksburg Battlefield", "Natchez Trace"],
    },
    37: {
      name: "North Carolina",
      flag: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg",
      description:
        "North Carolina boasts stunning Blue Ridge Mountains, beautiful Outer Banks coastline, vibrant cities, and a perfect blend of mountain and coastal culture.",
      artists: [
        { name: "Rhiannon Giddens", image: rhiannonGiddensImg },
        { name: "Chatham County Line", image: chathamCountyLineImg },
        { name: "MJ Lenderman", image: mjLendermanImg },
        { name: "The Avett Brothers", image: avettBrothersImg },
      ],
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
      artists: [
        { name: "Darius Rucker", image: dariusRuckerImg },
        { name: "Edwin McCain", image: edwinMccainImg },
        { name: "Ranky Tanky", image: rankyTankyImg },
      ],
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
      artists: [
        { name: "Damien Horne", image: damienHorneImg },
        { name: "David Tolliver", image: davidTolliverImg },
        { name: "Maura Streppa", image: mauraStreppaImg },
      ],
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
          color: "white",
          weight: 1,
          fillOpacity: 1.0,
          fillColor: "#00437a",
        },
        // Performance optimization for vector layers
        renderer: svgRenderer, // Use custom renderer with padding
        pane: "overlayPane", // Use a specific pane for better rendering control
        interactive: true,
        onEachFeature: (feature, layer) => {
          // Add hover effects with yellow background and cursor pointer
          layer.on("mouseover", (e) => {
            const layer = e.target;

            layer.setStyle({
              weight: 2,
              color: "white",
              fillOpacity: 1.0,
              fillColor: "#fbba00",
            });
            layer.bringToFront();
            this.map.getContainer().style.cursor = "pointer";
          });

          layer.on("mouseout", (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 1,
              color: "white",
              fillOpacity: 1.0,
              fillColor: "#00437a",
            });
            this.map.getContainer().style.cursor = "";
          });

          // Add click effect
          layer.on("click", (e) => {
            this.openStateModal(feature.id);
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
              "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          }
        });
      }, 100);

      // Add state labels with correct initial font size
      const initialFontSize = this.calculateFontSize(this.map.getZoom());
      for (const id in stateCentroids) {
        L.marker(stateCentroids[id], {
          icon: L.divIcon({
            className: "southern-us-map state-label",
            html: `<span style="font-size: ${initialFontSize}rem">${this.stateNames[id]}</span>`,
            iconSize: [100, 20],
          }),
        }).addTo(this.map);
      }

      console.log(
        `Initial state labels created with font size: ${initialFontSize}rem`
      );

      // Add Hays Travel featured cities with data
      const cities = [
        {
          name: "Raleigh",
          state: "North Carolina",
          coords: [35.7796, -78.6382],
          description:
            "North Carolina's capital city, known for its vibrant cultural scene, excellent museums, and beautiful parks.",
          attractions:
            "Visit the North Carolina Museum of Art, explore the historic State Capitol, and enjoy the scenic Umstead State Park.",
        },
        {
          name: "Tupelo",
          state: "Mississippi",
          coords: [34.2576, -88.7034],
          description:
            "The birthplace of Elvis Presley, offering rich musical heritage and charming Southern hospitality.",
          attractions:
            "Tour Elvis Presley's birthplace, visit the Tupelo Automobile Museum, and explore the beautiful Natchez Trace Parkway.",
        },
        {
          name: "Huntsville",
          state: "Alabama",
          coords: [34.7304, -86.5861],
          description:
            "Rocket City - home to NASA's Marshall Space Flight Center and rich aerospace heritage.",
          attractions:
            "Explore the U.S. Space & Rocket Center, visit the Huntsville Botanical Garden, and discover the historic Twickenham District.",
        },
        {
          name: "Mobile",
          state: "Alabama",
          coords: [30.6954, -88.0399],
          description:
            "Alabama's oldest city, famous for its antebellum architecture, historic districts, and Gulf Coast charm.",
          attractions:
            "Stroll through the Historic Downtown District, visit Fort Morgan, and enjoy the beautiful Mobile Bay waterfront.",
        },
        {
          name: "Sevierville",
          state: "Tennessee",
          coords: [35.8681, -83.5619],
          description:
            "Gateway to the Great Smoky Mountains, offering outdoor adventures and mountain charm.",
          attractions:
            "Experience Dollywood theme park, explore the Great Smoky Mountains National Park, and enjoy scenic mountain views along the Parkway.",
        },
      ];

      cities.forEach((city) => {
        // Add white dot marker
        const dotMarker = L.circleMarker(city.coords, {
          radius: 3,
          fillColor: "white",
          color: "#00437a",
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
        });

        // Add label marker at coordinates
        const labelMarker = L.marker(city.coords, {
          icon: L.divIcon({
            className: "southern-us-map city-label",
            html: city.name,
            iconSize: [null, null], // Let it size dynamically
            iconAnchor: [null, null], // No offset - center at coordinates
          }),
        });

        // Add click events to both markers
        dotMarker.on("click", () => {
          this.openCityModal(city);
        });

        labelMarker.on("click", () => {
          this.openCityModal(city);
        });

        // Store markers for visibility control
        this.cityMarkers.push({
          dot: dotMarker,
          label: labelMarker,
          city: city,
        });
      });

      // Set initial city marker visibility based on zoom level
      this.updateCityMarkerVisibility();
    });
};

// Method to update city marker visibility based on zoom level
SouthernUSMap.prototype.updateCityMarkerVisibility = function () {
  const currentZoom = this.map.getZoom();
  const shouldShowCities = currentZoom >= 6;

  this.cityMarkers.forEach((markerGroup) => {
    if (shouldShowCities) {
      // Add markers to map if not already added
      if (!this.map.hasLayer(markerGroup.dot)) {
        markerGroup.dot.addTo(this.map);
      }
      if (!this.map.hasLayer(markerGroup.label)) {
        markerGroup.label.addTo(this.map);
      }
    } else {
      // Remove markers from map
      if (this.map.hasLayer(markerGroup.dot)) {
        this.map.removeLayer(markerGroup.dot);
      }
      if (this.map.hasLayer(markerGroup.label)) {
        this.map.removeLayer(markerGroup.label);
      }
    }
  });

  console.log(
    `City markers ${
      shouldShowCities ? "shown" : "hidden"
    } at zoom level ${currentZoom}`
  );
};

// Helper method to calculate font size based on zoom level
SouthernUSMap.prototype.calculateFontSize = function (zoomLevel) {
  // Detect large desktop for different scaling
  const isLargeDesktop = window.innerWidth >= 1280;

  if (isLargeDesktop) {
    // Large Desktop (1280px+): Zoom 4-5: 0.875rem, Zoom 6: 1.25rem, Zoom 7-8: 1.5rem
    if (zoomLevel <= 5) {
      return 0.8; // Smaller for zoomed out view
    } else if (zoomLevel <= 6) {
      return 1.1; // Default size
    } else {
      return 1.5; // Larger for zoomed in view
    }
  } else {
    // Mobile/Tablet (below 1280px): Zoom 4-5: 0.7rem, Zoom 6: 1rem, Zoom 7-8: 1.2rem
    if (zoomLevel <= 5) {
      return 0.7; // Smaller for zoomed out view
    } else if (zoomLevel <= 6) {
      return 1.0; // Default size
    } else {
      return 1.2; // Larger for zoomed in view
    }
  }
};

// Method to update state label sizes based on zoom level
SouthernUSMap.prototype.updateStateLabelSizes = function () {
  const currentZoom = this.map.getZoom();
  const fontSize = this.calculateFontSize(currentZoom);

  // Update all state label spans
  const stateLabelSpans = document.querySelectorAll(
    ".southern-us-map .state-label span"
  );
  stateLabelSpans.forEach((span) => {
    span.style.fontSize = fontSize + "rem";
  });

  console.log(
    `Updated state label font size to ${fontSize}rem for zoom level ${currentZoom}`
  );
};

// Method to toggle performance mode
SouthernUSMap.prototype.setPerformanceMode = function (enabled) {
  console.log("setPerformanceMode called with:", enabled);
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
