document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL COMPONENTS ---

    // 1. Mouse Glow Effect
    const glow = document.getElementById('mouse-glow');
    if (glow) {
        window.addEventListener('mousemove', (e) => {
            glow.style.left = `${e.pageX}px`;
            glow.style.top = `${e.pageY}px`;
        });
    }

    // 2. Mobile Menu Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    if (hamburgerBtn && mobileMenu) {
        const toggleMenu = () => {
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            body.classList.toggle('overflow-hidden', !isMenuOpen); // Use overflow-hidden for better scroll lock
            hamburgerBtn.innerHTML = !isMenuOpen 
                ? `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>` 
                : `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16" /></svg>`;
        };
        hamburgerBtn.addEventListener('click', toggleMenu);
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    toggleMenu();
                }
            });
        });
    }
    
    // 3. Dynamic Year in Footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 4. Scroll-triggered Animations
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // General fade-in-up animation
                if (entry.target.classList.contains('animate-on-scroll')) {
                    entry.target.classList.add('animate-fade-in-up');
                }
                // Skill bar animation
                if (entry.target.classList.contains('skill-bar-fill')) {
                    const level = entry.target.getAttribute('data-skill-level');
                    if (level) {
                        entry.target.style.width = `${level}%`;
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll, .skill-bar-fill').forEach(el => {
        scrollObserver.observe(el);
    });


    // --- PAGE-SPECIFIC SCRIPTS ---

    // 5. Contact Page Flip Card
    const contactCard = document.getElementById('contact-card');
    if (contactCard) {
        contactCard.addEventListener('click', () => {
            contactCard.querySelector('.card-inner').classList.toggle('is-flipped');
        });
    }

    // 6. Survey/Calculator Page Logic
    const calculatorWrapper = document.getElementById('load-calculator-wrapper');
    if (calculatorWrapper) {
        const applianceList = document.getElementById('appliance-list');
        const addBtn = document.getElementById('add-appliance-btn');
        const voltageInput = document.getElementById('voltage');
        const standardRadios = document.querySelectorAll('input[name="standard_selection"]');

        const calculateLoad = () => {
            const voltage = parseFloat(voltageInput.value) || 0;
            let totalWatts = 0;
            
            document.querySelectorAll('#appliance-list .appliance-row').forEach(row => {
                const watts = parseFloat(row.querySelector('.appliance-watts').value) || 0;
                const qty = parseInt(row.querySelector('.appliance-qty').value) || 0;
                totalWatts += watts * qty;
            });

            const totalAmps = voltage > 0 ? totalWatts / voltage : 0;
            const requiredAmps = totalAmps / 0.8; // 80% safety margin

            const currentStandard = document.querySelector('input[name="standard_selection"]:checked').value;
            let breaker, wire;

            if (currentStandard === 'iec') {
                const sizes = [6, 10, 16, 20, 25, 32, 40, 63];
                const wireSizes = { 6: '1.0mm²', 10: '1.5mm²', 16: '2.5mm²', 20: '2.5mm²', 25: '4.0mm²', 32: '6.0mm²', 40: '10mm²', 63: '16mm²' };
                breaker = sizes.find(s => s >= requiredAmps) || 'Over 63A';
                wire = wireSizes[breaker] || 'Consult Electrician';
            } else { // NEC
                const sizes = [15, 20, 30, 40, 50, 60];
                const wireSizes = { 15: '14 AWG', 20: '12 AWG', 30: '10 AWG', 40: '8 AWG', 50: '6 AWG', 60: '6 AWG' };
                breaker = sizes.find(s => s >= requiredAmps) || 'Over 60A';
                wire = wireSizes[breaker] || 'Consult Electrician';
            }

            document.getElementById('total-watts').textContent = `${totalWatts.toFixed(0)} W`;
            document.getElementById('total-amps').textContent = `${totalAmps.toFixed(2)} A`;
            document.getElementById('breaker-size').textContent = typeof breaker === 'number' ? `${breaker} A` : breaker;
            document.getElementById('wire-gauge').textContent = wire;
        };

        const addApplianceRow = () => {
            const rowId = `row-${Date.now()}`;
            const row = document.createElement('div');
            row.className = 'appliance-row grid grid-cols-1 md:grid-cols-12 gap-4 items-center';
            row.id = rowId;
            row.innerHTML = `
                <div class="md:col-span-5"><input type="text" placeholder="Appliance (e.g., Heater)" class="appliance-name w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"></div>
                <div class="md:col-span-3"><input type="number" placeholder="Wattage (W)" class="appliance-watts w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"></div>
                <div class="md:col-span-2"><input type="number" value="1" min="1" class="appliance-qty w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"></div>
                <div class="md:col-span-2"><button type="button" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md transition" onclick="document.getElementById('${rowId}').remove(); this.closest('#load-calculator-wrapper').dispatchEvent(new Event('calculate'));">✕</button></div>
            `;
            applianceList.appendChild(row);
        };

        const updateStandard = () => {
            const standard = document.querySelector('input[name="standard_selection"]:checked').value;
            voltageInput.value = standard === 'iec' ? 230 : 120;
            document.getElementById('breaker-label').textContent = standard === 'iec' ? 'Required MCB Size:' : 'Required Breaker Size:';
            document.getElementById('wire-gauge-label').textContent = standard === 'iec' ? 'Suggested Wire Size (Copper):' : 'Suggested Wire Gauge (Copper):';
            calculateLoad();
        };
        
        // Use event delegation for a cleaner approach
        calculatorWrapper.addEventListener('input', calculateLoad);
        calculatorWrapper.addEventListener('calculate', calculateLoad);
        standardRadios.forEach(radio => radio.addEventListener('change', updateStandard));
        addBtn.addEventListener('click', addApplianceRow);

        // Initialize with one row
        addApplianceRow();
    }
});