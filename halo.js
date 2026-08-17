/* =================================
   AUDIO PLAYER
================================= */

const audio = document.getElementById("audio");

const playButton =
    document.getElementById("playButton");

const progress =
    document.getElementById("progress");

const progressContainer =
    document.getElementById("progressContainer");

const currentTimeElement =
    document.getElementById("currentTime");

const durationElement =
    document.getElementById("duration");

const musicPlayer = document.querySelector(".music-player");


/* =================================
   SVG ICONS
================================= */

const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

// Set icon awal
playButton.innerHTML = playIcon;


/* =================================
   FORMAT TIME
================================= */

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return (
        minutes +
        ":" +
        remainingSeconds
            .toString()
            .padStart(2, "0")
    );
}


/* =================================
   PLAY / PAUSE
================================= */

function togglePlay() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

playButton.addEventListener("click", togglePlay);


/* =================================
   KEYBOARD TRIGGER (SPASI)
================================= */

document.addEventListener("keydown", function (event) {
    const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) || 
                     document.activeElement.isContentEditable;

    if (event.code === "Space" && !isTyping) {
        event.preventDefault();
        togglePlay();
    }
});


/* =================================
   UPDATE ICON
================================= */

audio.addEventListener("play", function () {
    playButton.innerHTML = pauseIcon;

    musicPlayer.classList.add("mini");
});

audio.addEventListener("pause", function () {
    playButton.innerHTML = playIcon;

    musicPlayer.classList.remove("mini");
});


/* =================================
   AUDIO LOADED
================================= */

audio.addEventListener(
    "loadedmetadata",
    function () {

        durationElement.textContent =
            formatTime(audio.duration);

    }
);


/* =================================
   UPDATE PROGRESS
================================= */

audio.addEventListener(
    "timeupdate",
    function () {

        if (!audio.duration) {
            return;
        }


        const percentage =
            (audio.currentTime /
                audio.duration) *
            100;


        progress.style.width =
            percentage + "%";


        currentTimeElement.textContent =
            formatTime(
                audio.currentTime
            );

    }
);


/* =================================
   CLICK PROGRESS BAR
================================= */

progressContainer.addEventListener(
    "click",
    function (event) {

        const rect =
            progressContainer.getBoundingClientRect();


        const clickPosition =
            event.clientX - rect.left;


        const percentage =
            clickPosition /
            rect.width;


        audio.currentTime =
            percentage *
            audio.duration;

    }
);

/* =================================
   AUDIO SELESAI
================================= */

audio.addEventListener(
    "ended",
    function () {

        playButton.innerHTML = playIcon;

        progress.style.width = "0%";

        currentTimeElement.textContent =
            "0:00";

    }
);










const words = document.querySelectorAll('.lyrics-word');

// Inisialisasi durasi gerak animasi (transition-duration) per kata dari HTML
words.forEach(word => {
  const animDuration = word.getAttribute('data-anim-duration') || '0.3';
  word.style.transitionDuration = `${animDuration}s`;
});

// Update animasi kata sesuai timestamp audio
audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;

  words.forEach(word => {
    const startTime = parseFloat(word.getAttribute('data-time'));
    const duration = parseFloat(word.getAttribute('data-duration')) || 0.5;
    const endTime = startTime + duration;

    // Aktifkan glow & perbesar HANYA pada rentang waktu startTime hingga endTime
    if (currentTime >= startTime && currentTime <= endTime) {
      word.classList.add('active');
    } else {
      word.classList.remove('active');
    }
  });
});