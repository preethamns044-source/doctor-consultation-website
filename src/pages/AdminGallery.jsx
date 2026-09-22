import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Button from '../components/common/Button';
import { Upload, Trash2, Image as ImageIcon, X, Loader2 } from 'lucide-react';

export default function AdminGallery() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState([]);
  const [fetching, setFetching] = useState(true);
  
  // Upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        window.location.href = '/admin/login';
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        window.location.href = '/admin/login';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAllowed) {
      fetchGalleryImages();
    }
  }, [isAllowed]);

  const checkAdminStatus = async (userId) => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const fetchGalleryImages = async () => {
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
  };

  const handleFileSelect = (e) => {
    setUploadError(null);
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newSelectedFiles = [];
    let hasError = false;

    for (const file of files) {
      // Validate image
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed.');
        hasError = true;
        break;
      }
      // Validate size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Each image must be smaller than 10MB.');
        hasError = true;
        break;
      }

      newSelectedFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
        title: ''
      });
    }

    if (!hasError) {
      setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].previewUrl); // Clean up memory
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
      setUploadProgress(`Uploading image ${i + 1} of ${selectedFiles.length}...`);
      const item = selectedFiles[i];
      const fileExt = item.file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, item.file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setUploadError(`Failed to upload ${item.file.name}: ${uploadError.message}`);
        continue;
      }

      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // 3. Insert into database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([
          {
            image_url: publicUrlData.publicUrl,
            title: item.title,
          }
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
      // Clean up previews
      selectedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
      setSelectedFiles([]);
      fetchGalleryImages();
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      // Extract file path from URL (everything after 'gallery/')
      const urlParts = imageUrl.split('/gallery/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .remove([filePath]);
          
        if (storageError) {
          console.error('Error deleting from storage:', storageError);
          // Optional: handle storage delete failure, but might want to proceed to delete DB row anyway
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Update UI
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm border border-slate-200">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-6 text-sm">Your account is not authorized to access this area.</p>
          <Button onClick={handleLogout} variant="outline" className="w-full justify-center">
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Admin Panel</h1>
          <p className="hidden sm:block text-xs text-slate-500">Logged in as {session?.user?.email}</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <a href="/" className="text-xs sm:text-sm text-teal-700 font-medium hover:underline">
            View Live Site
          </a>
          <Button onClick={handleLogout} variant="outline" size="sm" className="hidden sm:flex">
            Log Out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 mt-4 sm:mt-8 space-y-8">
        
        {/* Upload Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal-700" />
            Upload New Images
          </h2>

          <div className="space-y-6">
            {/* File Input */}
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to select files</span> or drag and drop</p>
                  <p className="text-xs text-slate-400">JPG, PNG, WEBP (Max 10MB per image)</p>
                </div>
                <input 
                  id="dropzone-file" 
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
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {uploadError}
              </div>
            )}

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Files to Upload ({selectedFiles.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedFiles.map((item, index) => (
                    <div key={index} className="flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="relative h-32 bg-slate-200">
                        <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeSelectedFile(index)}
                          disabled={uploading}
                          className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm text-slate-600 hover:text-red-600 hover:bg-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3">
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Title (Optional)</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateFileTitle(index, e.target.value)}
                          disabled={uploading}
                          className="w-full text-sm px-3 py-1.5 border border-slate-300 rounded outline-none focus:border-teal-500"
                          placeholder="E.g. Arthroscopy procedure"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      selectedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
                      setSelectedFiles([]);
                      setUploadError(null);
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="min-w-[120px] justify-center"
                  >
                    {uploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...</>
                    ) : (
                      'Upload Images'
                    )}
                  </Button>
                </div>
                {uploadProgress && (
                  <p className="text-sm text-teal-700 font-medium text-right mt-2">{uploadProgress}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Existing Gallery Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-teal-700" />
              Published Gallery ({galleryImages.length})
            </h2>
            <Button variant="outline" size="sm" onClick={fetchGalleryImages} disabled={fetching}>
              {fetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {fetching && galleryImages.length === 0 ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center">
              <p className="text-slate-500">No images have been uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="group relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-square relative">
                    <img 
                      src={image.image_url} 
                      alt={image.title || 'Gallery image'} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button 
                      onClick={() => handleDelete(image.id, image.image_url)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {image.title && (
                    <div className="p-3 bg-white border-t border-slate-100">
                      <p className="text-xs sm:text-sm font-medium text-slate-800 truncate" title={image.title}>
                        {image.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
