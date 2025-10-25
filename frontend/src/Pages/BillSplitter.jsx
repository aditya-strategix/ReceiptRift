import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
// import { base44 } from '@/api/base44Client';
import { Calculator } from 'lucide-react';
import { Button } from '@/Components/ui/button';

import Header from '../Components/bill-splitter/Header';
import UploadForm from '../Components/bill-splitter/UploadForm';
import FoodItemsGrid from '../Components/bill-splitter/FoodItemsGrid';
import StudentBuckets from '../Components/bill-splitter/StudentBuckets';
import BillResultsTable from '../Components/bill-splitter/BillResultsTable';
import Toast from '../Components/bill-splitter/Toast';
import LoadingOverlay from '../Components/bill-splitter/LoadingOverlay';

let idCounter = 0;
function generateId() {
  idCounter += 1;
  return `item-${Date.now()}-${idCounter}`;
}

export default function BillSplitter() {
  const [appState, setAppState] = useState({
    step: 'upload',
    file: null,
    students: 5,
    items: null,
    assignments: {},
    totals: {},
    loading: false,
    error: null,
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleReset = () => {
    setAppState({
      step: 'upload',
      file: null,
      students: 5,
      items: null,
      assignments: {},
      totals: {},
      loading: false,
      error: null,
    });
    showToast('App reset successfully');
  };

  const handleUpload = async (file, students) => {
    setAppState(prev => ({ ...prev, loading: true, file, students }));

    try {
      const formData = new FormData();
      // backend expects field name "image" as defined in [`uploadReceipt`](backend/app.py)
      formData.append('image', file);

      const resp = await fetch('http://receiptrift-backend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Upload failed: ${resp.status} ${text}`);
      }

      const json = await resp.json();
      const rawItems = json.items || [];

      // Expand multi-quantity items into individual 1-quantity items
      const itemsWithIds = [];
      rawItems.forEach((it) => {
        const qty = it.quantity ?? 1;
        // prefer explicitly provided unit_price, else derive from total_price / qty or price
        const derivedUnit = it.unit_price ?? (it.total_price ? it.total_price / qty : it.price ?? 0);
        // normalize to 2 decimal places
        const unitPrice = Number(parseFloat(derivedUnit || 0).toFixed(2));

        for (let i = 0; i < qty; i++) {
          itemsWithIds.push({
            id: generateId(),
            name: it.name,
            quantity: 1,
            price: unitPrice,
            // preserve metadata if useful later
            _source_total: it.total_price ?? null,
            _source_unit: it.unit_price ?? null,
          });
        }
      });

      const initialAssignments = {};
      for (let i = 0; i < students; i++) {
        initialAssignments[i] = [];
      }

      const initialTotals = {};
      for (let i = 0; i < students; i++) {
        initialTotals[i] = 0;
      }

      setAppState(prev => ({
        ...prev,
        items: itemsWithIds,
        assignments: initialAssignments,
        totals: initialTotals,
        step: 'assign',
        loading: false,
      }));

      showToast('Bill parsed successfully! Assign items to people.');
    } catch (error) {
      setAppState(prev => ({ ...prev, loading: false }));
      showToast(error.message || 'Failed to parse bill', 'error');
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === 'unassigned-items' && destination.droppableId.startsWith('student-')) {
      const studentIndex = parseInt(destination.droppableId.replace('student-', ''));
      const item = appState.items.find(i => i.id === draggableId);

      if (!item) return;

      const isAssigned = Object.values(appState.assignments).some(
        assignments => assignments.some(a => a.id === item.id)
      );

      if (isAssigned) {
        showToast('This item is already assigned to someone', 'error');
        return;
      }

      setAppState(prev => {
        const newAssignments = {
          ...prev.assignments,
          [studentIndex]: [...prev.assignments[studentIndex], item]
        };

        const newTotals = {};
        Object.keys(newAssignments).forEach(key => {
          newTotals[key] = newAssignments[key].reduce((sum, item) => sum + item.price, 0);
        });

        return {
          ...prev,
          assignments: newAssignments,
          totals: newTotals
        };
      });
    }
  };

  const handleRemove = (studentIndex, itemId) => {
    setAppState(prev => {
      const newAssignments = {
        ...prev.assignments,
        [studentIndex]: prev.assignments[studentIndex].filter(item => item.id !== itemId)
      };

      const newTotals = {};
      Object.keys(newAssignments).forEach(key => {
        newTotals[key] = newAssignments[key].reduce((sum, item) => sum + item.price, 0);
      });

      return {
        ...prev,
        assignments: newAssignments,
        totals: newTotals
      };
    });
  };

  const handleCalculate = () => {
    const assignedItems = Object.values(appState.assignments).flat();
    const unassignedCount = appState.items.length - assignedItems.length;

    if (unassignedCount > 0) {
      showToast(`Please assign all items. ${unassignedCount} item(s) remaining.`, 'error');
      return;
    }

    setAppState(prev => ({ ...prev, step: 'results' }));
    showToast('Bill split calculated successfully!');
  };

  const handleExportCSV = () => {
    const rows = [['Person', 'Item', 'Quantity', 'Price']];
    
    Object.keys(appState.assignments).forEach(studentIndex => {
      const personName = `Person ${parseInt(studentIndex) + 1}`;
      appState.assignments[studentIndex].forEach(item => {
        rows.push([personName, item.name, item.quantity, item.price]);
      });
      
      rows.push([personName, 'TOTAL', '', appState.totals[studentIndex]]);
      rows.push([]);
    });

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bill-split.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('CSV exported successfully!');
  };

  const unassignedItems = appState.items 
    ? appState.items.filter(item => {
        const assignedItems = Object.values(appState.assignments).flat();
        return !assignedItems.some(a => a.id === item.id);
      })
    : [];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header onReset={handleReset} />
        
        {appState.loading && <LoadingOverlay message="Parsing your bill..." />}
        
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {appState.step === 'upload' && (
          <UploadForm
            onSubmit={handleUpload}
            loading={appState.loading}
          />
        )}

        {appState.step === 'assign' && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Assignment Progress</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {appState.items.length - unassignedItems.length} / {appState.items.length} assigned
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((appState.items.length - unassignedItems.length) / appState.items.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Droppable droppableId="unassigned-items">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <FoodItemsGrid items={unassignedItems} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <div>
                  <StudentBuckets
                    students={appState.students}
                    assignments={appState.assignments}
                    onRemove={handleRemove}
                    totals={appState.totals}
                  />
                </div>
              </div>

              <div className="sticky bottom-4 z-10">
                <Button
                  onClick={handleCalculate}
                  disabled={unassignedItems.length > 0}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-semibold gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Split
                </Button>
              </div>
            </div>
          </div>
        )}

        {appState.step === 'results' && (
          <BillResultsTable
            assignments={appState.assignments}
            totals={appState.totals}
            students={appState.students}
            onExportCSV={handleExportCSV}
          />
        )}
      </div>
    </DragDropContext>
  );
}