
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const header = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const btnPlay = $('.btn-toggle-play')
const player = $('.player')
const btnNext = $('.btn-next')
const btnRandom = $('.btn-random')
const btnPrev = $('.btn-prev')
const progress = $('#progress')
const btnRepeat = $('.btn-repeat')


const PLAYER_STORAGE_KEY = 'F8'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom : false,
    isRepeat : false,
    config: JSON.stringify(localStorage.getItem(PLAYER_STORAGE_KEY)),
    setConfig: function(key , value) {

    }
    ,
    songs: [
        {
          name: "Dem ngay xa em",
          singer: "Lou Hoang",
          path: "./mp3/DNXE.mp3",
          image: "./img/2.jpg"
        },
        {
          name: "Em chua 18",
          singer: "Will",
          path: "./mp3/EC18.mp3",
          image:    
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Giả vờ thương anh được không",
          singer: "An",
          path:
            "./mp3/GVTADK.mp3",
          image: "./img/1.jpg"
        },
        {
          name: "Nụ cười không vui",
          singer: "Châu khải Phong",
          path: "./mp3/NCKV.mp3",
          image:
            "./img/3.jpg"
        },
        {
          name: "NHLR",
          singer: "NHLR",
          path: "./mp3/NHLR.mp3",
          image:
            "./img/7.jpg"
        },
        {
          name: "Damn",
          singer: "Raftaar x kr$na",
          path:
            "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
          image:
            "./img/6.jpg"
        },
        {
          name: "Em chưa 18",
          singer: "Will",
          path: "./mp3/EC18.mp3",
          image:
            "./img/4.jpg"
        }
    ],
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex]
            }
        });
    }
    ,
    handleEvents: function() {
        const _this = this;
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate([{
            transform: "rotate(360deg)",
            
        }],{
            duration: 15000,
            iteration: Infinity
        })
        cdThumbAnimate.pause()
        
        // su kien cuon chuot 
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //
        btnPlay.onclick = function(){
            if(_this.isPlaying){             
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else {
                console.log(123);
                _this.nextSong()
            }
            _this.loadCurrentSong()
            _this.renderSong()
            audio.play()
            _this.scrollToActiveSong()
        }
        btnPrev.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else {
                _this.prevSong()
                
            }
            _this.loadCurrentSong()
            audio.play()
            _this.renderSong()
            _this.scrollToActiveSong()
        }
        audio.onseeking = function(){
            // console.log(audio.currentTime)
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }           
        }
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
            audio.play()
        }
        btnRandom.onclick = function(e){
            _this.isRandom = ! _this.isRandom
            btnRandom.classList.toggle('active',_this.isRandom )
        }
        
        btnRepeat.onclick = function() {
            _this.isRepeat = ! _this.isRepeat
            btnRepeat.classList.toggle('active',_this.isRepeat)
        }
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            } else {
                btnNext.click()
            }
        }
        // lang nghe hanh vi click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || 
                e.target.closest('.option')) {
                    
                    // xu li khi click vao song 
                if(e.target.closest('.song:not(.active)')){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.renderSong()
                    _this.scrollToActiveSong()
                    audio.play()
                }
                // xu ly khi click vao option
                if(e.target.closest('.option')){

                }

            }
        }
    },
    start: function() {
        this.defineProperties()
        this.renderSong()
        this.loadCurrentSong()
        this.handleEvents()
    },
    renderSong: function() {
        const html = this.songs.map((song, index) => {
            
            return  `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div> 

            `
        });
        playlist.innerHTML = html.join('');
    },
    loadCurrentSong: function() {
        
        header.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = 'url(' + this.currentSong.image +')'
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.renderSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.renderSong()
    },
    randomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 500)

    }
}

app.start()

// tua
// han che lap lai 1 bai trong 1 danh sach