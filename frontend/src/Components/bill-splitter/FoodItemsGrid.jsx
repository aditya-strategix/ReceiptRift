import React, { useEffect, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Package } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function FoodItemCard({ item, index, imageUrl }) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`transition-all duration-200 border-2 ${
            snapshot.isDragging ? 'opacity-50 border-blue-400 scale-95 shadow-xl' : 'border-gray-200 hover:border-blue-300'
          }`}
          role="button"
          aria-label={`Drag ${item.name} to assign to a person`}
          tabIndex={0}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={item.name} className="object-cover w-full h-full" />
                ) : (
                  <Package className="w-8 h-8 text-orange-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                  <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    Qty: {item.quantity}
                  </Badge>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

export default function FoodItemsGrid({ items }) {
  // images: { [itemId]: objectUrl }
  const [images, setImages] = useState({});

  useEffect(() => {
    if (!items || items.length === 0) return;

    let isMounted = true;
    const newIds = new Set(items.map(i => i.id));

    // revoke URLs for items no longer present
    Object.keys(images).forEach(id => {
      if (!newIds.has(id)) {
        URL.revokeObjectURL(images[id]);
        setImages(prev => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }
    });

    // fetch images for items without one
    items.forEach(item => {
      if (!images[item.id]) {
        (async () => {
          try {
            // backend endpoint that serves images: [`getFoodImage`](backend/app.py)
            const resp = await fetch(`https://receiptrift-backend-1.onrender.com/image?food=${encodeURIComponent(item.name)}`);
            if (!isMounted) return;
            if (!resp.ok) {
              // Try to read JSON error for debugging (optional)
              try {
                const err = await resp.json();
                console.warn('Image fetch error for', item.name, err);
              } catch {}
              return;
            }
            const contentType = resp.headers.get('content-type') || '';
            if (!contentType.startsWith('image/')) {
              // backend returned JSON (error) instead of image
              try {
                const json = await resp.json();
                console.warn('Expected image but got JSON for', item.name, json);
              } catch {}
              return;
            }
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            setImages(prev => ({ ...prev, [item.id]: url }));
          } catch (e) {
            // ignore network errors; keep default icon
          }
        })();
      }
    });

    return () => {
      isMounted = false;
      // optional: revoke all object URLs on unmount
      Object.values(images).forEach(u => URL.revokeObjectURL(u));
    };
    // intentionally include items only; images is updated via setImages
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Available Items</h3>
          <p className="text-sm text-gray-500">Drag items to assign to people</p>
        </div>
        <Badge variant="outline" className="text-base px-3 py-1">
          {items.length} items
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <FoodItemCard key={item.id} item={item} index={index} imageUrl={images[item.id]} />
        ))}
      </div>
    </div>
  );
}