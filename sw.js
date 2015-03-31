'use strict';

importScripts('caches.js');

self.addEventListener('install', function (event) {

    console.log('SW installed');

    event.waitUntil(
        caches.open('test').then(function (cache) {

            var realResourcesPromise = cache.addAll([
                '/sw-save-as-bug/',
                '/sw-save-as-bug/index.html',
                '/sw-save-as-bug/index.css',
                '/sw-save-as-bug/index.js',
                '/sw-save-as-bug/cat.jpg'
            ]);

            var generatedResourcePromise = cache.put(
                new Request('/sw-save-as-bug/cache-foobar.json'),
                new Response(JSON.stringify({ source: 'cache' }))
            );

            return Promise.all([realResourcesPromise, generatedResourcePromise]);
        }));
});

self.addEventListener('activate', function (event) {

    console.log('SW activated');
});

self.addEventListener('fetch', function (event) {

    console.log('Caught a fetch!', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function (response) {

            if (response) {
                return response;
            }
            else {

                if (event.request.url.match(/on-the-fly-foobar\.json$/)) {
                    return new Response(JSON.stringify({ source: 'on the fly' }), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
                else {
                    return fetch(event.request);
                }
            }

        })
    );

});