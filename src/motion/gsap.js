/** Single place where GSAP and its plugins are registered. Import from here, never from 'gsap' directly. */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.4 });

export { gsap, ScrollTrigger, useGSAP };
