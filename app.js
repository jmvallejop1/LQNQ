/**
 * Calculadora de Efectivo · San Mateo 2026
 * Peña Los Que No Querían (Monzón)
 * 100% Estática (HTML + CSS + JS)
 */

(function () {
  'use strict';

  // --- Configuration & Pricing ---
  const DINNERS_CONFIG = {
    jueves: {
      name: 'Jueves 17 (Paella)',
      priceSocio: 13,
      priceInvitado: 20
    },
    viernes: {
      name: 'Viernes 18 (Albóndigas)',
      priceSocio: 13,
      priceInvitado: 20
    },
    sabado: {
      name: 'Sábado 19 (Pollo chilindrón)',
      priceSocio: 13,
      priceInvitado: 20
    },
    domingo: {
      name: 'Domingo 20 (Carrilleras)',
      priceSocio: 13,
      priceInvitado: 20
    },
    lunes: {
      name: 'Lunes 21 (Sobaquillo)',
      priceSocio: 3,
      priceInvitado: 5
    }
  };

  const BONOS_CONFIG = {
    peña: 20,
    cubatas: 60,
    cervezas: 30
  };

  // --- State ---
  const state = {
    dinners: {
      jueves: { socio: 0, invitado: 0 },
      viernes: { socio: 0, invitado: 0 },
      sabado: { socio: 0, invitado: 0 },
      domingo: { socio: 0, invitado: 0 },
      lunes: { socio: 0, invitado: 0 }
    },
    bonos: {
      peña: 0,
      cubatas: 0,
      cervezas: 0
    }
  };

  const STORAGE_KEY = 'lqnq_cash_calc_dual_v3';

  // --- Helpers for Persistence ---
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  function loadSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (parsed.dinners) {
            for (const day of Object.keys(state.dinners)) {
              if (parsed.dinners[day]) {
                state.dinners[day].socio = Math.max(0, parseInt(parsed.dinners[day].socio, 10) || 0);
                state.dinners[day].invitado = Math.max(0, parseInt(parsed.dinners[day].invitado, 10) || 0);
              }
            }
          }
          if (parsed.bonos) {
            state.bonos.peña = Math.max(0, parseInt(parsed.bonos.peña, 10) || 0);
            state.bonos.cubatas = Math.max(0, parseInt(parsed.bonos.cubatas, 10) || 0);
            state.bonos.cervezas = Math.max(0, parseInt(parsed.bonos.cervezas, 10) || 0);
          }
        }
      }
    } catch (e) {
      console.warn('Could not load saved state', e);
    }
  }



  // --- Render UI ---
  function updateUI() {
    let dinnersTotal = 0;
    let totalDinersCount = 0;

    // 1. Dinners
    for (const [day, cfg] of Object.entries(DINNERS_CONFIG)) {
      const counts = state.dinners[day];
      const socioCount = counts.socio;
      const invitadoCount = counts.invitado;

      const subSocio = socioCount * cfg.priceSocio;
      const subInvitado = invitadoCount * cfg.priceInvitado;
      const subDay = subSocio + subInvitado;

      dinnersTotal += subDay;
      totalDinersCount += (socioCount + invitadoCount);

      // Inputs
      const inputSocio = document.getElementById(`input-dinner-${day}-socio`);
      const inputInvitado = document.getElementById(`input-dinner-${day}-invitado`);
      if (inputSocio) inputSocio.value = socioCount;
      if (inputInvitado) inputInvitado.value = invitadoCount;

      // Subtotals
      const subSocioEl = document.getElementById(`subtotal-${day}-socio`);
      const subInvitadoEl = document.getElementById(`subtotal-${day}-invitado`);
      const totalDayEl = document.getElementById(`total-dinner-${day}`);

      if (subSocioEl) subSocioEl.textContent = `${subSocio} €`;
      if (subInvitadoEl) subInvitadoEl.textContent = `${subInvitado} €`;
      if (totalDayEl) totalDayEl.textContent = `${subDay} €`;

      // Tier boxes active states
      const boxSocio = document.getElementById(`box-${day}-socio`);
      const boxInvitado = document.getElementById(`box-${day}-invitado`);
      if (boxSocio) {
        boxSocio.classList.toggle('tier-active', socioCount > 0);
        const minusBtn = boxSocio.querySelector('.btn-minus');
        if (minusBtn) minusBtn.disabled = socioCount <= 0;
      }
      if (boxInvitado) {
        boxInvitado.classList.toggle('tier-active', invitadoCount > 0);
        const minusBtn = boxInvitado.querySelector('.btn-minus');
        if (minusBtn) minusBtn.disabled = invitadoCount <= 0;
      }

      // Card overall active state
      const card = document.getElementById(`card-dinner-${day}`);
      if (card) {
        card.classList.toggle('has-items', subDay > 0);
      }
    }

    // 2. Bonos
    let bonosTotal = 0;

    // Bono Peña
    const countPeña = state.bonos.peña;
    const subPeña = countPeña * BONOS_CONFIG.peña;
    bonosTotal += subPeña;
    const inputPeña = document.getElementById('input-bono-peña');
    const subPeñaEl = document.getElementById('subtotal-bono-peña');
    const cardPeña = document.getElementById('card-bono-peña');
    if (inputPeña) inputPeña.value = countPeña;
    if (subPeñaEl) subPeñaEl.textContent = `${subPeña} €`;
    if (cardPeña) {
      cardPeña.classList.toggle('has-items', countPeña > 0);
      const minus = cardPeña.querySelector('.btn-minus');
      if (minus) minus.disabled = countPeña <= 0;
    }

    // Bono Cubatas
    const countCubatas = state.bonos.cubatas;
    const subCubatas = countCubatas * BONOS_CONFIG.cubatas;
    bonosTotal += subCubatas;
    const inputCubatas = document.getElementById('input-bono-cubatas');
    const subCubatasEl = document.getElementById('subtotal-bono-cubatas');
    const cardCubatas = document.getElementById('card-bono-senpa-cubatas');
    if (inputCubatas) inputCubatas.value = countCubatas;
    if (subCubatasEl) subCubatasEl.textContent = `${subCubatas} €`;
    if (cardCubatas) {
      cardCubatas.classList.toggle('has-items', countCubatas > 0);
      const minus = cardCubatas.querySelector('.btn-minus');
      if (minus) minus.disabled = countCubatas <= 0;
    }

    // Bono Cervezas
    const countCervezas = state.bonos.cervezas;
    const subCervezas = countCervezas * BONOS_CONFIG.cervezas;
    bonosTotal += subCervezas;
    const inputCervezas = document.getElementById('input-bono-cervezas');
    const subCervezasEl = document.getElementById('subtotal-bono-cervezas');
    const cardCervezas = document.getElementById('card-bono-senpa-cervezas');
    if (inputCervezas) inputCervezas.value = countCervezas;
    if (subCervezasEl) subCervezasEl.textContent = `${subCervezas} €`;
    if (cardCervezas) {
      cardCervezas.classList.toggle('has-items', countCervezas > 0);
      const minus = cardCervezas.querySelector('.btn-minus');
      if (minus) minus.disabled = countCervezas <= 0;
    }

    // 3. Grand Total
    const grandTotalVal = dinnersTotal + bonosTotal;
    const totalEl = document.getElementById('display-grand-total');
    const mobileTotalEl = document.getElementById('mobile-grand-total');
    const mobileCountEl = document.getElementById('mobile-items-count');
    const helperTextEl = document.getElementById('total-helper-text');

    if (totalEl) totalEl.textContent = grandTotalVal;
    if (mobileTotalEl) mobileTotalEl.textContent = `${grandTotalVal} €`;

    const totalBonosCount = countPeña + countCubatas + countCervezas;
    const summaryPieces = [];
    if (totalDinersCount > 0) summaryPieces.push(`${totalDinersCount} comensales`);
    if (totalBonosCount > 0) summaryPieces.push(`${totalBonosCount} bonos`);

    if (mobileCountEl) {
      mobileCountEl.textContent = summaryPieces.length > 0 ? summaryPieces.join(' · ') : '0 selecciones';
    }

    if (helperTextEl) {
      if (grandTotalVal === 0) {
        helperTextEl.textContent = 'Selecciona tus comensales y bonos';
      } else {
        helperTextEl.textContent = `Total listo para llevar en efectivo (${summaryPieces.join(', ')})`;
      }
    }

    // 4. Breakdown ticket
    renderBreakdownList();

    // 5. Save state
    saveState();
  }

  function renderBreakdownList() {
    const listEl = document.getElementById('breakdown-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const items = [];

    // Dinners
    for (const [day, cfg] of Object.entries(DINNERS_CONFIG)) {
      const counts = state.dinners[day];
      if (counts.socio > 0) {
        items.push({
          type: 'socio',
          title: `${cfg.name} · Peñista`,
          qty: `${counts.socio}x (${cfg.priceSocio}€)`,
          subtotal: `${counts.socio * cfg.priceSocio} €`
        });
      }
      if (counts.invitado > 0) {
        items.push({
          type: 'invitado',
          title: `${cfg.name} · No Peñista`,
          qty: `${counts.invitado}x (${cfg.priceInvitado}€)`,
          subtotal: `${counts.invitado * cfg.priceInvitado} €`
        });
      }
    }

    // Bonos
    if (state.bonos.peña > 0) {
      items.push({
        type: 'bono',
        title: 'Bono Barra Peña',
        qty: `${state.bonos.peña}x (20€)`,
        subtotal: `${state.bonos.peña * BONOS_CONFIG.peña} €`
      });
    }
    if (state.bonos.cubatas > 0) {
      items.push({
        type: 'bono',
        title: 'Bono Cubatas SENPA',
        qty: `${state.bonos.cubatas}x (60€)`,
        subtotal: `${state.bonos.cubatas * BONOS_CONFIG.cubatas} €`
      });
    }
    if (state.bonos.cervezas > 0) {
      items.push({
        type: 'bono',
        title: 'Bono Cervezas SENPA',
        qty: `${state.bonos.cervezas}x (30€)`,
        subtotal: `${state.bonos.cervezas * BONOS_CONFIG.cervezas} €`
      });
    }

    if (items.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <span>No has seleccionado ningún menú ni bono todavía.</span>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = `breakdown-item item-${item.type}`;
      div.innerHTML = `
        <div>
          <span class="bi-name">${item.title}</span>
          <span class="bi-qty">${item.qty}</span>
        </div>
        <span class="bi-price">${item.subtotal}</span>
      `;
      listEl.appendChild(div);
    });
  }



  // --- WhatsApp & Text Message Builder ---
  function generateSummaryText() {
    let dinnersSum = 0;
    const dinnerLines = [];

    for (const [day, cfg] of Object.entries(DINNERS_CONFIG)) {
      const counts = state.dinners[day];
      const parts = [];
      let dayTotal = 0;

      if (counts.socio > 0) {
        const sub = counts.socio * cfg.priceSocio;
        dayTotal += sub;
        parts.push(`${counts.socio} Peñista (${cfg.priceSocio}€)`);
      }
      if (counts.invitado > 0) {
        const sub = counts.invitado * cfg.priceInvitado;
        dayTotal += sub;
        parts.push(`${counts.invitado} No Peñista (${cfg.priceInvitado}€)`);
      }

      if (parts.length > 0) {
        dinnersSum += dayTotal;
        dinnerLines.push(`  • ${cfg.name}: ${parts.join(' + ')} = ${dayTotal}€`);
      }
    }

    let bonosSum = 0;
    const bonoLines = [];
    if (state.bonos.peña > 0) {
      const sub = state.bonos.peña * BONOS_CONFIG.peña;
      bonosSum += sub;
      bonoLines.push(`  • ${state.bonos.peña}x Bono Barra Peña (20€) = ${sub}€`);
    }
    if (state.bonos.cubatas > 0) {
      const sub = state.bonos.cubatas * BONOS_CONFIG.cubatas;
      bonosSum += sub;
      bonoLines.push(`  • ${state.bonos.cubatas}x Bono Cubatas SENPA (60€) = ${sub}€`);
    }
    if (state.bonos.cervezas > 0) {
      const sub = state.bonos.cervezas * BONOS_CONFIG.cervezas;
      bonosSum += sub;
      bonoLines.push(`  • ${state.bonos.cervezas}x Bono Cervezas SENPA (30€) = ${sub}€`);
    }

    const grandTotalVal = dinnersSum + bonosSum;

    let text = `🎉 *PRESUPUESTO EFECTIVO · SAN MATEO 2026*\n`;
    text += `*Peña Los Que No Querían (Monzón)* 🏮\n`;
    text += `----------------------------------------\n`;

    if (dinnerLines.length > 0) {
      text += `🍽️ *CENAS:*\n${dinnerLines.join('\n')}\n`;
    }

    if (bonoLines.length > 0) {
      text += `🍻 *BONOS Y CONSUMICIONES:*\n${bonoLines.join('\n')}\n`;
    }

    if (dinnerLines.length === 0 && bonoLines.length === 0) {
      text += `(No hay selecciones activas todavía)\n`;
    }

    text += `----------------------------------------\n`;
    text += `💰 *TOTAL EFECTIVO A LLEVAR: ${grandTotalVal} €*\n`;
    text += `⚠️ *Recuerda: ¡Sólo pagos en efectivo!*\n`;
    text += `¡Viva San Mateo y Los Que No Querían! 🎊`;

    return text;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(showToast)
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showToast();
      }
    } catch (err) {
      console.warn('Fallback copy error', err);
    }
    document.body.removeChild(textArea);
  }

  function showToast() {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;
    toast.textContent = '¡Copiado para WhatsApp con éxito! 📋';
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // 1. Stepper Click Delegate
    document.addEventListener('click', (e) => {
      const stepBtn = e.target.closest('.btn-step');
      if (!stepBtn) return;

      const target = stepBtn.dataset.target;
      const isPlus = stepBtn.classList.contains('btn-plus');
      const change = isPlus ? 1 : -1;

      if (!target) return;

      if (target.startsWith('dinner-')) {
        const parts = target.split('-');
        if (parts.length === 3) {
          const day = parts[1];
          const type = parts[2]; // 'socio' or 'invitado'
          if (state.dinners[day] && state.dinners[day][type] !== undefined) {
            state.dinners[day][type] = Math.max(0, state.dinners[day][type] + change);
            updateUI();
          }
        }
      } else if (target === 'bono-peña') {
        state.bonos.peña = Math.max(0, state.bonos.peña + change);
        updateUI();
      } else if (target === 'bono-cubatas') {
        state.bonos.cubatas = Math.max(0, state.bonos.cubatas + change);
        updateUI();
      } else if (target === 'bono-cervezas') {
        state.bonos.cervezas = Math.max(0, state.bonos.cervezas + change);
        updateUI();
      }
    });

    // 2. Direct Input Typing in Steppers
    for (const day of Object.keys(DINNERS_CONFIG)) {
      ['socio', 'invitado'].forEach(type => {
        const input = document.getElementById(`input-dinner-${day}-${type}`);
        if (input) {
          input.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            state.dinners[day][type] = isNaN(val) ? 0 : Math.max(0, val);
            updateUI();
          });
          input.addEventListener('blur', (e) => {
            if (e.target.value === '' || isNaN(parseInt(e.target.value, 10))) {
              state.dinners[day][type] = 0;
              updateUI();
            }
          });
        }
      });
    }

    // Bono inputs
    const bonoMap = {
      'input-bono-peña': 'peña',
      'input-bono-cubatas': 'cubatas',
      'input-bono-cervezas': 'cervezas'
    };
    Object.entries(bonoMap).forEach(([id, key]) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          state.bonos[key] = isNaN(val) ? 0 : Math.max(0, val);
          updateUI();
        });
        input.addEventListener('blur', (e) => {
          if (e.target.value === '' || isNaN(parseInt(e.target.value, 10))) {
            state.bonos[key] = 0;
            updateUI();
          }
        });
      }
    });



    // 4. Reset Actions
    const btnClearDinners = document.getElementById('btn-clear-dinners');
    if (btnClearDinners) {
      btnClearDinners.addEventListener('click', () => {
        for (const day of Object.keys(state.dinners)) {
          state.dinners[day].socio = 0;
          state.dinners[day].invitado = 0;
        }
        updateUI();
      });
    }

    const btnResetAll = document.getElementById('btn-reset-all');
    if (btnResetAll) {
      btnResetAll.addEventListener('click', () => {
        if (confirm('¿Quieres reiniciar todas las selecciones a cero?')) {
          for (const day of Object.keys(state.dinners)) {
            state.dinners[day].socio = 0;
            state.dinners[day].invitado = 0;
          }
          state.bonos.peña = 0;
          state.bonos.cubatas = 0;
          state.bonos.cervezas = 0;
          updateUI();
        }
      });
    }

    // 5. WhatsApp and Copy Buttons
    const btnWhatsApp = document.getElementById('btn-whatsapp');
    if (btnWhatsApp) {
      btnWhatsApp.addEventListener('click', () => {
        const text = generateSummaryText();
        copyToClipboard(text);
      });
    }



    const btnMobileWa = document.getElementById('btn-mobile-wa');
    if (btnMobileWa) {
      btnMobileWa.addEventListener('click', () => {
        const text = generateSummaryText();
        copyToClipboard(text);
      });
    }

    const btnMobileScroll = document.getElementById('btn-mobile-scroll');
    if (btnMobileScroll) {
      btnMobileScroll.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar-summary');
        if (sidebar) {
          sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // 6. Modal Cartel Viewer
    const modalCartel = document.getElementById('modal-cartel');
    const btnOpenCartel = document.getElementById('btn-open-cartel');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCloseModal2 = document.getElementById('btn-close-modal-2');

    function openModal() {
      if (!modalCartel) return;
      modalCartel.classList.add('is-active');
      modalCartel.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modalCartel) return;
      modalCartel.classList.remove('is-active');
      modalCartel.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (btnOpenCartel) btnOpenCartel.addEventListener('click', openModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCloseModal2) btnCloseModal2.addEventListener('click', closeModal);

    if (modalCartel) {
      modalCartel.addEventListener('click', (e) => {
        if (e.target === modalCartel) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalCartel && modalCartel.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  // --- Init ---
  function init() {
    loadSavedState();
    setupEventListeners();
    updateUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
