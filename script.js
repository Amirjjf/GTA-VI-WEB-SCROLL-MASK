import { logoData } from "./logo";
import {gsap} from "gsap";
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
    




});