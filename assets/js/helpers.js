import { curIndex, fullscreenEl, fullscreenObject } from "./app.js";

const bg = document.getElementById("bg");
const maskImg = document.getElementById("mask");
const track = document.getElementById("image-track");
const counterEl = document.getElementById("counter");
const trackStyle = { x: 0, width: 0 };
const extra = 1440 - window.innerWidth;

window.addEventListener("resize", () => {
  if (!fullscreenEl) return;
  minimizeTrack(fullscreenEl, 1200, true);
});

export const animateTrack = (
  progress,
  duration = 1200,
  { easingProgress, easingParallax } = {}
) => {
  bg.animate(
    {
      transform: `translate(${-Math.min(progress * 0.5, 50)}%, 0)`,
      filter: `grayscale(${100 - progress}%)`,
    },
    {
      duration: duration,
      fill: "forwards",
      easing: easingProgress || "cubic-bezier(0.66, 0.16, 0.63, 0.86)",
    }
  );
  maskImg.animate(
    {
      transform: `translate(${(-progress * extra) / 100}px, -50%)`,
    },
    {
      duration: duration,
      fill: "forwards",
      easing: easingProgress || "cubic-bezier(0.66, 0.16, 0.63, 0.86)",
    }
  );
  track.animate(
    {
      transform: `translate(${-progress}%, -50%)`,
    },
    {
      duration: duration,
      fill: "forwards",
      easing: easingProgress || "cubic-bezier(0.66, 0.16, 0.63, 0.86)",
    }
  );

  for (const image of track.getElementsByClassName("img")) {
    image.animate(
      {
        objectPosition: `${100 - progress}% center`,
      },
      {
        duration: duration,
        fill: "forwards",
        easing: easingParallax || "cubic-bezier(0.66, 0.16, 0.63, 0.86)",
      }
    );
  }
};

export const animateCounter = (progress, duration = 1000) => {
  counterEl.animate(
    {
      transform: `translate(0, ${-progress}%)`,
    },
    {
      duration: duration,
      fill: "forwards",
      easing: "cubic-bezier(0, 0.2, 0, 0.95)",
    }
  );
};

export const resizeTrack = () => {};

export const minimizeTrack = (el, duration = 1200, resize) => {
  track.classList.remove("resize");
  const anims = track.getAnimations();
  anims.forEach((anim) => anim.pause());
  const { x } = getTranslateValues(track);
  trackStyle.x = x;
  track.style.transformOrigin = "left top";
  const vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
  const trackWdth = Math.floor(vmin * 20 + vmin * 42 * 11);
  const trackWidth = +getComputedStyle(track).width.split("px")[0];
  const factor = (window.innerWidth / 2 - 100) / (trackWdth * 1.681);
  const factorSm = (window.innerWidth - 100) / (trackWdth * 1.681);
  const left = window.innerWidth * 0.5 + -x * factor * 1.681 + 62.5 + "px";
  const leftSm = 50 + -x * factorSm * 1.681 + "px";
  document.documentElement.style.setProperty("--track-scale", factor);
  document.documentElement.style.setProperty("--track-scale-sm", factorSm);
  document.documentElement.style.setProperty("--track-left", left);
  document.documentElement.style.setProperty("--track-left-sm", leftSm);
  track.classList.add("mini");
  track.classList.add("resize");
  if (resize) return;
  el.animate(
    [
      {
        opacity: 0.25,
      },
      {
        opacity: 1,
        transform: "translateY(0)",
      },
    ],
    {
      delay: duration * 0.9,
      duration: duration / 2,
      fill: "forwards",
      easing: "ease",
    }
  );
};

export function getTranslateValues(element) {
  const style = window.getComputedStyle(element);
  const matrix = style.transform || style.webkitTransform || style.mozTransform;

  // No transform property. Simply return 0 values.
  if (matrix === "none") {
    return {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  // Can either be 2d or 3d transform
  const matrixType = matrix.includes("3d") ? "3d" : "2d";
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");

  // 2d matrices have 6 values
  // Last 2 values are X and Y.
  // 2d matrices does not have Z value.
  if (matrixType === "2d") {
    return {
      x: matrixValues[4],
      y: matrixValues[5],
      z: 0,
    };
  }

  // 3d matrices have 16 values
  // The 13th, 14th, and 15th values are X, Y, and Z
  if (matrixType === "3d") {
    return {
      x: matrixValues[12],
      y: matrixValues[13],
      z: matrixValues[14],
    };
  }
}

export function easeInQuad(time, b, c, d) {
  return c * (time /= d) * time + b;
}
