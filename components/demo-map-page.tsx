"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const MAP_TOKEN = "RankingTopTen123#";
const RADIUS_KM = 0.5;

type RankedPlace = {
  entryId: number;
  rankingRunId: number;
  title: string;
  address: string | null;
  latitude: number;
  longitude: number;
  category: string | null;
  searchPhrase: string;
  position: number;
  rating: number;
  ratingCount: number;
  distanceKm: number;
  rateUrl: string | null;
  justrateJid: string | null;
};

type LeafletModule = typeof import("leaflet");
type LeafletMap = import("leaflet").Map;
type LeafletMarker = import("leaflet").Marker;

export function DemoMapPage() {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [status, setStatus] = useState("Sprawdzam dostęp...");
  const [places, setPlaces] = useState<RankedPlace[]>([]);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token") ?? "";
    const normalizedToken = normalizeToken(urlToken);

    setToken(urlToken);
    setIsAuthorized(normalizedToken === normalizeToken(MAP_TOKEN));
    setStatus(
      normalizedToken === normalizeToken(MAP_TOKEN)
        ? "Pobieram lokalizację..."
        : "Brak dostępu. Podaj poprawny token w adresie URL.",
    );
  }, []);

  useEffect(() => {
    if (!isAuthorized || !mapElementRef.current) {
      return;
    }

    let cancelled = false;

    loadLeaflet()
      .then((Leaflet) => {
        if (cancelled || !mapElementRef.current) {
          return;
        }

        leafletRef.current = Leaflet;
        const map = Leaflet.map(mapElementRef.current).setView([52.4064, 16.9252], 15);
        mapRef.current = map;

        Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);

        if (!navigator.geolocation) {
          setStatus("Ta przeglądarka nie obsługuje geolokalizacji.");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            map.setView([userLat, userLng], 17);
            Leaflet.circle([userLat, userLng], {
              radius: RADIUS_KM * 1000,
              color: "#1A73E8",
              fillColor: "#1A73E8",
              fillOpacity: 0.08,
              weight: 2,
            }).addTo(map);
            Leaflet.marker([userLat, userLng], {
              icon: Leaflet.divIcon({
                className: "demo-map-user-marker",
                html: "<span></span>",
                iconSize: [22, 22],
                iconAnchor: [11, 11],
              }),
              title: "Twoja lokalizacja",
            })
              .addTo(map)
              .bindPopup("Twoja lokalizacja");

            loadNearbyPlaces(userLat, userLng, urlSafeToken(token));
          },
          () => setStatus("Nie udało się pobrać lokalizacji użytkownika."),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000,
          },
        );
      })
      .catch(() => setStatus("Nie udało się załadować mapy."));

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [isAuthorized, token]);

  const visiblePlacesText = useMemo(() => {
    if (!places.length) {
      return "Brak lokali z rankingu w promieniu 0.5 km.";
    }

    return `${places.length} lokali z rankingu w promieniu 0.5 km.`;
  }, [places.length]);

  if (!isAuthorized) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#F8F9FA] p-6 text-[#202124]">
        <div className="max-w-lg rounded-[32px] border border-[#DADCE0] bg-white p-8 text-center shadow-[0_24px_60px_rgba(32,33,36,0.10)]">
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Mapa demo</h1>
          <p className="mt-4 text-[#5F6368]">{status}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-[#F8F9FA] text-[#202124]">
      <div ref={mapElementRef} className="h-full w-full" />
      <div className="pointer-events-none absolute top-4 left-4 z-[400] rounded-full border border-[#DADCE0] bg-white/95 px-4 py-2 shadow-[0_12px_28px_rgba(32,33,36,0.14)] backdrop-blur">
        <p className="text-sm font-semibold text-[#202124]">{visiblePlacesText}</p>
      </div>
      <style jsx global>{`
        .leaflet-popup-pane {
          z-index: 1200;
        }

        .leaflet-tooltip-pane {
          z-index: 1100;
        }

        .demo-map-place-marker {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #1a73e8;
          color: #fff;
          border: 3px solid #fff;
          box-shadow: 0 10px 24px rgba(26, 115, 232, 0.32);
          font-size: 12px;
          font-weight: 700;
        }

        .demo-map-user-marker span {
          display: block;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #34a853;
          border: 4px solid #fff;
          box-shadow: 0 0 0 8px rgba(52, 168, 83, 0.18);
        }

        .demo-map-popup {
          min-width: 220px;
          font-family: var(--font-google-sans);
          color: #202124;
        }

        .demo-map-popup strong {
          display: block;
          margin-bottom: 6px;
          font-size: 15px;
        }

        .demo-map-popup p {
          margin: 4px 0;
          font-size: 12px;
          line-height: 1.45;
        }

        .demo-map-popup-muted {
          color: #5f6368;
        }

        .demo-map-popup button {
          width: 100%;
          margin-top: 10px;
          border: 0;
          border-radius: 999px;
          background: #1a73e8;
          color: #fff;
          padding: 9px 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .demo-map-rate-link {
          display: block;
          margin-top: 8px;
          overflow-wrap: anywhere;
          color: #1a73e8;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }
      `}</style>
    </main>
  );

  function loadNearbyPlaces(lat: number, lng: number, safeToken: string) {
    setStatus("Ładuję lokale z rankingu...");

    fetch(
      `/api/ranked-places-nearby.php?token=${encodeURIComponent(safeToken)}&lat=${lat}&lng=${lng}&radius_km=${RADIUS_KM}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )
      .then(async (response) => {
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message ?? "Nie udało się pobrać lokali.");
        }

        return payload.places as RankedPlace[];
      })
      .then((nearbyPlaces) => {
        setPlaces(nearbyPlaces);
        setStatus("Gotowe.");
        renderMarkers(nearbyPlaces);
      })
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Nie udało się pobrać lokali.");
      });
  }

  function renderMarkers(nextPlaces: RankedPlace[]) {
    const Leaflet = leafletRef.current;
    const map = mapRef.current;

    if (!Leaflet || !map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    nextPlaces.forEach((place) => {
      const marker = Leaflet.marker([place.latitude, place.longitude], {
        icon: Leaflet.divIcon({
          className: "demo-map-place-marker",
          html: `#${place.position}`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        }),
      }).addTo(map);
      marker.bindPopup(popupHtml(place));
      marker.on("popupopen", () => {
        const button = document.querySelector<HTMLButtonElement>(
          `[data-demo-entry-id="${place.entryId}"]`,
        );

        button?.addEventListener("click", () => setActiveDemoPlace(place));
      });
      markersRef.current.push(marker);
    });
  }

  function setActiveDemoPlace(place: RankedPlace) {
    setStatus(`Ustawiam demo: ${place.title}...`);

    fetch("/api/set-active-demo.php", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: urlSafeToken(token),
        entryId: place.entryId,
      }),
    })
      .then(async (response) => {
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message ?? "Nie udało się ustawić demo.");
        }

        const rateUrl = payload?.active?.rateUrl;
        const nextPlaces = places.map((entry) =>
          entry.entryId === place.entryId && typeof rateUrl === "string"
            ? { ...entry, rateUrl }
            : entry,
        );

        setPlaces(nextPlaces);
        renderMarkers(nextPlaces);
        setStatus(`Aktywne demo: ${place.title}`);
      })
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Nie udało się ustawić demo.");
      });
  }
}

