import { Download, Check, Receipt } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export default function BillResultsTable({ assignments, totals, students, onExportCSV }) {
  const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);
  const averagePerPerson = grandTotal / students;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Success Banner */}
        <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Bill Split Complete!</h3>
                <p className="text-gray-600">Here's how much each person owes</p>
              </div>
              <Button
                onClick={onExportCSV}
                className="bg-green-600 hover:bg-green-700 gap-2"
                aria-label="Export results to CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-blue-600 font-medium mb-2">Total Bill</p>
              <p className="text-3xl font-bold text-blue-900">{formatCurrency(grandTotal)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-purple-600 font-medium mb-2">People Splitting</p>
              <p className="text-3xl font-bold text-purple-900">{students}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-orange-600 font-medium mb-2">Average per Person</p>
              <p className="text-3xl font-bold text-orange-900">{formatCurrency(averagePerPerson)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Detailed Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: students }, (_, i) => {
                const personAssignments = assignments[i] || [];
                const personTotal = totals[i] || 0;
                
                return (
                  <div key={i} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Person {i + 1}</h4>
                      <Badge variant="secondary" className="text-lg px-4 py-1 font-bold">
                        {formatCurrency(personTotal)}
                      </Badge>
                    </div>
                    
                    {personAssignments.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No items assigned</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-right">Quantity</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {personAssignments.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right font-semibold">
                                  {formatCurrency(item.price)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}