/* ========================================
   SPOTBUST — GSAP Animations
   Parallax, Flying Finger, Scroll Reveals
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // ---- HERO PARALLAX BACKGROUND ----
    const heroBg = document.querySelector('.hero-bg');
    const heroLogo = document.querySelector('.hero-logo');
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

    // Logo schiebt sich langsam hoch beim Scrollen + leichter Scale
    if (heroLogo) {
        gsap.to(heroLogo, {
            y: -80,
            scale: 0.9,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: '60% top',
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

    // Waypoints: Positionen wo der Finger "hin fliegt" beim Scrollen
    // Er taucht auf nach dem Hero und begleitet den User durch die Seite
    const sections = ['#gigs', '#media', '#kontakt'];

    // Erst mal: Finger erscheint wenn Hero verschwindet
    gsap.set(finger, { xPercent: -50, yPercent: -50 });

    // Phase 1: Finger fliegt von rechts rein beim Gigs-Section
    ScrollTrigger.create({
        trigger: '#gigs',
        start: 'top 90%',
        end: 'top 40%',
        onEnter: () => {
            gsap.to(finger, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
            });
        },
        onLeaveBack: () => {
            gsap.to(finger, {
                opacity: 0,
                duration: 0.3,
            });
        }
    });

    // Der Finger fliegt entlang eines Pfades beim Scrollen
    // Berechne die Positionen dynamisch
    const buildTimeline = () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#gigs',
                start: 'top 80%',
                end: 'bottom top',
                endTrigger: 'footer',
                scrub: 1,
            }
        });

        // Start: rechts neben der Seite
        tl.fromTo(finger,
            {
                x: () => window.innerWidth - 100,
                y: () => window.innerHeight * 0.5,
                rotation: -15,
            },
            {
                x: () => window.innerWidth - 80,
                y: () => window.innerHeight * 0.3,
                rotation: 10,
                duration: 1,
            }
        )
            // Rüber zur linken Seite (beim Media-Section)
            .to(finger, {
                x: 30,
                y: () => window.innerHeight * 0.6,
                rotation: -20,
                duration: 2,
                ease: 'power1.inOut',
            })
            // Kurzer Spin
            .to(finger, {
                rotation: 360 - 20,
                duration: 0.5,
                ease: 'power1.inOut',
            })
            // Rüber nach rechts unten (Kontakt)
            .to(finger, {
                x: () => window.innerWidth * 0.5,
                y: () => window.innerHeight * 0.4,
                rotation: 0,
                duration: 2,
                ease: 'power1.inOut',
            })
            // Finger zeigt auf die E-Mail
            .to(finger, {
                x: () => window.innerWidth * 0.5 - 40,
                y: () => window.innerHeight * 0.5,
                rotation: -30,
                scale: 1.2,
                duration: 1,
                ease: 'power2.inOut',
            })
            // Und tschüss — fliegt raus
            .to(finger, {
                x: () => window.innerWidth + 100,
                y: () => window.innerHeight * 0.3,
                rotation: 45,
                opacity: 0,
                scale: 0.5,
                duration: 1.5,
                ease: 'power2.in',
            });

        return tl;
    };

    buildTimeline();

    // Bei Resize neu berechnen
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}
