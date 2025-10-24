import React, { useState, useRef } from 'react';
import { Upload, FileText, Users, ArrowRight, X, ImageIcon } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent } from '@/Components/ui/card';

export default function UploadForm({ onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState(5);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or image file (JPG, PNG)');
      return false;
    }
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a bill first');
      return;
    }
    if (students < 1 || students > 10) {
      alert('Number of students must be between 1 and 10');
      return;
    }
    onSubmit(file, students);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Split Your Bill in Seconds
          </h2>
          <p className="text-lg text-gray-600">
            Upload your receipt, assign items to friends, and calculate everyone's share automatically
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200">
            <CardContent className="p-6 md:p-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative ${dragActive ? 'bg-blue-50' : ''} transition-colors duration-200`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload bill file"
                />
                
                {!file ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Upload Your Bill
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Drag and drop or click to browse
                    </p>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Browse Files
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                      Supports PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      {file.type === 'application/pdf' ? (
                        <FileText className="w-6 h-6 text-red-500" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={removeFile}
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Label htmlFor="students" className="flex items-center gap-2 text-base font-semibold">
                  <Users className="w-5 h-5 text-blue-500" />
                  Number of People
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="students"
                    type="number"
                    min="1"
                    max="10"
                    value={students}
                    onChange={(e) => setStudents(parseInt(e.target.value) || 1)}
                    className="text-lg font-semibold"
                    aria-label="Number of people splitting the bill"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setStudents(Math.max(1, students - 1))}
                      disabled={students <= 1}
                      aria-label="Decrease number of people"
                    >
                      -
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setStudents(Math.min(10, students + 1))}
                      disabled={students >= 10}
                      aria-label="Increase number of people"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  How many people are splitting this bill? (1-10)
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 text-lg font-semibold gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Parse Bill & Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}