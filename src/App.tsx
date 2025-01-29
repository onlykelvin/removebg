import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { removeBackground } from '@imgly/background-removal';
import { Upload, Download, Image as ImageIcon, Loader2, Clipboard } from 'lucide-react';

interface ProcessedImage {
  original: string;
  processed: string;
  name: string;
  status: 'processing' | 'done' | 'error';
}

function App() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [clipboardError, setClipboardError] = useState<string>('');
  
  const onDrop = async (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      original: URL.createObjectURL(file),
      processed: '',
      name: file.name,
      status: 'processing' as const
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
    // Process each image
    await Promise.all(
      acceptedFiles.map(async (file, index) => {
        try {
          const blob = await removeBackground(file);
          const processedUrl = URL.createObjectURL(blob);
          
          setImages(prev => prev.map((img, i) => 
            i === prev.length - acceptedFiles.length + index
              ? { ...img, processed: processedUrl, status: 'done' as const }
              : img
          ));
        } catch (error) {
          setImages(prev => prev.map((img, i) => 
            i === prev.length - acceptedFiles.length + index
              ? { ...img, status: 'error' as const }
              : img
          ));
        }
      })
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    }
  });

  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(
      item => item.type.indexOf('image') !== -1
    );

    for (const item of imageItems) {
      const file = item.getAsFile();
      if (file) {
        await onDrop([file]);
      }
    }
  };

  // Add paste event listener
  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleClipboardButton = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      setClipboardError('');

      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
        
        for (const imageType of imageTypes) {
          const blob = await clipboardItem.getType(imageType);
          const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: imageType });
          await onDrop([file]);
        }
      }
    } catch (error) {
      setClipboardError('Please use Ctrl+V or copy an image first');
      setTimeout(() => setClipboardError(''), 3000);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `bg-removed-${filename}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    images
      .filter(img => img.status === 'done')
      .forEach(img => downloadImage(img.processed, img.name));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            RemoveBG
          </h1>
          <p className="text-lg text-gray-600">
            Transform your images instantly with our free background removal tool
          </p>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            No signup required • 100% free • Processing happens in your browser
          </p>
          <div className="space-y-2">
            <button
              onClick={handleClipboardButton}
              className="inline-flex items-center gap-2 bg-white text-gray-600 px-4 py-2 
                       rounded-lg border border-gray-200 hover:bg-gray-50 
                       transition-colors duration-200 text-sm"
            >
              <Clipboard className="w-4 h-4" />
              Paste from Clipboard (or press Ctrl+V)
            </button>
            {clipboardError && (
              <p className="text-sm text-red-500 animate-fade-in">
                {clipboardError}
              </p>
            )}
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 mb-8 text-center
            transition-colors duration-200 cursor-pointer
            ${isDragActive 
              ? 'border-purple-400 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg text-gray-600 mb-2">
            {isDragActive
              ? 'Drop your images here...'
              : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-sm text-gray-500">
            Supports JPG, PNG and WebP
          </p>
        </div>

        {images.length > 0 && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <button
                onClick={downloadAll}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg 
                         hover:bg-purple-700 transition-colors duration-200
                         flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {images.map((image, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={image.original}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-500">Original</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 
                                    flex items-center justify-center">
                        {image.status === 'processing' ? (
                          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        ) : image.status === 'error' ? (
                          <div className="text-center text-red-500">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Processing failed</p>
                          </div>
                        ) : (
                          <img
                            src={image.processed}
                            alt="Processed"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <p className="text-center text-sm text-gray-500">Processed</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate">{image.name}</p>
                    {image.status === 'done' && (
                      <button
                        onClick={() => downloadImage(image.processed, image.name)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600
                                 px-4 py-2 rounded-lg transition-colors duration-200
                                 flex items-center gap-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
