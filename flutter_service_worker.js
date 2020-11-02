'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "66703a689558cf7f24c834ccf08828f9",
"assets/assets/Category.png": "1a379a498d4f58af3fcea71a3e2bf8bd",
"assets/assets/Category@2x.png": "571fd4243fecfcca5cffc970f61e6e46",
"assets/assets/cutomer.png": "acf2b7314d805ba4e31c9e902e44c2cc",
"assets/assets/cutomer@2x.png": "0e5453e9939f3b48fbfb27be1dd44025",
"assets/assets/Dashboard.png": "95a8ae38e0f5d1ed502ba98fba55f4cb",
"assets/assets/Dashboard@2x.png": "67496fd4f170faaf3e92346fc3cc80ed",
"assets/assets/full%2520screen.png": "5e07e33aaf641a648cf775b405b3aaca",
"assets/assets/full%2520screen@2x.png": "4817a0d1a00eebb1115b3f1a366b7570",
"assets/assets/Group%252010773.png": "0d1ba45e041a04844a2cbacf4ffeb9f8",
"assets/assets/Group%252010773@2x.png": "a3f6e051c4dc68f0a708ee164bc6c8a2",
"assets/assets/Group%252010944.png": "b30fe47497790a51b31f1a67b2d7cf75",
"assets/assets/Group%252010944@2x.png": "a1c319aec591912bfea307b6150fcc25",
"assets/assets/HomelyEat_Logo.png": "2433ce307e5cede8ba5d23008814b63b",
"assets/assets/HomelyEat_Logo@2x.png": "3699d217aaa524099b7e7498bb47f1e7",
"assets/assets/Image%25202.png": "b1d6745c3e96e40dd5ffbce87058782d",
"assets/assets/Image%25202@2x.png": "0255918e0038efeb63ef5a476c60bc67",
"assets/assets/Path%252078.png": "a8c71010fc9175d92e659879a4bf3860",
"assets/assets/Path%252078@2x.png": "1804644d3ddd9e4d19cdf550361b055a",
"assets/assets/save-file-option.png": "1014cd78fcb24d6e27837632e0cbd2ec",
"assets/assets/save-file-option@2x.png": "175cc517405feec6dde1472a2cc6575c",
"assets/assets/Tag.png": "24d386f48881bbc81dde3a451fae140a",
"assets/assets/Tag@2x.png": "8d3c340ebdaf565716742bd6026c96ea",
"assets/assets/Vendor.png": "b2c332fa0899ba0ba57d1a9b66ca6562",
"assets/assets/Vendor@2x.png": "72ada2654b3a23f459e7cea0db18b615",
"assets/assets/writing.png": "9203036ab650ede2d9c870bd39695810",
"assets/assets/writing@2x.png": "edff9875a97eb96e9aec84467aad2381",
"assets/assets/XMLID_1346_.png": "52e47ce37bd95eabdd4f4848f251458d",
"assets/assets/XMLID_1346_@2x.png": "c610fb8ad01ba38767248a768f6c752c",
"assets/assets/XMLID_1419_.png": "ef22150d87380e1eacb9c82df52c3d0f",
"assets/assets/XMLID_1419_@2x.png": "cf29d250aa76afe0caf865c77ecc967e",
"assets/assets/XMLID_94_.png": "09b73735a2e456079a9c8d91eb2a057d",
"assets/assets/XMLID_94_@2x.png": "97877c77016678e91a27b61f88faab9e",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "527440905b5dd4bfe4211a34539e0bc4",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "a5febb6c315f319b6407de1b4d9594b9",
"/": "a5febb6c315f319b6407de1b4d9594b9",
"main.dart.js": "1b76c53a3f5e43c57a7191cc3f81ad5e",
"manifest.json": "93465fa57d4535dc57f667f4eb1b9304",
"version.json": "fe3614bc69b6d5841fdc4da774f9fa71"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
