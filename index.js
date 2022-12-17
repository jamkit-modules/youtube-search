var module = (function() {
    const webjs = require("webjs-helper"),
          feed  = require("webjs-feed");

    var _id = "", _dir_path = "", _handlers = [];
    var _web_loaded = false;

    function _on_web_loaded(data) {
        if (data["url"].startsWith("https://m.youtube.com/results?")) {
            webjs.import(_dir_path + "/youtube.js");

            _handlers.forEach(function(handler) {
                handler();
            });

            if (!feed.is_web_loaded()) {
                feed.on_web_loaded();
            }

            _web_loaded = true, _handlers = [];
        }
    }

    function _get_object(id, handler) {
        const object = view.object(id);

        if (!object) {
            timeout(0.1, function() {
                _get_object(id, handler);
            });
        } else {
            handler(object);
        }
    }

    return {
        initialize: function(id) {
            var web_prefix = id.replace(".", "_");
            var dir_path = this.__ENV__["dir-path"];
            
            global[web_prefix + "__on_web_activate"] = function() {
                webjs.initialize(id + ".web", "__$_bridge");
            }

            global[web_prefix + "__on_web_loaded"] = function(data) {
                _on_web_loaded(data);
            }

            view.object(id).action("load", { 
                "filename": dir_path + "/web.sbml",
                "dir-path": dir_path,
                "web-id": id, 
                "web-prefix": web_prefix
            });

            _id = id, _dir_path = dir_path;

            return this;
        },

        search: function(keyword, location) {
            return new Promise(function(resolve, reject) {
                var handler = function() {
                    feed.feed("videos", function(next_token) {
                        webjs.call("getVideos", [ next_token ])
                            .then(function(result) {
                                var videos = [];
                
                                result["videos"].forEach(function(video) {
                                    var video_id = video["url"].match(/v=([^&#]+)|shorts\/([^/?]+)/);

                                    if (video_id) {
                                        videos.push({
                                            "video-id": video_id[1] || video_id[2],
                                            "type": video_id[2] ? "shorts" : "video",
                                            "title": video["title"],
                                            "view-count": video["viewCount"],
                                            "published-at": video["publishedDate"]
                                        });
                                    }
                                });

                                feed.on_feed_done("videos", location + result["videos"].length);
                                resolve(videos);
                            })
                            .catch(function(error) {
                                reject(error);
                            });
                    });
                }

                if (location === 0) {
                    _get_object(_id + ".web", function(object) {
                        feed.reset();
                        object.property({ 
                            "url": "https://www.youtube.com/results?search_query=" + encodeURIComponent(keyword) 
                        });
                    });

                    _web_loaded = false;
                }

                _web_loaded ? handler() : _handlers.push(handler);
            });
        },
    }
})();

__MODULE__ = module;
