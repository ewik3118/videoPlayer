class Player {
    private static STATE_PLAYING = 'playing';
    private static STATE_PAUSED = 'paused';
    private static STATE_STOPPED = 'stopped';

    protected statePlay = false;
    public listItems = <any>[];
    public sourceItem = this.videoItem.getElementsByTagName('source')[0];
    public actualPlayingIndex = 0;
    public playBtn = this.element.querySelector(".playerControlBtn");
    public stopBtn = this.element.querySelector(".playerControlBarStop");
    public volumeBtn = this.element.querySelector(".playerControlBarVolume");
    public shuffleBtn = document.querySelector('.playerControlBtnShuffle');
    public playPauseBtn = this.element.querySelector(".playerControlBarPlay");
    public repeatBtn = this.element.querySelector(".playerControlBtnRepeat");
    public fullScreenBtn = this.element.querySelector(".playerControlBarFullScreen");
    public playerListContainer = document.querySelector(".playerList ul");
    public source = this.videoItem.querySelector("source");
    public collectionVideoLength = this.data().length;
    public fullScreenMode = false;

    constructor(public element, public videoItem) {
        this.element = element;
        this.videoItem = videoItem;

        this.init();
    }

    public init(): void {
        this.createVideoList([]);
        this.loadVideoList();
        this.attachEvents();
        this.reloadSrcVideo(0);
        this.activeVideo(0);
        this.changeVolume();
    }

    public attachEvents(): void {
        this.playHandler();
        this.stopHandler();
        this.playPauseHandler();
        this.endedHandler();
        this.repeatHandler();
        this.activeVideoHandler();
        this.shuffleHandler();
        this.fullScreenHandler();
        this.volumeHandler();
    }

    public data(): any {
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
    }

    public loadVideoList(): void {
        this.listItems = document.querySelectorAll(this.element.getAttribute('data-element-list-video-name'));
    }

    public playHandler(): void {
        this.playBtn.addEventListener('click',
            () => {
                this.changePlayingState();
            }, false);
    }


    public stopHandler(): void {
        this.stopBtn.addEventListener('click',
            () => {
                this.stop();
            }, false);
    }

    public playPauseHandler(): void {
        this.playPauseBtn.addEventListener('click',
            () => {
                this.changePlayingState();
            }, false);
    }

    public endedHandler(): void {
        this.videoItem.addEventListener('ended', () => {
            this.runNextVideo();
        }, false);
    }

    public repeatHandler(): void {
        this.repeatBtn.addEventListener('click',
            () => {
                this.repeat();
            }, false);
    }

    public shuffleHandler(): void {
        this.shuffleBtn.addEventListener('click', () => {
            this.shuffle();
        }, false);
    }

    public fullScreenHandler(): void {
        this.fullScreenBtn.addEventListener('click', () => {
            this.fullScreen();
        }, false);
    }

    public activeVideoHandler(): void {
        this.listItems.forEach((el, i) => {
            el.addEventListener('click', () => {
                this.hideRepeatBtn();
                this.reloadSrcVideo(i);
                this.play();
                this.actualPlayingIndex = i;
            }, false);
        });
    }

    public volumeHandler(): void {
        this.volumeBtn.addEventListener('change', () => {
            this.changeVolume();
        }, false)
    }

    public setDataPlayState(state: string): void {
        this.element.setAttribute('data-play-state', state);
    }

    public play(): void {
        this.videoItem.play();
        this.setDataPlayState(Player.STATE_PLAYING);
        this.videoItem.setAttribute('poster', '');
        this.statePlay = true;
    }

    public pause(): void {
        this.videoItem.pause();
        this.setDataPlayState(Player.STATE_PAUSED);
        this.statePlay = false;
    }

    public changePlayingState(): void {
        if (!this.statePlay) {
            this.play();
        } else {
            this.pause();
        }
    }

    public stop(): void {
        this.setDataPlayState(Player.STATE_STOPPED);
        this.videoItem.setAttribute('poster', '../assets/images/video_poster_1.PNG');
        this.reloadSrcVideo(0);
        this.statePlay = false;
    }

    public changeVolume(): void {
        let value = this.volumeBtn.value;
        this.videoItem.volume = value * 0.1;
    }

    public setVideoSource(src: string): void {
        this.sourceItem.src = src;

        this.sourceItem.setAttribute('type', 'video/' + this.setFormatTypeSrc(src));
    }

    public setFormatTypeSrc(src: string): string {
        let array = {'ogv': 'ogg', 'mp4': 'mp4', 'webm': 'webm'};

        return array[this.getTypeVideoSrc(src)];
    }

    public reloadSrcVideo(index: number): void {
        this.setVideoSource(this.listItems[index].getAttribute('data-src'));
        this.activeVideo(index);
        this.videoItem.load();
    }

    public activeVideo(index: number): void {
        this.listItems.forEach((el) => el.classList.remove("listItemsActive"));
        this.listItems[index].classList.add("listItemsActive");
    }

    public runNextVideo(): void {
        if (this.actualPlayingIndex < this.listItems.length - 1) {
            this.actualPlayingIndex++;
        } else {
            this.actualPlayingIndex = 0;
        }

        if (this.actualPlayingIndex) {
            this.reloadSrcVideo(this.actualPlayingIndex);
            this.activeVideo(this.actualPlayingIndex);
            this.videoItem.play();
        } else {
            this.setDataPlayState(Player.STATE_STOPPED);
            this.showRepeatBtn();
            this.stop();
        }
    }

    public showRepeatBtn(): void {
        this.repeatBtn.classList.remove('btnHidden');
    }

    public hideRepeatBtn(): void {
        this.repeatBtn.classList.add('btnHidden');
    }

    public repeat(): void {
        this.reloadSrcVideo(0);
        this.videoItem.load();
        this.play();
        this.hideRepeatBtn();
    }

    public findIndexInListNodes(elementsList, element): number {
        elementsList = Array.prototype.slice.call(elementsList);

        return elementsList.indexOf(element);
    }

    public shuffle(): void {
        let indexActive = document.querySelector('.listItemsActive').getAttribute('data-src-index'),
            activeElement;

        this.createVideoList(this.generateRandomArray(this.collectionVideoLength));
        this.loadVideoList();

        activeElement = document.querySelector('.playerListItem[data-src-index="' + indexActive + '"]');
        activeElement.classList.add('listItemsActive');

        this.activeVideoHandler();
        this.findIndexInListNodes(this.listItems, activeElement);
        this.actualPlayingIndex = this.findIndexInListNodes(this.listItems, activeElement);
    }

    public fullScreen(): void {
        if (this.fullScreenMode) {
            this.fullScreenOff();
        } else {
            this.fullScreenOn();
        }
    }

    public getTypeVideoSrc(videoSrc: string): string {
        return videoSrc.slice(videoSrc.lastIndexOf('.') + 1, videoSrc.length);
    }

    public fullScreenOn(): void {
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
    }

    public fullScreenOff(): void {
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
    }

    public generateRandomArray(maxRange): any {
        let array = [],
            value,
            maxValue = maxRange;

        while (maxRange) {
            value = Math.floor(Math.random() * maxValue);

            if (!array.length) {
                array.push(value);
                --maxRange;
            } else {
                if (!(array.filter((a) => {
                    return a == value
                }).length)) {
                    --maxRange;
                    array.push(value);
                }
            }
        }

        return array;
    }

    public createElementHTML(parentElem, tagName, contentElement, attrObj): void {
        let element = document.createElement(tagName),
            content = document.createTextNode(contentElement);

        for (let i in attrObj) {
            element.setAttribute(i, attrObj[i]);
        }

        element.appendChild(content);
        parentElem.appendChild(element);
    }

    public clearVideoList(): void {
        this.playerListContainer.innerHTML = '';
    }


    public createVideoList(indexArray): void {
        let data = this.data(),
            index;

        this.clearVideoList();

        for (let i = 0, dataLength = data.length; i < dataLength; i++) {
            index = indexArray.length ? indexArray[i] : i;
            this.createElementHTML(this.playerListContainer,
                "li",
                data[index].title + ' ' + data[index].time,
                {'class': 'playerListItem', 'data-src': data[index].url, 'data-src-index': index});
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById("player"),
        videoItem = videoElement.querySelector("video");

    new Player(videoElement, videoItem);
}, false);
