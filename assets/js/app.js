import { animateTrack, animateCounter } from "./helpers.js";

const track = document.getElementById("image-track");
const counterEl = document.getElementById("counter");
const totalEl = document.getElementById("total-count");

const total = track.childElementCount;
const imgPrcFr = 50 / total;
let currentImage = 1;
totalEl.innerText = total;

let freeScroll = true;

if (!freeScroll) {
  track.style.opacity = 0;
  track.dataset.prevPercentage = imgPrcFr;
  animateTrack(imgPrcFr, 600);
  track.animate(
    { opacity: 1 },
    {
      duration: 1200,
      fill: "forwards",
      easing: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
    }
  );
}

for (let i = 0; i < total; i++) {
  const countDiv = document.createElement("div");
  countDiv.className = "count-text";
  countDiv.innerText = +i + 1;
  counterEl.appendChild(countDiv);
}

let currentPrc,
  rep = 0;
let animationDone;
const trackWidth = track.offsetWidth;
function updateValue() {
  const style = window.getComputedStyle(track);
  const matrix = new WebKitCSSMatrix(style.transform);
  const currentTransform = -(matrix.m41 * 100) / trackWidth;
  const curIndex = Math.floor((currentTransform * total) / 100);
  if (currentImage !== curIndex + 1) {
    currentImage = curIndex + 1;
    animateCounter((Math.min(curIndex, total - 1) * 100) / total);
  }

  if (currentPrc == currentTransform && animationDone) {
    rep++;
  } else {
    rep = 0;
    currentPrc = currentTransform;
  }
  if (rep > 10) return;
  requestAnimationFrame(updateValue);
}

const handleMouseDown = (e) => {
  track.dataset.mouseDownAt = e.clientX;
  animationDone = false;
  requestAnimationFrame(updateValue);
};
const handleMouseUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
  if (!freeScroll) {
    const prc = parseInt(track.dataset.currentImage) * imgPrcFr * 2 - imgPrcFr;
    track.dataset.prevPercentage = prc;
    animateTrack(prc, 600);
  }
  animationDone = true;
};
const handleDrag = (e) => {
  if (track.dataset.mouseDownAt === "0") return;
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
  const maxDelta = window.innerWidth / 2;
  const prc = (mouseDelta / maxDelta) * 100;
  const prev = parseFloat(track.dataset.prevPercentage);
  const cur = prev + prc;
  const constrainedPrc = Math.min(Math.max(cur, 0), 100);
  const floatedCurrentImage = Math.max(constrainedPrc / (imgPrcFr * 2), 1);
  const currentImage = Math.ceil(floatedCurrentImage);
  track.dataset.currentImage = currentImage;

  track.dataset.percentage = constrainedPrc;
  if (cur > 100 || cur < 0) {
    track.dataset.mouseDownAt = e.clientX;
    track.dataset.prevPercentage = constrainedPrc;
  }
  animateTrack(constrainedPrc);
};
// mouse events
window.onmousedown = (e) => handleMouseDown(e);
window.onmouseup = (e) => handleMouseUp(e);
window.onmousemove = (e) => handleDrag(e);

// touch events
window.ontouchstart = (e) => handleMouseDown(e.touches[0]);
window.ontouchend = (e) => handleMouseUp(e.touches[0]);
window.ontouchmove = (e) => handleDrag(e.touches[0]);
