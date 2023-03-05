const bg = document.getElementById("bg");
const maskImg = document.getElementById("mask");
const track = document.getElementById("image-track");
const counterEl = document.getElementById("counter");
let extra = 1440 - window.innerWidth;

window.addEventListener("resize", () => {
  extra = 1440 - window.innerWidth;
  maskImg.animate(
    {
      transform: `translate(${
        (-track.dataset.percentage * extra) / 100
      }px, -50%)`,
    },
    {
      duration: 50,
      fill: "forwards",
      easing: "cubic-bezier(0.66, 0.16, 0.63, 0.86)",
    }
  );
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
