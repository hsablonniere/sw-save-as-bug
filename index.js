'use strict';

if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('/sw-save-as-bug/sw.js')

        .then(function (registration) {
            console.log(registration);
        })
        .catch(function (err) {
            console.log(err);
        });
}