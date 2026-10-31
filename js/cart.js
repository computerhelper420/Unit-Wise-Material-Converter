const CartManager = {
  getAggregatedMaterials() {
    const materialMap = {};

    Object.entries(state.selectedUnits).forEach(([unitCode, unitQty]) => {
      const qtyNum = parseFloat(unitQty) || 0;
      if (qtyNum <= 0) return;

      unitDatabase.forEach(item => {
        const qtyPerUnit = item.units[unitCode];
        if (qtyPerUnit !== undefined && qtyPerUnit > 0) {
          const totalQtyForItem = qtyPerUnit * qtyNum;
          
          if (!materialMap[item.item]) {
            materialMap[item.item] = {
              item: item.item,
              desc: item.desc,
              price: item.price,
              perUnitDetails: {},
              totalQty: 0
            };
          }

          materialMap[item.item].perUnitDetails[unitCode] = qtyPerUnit;
          materialMap[item.item].totalQty += totalQtyForItem;
        }
      });
    });

    return Object.values(materialMap);
  },

  calculateTotals(materials) {
    let totalItemsCount = materials.length;
    let totalQuantity = 0;
    let grandTotalCost = 0;

    materials.forEach(m => {
      totalQuantity += m.totalQty;
      grandTotalCost += m.totalQty * m.price;
    });

    return {
      totalItemsCount,
      totalQuantity,
      grandTotalCost
    };
  }
};
