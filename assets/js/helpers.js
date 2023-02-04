const bg = document.getElementById("bg");
const maskImg = document.getElementById("mask");
const track = document.getElementById("image-track");
const counterEl = document.getElementById("counter");
const extra = 1440 - window.innerWidth;

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

export const animateCounter = (progress, duration = 1000, easingProgress) => {
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

export const minimizeTrack = (el, duration = 1200, easingProgress) => {
  const anims = track.getAnimations();
  anims.forEach((anim) => anim.cancel());
  const { x } = getTranslateValues(track);
  track.style.transformOrigin = "left top";
  const trackWidth = +getComputedStyle(track).width.split("px")[0];
  const factor = (window.innerWidth / 2 - 100) / (trackWidth * 1.681);
  const left = window.innerWidth * 0.5 + -x * factor * 1.681 + 62.5 + "px";
  track.classList.add("mini");
  track.animate(
    {
      scale: factor,
      top: "93.75%",
      left,
    },
    {
      duration: duration,
      fill: "forwards",
      easing: easingProgress || "ease",
    }
  );

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
