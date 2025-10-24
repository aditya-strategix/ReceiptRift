import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { User, X, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function StudentBucket({ studentIndex, assignments, onRemove, total }) {
  const studentName = `Person ${studentIndex + 1}`;
  const itemsCount = assignments[studentIndex]?.length || 0;

  return (
    <Droppable droppableId={`student-${studentIndex}`}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`transition-all duration-200 ${
            snapshot.isDraggingOver ? 'border-2 border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' : 'border-2 border-gray-200'
          }`}
          role="region"
          aria-label={`Items for ${studentName}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {studentName}
              </CardTitle>
              <Badge variant="secondary" className="font-semibold">
                {formatCurrency(total)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[120px] space-y-2">
              {itemsCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Drop items here</p>
                </div>
              ) : (
                assignments[studentIndex].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(studentIndex, item.id)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove ${item.name} from ${studentName}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
              {provided.placeholder}
            </div>
          </CardContent>
        </Card>
      )}
    </Droppable>
  );
}

export default function StudentBuckets({ students, assignments, onRemove, totals }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Assign to People</h3>
        <p className="text-sm text-gray-500">Drop items onto each person's card</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: students }, (_, i) => (
          <StudentBucket
            key={i}
            studentIndex={i}
            assignments={assignments}
            onRemove={onRemove}
            total={totals[i] || 0}
          />
        ))}
      </div>
    </div>
  );
}