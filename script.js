import { logoData } from "./logo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const heroImgContainer = document.querySelector(".hero-img-container");
  const heroImgLogo = document.querySelector(".hero-img-logo");
  const heroImgCopy = document.querySelector(".hero-img-copy");
  const fadeOverlay = document.querySelector(".fade-overlay");
  const svgOverlay = document.querySelector(".overlay");
  const overlayCopy = document.querySelector("h1");

  const initialOverlayScale = 350;
  const logoContainer = document.querySelector(".logo-container");
  const logoMask = document.getElementById("logoMask");

  logoMask.setAttribute("d", logoData);

  const logoDimensions = logoContainer.getBoundingClientRect();
  const logoBoundingBox = logoMask.getBBox();

  const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;
  const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;
  const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);

  const horizontalPosition =
    logoDimensions.left +
    (logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 -
    logoBoundingBox.x * logoScaleFactor;

  const verticalPosition =
    logoDimensions.top +
    (logoDimensions.height - logoBoundingBox.height * logoScaleFactor) / 2 -
    logoBoundingBox.y * logoScaleFactor;

  logoMask.setAttribute(
    "transform",
    `translate(${horizontalPosition}, ${verticalPosition}) scale(${logoScaleFactor})`
  );

  scrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: `${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const scrollProgress = self.progress;
      const fadeOpacity = 1 - scrollProgress * (1 / 0.15);

      if (scrollProgress < 0.15) {
        gsap.set([heroImgLogo, heroImgCopy], {
          opacity: fadeOpacity,
        });
      } else {
        gsap.set([heroImgLogo, heroImgCopy], {
          opacity: 0,
        });
      }

      if (scrollProgress < 0.85) {
        const normalizedProgress = scrollProgress * (1 / 0.85);
        const heroImgContainerScale = 1.5 - 0.5 * normalizedProgress;

        const overlayScale =
          initialOverlayScale *
          Math.pow(1 / initialOverlayScale, normalizedProgress);

        let fadeoverlayOpacity = 0;

        gsap.set(heroImgContainer, {
          scale: heroImgContainerScale,
        });

        gsap.set(svgOverlay, {
          scale: overlayScale,
        });

        if (scrollProgress > 0.25) {
          fadeoverlayOpacity = Math.min(1, (scrollProgress - 0.25) * (1 / 0.4));
        }

        gsap.set(fadeOverlay, {
          opacity: fadeoverlayOpacity,
        });
      }
    },
  });
});
