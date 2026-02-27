/* ========================================
   SPOTBUST — Main JS
   Lädt Gig-Daten aus gigs.json
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Jahr im Footer ----
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---- Mobile Burger Menu ----
    const burger = document.getElementById('burger');
    const navLinks = document.querySelector('.nav-links');
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        // Schließen bei Klick auf Link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // ---- Gigs laden ----
    loadGigs();
});


async function loadGigs() {
    const container = document.getElementById('gig-list');
    if (!container) return;

    try {
        const res = await fetch('gigs.json');
        if (!res.ok) throw new Error('Netzwerkfehler');
        const gigs = await res.json();

        // Sortieren nach Datum (nächster Termin zuerst)
        gigs.sort((a, b) => new Date(a.datum) - new Date(b.datum));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Aufteilen in upcoming & past
        const upcoming = gigs.filter(g => new Date(g.datum) >= today);
        const past = gigs.filter(g => new Date(g.datum) < today);

        container.innerHTML = '';

        if (upcoming.length === 0 && past.length === 0) {
            container.innerHTML = '<p class="no-gigs">Aktuell keine Termine eingetragen.</p>';
            return;
        }

        // Upcoming Gigs
        upcoming.forEach(gig => {
            container.appendChild(createGigElement(gig, false));
        });

        // Vergangene Gigs (leicht ausgegraut)
        if (past.length > 0) {
            const pastHeader = document.createElement('p');
            pastHeader.style.cssText = 'margin-top:2rem;font-size:0.8rem;opacity:0.4;text-transform:uppercase;letter-spacing:3px;';
            pastHeader.textContent = '— Vergangene Shows —';
            container.appendChild(pastHeader);

            past.reverse().forEach(gig => {
                container.appendChild(createGigElement(gig, true));
            });
        }

    } catch (err) {
        console.error('Fehler beim Laden der Gigs:', err);
        container.innerHTML = '<p class="no-gigs">Termine konnten nicht geladen werden.</p>';
    }
}


function createGigElement(gig, isPast) {
    const div = document.createElement('div');
    div.className = 'gig-item' + (isPast ? ' gig-past' : '');

    // Datum formatieren (z.B. "14. MÄR")
    const date = new Date(gig.datum);
    const day = date.getDate();
    const months = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Wochentag
    const weekdays = ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'];
    const weekday = weekdays[date.getDay()];

    const infoHtml = gig.info ? `<span class="gig-info">${escapeHtml(gig.info)}</span>` : '';

    div.innerHTML = `
    <div class="gig-date">${day}. ${month} ${year}<br><small style="font-size:0.65em;opacity:0.6;">${weekday}</small></div>
    <div class="gig-details">
      <span class="gig-venue">${escapeHtml(gig.venue)}</span>
      <span class="gig-city">${escapeHtml(gig.stadt)}</span>
      ${infoHtml}
    </div>
    <div class="gig-time">${gig.uhrzeit ? escapeHtml(gig.uhrzeit) + ' Uhr' : ''}</div>
  `;

    return div;
}


function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
