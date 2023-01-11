import { animateTrack } from "./helpers.js";

const track = document.getElementById("image-track");
const counterEl = document.getElementById("counter");
const totalEl = document.getElementById("total-count");

const total = track.childElementCount;
const imgPrcFr = 50 / total;
let currentImage = 1;
counterEl.innerText = currentImage;
totalEl.innerText = total;

let freeScroll = false;

if (!freeScroll) {
  track.style.opacity = 0;
  track.dataset.prevPercentage = imgPrcFr;
  animateTrack(imgPrcFr, 600);
  track.animate(
    { opacity: 1 },
    {
      duration: 1200,
      delay: 500,
      fill: "forwards",
      easing: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
    }
  );
}

const handleMouseDown = (e) => {
  track.dataset.mouseDownAt = e.clientX;
};
const handleMouseUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
  if (!freeScroll) {
    const prc = parseInt(track.dataset.currentImage) * imgPrcFr * 2 - imgPrcFr;
    track.dataset.prevPercentage = prc;
    animateTrack(prc, 600);
  }
};
const handleDrag = (e) => {
  if (track.dataset.mouseDownAt === "0") return;
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
  const maxDelta = window.innerWidth / 2;
  const prc = (mouseDelta / maxDelta) * 100;
  const prev = parseFloat(track.dataset.prevPercentage);
  const cur = prev + prc;
  const constrainedPrc = Math.min(Math.max(cur, 0), 100);
  const currentImage = Math.max(Math.ceil(constrainedPrc / (imgPrcFr * 2)), 1);
  counterEl.innerText = currentImage;
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
