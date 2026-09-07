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

  const MERCH_CONFIG = {
    camiseta: {
      name: 'Camiseta de la Peña',
      price: 10
    },
    sudadera: {
      name: 'Sudadera de la Peña',
      price: 20
    },
    loteria: {
      name: 'Lotería de Navidad',
      price: 6
    }
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
    },
    merch: {
      camiseta: 0,
      sudadera: 0,
      loteria: 0
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
          if (parsed.merch) {
            state.merch.camiseta = Math.max(0, parseInt(parsed.merch.camiseta, 10) || 0);
            state.merch.sudadera = Math.max(0, parseInt(parsed.merch.sudadera, 10) || 0);
            state.merch.loteria = Math.max(0, parseInt(parsed.merch.loteria, 10) || 0);
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

    // 3. Merchandising y Lotería
    let merchTotal = 0;

    // Camiseta
    const countCamiseta = state.merch.camiseta;
    const subCamiseta = countCamiseta * MERCH_CONFIG.camiseta.price;
    merchTotal += subCamiseta;
    const inputCamiseta = document.getElementById('input-merch-camiseta');
    const subCamisetaEl = document.getElementById('subtotal-merch-camiseta');
    const cardCamiseta = document.getElementById('card-merch-camiseta');
    if (inputCamiseta) inputCamiseta.value = countCamiseta;
    if (subCamisetaEl) subCamisetaEl.textContent = `${subCamiseta} €`;
    if (cardCamiseta) {
      cardCamiseta.classList.toggle('has-items', countCamiseta > 0);
      const minus = cardCamiseta.querySelector('.btn-minus');
      if (minus) minus.disabled = countCamiseta <= 0;
    }

    // Sudadera
    const countSudadera = state.merch.sudadera;
    const subSudadera = countSudadera * MERCH_CONFIG.sudadera.price;
    merchTotal += subSudadera;
    const inputSudadera = document.getElementById('input-merch-sudadera');
    const subSudaderaEl = document.getElementById('subtotal-merch-sudadera');
    const cardSudadera = document.getElementById('card-merch-sudadera');
    if (inputSudadera) inputSudadera.value = countSudadera;
    if (subSudaderaEl) subSudaderaEl.textContent = `${subSudadera} €`;
    if (cardSudadera) {
      cardSudadera.classList.toggle('has-items', countSudadera > 0);
      const minus = cardSudadera.querySelector('.btn-minus');
      if (minus) minus.disabled = countSudadera <= 0;
    }

    // Lotería
    const countLoteria = state.merch.loteria;
    const subLoteria = countLoteria * MERCH_CONFIG.loteria.price;
    merchTotal += subLoteria;
    const inputLoteria = document.getElementById('input-merch-loteria');
    const subLoteriaEl = document.getElementById('subtotal-merch-loteria');
    const cardLoteria = document.getElementById('card-merch-loteria');
    if (inputLoteria) inputLoteria.value = countLoteria;
    if (subLoteriaEl) subLoteriaEl.textContent = `${subLoteria} €`;
    if (cardLoteria) {
      cardLoteria.classList.toggle('has-items', countLoteria > 0);
      const minus = cardLoteria.querySelector('.btn-minus');
      if (minus) minus.disabled = countLoteria <= 0;
    }

    // 4. Grand Total
    const grandTotalVal = dinnersTotal + bonosTotal + merchTotal;
    const totalEl = document.getElementById('display-grand-total');
    const mobileTotalEl = document.getElementById('mobile-grand-total');
    const mobileCountEl = document.getElementById('mobile-items-count');
    const helperTextEl = document.getElementById('total-helper-text');

    if (totalEl) totalEl.textContent = grandTotalVal;
    if (mobileTotalEl) mobileTotalEl.textContent = `${grandTotalVal} €`;

    const totalBonosCount = countPeña + countCubatas + countCervezas;
    const totalMerchCount = countCamiseta + countSudadera + countLoteria;
    const summaryPieces = [];
    if (totalDinersCount > 0) summaryPieces.push(`${totalDinersCount} comensales`);
    if (totalBonosCount > 0) summaryPieces.push(`${totalBonosCount} bonos`);
    if (totalMerchCount > 0) summaryPieces.push(`${totalMerchCount} artículos`);

    if (mobileCountEl) {
      mobileCountEl.textContent = summaryPieces.length > 0 ? summaryPieces.join(' · ') : '0 selecciones';
    }

    if (helperTextEl) {
      if (grandTotalVal === 0) {
        helperTextEl.textContent = 'Selecciona tus comidas, bonos o ropa';
      } else {
        helperTextEl.textContent = `Total listo para llevar en efectivo (${summaryPieces.join(', ')})`;
      }
    }

    // Section Accordion Summary Pills
    const pillCenas = document.getElementById('pill-cenas-summary');
    if (pillCenas) {
      if (totalDinersCount > 0) {
        pillCenas.textContent = `${totalDinersCount} ${totalDinersCount === 1 ? 'comensal' : 'comensales'} · ${dinnersTotal} €`;
        pillCenas.classList.add('is-active');
      } else {
        pillCenas.textContent = '0 comensales';
        pillCenas.classList.remove('is-active');
      }
    }

    const pillBonos = document.getElementById('pill-bonos-summary');
    if (pillBonos) {
      if (totalBonosCount > 0) {
        pillBonos.textContent = `${totalBonosCount} ${totalBonosCount === 1 ? 'bono' : 'bonos'} · ${bonosTotal} €`;
        pillBonos.classList.add('is-active');
      } else {
        pillBonos.textContent = '0 bonos';
        pillBonos.classList.remove('is-active');
      }
    }

    const pillMerch = document.getElementById('pill-merch-summary');
    if (pillMerch) {
      if (totalMerchCount > 0) {
        pillMerch.textContent = `${totalMerchCount} ${totalMerchCount === 1 ? 'artículo' : 'artículos'} · ${merchTotal} €`;
        pillMerch.classList.add('is-active');
      } else {
        pillMerch.textContent = '0 artículos';
        pillMerch.classList.remove('is-active');
      }
    }

    // 5. Breakdown ticket
    renderBreakdownList();

    // 6. Save state
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

    // Merchandising y Lotería
    if (state.merch.camiseta > 0) {
      items.push({
        type: 'extra',
        title: 'Camiseta de la Peña',
        qty: `${state.merch.camiseta}x (${MERCH_CONFIG.camiseta.price}€)`,
        subtotal: `${state.merch.camiseta * MERCH_CONFIG.camiseta.price} €`
      });
    }
    if (state.merch.sudadera > 0) {
      items.push({
        type: 'extra',
        title: 'Sudadera de la Peña',
        qty: `${state.merch.sudadera}x (${MERCH_CONFIG.sudadera.price}€)`,
        subtotal: `${state.merch.sudadera * MERCH_CONFIG.sudadera.price} €`
      });
    }
    if (state.merch.loteria > 0) {
      items.push({
        type: 'extra',
        title: 'Lotería de Navidad',
        qty: `${state.merch.loteria}x (${MERCH_CONFIG.loteria.price}€)`,
        subtotal: `${state.merch.loteria * MERCH_CONFIG.loteria.price} €`
      });
    }

    if (items.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <span>No has seleccionado ningún menú, bono ni artículo todavía.</span>
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

    let merchSum = 0;
    const merchLines = [];
    if (state.merch.camiseta > 0) {
      const sub = state.merch.camiseta * MERCH_CONFIG.camiseta.price;
      merchSum += sub;
      merchLines.push(`  • ${state.merch.camiseta}x Camiseta (${MERCH_CONFIG.camiseta.price}€) = ${sub}€`);
    }
    if (state.merch.sudadera > 0) {
      const sub = state.merch.sudadera * MERCH_CONFIG.sudadera.price;
      merchSum += sub;
      merchLines.push(`  • ${state.merch.sudadera}x Sudadera (${MERCH_CONFIG.sudadera.price}€) = ${sub}€`);
    }
    if (state.merch.loteria > 0) {
      const sub = state.merch.loteria * MERCH_CONFIG.loteria.price;
      merchSum += sub;
      merchLines.push(`  • ${state.merch.loteria}x Lotería (${MERCH_CONFIG.loteria.price}€) = ${sub}€`);
    }

    const grandTotalVal = dinnersSum + bonosSum + merchSum;

    let text = `🎉 *PRESUPUESTO EFECTIVO · SAN MATEO 2026*\n`;
    text += `*Peña Los Que No Querían (Monzón)* 🏮\n`;
    text += `----------------------------------------\n`;

    if (dinnerLines.length > 0) {
      text += `🍽️ *CENAS:*\n${dinnerLines.join('\n')}\n`;
    }

    if (bonoLines.length > 0) {
      text += `🍻 *BONOS Y CONSUMICIONES:*\n${bonoLines.join('\n')}\n`;
    }

    if (merchLines.length > 0) {
      text += `👕 *ROPA Y LOTERÍA:*\n${merchLines.join('\n')}\n`;
    }

    if (dinnerLines.length === 0 && bonoLines.length === 0 && merchLines.length === 0) {
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

  function showToast(msg = '¡Copiado para WhatsApp con éxito! 📋') {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2800);
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
      } else if (target.startsWith('merch-')) {
        const key = target.replace('merch-', '');
        if (state.merch[key] !== undefined) {
          state.merch[key] = Math.max(0, state.merch[key] + change);
          updateUI();
        }
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

    // Merch inputs
    const merchMap = {
      'input-merch-camiseta': 'camiseta',
      'input-merch-sudadera': 'sudadera',
      'input-merch-loteria': 'loteria'
    };
    Object.entries(merchMap).forEach(([id, key]) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          state.merch[key] = isNaN(val) ? 0 : Math.max(0, val);
          updateUI();
        });
        input.addEventListener('blur', (e) => {
          if (e.target.value === '' || isNaN(parseInt(e.target.value, 10))) {
            state.merch[key] = 0;
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

    function resetAll() {
      if (confirm('¿Quieres empezar de nuevo y poner todas las cantidades a cero?')) {
        for (const day of Object.keys(state.dinners)) {
          state.dinners[day].socio = 0;
          state.dinners[day].invitado = 0;
        }
        state.bonos.peña = 0;
        state.bonos.cubatas = 0;
        state.bonos.cervezas = 0;
        state.merch.camiseta = 0;
        state.merch.sudadera = 0;
        state.merch.loteria = 0;
        updateUI();
        showToast('¡Empezamos de nuevo! Calculadora a cero 🔄');
      }
    }

    const btnResetAll = document.getElementById('btn-reset-all');
    if (btnResetAll) btnResetAll.addEventListener('click', resetAll);

    const btnStartOver = document.getElementById('btn-start-over');
    if (btnStartOver) btnStartOver.addEventListener('click', resetAll);

    const btnMobileReset = document.getElementById('btn-mobile-reset');
    if (btnMobileReset) btnMobileReset.addEventListener('click', resetAll);

    // 5. WhatsApp Button
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

    // 7. Accordion Collapsible Sections
    document.querySelectorAll('.section-accordion-header').forEach(header => {
      function toggleSection(e) {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) {
          return;
        }
        const section = header.closest('.section-card');
        if (!section) return;
        const isCollapsed = section.classList.toggle('is-collapsed');
        header.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
        header.setAttribute('title', isCollapsed ? 'Desplegar sección' : 'Plegar sección');
      }

      header.addEventListener('click', toggleSection);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSection(e);
        }
      });
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
