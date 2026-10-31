const ControlsManager = {
  setupControlButtons() {
    const exportBtn = document.getElementById('btn-export-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const materials = CartManager.getAggregatedMaterials();
        if (materials.length === 0) {
          alert('রপ্তানি করার জন্য কোনো ডাটা নেই!');
          return;
        }

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Item Code,Item Description,Total Quantity,Unit Price (BDT),Total Price (BDT)\n';

        materials.forEach(m => {
          const lineTotal = m.totalQty * m.price;
          const row = `"${m.item}","${m.desc.replace(/"/g, '""')}",${m.totalQty},${m.price},${lineTotal}`;
          csvContent += row + '\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `BREB_Material_Estimate_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    const printBtn = document.getElementById('btn-print');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const clearBtn = document.getElementById('btn-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('আপনি কি নিশ্চিত যে সকল সিলেক্ট করা ইউনিট মুছে ফেলতে চান?')) {
          state.selectedUnits = {};
          StorageManager.saveSelectedUnits();
          UIRenderer.renderUnitChips();
          UIRenderer.renderTable();
        }
      });
    }
  }
};