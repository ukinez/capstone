const container = document.querySelector(".container");
const speedSlider = document.getElementById("speedSlider");
const speedText = document.getElementById("speedText");

const orbitObjects = document.querySelectorAll(
    ".mercury, .venus, .earth, .moon, .mars, .phobos, .deimos, .ceres, .jupiter, .saturn, .uranus, .neptune, .pluto, .haumea, .makemake, .eris, .asteroidbelt1, .asteroidbelt2, .asteroidbelt3"
);

// --------------------
// SPEED SLIDER
// --------------------

orbitObjects.forEach(object => {
    const duration = parseFloat(getComputedStyle(object).animationDuration);
    object.dataset.originalDuration = duration;
});

function updateSpeed() {
    const sliderValue = parseFloat(speedSlider.value);
    const speed = Math.pow(10, sliderValue);

    speedText.textContent = speed >= 1000 ? "1000x" : Math.round(speed) + "x";

    orbitObjects.forEach(object => {
        const original = parseFloat(object.dataset.originalDuration);
        object.style.animationDuration = original / speed + "s";
    });
}

speedSlider.addEventListener("input", updateSpeed);
updateSpeed();

// stop slider from moving the screen
speedSlider.addEventListener("touchstart", e => e.stopPropagation());
speedSlider.addEventListener("touchmove", e => e.stopPropagation());
speedSlider.addEventListener("mousedown", e => e.stopPropagation());

// --------------------
// CAMERA MOVE + ZOOM
// --------------------

let isDragging = false;
let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;
let scale = 1;

function updateCamera() {
    container.style.transform =
        `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

// mouse drag
document.addEventListener("mousedown", e => {
    if (e.target === speedSlider) return;

    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
});

document.addEventListener("mousemove", e => {
    if (!isDragging) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    updateCamera();
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// mouse wheel zoom
document.addEventListener("wheel", e => {
    if (e.target === speedSlider) return;

    e.preventDefault();

    if (e.deltaY < 0) {
        scale += 0.1;
    } else {
        scale -= 0.1;
    }

    scale = Math.max(0.3, Math.min(scale, 5));

    updateCamera();
}, { passive: false });


// phone drag
let lastTouchDistance = null;

document.addEventListener("touchstart", e => {
    if (e.target === speedSlider) return;

    if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - currentX;
        startY = e.touches[0].clientY - currentY;
    }

    if (e.touches.length === 2) {
        isDragging = false;
        lastTouchDistance = getTouchDistance(e);
    }
}, { passive: false });

document.addEventListener("touchmove", e => {
    if (e.target === speedSlider) return;
    e.preventDefault();

    if (e.touches.length === 1 && isDragging) {
        currentX = e.touches[0].clientX - startX;
        currentY = e.touches[0].clientY - startY;
        updateCamera();
    }

    if (e.touches.length === 2) {
        const newDistance = getTouchDistance(e);
        scale *= newDistance / lastTouchDistance;
        scale = Math.max(0.3, Math.min(scale, 5));
        lastTouchDistance = newDistance;
        updateCamera();
    }
}, { passive: false });

document.addEventListener("touchend", () => {
    isDragging = false;
    lastTouchDistance = null;
});

function getTouchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

