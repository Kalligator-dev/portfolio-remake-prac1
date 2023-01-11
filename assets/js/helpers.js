const track = document.getElementById("image-track");

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
