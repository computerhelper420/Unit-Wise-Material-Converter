document.addEventListener('DOMContentLoaded', () => {
  StorageManager.loadSelectedUnits();
  UIRenderer.populateUnitDropdown();
  UIRenderer.renderUnitChips();
  UIRenderer.renderTable();
  EventHandlers.setupEventListeners();
  ControlsManager.setupControlButtons();
});