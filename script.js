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
  // Function to update logo position responsively
  function updateLogoPosition() {
    const logoBoundingBox = logoMask.getBBox();
    
    // Use fixed viewport coordinates for consistent positioning across screen sizes
    const svgWidth = window.innerWidth;
    const svgHeight = window.innerHeight;
    
    // Fixed center position - same across all screen sizes (center of viewport)
    const fixedCenterX = svgWidth / 2;
    const fixedCenterY = svgHeight * 0.25; // 25% from top, consistent position
    
    // Calculate scale based on a target size that works well across screens
    const targetWidth = Math.min(200, svgWidth * 0.2); // Max 200px or 20% of screen width
    const targetHeight = Math.min(150, svgHeight * 0.15); // Max 150px or 15% of screen height
    
    const horizontalScaleRatio = targetWidth / logoBoundingBox.width;
    const verticalScaleRatio = targetHeight / logoBoundingBox.height;
    const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);
    
    // Calculate the offset needed to center the logo path at the fixed position
    const logoCenterX = (logoBoundingBox.x + logoBoundingBox.width / 2) * logoScaleFactor;
    const logoCenterY = (logoBoundingBox.y + logoBoundingBox.height / 2) * logoScaleFactor;
    
    const horizontalPosition = fixedCenterX - logoCenterX;
    const verticalPosition = fixedCenterY - logoCenterY;

    logoMask.setAttribute(
      "transform",
      `translate(${horizontalPosition}, ${verticalPosition}) scale(${logoScaleFactor})`
    );
  }

  // Initial positioning
  updateLogoPosition();

  // Update positioning on window resize
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

        const gradientSpread = 100;
        const gradientBottomPosition = 240 - overlayCopyRevealProgress * 280;
        const gradientTopPosition = gradientBottomPosition - gradientSpread;
        const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealProgress;

        overlayCopy.style.background = `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%, #e66461 ${gradientBottomPosition}%, #e66461 100%)`;
        overlayCopy.style.backgroundClip = "text";

        gsap.set(overlayCopy, {
          scale: overlayCopyScale,
          opacity: overlayCopyRevealProgress,
        });
      } else if (scrollProgress<= 0.6) {
        gsap.set(overlayCopy, {
          opacity: 0,
        });
        }     
    },
  });
});
