function getVideos(nextToken, onResult, onError) {
    if (nextToken) {
        if (_loadNextPage()) {
            setTimeout(function() {
                _getVideos(nextToken, 1, onResult, onError);
            }, 200)    
        } else {
            onResult({ "videos":[] })
        }
    } else {
        _getVideos(0, 0, onResult, onError);        
    }
}

function _getVideos(location, waitingCount, onResult, onError) {
    try {
        var videoItems = document.getElementsByTagName('ytm-compact-video-renderer')
        var videos = []

        if (videoItems.length > location) {
            for (var i = location; i < videoItems.length; i++) {
                try {
                    videos.push({
                        "url":videoItems[i].getElementsByClassName('compact-media-item-image')[0].href,
                        "title":videoItems[i].getElementsByClassName('compact-media-item-headline')[0].textContent,
                        "viewCount":videoItems[i].getElementsByClassName('compact-media-item-stats')[0].textContent,
                        "publishedDate":videoItems[i].getElementsByClassName('compact-media-item-stats')[1].textContent
                    })
                } catch (e) {
                    // eat up
                }
            }
    
            if (waitingCount > 0) {
                setTimeout(function() {
                    _getVideos(location, waitingCount - 1, onResult, onError)
                }, 200)
            } else {
                onResult({ "videos":videos })
            }
        } else {
            setTimeout(function() {
                _getVideos(location, waitingCount, onResult, onError)
            }, 200)
        }
    } catch (e) {
        onError();
    }
}

function _loadNextPage() {
    try {
        window.scrollTo(0, document.body.scrollHeight);
    } catch (e) {
        return false;
    }

    return true;
}
