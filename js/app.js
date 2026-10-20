/**
 * XUÂN HOA XE ĐẦU KÉO - CORE APPLICATION LOGIC
 * Bãi xe: Tân Đông Hiệp, Dĩ An, Bình Dương | Hotline: 0908 555 678
 */

(function () {
  'use strict';

  let vehiclesData = [];
  let currentCategory = 'all';

  // Format VNĐ
  function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  // Load Data
  async function init() {
    try {
      const res = await fetch('data/vehicles.json');
      if (res.ok) {
        vehiclesData = await res.json();
        renderVehicles();
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu xe:', err);
    }
    bindEvents();
    initLoanCalculator();
  }

  // Render Vehicles
  function renderVehicles() {
    const grid = document.getElementById('vehiclesGrid');
    if (!grid) return;

    const filtered = currentCategory === 'all'
      ? vehiclesData
      : vehiclesData.filter(v => v.category === currentCategory);

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;">Chưa có phương tiện trong phân loại này.</div>';
      return;
    }

    grid.innerHTML = filtered.map(v => `
      <article class="vehicle-card" data-id="${v.id}">
        <div class="vehicle-thumb-box">
          <img src="${v.image}" alt="${v.name}" loading="lazy">
          <span class="vehicle-badge-pill">${v.badge}</span>
          <span class="vehicle-origin-tag">${v.origin}</span>
        </div>
        <div class="vehicle-info-content">
          <span class="vehicle-cat-label">${v.categoryName} • Đời ${v.year}</span>
          <h3 class="vehicle-card-title">${v.name}</h3>

          <div class="vehicle-specs-list">
            <div class="spec-chip">⚙️ ${v.engine}</div>
            <div class="spec-chip">⚡ ${v.power}</div>
            <div class="spec-chip">🕹️ ${v.transmission}</div>
            <div class="spec-chip">🚛 Tải kéo: ${v.towingCapacity}</div>
          </div>

          <div class="vehicle-price-box">
            <div>
              <span class="price-val">${formatMoney(v.price)}</span>
              ${v.originalPrice ? `<span class="price-old">${formatMoney(v.originalPrice)}</span>` : ''}
            </div>
            <span class="price-status">${v.status}</span>
          </div>

          <div class="vehicle-actions-row">
            <button class="btn-specs-view" data-id="${v.id}">
              <span>📋 Chi Tiết</span>
            </button>
            <button class="btn-call-quote trigger-truck-chat" data-prompt="Báo giá lăn bánh và thủ tục trả góp cho xe ${v.name}">
              <span>💬 Báo Giá Góp</span>
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Quick Specs Modal
  const specsModal = document.getElementById('specsModal');
  const btnCloseModal = document.getElementById('btnCloseModal');

  function openSpecsModal(id) {
    const v = vehiclesData.find(item => item.id === id);
    if (!v || !specsModal) return;

    document.getElementById('modalTruckName').textContent = v.name;
    document.getElementById('modalTruckBadge').textContent = v.badge;
    document.getElementById('modalTruckPrice').textContent = formatMoney(v.price);
    document.getElementById('modalTruckDesc').textContent = v.desc;
    document.getElementById('modalSpecEngine').textContent = v.engine;
    document.getElementById('modalSpecPower').textContent = v.power;
    document.getElementById('modalSpecTrans').textContent = v.transmission;
    document.getElementById('modalSpecDrive').textContent = v.drive;
    document.getElementById('modalSpecCabin').textContent = v.cabin;
    document.getElementById('modalSpecTowing').textContent = v.towingCapacity;

    const btnQuote = document.getElementById('modalBtnQuote');
    if (btnQuote) {
      btnQuote.onclick = () => {
        window.open(`https://zalo.me/0908555678?text=Chào%20Xuân%20Hoa,%20tôi%20cần%20báo%20giá%20xe%20${encodeURIComponent(v.name)}`, '_blank');
      };
    }

    specsModal.classList.add('active');
  }

  function closeSpecsModal() {
    if (specsModal) specsModal.classList.remove('active');
  }

  // Interactive Truck Loan Calculator
  function initLoanCalculator() {
    const rangePrice = document.getElementById('calcRangePrice');
    const labelPrice = document.getElementById('calcLabelPrice');
    const selectDownPayment = document.getElementById('calcDownPayment');
    const selectDuration = document.getElementById('calcDuration');
    const inputRate = document.getElementById('calcInterestRate');

    const outDownPayment = document.getElementById('outDownPayment');
    const outLoanAmount = document.getElementById('outLoanAmount');
    const outMonthlyPrincipal = document.getElementById('outMonthlyPrincipal');
    const outFirstMonthInterest = document.getElementById('outFirstMonthInterest');
    const outFirstMonthTotal = document.getElementById('outFirstMonthTotal');

    function calculate() {
      if (!rangePrice) return;
      const price = parseFloat(rangePrice.value);
      const downPercent = parseFloat(selectDownPayment.value);
      const months = parseInt(selectDuration.value);
      const yearlyRate = parseFloat(inputRate.value) / 100;

      if (labelPrice) labelPrice.textContent = formatMoney(price);

      const downPayment = price * (downPercent / 100);
      const loanAmount = price - downPayment;
      const monthlyPrincipal = loanAmount / months;
      const firstMonthInterest = (loanAmount * yearlyRate) / 12;
      const firstMonthTotal = monthlyPrincipal + firstMonthInterest;

      if (outDownPayment) outDownPayment.textContent = formatMoney(downPayment);
      if (outLoanAmount) outLoanAmount.textContent = formatMoney(loanAmount);
      if (outMonthlyPrincipal) outMonthlyPrincipal.textContent = formatMoney(monthlyPrincipal);
      if (outFirstMonthInterest) outFirstMonthInterest.textContent = formatMoney(firstMonthInterest);
      if (outFirstMonthTotal) outFirstMonthTotal.textContent = formatMoney(firstMonthTotal);
    }

    if (rangePrice) {
      rangePrice.addEventListener('input', calculate);
      selectDownPayment.addEventListener('change', calculate);
      selectDuration.addEventListener('change', calculate);
      inputRate.addEventListener('input', calculate);
      calculate();
    }
  }

  function bindEvents() {
    // Filter Tabs
    const filterTabs = document.getElementById('filterTabs');
    if (filterTabs) {
      filterTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderVehicles();
      });
    }

    // Grid click for specs
    const grid = document.getElementById('vehiclesGrid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const btnSpecs = e.target.closest('.btn-specs-view');
        if (btnSpecs) {
          const id = btnSpecs.getAttribute('data-id');
          openSpecsModal(id);
        }
      });
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeSpecsModal);
    if (specsModal) {
      specsModal.addEventListener('click', (e) => {
        if (e.target === specsModal) closeSpecsModal();
      });
    }

    // Scroll header shadow
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.main-header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }
    });

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