function popupHtml(place: RankedPlace) {
  const address = place.address ? `<p class="demo-map-popup-muted">${escapeHtml(place.address)}</p>` : "";
  const category = place.category ? `<p class="demo-map-popup-muted">${escapeHtml(place.category)}</p>` : "";
  const rateLink = place.rateUrl
    ? `<a class="demo-map-rate-link" href="${escapeHtml(place.rateUrl)}" target="_blank" rel="noreferrer">${escapeHtml(place.rateUrl)}</a>`
    : "";

  return `
    <div class="demo-map-popup">
      <strong>${escapeHtml(place.title)}</strong>
      ${address}
      ${category}
      <p>#${place.position} w ${escapeHtml(place.searchPhrase)}</p>
      <p>${place.rating.toFixed(1)} • ${place.ratingCount.toLocaleString("pl-PL")} opinii • ${place.distanceKm.toFixed(2)} km</p>
      <button type="button" data-demo-entry-id="${place.entryId}">Ustaw jako demo</button>
      ${rateLink}
    </div>
  `;
}

function normalizeToken(value: string) {
  return value.trim().replace(/#$/, "");
}

function urlSafeToken(value: string) {
  return normalizeToken(value) || normalizeToken(MAP_TOKEN);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadLeaflet(): Promise<LeafletModule> {
  ensureLeafletStyles();

  return import("leaflet");
}

function ensureLeafletStyles() {
  const href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

  if (document.querySelector(`link[href="${href}"]`)) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
