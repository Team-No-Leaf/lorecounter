const CACHE_NAME = "lorcana-scorekeeper-v99";
const ASSETS = [
  "./",
  "./index.html",
  "./styles-v3.css?v=99",
  "./app.js?v=99",
  "./manifest.webmanifest?v=92",
  "../brand/favicon-v2.png",
  "../brand/banner-logo-light-v2.png",
  "../brand/banner-logo-v2.png",
  "./assets/ink/dlc_ink_amber.png",
  "./assets/ink/dlc_ink_amethyst.png",
  "./assets/ink/dlc_ink_emerald.png",
  "./assets/ink/dlc_ink_ruby.png",
  "./assets/ink/dlc_ink_sapphire.png",
  "./assets/ink/dlc_ink_steel.png",
  "./assets/commanders/aladdin-and-genie-mischievous-pals.jpg",
  "./assets/commanders/ariel-spectacular-singer.jpg",
  "./assets/commanders/belle-and-beast-certain-as-the-sun.jpg",
  "./assets/commanders/darkwing-duck-and-launchpad-st-canard-s-finest.jpg",
  "./assets/commanders/donald-duck-fred-honeywell.jpg",
  "./assets/commanders/dumbo-ninth-wonder-of-the-universe.jpg",
  "./assets/commanders/john-silver-greedy-treasure-seeker.jpg",
  "./assets/commanders/mickey-mouse-brave-little-tailor.jpg",
  "./assets/commanders/moana-curious-explorer.jpg",
  "./assets/commanders/mr-incredible-super-strong.jpg",
  "./assets/commanders/mufasa-ruler-of-pride-rock.jpg",
  "./assets/commanders/nick-wilde-wily-fox.jpg",
  "./assets/commanders/peter-pan-and-tinker-bell-fast-friends.jpg",
  "./assets/commanders/pocahontas-peacekeeper.jpg",
  "./assets/commanders/robin-hood-sneaky-sleuth.jpg",
  "./assets/commanders/scar-finally-king.jpg",
  "./assets/commanders/sisu-emboldened-warrior.jpg",
  "./assets/commanders/snow-white-merry-as-the-morning.jpg",
  "./assets/commanders/stitch-rock-star.jpg",
  "./assets/commanders/the-madrigal-family-every-generation.jpg",
  "./assets/commanders/the-vine-towering-stalk.jpg",
  "./assets/commanders/tinker-bell-giant-fairy.jpg",
  "./assets/commanders/ursula-deceiver-of-all.jpg",
  "./assets/commanders/winnie-the-pooh-hunny-wizard.jpg",
  "./assets/commanders/woody-and-buzz-lightyear-best-buddies.jpg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
    )
  );
});
