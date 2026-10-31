const SearchManager = {
  getAllAvailableUnits() {
    const unitSet = new Set();
    unitDatabase.forEach(item => {
      Object.keys(item.units).forEach(u => unitSet.add(u));
    });
    return Array.from(unitSet).sort();
  },

  filterMaterials(materials, query) {
    if (!query) return materials;
    const cleanQuery = query.toLowerCase().trim();
    return materials.filter(m => 
      m.item.toLowerCase().includes(cleanQuery) || 
      m.desc.toLowerCase().includes(cleanQuery)
    );
  }
};