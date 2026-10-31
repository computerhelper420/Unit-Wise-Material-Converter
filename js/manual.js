const UIRenderer = {
  renderUnitChips() {
    const container = document.getElementById('selected-units-container');
    if (!container) return;
    
    container.innerHTML = '';
    const entries = Object.entries(state.selectedUnits);

    if (entries.length === 0) {
      container.innerHTML = '<span class="text-gray-400 text-sm italic">কোন ইউনিট যুক্ত করা হয়নি</span>';
      return;
    }

    entries.forEach(([unitCode, qty]) => {
      const chip = document.createElement('div');
      chip.className = 'flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-sm shadow-sm';
      chip.innerHTML = `
        <span class="font-bold">${unitCode}</span>
        <span class="text-gray-400">×</span>
        <input type="number" min="1" value="${qty}" data-unit="${unitCode}" 
               class="unit-qty-input w-14 px-1 py-0.5 border border-emerald-300 rounded text-center font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500">
        <button data-remove="${unitCode}" class="text-rose-500 hover:text-rose-700 font-bold ml-1 text-base leading-none">&times;</button>
      `;
      container.appendChild(chip);
    });
  },

  renderTable() {
    const tbody = document.getElementById('materials-table-body');
    if (!tbody) return;

    const allAggregated = CartManager.getAggregatedMaterials();
    const filtered = SearchManager.filterMaterials(allAggregated, state.searchQuery);
    const totals = CartManager.calculateTotals(allAggregated);

    document.getElementById('stat-unique-items').textContent = totals.totalItemsCount;
    document.getElementById('stat-total-qty').textContent = totals.totalQuantity;
    document.getElementById('stat-grand-total').textContent = `${CONFIG.CURRENCY} ${totals.grandTotalCost.toLocaleString('bn-BD', { minimumFractionDigits: 2 })}`;

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-gray-500 italic">
            কোনো মালামাল পাওয়া যায়নি। অনুগ্রহ করে ইউনিট নির্বাচন করুন বা ফিল্টার পরিবর্তন করুন।
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((m, index) => {
      const lineTotal = m.totalQty * m.price;
      const tr = document.createElement('tr');
      tr.className = index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100/60';
      
      tr.innerHTML = `
        <td class="px-4 py-3 font-semibold text-slate-900 border-b border-slate-100">${m.item}</td>
        <td class="px-4 py-3 text-slate-700 border-b border-slate-100">${m.desc}</td>
        <td class="px-4 py-3 text-center border-b border-slate-100">
          <span class="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
            ${Object.entries(m.perUnitDetails).map(([u, q]) => `${u}: ${q}`).join(', ')}
          </span>
        </td>
        <td class="px-4 py-3 text-right font-bold text-slate-800 border-b border-slate-100">${m.totalQty}</td>
        <td class="px-4 py-3 text-right text-slate-600 border-b border-slate-100">${CONFIG.CURRENCY} ${m.price.toFixed(2)}</td>
        <td class="px-4 py-3 text-right font-bold text-emerald-600 border-b border-slate-100">${CONFIG.CURRENCY} ${lineTotal.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  populateUnitDropdown() {
    const select = document.getElementById('unit-select');
    if (!select) return;

    const availableUnits = SearchManager.getAllAvailableUnits();
    select.innerHTML = '<option value="" disabled selected>ইউনিট সিলেক্ট করুন...</option>';
    
    availableUnits.forEach(unit => {
      const opt = document.createElement('option');
      opt.value = unit;
      opt.textContent = unit;
      select.appendChild(opt);
    });
  }
};