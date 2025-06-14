import { logoData } from "./logo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    duration: 0.8, 
    easing: "easeInOutQuad", 
    smoothWheel: true,
    smoothTouch: true,
    touchMultiplier: 2, 
  });
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

  function updateLogoPosition() {
    const svgEl = svgOverlay.querySelector('svg');
    if (!svgEl) return;

    const vb = svgEl.viewBox.baseVal;
    if (!vb || vb.width === 0 || vb.height === 0) return;

    const vbWidth = vb.width;
    const vbHeight = vb.height;

    // Center point in viewBox coords (through letter A)
    const fixedCenterX = vbWidth / 2;
    const fixedCenterY = vbHeight * 0.12;

    const logoBoundingBox = logoMask.getBBox();
    if (!logoBoundingBox || logoBoundingBox.width === 0 || logoBoundingBox.height === 0) {
        logoMask.removeAttribute("transform");
        return;
    }

    // Mask target size in viewBox units (original logic)
    const targetWidth = Math.min(200, vbWidth * 0.2);
    const targetHeight = Math.min(150, vbHeight * 0.15);

    const horizontalScaleRatio = targetWidth / logoBoundingBox.width;
    const verticalScaleRatio = targetHeight / logoBoundingBox.height;
    
    let logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);

    if (!isFinite(logoScaleFactor) || logoScaleFactor < 0) {
        logoScaleFactor = 0; 
    }

    const logoCenterX = (logoBoundingBox.x + logoBoundingBox.width / 2) * logoScaleFactor;
    const logoCenterY = (logoBoundingBox.y + logoBoundingBox.height / 2) * logoScaleFactor;
    const horizontalPosition = fixedCenterX - logoCenterX;
    const verticalPosition = fixedCenterY - logoCenterY;

    logoMask.setAttribute(
      "transform",
      `translate(${horizontalPosition}, ${verticalPosition}) scale(${logoScaleFactor})`
    );
  }

  updateLogoPosition();
  window.addEventListener('resize', updateLogoPosition);

  ScrollTrigger.create({
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

      if (scrollProgress > 0.6 && scrollProgress < 0.85) {
        const overlayCopyRevealProgress = (scrollProgress - 0.6) * (1 / 0.25);
        const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealProgress;

        overlayCopy.style.background = 'linear-gradient(to bottom right,rgb(255, 55, 162) 0%,rgb(254, 105, 160) 33%,rgb(255, 191, 165) 66%,rgb(251, 223, 175) 100%)';
        overlayCopy.style.backgroundClip = 'text';
        overlayCopy.style.webkitTextFillColor = 'transparent'; // Retain compatibility for text fill

        gsap.set(overlayCopy, {
          scale: overlayCopyScale,
          opacity: overlayCopyRevealProgress,
        });
      } else if (scrollProgress <= 0.6) {
        gsap.set(overlayCopy, {
          opacity: 0,
        });
      }
    },
  });
});
