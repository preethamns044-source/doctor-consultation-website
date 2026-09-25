import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';
import { Upload, Trash2, Image as ImageIcon, X, Loader2 } from 'lucide-react';

export default function GalleryManager() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState('');

  const fileInputRef = useRef(null);

  const fetchGalleryImages = useCallback(async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setGalleryImages(data);
    } else if (error) {
      console.error('Error fetching images:', error);
    }
    setFetching(false);
  }, []);

  useEffect(() => {
    fetchGalleryImages();
  }, [fetchGalleryImages]);

  const handleFileSelect = (e) => {
    setUploadError(null);
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newSelectedFiles = [];
    let hasError = false;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files (JPG, PNG, WEBP) are allowed.');
        hasError = true;
        break;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Each image must be smaller than 10MB.');
        hasError = true;
        break;
      }

      newSelectedFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
        title: '',
      });
    }

    if (!hasError) {
      setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].previewUrl);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileTitle = (index, title) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].title = title;
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setUploadError(null);

    let successCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      setUploadProgress(`Uploading photo ${i + 1} of ${selectedFiles.length}...`);
      const item = selectedFiles[i];
      const fileExt = item.file.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 1. Upload to Supabase storage bucket 'gallery'
      const { error: uploadErr } = await supabase.storage
        .from('gallery')
        .upload(filePath, item.file);

      if (uploadErr) {
        console.error('Upload error:', uploadErr);
        setUploadError(`Failed to upload ${item.file.name}: ${uploadErr.message}`);
        continue;
      }

      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // 3. Insert record into database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([
          {
            image_url: publicUrlData.publicUrl,
            title: item.title?.trim() || null,
          },
        ]);

      if (dbError) {
        console.error('DB error:', dbError);
        setUploadError(`Database error for ${item.file.name}: ${dbError.message}`);
      } else {
        successCount++;
      }
    }

    setUploadProgress('');
    setUploading(false);

    if (successCount === selectedFiles.length) {
      selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      setSelectedFiles([]);
      fetchGalleryImages();
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) {
      return;
    }

    try {
      const urlParts = imageUrl.split('/gallery/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .remove([filePath]);

        if (storageError) {
          console.warn('Storage deletion notice:', storageError.message);
        }
      }

      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-teal-700" />
          Add / Upload Photos
        </h3>

        <div className="space-y-6">
          {/* File Input */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-gallery-file"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-7 h-7 mb-2 text-slate-400" />
                <p className="mb-1 text-sm text-slate-600">
                  <span className="font-semibold text-teal-700">Click to select photos</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400">JPG, PNG, WEBP (Max 10MB per image)</p>
              </div>
              <input
                id="dropzone-gallery-file"
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                disabled={uploading}
              />
            </label>
          </div>

          {uploadError && (
            <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {uploadError}
            </div>
          )}

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Selected Photos ({selectedFiles.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedFiles.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="relative h-32 bg-slate-200">
                      <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeSelectedFile(index)}
                        disabled={uploading}
                        className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm text-slate-600 hover:text-red-600 hover:bg-white transition-colors"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Caption / Title (Optional)</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateFileTitle(index, e.target.value)}
                        disabled={uploading}
                        className="w-full text-xs sm:text-sm px-3 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                        placeholder="E.g. Arthroscopy procedure room"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
                    setSelectedFiles([]);
                    setUploadError(null);
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="min-w-[120px] justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...
                    </>
                  ) : (
                    'Upload to Gallery'
                  )}
                </Button>
              </div>
              {uploadProgress && (
                <p className="text-xs text-teal-700 font-medium text-right mt-1">{uploadProgress}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Published Gallery Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-teal-700" />
            Clinic Gallery Photos ({galleryImages.length})
          </h3>
          <Button variant="outline" size="sm" onClick={fetchGalleryImages} disabled={fetching}>
            {fetching ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {fetching && galleryImages.length === 0 ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-teal-700" />
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center">
            <p className="text-slate-500 text-sm">No photos have been uploaded to the gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="group relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-square relative">
                  <img
                    src={image.image_url}
                    alt={image.title || 'Gallery photo'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => handleDelete(image.id, image.image_url)}
                    className="absolute top-2 right-2 p-1.5 bg-white/95 text-slate-700 hover:text-red-600 hover:bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {image.title && (
                  <div className="p-2.5 bg-white border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-800 truncate" title={image.title}>
                      {image.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
