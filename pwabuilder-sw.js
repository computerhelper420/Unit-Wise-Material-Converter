/* BREB Unit Material Estimator - Service Worker */

"use strict";

const CACHE_PREFIX = "breb-unit-material-estimator";
const CACHE_VERSION = "v1";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/data.js",
  "./js/config.js",
  "./js/state.js",
  "./js/storage.js",
  "./js/cart.js",
  "./js/search.js",
  "./js/manual.js",
  "./js/events.js",
  "./js/controls.js",
  "./js/main.js",
  "./image/icon-192.png",
  "./image/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES.map(file => new Request(new URL(file, self.registration.scope), { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const appUrl = new URL(self.registration.scope);

  if (requestUrl.origin !== appUrl.origin) return;
  if (!requestUrl.pathname.startsWith(appUrl.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(new URL("./index.html", self.registration.scope), responseCopy));
          }
          return response;
        })
        .catch(() => caches.match(new URL("./index.html", self.registration.scope)))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then(response => {
          if (response && response.ok && response.type === "basic") {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseCopy));
          }
          return response;
        });
      })
  );
});
