// config
const TOTAL_IMAGES = 12;
const GRID_COUNT = 5;
const ROWS = 3;
const COLUMNS = 6;
const IMAGES_PER_GRID = ROWS * COLUMNS;
const SPEED = 80;

const carousel = document.querySelector(".carousel");
const track = document.getElementById("track");

const IMAGE_PATH = "images/";
const IMAGE_EXTENSION = ".jpg";

// grid data
const grids = [];
let gridWidth = 0;
let gridGap = 0;
let minX = 0;

function createGrid(gridIndex) {
    const grid = document.createElement("div");
    grid.className = "grid";

    for (let i = 0; i < IMAGES_PER_GRID; i++) {
        const imageNumber =
            ((gridIndex * IMAGES_PER_GRID + i) % TOTAL_IMAGES) + 1;

        const image = document.createElement("img");

        image.src = IMAGE_PATH + imageNumber + IMAGE_EXTENSION;
        image.alt = `Image ${imageNumber}`;
        image.draggable = false;

        grid.appendChild(image);
    }

    track.appendChild(grid);

    return grid;
}

function initialize() {
    track.innerHTML = "";
    grids.length = 0;

    gridGap = parseFloat(
        getComputedStyle(carousel).getPropertyValue("--gap"),
    );

    // Buat grid
    for (let i = 0; i < GRID_COUNT; i++) {
        const grid = createGrid(i);

        grids.push({
            element: grid,
            x: 0,
        });
    }

    // Ukur lebar grid
    const firstGrid = grids[0].element;

    gridWidth = firstGrid.offsetWidth;

    // Batas kiri
    minX = -(gridWidth + gridGap);

    // Posisi awal
    const initialCenterOffset =
        (carousel.offsetWidth - gridWidth) / 2 - 2 * (gridWidth + gridGap);

    grids.forEach((grid, index) => {
        grid.x = initialCenterOffset + index * (gridWidth + gridGap);

        grid.element.style.transform = `translate3d(${grid.x}px, -50%, 0)`;
    });

    startAnimation();
}

// animation
let lastTime = performance.now();
let animationFrameId;

function animate(currentTime) {
    const delta = (currentTime - lastTime) / 2000;
    lastTime = currentTime;

    const movement = SPEED * delta;

    grids.forEach((grid) => {
        grid.x -= movement;

        // Jika grid bergerak melewati batas minX (sudah hilang di kiri)
        if (grid.x <= minX) {
            let rightmost = Math.max(...grids.map((item) => item.x));
            grid.x = rightmost + gridWidth + gridGap;
        }

        grid.element.style.transform = `translate3d(${grid.x}px, -50%, 0)`;
    });

    animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
}

// event
window.addEventListener("load", initialize);

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initialize();
    }, 200);
});


// music player
const audio = document.getElementById("audio");

const musicPlayer = document.getElementById("musicPlayer");

const playButton = document.getElementById("playButton");

const progressBar = document.getElementById("progressBar");

const progressContainer = document.getElementById("progressContainer");

const currentTime = document.getElementById("currentTime");

const duration = document.getElementById("duration");

// format time
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}

// play music
function playMusic() {
    audio.play().catch((error) => {
        console.log("Audio belum dapat dimainkan:", error);
    });
}

// pause music
function pauseMusic() {
    audio.pause();
}


// toggle music
function toggleMusic() {
    if (audio.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

// button
playButton.addEventListener("click", toggleMusic);

// spacebar
document.addEventListener("keydown", function (event) {
    /*
     * Space
     */

    if (event.code !== "Space") {
        return;
    }

    /*
     * Jangan trigger kalau user
     * sedang mengetik di input.
     */

    const target = event.target;

    if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
    ) {
        return;
    }

    /*
     * Mencegah halaman scrolling
     * ketika Space ditekan.
     */

    event.preventDefault();

    toggleMusic();
});

// audio play
audio.addEventListener("play", function () {
    musicPlayer.classList.add("is-playing");
});

// audio pause
audio.addEventListener("pause", function () {
    musicPlayer.classList.remove("is-playing");
});

// update progress
audio.addEventListener("timeupdate", function () {
    if (!audio.duration) {
        return;
    }

    const percentage = (audio.currentTime / audio.duration) * 100;

    progressBar.style.width = percentage + "%";

    currentTime.textContent = formatTime(audio.currentTime);

    const remaining = audio.duration - audio.currentTime;

    duration.textContent = "-" + formatTime(remaining);
});

// load duration
audio.addEventListener("loadedmetadata", function () {
    duration.textContent = "-" + formatTime(audio.duration);
});

// click on progress bar
progressContainer.addEventListener("click", function (event) {
    if (!audio.duration) {
        return;
    }

    const rect = progressContainer.getBoundingClientRect();

    const clickPosition = event.clientX - rect.left;

    const percentage = clickPosition / rect.width;

    audio.currentTime = percentage * audio.duration;
});

// audio ended
audio.addEventListener("ended", function () {
    audio.currentTime = 0;

    pauseMusic();
});