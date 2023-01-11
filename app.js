const track = document.getElementById("image-track");
const counterEl = document.getElementById("counter");
const totalEl = document.getElementById("total-count");

const total = track.childElementCount;
const imgPrcFr = 50 / total;
let currentImage = 1;
counterEl.innerText = currentImage;
totalEl.innerText = total;

let freeScroll = false;

const animateTrack = (constrainedPrc, duration = 1200) => {
  track.animate(
    {
      transform: `translate(${-constrainedPrc}%, -50%)`,
    },
    {
      duration: duration,
      fill: "forwards",
      easing: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
    }
  );

  for (const image of track.getElementsByClassName("img")) {
    image.animate(
      {
        objectPosition: `${100 - constrainedPrc}% center`,
      },
      {
        duration: duration,
        fill: "forwards",
        easing: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
      }
    );
  }
};

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

window.onmousedown = (e) => {
  track.dataset.mouseDownAt = e.clientX;
};
window.onmouseup = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
  if (!freeScroll) {
    const prc = parseInt(track.dataset.currentImage) * imgPrcFr * 2 - imgPrcFr;
    track.dataset.prevPercentage = prc;
    animateTrack(prc, 600);
  }
};

window.onmousemove = (e) => {
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
