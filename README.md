komenda budowania styli:

**gulp sass**

komenda budowania sktyprów:

**gulp script**

funkcjonalności player:

- play
- stop
- pause
- shuffle
- repeat
- volume control

przykładowa struktura i użycie:

    <div id="player" data-play-state="stopped" data-element-list-video-name=".playerListItem">
        <video class="playerItem" poster="../assets/images/video_poster_1.PNG">
            <source src="" type="">
            <div class="playerControlBarFullScreen"></div>
        </video>
        <div class="playerControlBtn playerControlBtnPlay">
        </div>
        <div class="playerControlBtnRepeat btnHidden">
        </div>
        <div class="playerControlBar">
            <div class="playerControlBarPlay isPlaying"></div>
            <div class="playerControlBarStop"></div>
            <input type="range" class="playerControlBarVolume" name="volume" min="0" max="10" />
        </div>
    </div>

    <div class="playerList">
        <p>Next video:</p>
        <ul>
        </ul>
    </div>
    <div class="playerControlBtnShuffle">shuffle wideo</div>
    
wywołanie js:


    document.addEventListener('DOMContentLoaded', () => {
        const videoElement = document.getElementById("player"),
              videoItem = videoElement.querySelector("video");

    new Player(videoElement, videoItem);
    }, false);    
    
podajemy element kontenera wideo oraz tag wideo.     
    