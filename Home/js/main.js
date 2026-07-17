document.addEventListener('DOMContentLoaded', () => {

    // ── Typewriter effect ─────────────────────────────────────────────────────
    const titleEl = document.getElementById('main-title');

    if (titleEl) {
        const prefix = 'Bienvenido a ';
        const branded = 'Marketing Hub';
        const speed = 55; // ms per character

        // Insert blinking cursor immediately so there's no blank flash
        const cursor = document.createElement('span');
        cursor.className = 'tw-cursor';
        titleEl.appendChild(cursor);

        let i = 0;

        function typePrefix() {
            if (i < prefix.length) {
                titleEl.insertBefore(document.createTextNode(prefix[i]), cursor);
                i++;
                setTimeout(typePrefix, speed);
            } else {
                // Prefix done — now create the gradient span and type the branded part
                const brandSpan = document.createElement('span');
                brandSpan.className = 'gradient-brand';
                titleEl.insertBefore(brandSpan, cursor);
                setTimeout(() => typeBrand(brandSpan), 120);
            }
        }

        function typeBrand(brandSpan) {
            let j = 0;
            function step() {
                if (j < branded.length) {
                    brandSpan.textContent += branded[j];
                    j++;
                    setTimeout(step, speed);
                } else {
                    setTimeout(() => cursor.remove(), 800);
                }
            }
            step();
        }

        // Start typing after a short initial delay
        setTimeout(typePrefix, 400);
    }

    // ── Brand card interactions ───────────────────────────────────────────────
    const brandBtns = document.querySelectorAll('.brand-btn');

    // Dynamic mouse hover glow tracker (Premium 3D / Radial glow effect)
    brandBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const glow = btn.querySelector('.card-glow');
            if (glow) {
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
            }
        });

        // Click interaction for redirection with visual feedback
        btn.addEventListener('click', () => {
            const brand = btn.getAttribute('data-brand');

            btn.style.transform = 'scale(0.98)';
            btn.style.opacity = '0.86';

            setTimeout(() => {
                let targetUrl = '';
                switch (brand) {
                    case 'cibertec': targetUrl = '../CIBERTEC/Monitoreo-CRM/Dashboard.html'; break;
                    case 'upn': targetUrl = '../UPN/Monitoreo-CRM/Dashboard.html'; break;
                    case 'upc': targetUrl = '../UPC/Monitoreo-Leads/Dashboard.html'; break;
                    default: targetUrl = '#';
                }
                window.location.href = targetUrl;
            }, 180);
        });
    });
});

