/* ========================================
   SPOTBUST — GSAP Animations
   Parallax, Flying Finger, Scroll Reveals
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // ---- HERO PARALLAX BACKGROUND ----
    const heroBg = document.querySelector('.hero-bg');
    const heroSub = document.querySelector('.hero-sub');

    if (heroBg) {
        gsap.to(heroBg, {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        });
    }

    // Subline faded weg
    if (heroSub) {
        gsap.to(heroSub, {
            y: -40,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: '40% top',
                scrub: true,
            }
        });
    }


    // ---- PARALLAX DIVIDER IMAGES ----
    document.querySelectorAll('.parallax-divider .parallax-img').forEach(img => {
        gsap.to(img, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: img.closest('.parallax-divider'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });
    });


    // ---- FLYING FINGER ----
    const finger = document.getElementById('flying-finger');
    if (finger) {
        initFlyingFinger(finger);
    }


    // ---- SECTION TITLE REVEALS ----
    document.querySelectorAll('.section-title').forEach(title => {
        gsap.from(title, {
            x: -80,
            opacity: 0,
            rotation: -5,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    });


    // ---- GIG ITEMS STAGGER REVEAL ----
    // Warten bis Gigs geladen sind (per MutationObserver)
    const gigList = document.getElementById('gig-list');
    if (gigList) {
        const observer = new MutationObserver(() => {
            const items = gigList.querySelectorAll('.gig-item');
            if (items.length > 0) {
                observer.disconnect();
                gsap.from(items, {
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: gigList,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    }
                });
            }
        });
        observer.observe(gigList, { childList: true, subtree: true });
    }


    // ---- MEDIA GRID ITEMS ----
    document.querySelectorAll('.media-item').forEach((item, i) => {
        gsap.from(item, {
            y: 40,
            opacity: 0,
            rotation: (i % 2 === 0) ? -3 : 3,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    });


    // ---- KONTAKT SECTION ----
    const emailLink = document.querySelector('.email-link');
    if (emailLink) {
        gsap.from(emailLink, {
            scale: 0.5,
            opacity: 0,
            rotation: -8,
            duration: 0.7,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '#kontakt',
                start: 'top 75%',
                toggleActions: 'play none none reverse',
            }
        });
    }

});


/* =============================================
   FLYING FINGER — flies between sections
   ============================================= */

function initFlyingFinger(finger) {

    // Set initial state: centered in viewport, 50vw
    gsap.set(finger, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        width: '50vw',
        maxWidth: '400px',
        opacity: 1,
        rotation: 0,
        scale: 1,
    });

    // ============ MASTER TIMELINE — scroll-coupled ============
    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            endTrigger: 'footer',
            scrub: 1.2,
        }
    });

    // Phase 1: Shrink from hero-size, drift slightly right
    masterTl.to(finger, {
        width: '70px',
        maxWidth: 'none',
        left: '60%',
        top: '40%',
        rotation: -8,
        ease: 'power2.inOut',
        duration: 3,
    })

    // Phase 2: Gentle drift right while passing gigs
    .to(finger, {
        left: '65%',
        top: '38%',
        rotation: 5,
        duration: 2,
        ease: 'power1.inOut',
    })

    // Subtle move toward left-center (media section)
    .to(finger, {
        left: '38%',
        top: '50%',
        rotation: -10,
        duration: 3,
        ease: 'power1.inOut',
    })

    // Small lazy rotation
    .to(finger, {
        rotation: 350,
        duration: 1.5,
        ease: 'power1.inOut',
    })

    // Phase 3: Settle back to center (kontakt)
    .to(finger, {
        left: '50%',
        top: '50%',
        rotation: 0,
        width: '90px',
        scale: 1.1,
        duration: 3,
        ease: 'power2.inOut',
    })

    // Point at email
    .to(finger, {
        rotation: -20,
        scale: 1.2,
        duration: 1,
        ease: 'power2.inOut',
    })

    // Fade out gently
    .to(finger, {
        left: '55%',
        top: '40%',
        rotation: 10,
        opacity: 0,
        scale: 0.7,
        duration: 2,
        ease: 'power2.in',
    });

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}
