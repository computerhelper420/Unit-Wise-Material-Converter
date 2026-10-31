const StorageManager = {
  loadSelectedUnits() {
    try {
      const saved = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
      if (saved) {
        state.selectedUnits = JSON.parse(saved);
      } else {
        state.selectedUnits = { 'F2-1': 1 };
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      state.selectedUnits = { 'F2-1': 1 };
    }
  },

  saveSelectedUnits() {
    try {
      localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(state.selectedUnits));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
};