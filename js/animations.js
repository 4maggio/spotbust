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

    // Finger startet groß und zentriert im Hero (CSS setzt initial left:50%, top:50%)
    // GSAP übernimmt ab hier

    const heroHeight = document.getElementById('hero').offsetHeight;

    // Set initial state: centered in viewport, large
    gsap.set(finger, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        width: 'min(70vw, 420px)',
        opacity: 1,
        rotation: 0,
        scale: 1,
    });

    // ============ PHASE 1: Hero → Shrink while scrolling out of hero ============
    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            endTrigger: 'footer',
            scrub: 1.2,
            // pin: false,
        }
    });

    // Finger shrinks from hero-size to small traveling size
    masterTl.to(finger, {
        width: '80px',
        left: '80%',
        top: '40%',
        rotation: -15,
        ease: 'power2.inOut',
        duration: 3,
    })

    // ============ PHASE 2: Travel alongside content ============
    // Drift to the right side while passing gigs
    .to(finger, {
        left: '85%',
        top: '35%',
        rotation: 10,
        duration: 2,
        ease: 'power1.inOut',
    })

    // Swing over to the left (during media section)
    .to(finger, {
        left: '10%',
        top: '60%',
        rotation: -25,
        duration: 3,
        ease: 'power1.inOut',
    })

    // Little spin
    .to(finger, {
        rotation: 335,
        duration: 1,
        ease: 'power1.inOut',
    })

    // ============ PHASE 3: Settle bottom center ============
    // Move toward center-bottom (kontakt area)
    .to(finger, {
        left: '50%',
        top: '50%',
        rotation: 0,
        width: '100px',
        scale: 1.15,
        duration: 3,
        ease: 'power2.inOut',
    })

    // Final position: pointing at email, slightly larger
    .to(finger, {
        rotation: -30,
        scale: 1.3,
        duration: 1,
        ease: 'power2.inOut',
    })

    // Fly off screen
    .to(finger, {
        left: '110%',
        top: '30%',
        rotation: 45,
        opacity: 0,
        scale: 0.5,
        duration: 2,
        ease: 'power2.in',
    });

    // Bei Resize neu berechnen
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}
