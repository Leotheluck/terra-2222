//will make sure that all images are loaded before used to avoid errors
(function() {
    let resourceCache = {}
    let loading = []
    let readyCallbacks = []

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url)
            })
        }
        else {
            _load(urlOrArr)
        }
    }

    //creation of a cache to load the images
    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url]
        }
        else {
            let img = new Image()
            img.onload = function() {
                resourceCache[url] = img
                
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); })
                }
            }
            resourceCache[url] = false
            img.src = url
        }
    }

    function get(url) {
        return resourceCache[url]
    }

    //creation of the function to tell if the images are ready or not
    function isReady() {
        let ready = true
        for(let k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false
            }
        }
        return ready
    }

    //if images ready it will push the readycallback 
    function onReady(func) {
        readyCallbacks.push(func)
    }

    //creation of subfunction for global resources function
    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    }
})()