import { animateTrack, animateCounter, minimizeTrack } from "./helpers.js";

// export class project {
//   constructor(){
//     this.track =
//   }
// }

export const track = document.getElementById("image-track");
export const counterEl = document.getElementById("counter");
export const totalEl = document.getElementById("total-count");
export const fullscreenTrack = document.getElementById("fullscreen-track");
export let fullscreenEl = null;
export let curIndex = 0;
export const fullscreenObject = {
  fullscreen: false,
  el: null,
  index: 0,
};
export const total = track.childElementCount;
export const imgPrcFr = 50 / total;
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
      easing: "cubic-bezier(0.66, 0.16, 0.63, 0.86)",
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
let startLink;
const trackWidth = track.offsetWidth;
function updateValue() {
  if (!fullscreenEl) {
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
  } else {
    animateCounter((Math.min(curIndex, total - 1) * 100) / total);
    if (fullscreenObject.exit) {
      linkPosition(900);
    }
  }
  requestAnimationFrame(updateValue);
}

const handleMouseDown = (e) => {
  track.dataset.mouseDownAt = e.clientX;
  animationDone = false;
  if (
    fullscreenEl &&
    !fullscreenObject.minimizeFullscreenEl &&
    !fullscreenObject.exit
  ) {
    fullscreenObject.minimizeFullscreenEl = true;
  }
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

let exitTimer;
const handleDrag = (e) => {
  if (track.dataset.mouseDownAt === "0") return;
  if (fullscreenEl) {
    const duration = 1200;
    if (fullscreenObject.minimizeFullscreenEl) {
      fullscreenObject.minimizeFullscreenEl = false;
      minimizeFullscreenEl(duration / 2);
    }
    fullscreenObject.exit = true;
    exitFullScreen(duration / 2);
    track.classList.add("animate");
    track.classList.remove("resize");
    track.classList.remove("mini");
    if (!exitTimer)
      exitTimer = setTimeout(() => {
        images[fullscreenObject.index].animate(
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: 10, fill: "forwards" }
        );
        setTimeout(() => {
          fullscreenEl = null;
          track.classList.remove("animate");
          fullscreenObject.exit = false;
          if (fullscreenObject.el) {
            fullscreenObject.el.remove();
            fullscreenObject.el = null;
            fullscreenObject.fullscreen = false;
          }
          exitTimer = null;
        }, 20);
      }, duration * 1.5);
  }
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
  const maxDelta = window.innerWidth / 1.2;
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

const enterFullScreen = (fullscreenEl) => {
  fullscreenObject.fullscreen = true;
  const images = track.children;
  for (let i = 0; i < images.length; i++) {
    if (images[i] === fullscreenEl) {
      curIndex = i;
      fullscreenObject.index = i;
    }
  }
  const elBox = fullscreenEl.getBoundingClientRect();
  const clone = fullscreenEl.cloneNode(true);
  fullscreenEl.animate(
    [
      {
        opacity: 1,
      },
      {
        opacity: 0,
        transform: "translateY(55vh)",
      },
    ],
    { duration: 1, fill: "forwards" }
  );
  const styles = getComputedStyle(fullscreenEl);

  fullscreenTrack.appendChild(clone);
  fullscreenObject.el = clone;
  clone.style.width = styles.width;
  clone.style.height = styles.height;
  clone.classList.add("img");
  clone.style.position = "absolute";
  clone.style.left = elBox.left + "px";
  clone.style.top = elBox.top + "px";
  clone.style.objectPosition = styles.objectPosition;

  clone.animate(
    {
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
    },
    {
      duration: 1200,
      fill: "forwards",
      easing: "cubic-bezier(0,0.6,0.5,1)",
    }
  );
};

const exitFullScreen = (duration = 600) => {
  if (!fullscreenObject.fullscreen) return;
  fullscreenObject.fullscreen = false;
  const images = track.children;
  const fullscreenEl = images[fullscreenObject.index];
  const elBox = fullscreenEl.getBoundingClientRect();
  const clone = fullscreenEl.cloneNode(true);
  const styles = getComputedStyle(fullscreenEl);
  clone.classList.add("img");
  clone.style.width = elBox.width + "px";
  clone.style.height = elBox.height + "px";
  clone.style.position = "absolute";
  clone.style.left = elBox.left + "px";
  clone.style.top = elBox.top + "px";
  clone.style.objectPosition = styles.objectPosition;
  clone.style.zIndex = "999";
  document.body.appendChild(clone);
  fullscreenEl.animate(
    [
      {
        opacity: 1,
      },
      {
        opacity: 0,
      },
    ],
    {
      duration: 10,
      fill: "forwards",
    }
  );

  clone.animate(
    [
      {
        opacity: 1,
      },
      {
        opacity: 0.25,
        top: "120%",
      },
    ],
    {
      duration: duration,
      fill: "forwards",
      easing: "ease",
    }
  );

  setTimeout(() => {
    clone.remove();
  }, duration);
};

let logged = false;
const minimizeFullscreenEl = (duration, easing) => {
  startLink = Date.now();
  const clone = fullscreenObject.el;
  const vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
  clone.animate(
    [
      {
        width: "100%",
        height: "100%",
        top: 0,
      },
      {
        width: 42 * vmin + "px",
        height: 52 * vmin + "px",
        top: "50%",
        transform: "translateY(-50%)",
      },
    ],
    {
      duration: duration,
      fill: "forwards",
      easing: easing || "cubic-bezier(0,0.4,0.5,1)",
    }
  );
  setTimeout(() => {
    images[fullscreenObject.index].animate(
      [{ opacity: 0.95 }, { opacity: 1 }],
      {
        duration: 5,
        fill: "forwards",
      }
    );
    // setTimeout(() => {
    //   fullscreenEl = null;
    //   if (fullscreenObject.el) {
    //     fullscreenObject.el.remove();
    //     fullscreenObject.el = null;
    //   }
    // }, 500);
  }, duration * 2.5);
};
const linkPosition = (duration = 600, easing) => {
  const clone = fullscreenObject.el;
  const elBox = fullscreenEl.getBoundingClientRect();
  const elBox1 = clone.getBoundingClientRect();
  // const centerDiff = (elBox1.width - elBox.width) / 2;
  const centerDiff = 0;
  const styles = getComputedStyle(fullscreenEl);
  const styles1 = getComputedStyle(clone);
  const animationTime = Math.max(5, duration + startLink - Date.now());

  clone.animate(
    [
      {
        left: elBox1.left + "px",
        objectPosition: styles1.objectPosition,
      },
      {
        left: elBox.left - centerDiff + "px",
        objectPosition: styles.objectPosition,
      },
    ],
    {
      duration: animationTime,
      fill: "forwards",
      easing: easing || "cubic-bezier(0,0.6,0.5,1)",
    }
  );
  // fullscreenTrack.removeChild(clone);
  // fullscreenObject.el = null;
};

const handleClick = (e) => {
  if (fullscreenObject.exit || fullscreenObject.el || exitTimer) return;
  fullscreenEl = e.target;
  enterFullScreen(fullscreenEl);
  minimizeTrack(fullscreenEl);
  animateCounter((Math.min(curIndex, total - 1) * 100) / total);
};

const images = track.children;
for (let i = 0; i < images.length; i++) {
  images[i].addEventListener("click", handleClick);
}
