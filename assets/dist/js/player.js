var Player = /** @class */ (function () {
    function Player(element, videoItem) {
        this.element = element;
        this.videoItem = videoItem;
        this.statePlay = false;
        this.listItems = [];
        this.sourceItem = this.videoItem.getElementsByTagName('source')[0];
        this.actualPlayingIndex = 0;
        this.playBtn = this.element.querySelector(".playerControlBtn");
        this.stopBtn = this.element.querySelector(".playerControlBarStop");
        this.volumeBtn = this.element.querySelector(".playerControlBarVolume");
        this.shuffleBtn = document.querySelector('.playerControlBtnShuffle');
        this.playPauseBtn = this.element.querySelector(".playerControlBarPlay");
        this.repeatBtn = this.element.querySelector(".playerControlBtnRepeat");
        this.fullScreenBtn = this.element.querySelector(".playerControlBarFullScreen");
        this.playerListContainer = document.querySelector(".playerList ul");
        this.source = this.videoItem.querySelector("source");
        this.collectionVideoLength = this.data().length;
        this.fullScreenMode = false;
        this.element = element;
        this.videoItem = videoItem;
        this.init();
    }
    Player.prototype.init = function () {
        this.createVideoList([]);
        this.loadVideoList();
        this.attachEvents();
        this.reloadSrcVideo(0);
        this.activeVideo(0);
        this.changeVolume();
    };
    Player.prototype.attachEvents = function () {
        this.playHandler();
        this.stopHandler();
        this.playPauseHandler();
        this.endedHandler();
        this.repeatHandler();
        this.activeVideoHandler();
        this.shuffleHandler();
        this.fullScreenHandler();
        this.volumeHandler();
    };
    Player.prototype.data = function () {
        return [
            {
                "title": "Genesis - Invisible Touch",
                "time": "02:00",
                "url": "../assets/video/video_1.mp4"
            },
            {
                "title": "Grechuta",
                "time": "00:50",
                "url": "../assets/video/video_2.mp4"
            },
            {
                "title": "Urszula",
                "time": "01:00",
                "url": "../assets/video/video_3.mp4"
            },
            {
                "title": "Królik",
                "time": "01:00",
                "url": "../assets/video/video_4.ogv"
            },
            {
                "title": "Wulkan",
                "time": "01:00",
                "url": "../assets/video/video_5.webm"
            }
        ];
    };
    Player.prototype.loadVideoList = function () {
        this.listItems = document.querySelectorAll(this.element.getAttribute('data-element-list-video-name'));
    };
    Player.prototype.playHandler = function () {
        var _this = this;
        this.playBtn.addEventListener('click', function () {
            _this.changePlayingState();
        }, false);
    };
    Player.prototype.stopHandler = function () {
        var _this = this;
        this.stopBtn.addEventListener('click', function () {
            _this.stop();
        }, false);
    };
    Player.prototype.playPauseHandler = function () {
        var _this = this;
        this.playPauseBtn.addEventListener('click', function () {
            _this.changePlayingState();
        }, false);
    };
    Player.prototype.endedHandler = function () {
        var _this = this;
        this.videoItem.addEventListener('ended', function () {
            _this.runNextVideo();
        }, false);
    };
    Player.prototype.repeatHandler = function () {
        var _this = this;
        this.repeatBtn.addEventListener('click', function () {
            _this.repeat();
        }, false);
    };
    Player.prototype.shuffleHandler = function () {
        var _this = this;
        this.shuffleBtn.addEventListener('click', function () {
            _this.shuffle();
        }, false);
    };
    Player.prototype.fullScreenHandler = function () {
        var _this = this;
        this.fullScreenBtn.addEventListener('click', function () {
            _this.fullScreen();
        }, false);
    };
    Player.prototype.activeVideoHandler = function () {
        var _this = this;
        this.listItems.forEach(function (el, i) {
            el.addEventListener('click', function () {
                _this.reloadSrcVideo(i);
                _this.play();
                _this.actualPlayingIndex = i;
                console.log('this.actualPlayingIndex', _this.actualPlayingIndex);
                console.log("index", i);
                console.log("element", el);
            }, false);
        });
    };
    Player.prototype.volumeHandler = function () {
        var _this = this;
        this.volumeBtn.addEventListener('change', function () {
            _this.changeVolume();
        }, false);
    };
    Player.prototype.setDataPlayState = function (state) {
        this.element.setAttribute('data-play-state', state);
    };
    Player.prototype.play = function () {
        this.videoItem.play();
        this.setDataPlayState(Player.STATE_PLAYING);
        this.videoItem.setAttribute('poster', '');
        this.statePlay = true;
    };
    Player.prototype.pause = function () {
        this.videoItem.pause();
        this.setDataPlayState(Player.STATE_PAUSED);
        this.statePlay = false;
    };
    Player.prototype.changePlayingState = function () {
        if (!this.statePlay) {
            this.play();
        }
        else {
            this.pause();
        }
    };
    Player.prototype.stop = function () {
        this.setDataPlayState(Player.STATE_STOPPED);
        this.videoItem.setAttribute('poster', '../assets/images/video_poster_1.PNG');
        this.reloadSrcVideo(0);
        this.statePlay = false;
    };
    Player.prototype.changeVolume = function () {
        var value = this.volumeBtn.value;
        this.videoItem.volume = value * 0.1;
        console.log(value);
        console.log(this.videoItem.volume);
    };
    Player.prototype.setVideoSource = function (src) {
        this.sourceItem.src = src;
        this.sourceItem.setAttribute('type', 'video/' + this.setFormatTypeSrc(src));
    };
    Player.prototype.setFormatTypeSrc = function (src) {
        var formatType = '';
        if (this.getTypeVideoSrc(src) == 'ogv') {
            formatType = 'ogg';
        }
        else {
            formatType = this.getTypeVideoSrc(src);
        }
        return formatType;
    };
    Player.prototype.reloadSrcVideo = function (index) {
        this.setVideoSource(this.listItems[index].getAttribute('data-src'));
        this.activeVideo(index);
        this.videoItem.load();
    };
    Player.prototype.activeVideo = function (index) {
        this.listItems.forEach(function (el) { return el.classList.remove("listItemsActive"); });
        this.listItems[index].classList.add("listItemsActive");
    };
    Player.prototype.runNextVideo = function () {
        if (this.actualPlayingIndex < this.listItems.length - 1) {
            this.actualPlayingIndex++;
        }
        else {
            this.actualPlayingIndex = 0;
        }
        if (this.actualPlayingIndex) {
            this.reloadSrcVideo(this.actualPlayingIndex);
            this.activeVideo(this.actualPlayingIndex);
            this.videoItem.play();
        }
        else {
            this.setDataPlayState(Player.STATE_STOPPED);
            this.showRepeatBtn();
            this.stop();
        }
    };
    Player.prototype.showRepeatBtn = function () {
        this.repeatBtn.classList.remove('btnHidden');
    };
    Player.prototype.hideRepeatBtn = function () {
        this.repeatBtn.classList.add('btnHidden');
    };
    Player.prototype.repeat = function () {
        this.reloadSrcVideo(0);
        this.videoItem.load();
        this.play();
        this.hideRepeatBtn();
    };
    Player.prototype.findIndexInListNodes = function (elementsList, element) {
        elementsList = Array.prototype.slice.call(elementsList);
        return elementsList.indexOf(element);
    };
    Player.prototype.shuffle = function () {
        var indexActive = document.querySelector('.listItemsActive').getAttribute('data-src-index'), activeElement;
        this.createVideoList(this.generateRandomArray(this.collectionVideoLength));
        this.loadVideoList();
        activeElement = document.querySelector('.playerListItem[data-src-index="' + indexActive + '"]');
        activeElement.classList.add('listItemsActive');
        this.activeVideoHandler();
        this.findIndexInListNodes(this.listItems, activeElement);
        this.actualPlayingIndex = this.findIndexInListNodes(this.listItems, activeElement);
    };
    Player.prototype.fullScreen = function () {
        if (this.fullScreenMode) {
            this.fullScreenOff();
        }
        else {
            this.fullScreenOn();
        }
    };
    Player.prototype.getTypeVideoSrc = function (videoSrc) {
        return videoSrc.slice(videoSrc.lastIndexOf('.') + 1, videoSrc.length);
    };
    Player.prototype.fullScreenOn = function () {
        if (this.videoItem.requestFullscreen) {
            this.videoItem.requestFullscreen();
        }
        else if (this.videoItem.mozRequestFullScreen) {
            this.videoItem.mozRequestFullScreen();
        }
        else if (this.videoItem.webkitRequestFullScreen) {
            this.videoItem.webkitRequestFullScreen();
        }
        else if (this.videoItem.msRequestFullscreen) {
            this.videoItem.msRequestFullscreen();
        }
        this.fullScreenMode = true;
    };
    Player.prototype.fullScreenOff = function () {
        if (this.videoItem.exitFullscreen) {
            this.videoItem.exitFullscreen();
        }
        else if (this.videoItem.mozExitFullScreen) {
            this.videoItem.mozExitFullScreen();
        }
        else if (this.videoItem.webkitExitFullScreen) {
            this.videoItem.webkitExitFullScreen();
        }
        else if (this.videoItem.msExitFullscreen) {
            this.videoItem.msExitFullscreen();
        }
        this.fullScreenMode = true;
    };
    Player.prototype.generateRandomArray = function (maxRange) {
        var array = [], value, maxValue = maxRange;
        while (maxRange) {
            value = Math.floor(Math.random() * maxValue);
            if (!array.length) {
                array.push(value);
                --maxRange;
            }
            else {
                if (!(array.filter(function (a) {
                    return a == value;
                }).length)) {
                    --maxRange;
                    array.push(value);
                }
            }
        }
        return array;
    };
    Player.prototype.createElementHTML = function (parentElem, tagName, contentElement, attrObj) {
        var element = document.createElement(tagName), content = document.createTextNode(contentElement);
        for (var i in attrObj) {
            element.setAttribute(i, attrObj[i]);
        }
        element.appendChild(content);
        parentElem.appendChild(element);
    };
    Player.prototype.clearVideoList = function () {
        this.playerListContainer.innerHTML = '';
    };
    Player.prototype.createVideoList = function (indexArray) {
        var data = this.data(), index;
        this.clearVideoList();
        for (var i = 0, dataLength = data.length; i < dataLength; i++) {
            index = indexArray.length ? indexArray[i] : i;
            this.createElementHTML(this.playerListContainer, "li", data[index].title + ' ' + data[index].time, { 'class': 'playerListItem', 'data-src': data[index].url, 'data-src-index': index });
        }
    };
    Player.STATE_PLAYING = 'playing';
    Player.STATE_PAUSED = 'paused';
    Player.STATE_STOPPED = 'stopped';
    return Player;
}());
document.addEventListener('DOMContentLoaded', function () {
    var videoElement = document.getElementById("player"), videoItem = videoElement.querySelector("video");
    new Player(videoElement, videoItem);
}, false);
