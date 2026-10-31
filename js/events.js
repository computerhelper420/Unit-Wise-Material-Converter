const EventHandlers = {
  setupEventListeners() {
    const addForm = document.getElementById('add-unit-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const select = document.getElementById('unit-select');
        const qtyInput = document.getElementById('unit-qty-input');
        
        const unit = select.value;
        const qty = parseInt(qtyInput.value) || 1;

        if (unit) {
          state.selectedUnits[unit] = (state.selectedUnits[unit] || 0) + qty;
          StorageManager.saveSelectedUnits();
          UIRenderer.renderUnitChips();
          UIRenderer.renderTable();
          select.value = '';
          qtyInput.value = '1';
        }
      });
    }

    const chipsContainer = document.getElementById('selected-units-container');
    if (chipsContainer) {
      chipsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('unit-qty-input')) {
          const unit = e.target.getAttribute('data-unit');
          const newQty = parseInt(e.target.value) || 1;
          state.selectedUnits[unit] = newQty;
          StorageManager.saveSelectedUnits();
          UIRenderer.renderTable();
        }
      });

      chipsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-remove]');
        if (removeBtn) {
          const unitToRemove = removeBtn.getAttribute('data-remove');
          delete state.selectedUnits[unitToRemove];
          StorageManager.saveSelectedUnits();
          UIRenderer.renderUnitChips();
          UIRenderer.renderTable();
        }
      });
    }

    const searchInput = document.getElementById('table-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        UIRenderer.renderTable();
      });
    }
  }
};