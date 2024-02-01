const module = (function() {
    const webjs = require("webjs-helper"),
          feed  = require("webjs-feed");

    var _id = "", _dir_path = "", _handlers = [];
    var _web_loaded = false;

    function _on_web_loaded(data) {
        if (data["url"].startsWith("https://m.youtube.com/results?")) {
            webjs.import(`${_dir_path}/youtube.js`);

            _handlers.forEach((handler) => {
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
            timeout(0.1, () => {
                _get_object(id, handler);
            });
        } else {
            handler(object);
        }
    }

    return {
        initialize: function(id) {
            const web_prefix = id.replace(".", "_");
            const dir_path = this.__ENV__["dir-path"];

            global[`${web_prefix}__on_web_loaded`] = function(data) {
                if (data["is-for-main-frame"] === "yes") {
                    webjs.initialize(`${id}.web`, "__bridge__");
                }
                
                _on_web_loaded(data);
            }

            view.object(id).action("load", { 
                "filename": `${dir_path}/web.sbml`,
                "dir-path": dir_path,
                "web-id": id, 
                "web-prefix": web_prefix
            });

            _id = id, _dir_path = dir_path;

            return this;
        },

        search: function(keyword, location = 0) {
            return new Promise((resolve, reject) => {
                const handler = () => {
                    feed.feed("videos")
                        .then((next_token) => {
                            return webjs.call("getVideos", [ next_token ]);
                        })
                        .then((result) => {
                            const videos = [];
            
                            result["videos"].forEach((video) => {
                                const video_id = video["url"].match(/v=([^&#]+)|shorts\/([^/?]+)/);

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
                        .catch((error) => {
                            reject(error);
                        });
                }

                if (location === 0) {
                    _get_object(_id + ".web", (object) => {
                        feed.reset();
                        object.property({ 
                            "url": `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}` 
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
