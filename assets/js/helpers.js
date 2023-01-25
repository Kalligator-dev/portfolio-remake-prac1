const track = document.getElementById("image-track");
const counterEl = document.getElementById("counter");

export const animateTrack = (
  progress,
  duration = 1200,
  { easingProgress, easingParallax } = {}
) => {
  track.animate(
    {
      transform: `translate(${-progress}%, -50%)`,
    },
    {
      duration: duration,
      fill: "forwards",
      easing: easingProgress || "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
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
        easing: easingParallax || "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
      }
    );
  }
};

export const animateCounter = (progress, duration = 200, easingProgress) => {
  counterEl.animate(
    {
      transform: `translate(0, ${-progress}%)`,
    },
    {
      duration: duration,
      fill: "forwards",
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
