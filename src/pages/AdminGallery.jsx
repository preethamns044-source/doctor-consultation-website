import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import Button from '../components/common/Button';
import GalleryManager from '../components/admin/GalleryManager';
import { Loader2, ArrowLeft, LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminGallery() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const checkAdminStatus = useCallback(async (userId) => {
    if (!userId) {
      setIsAllowed(false);
      setLoading(false);
      window.location.replace('/admin/login?redirect=/admin/gallery');
      return;
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (data && !error) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      setSession(currentSession);

      if (currentSession?.user?.id) {
        checkAdminStatus(currentSession.user.id);
      } else {
        setIsAllowed(false);
        setLoading(false);
        window.location.replace('/admin/login?redirect=/admin/gallery');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);

      if (currentSession?.user?.id) {
        checkAdminStatus(currentSession.user.id);
      } else {
        setIsAllowed(false);
        setLoading(false);
        window.location.replace('/admin/login?redirect=/admin/gallery');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
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
          <p className="text-slate-600 mb-6 text-sm">Your account is not authorized to access gallery management.</p>
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
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Gallery Management</h1>
          <p className="hidden sm:block text-xs text-slate-500">Logged in as {session?.user?.email}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/doctor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Doctor Dashboard</span>
          </a>
          <a href="/" className="text-xs sm:text-sm text-slate-600 font-medium hover:text-teal-700 hover:underline">
            Live Site
          </a>
          <Button onClick={handleLogout} variant="outline" size="sm" icon={LogOut}>
            <span className="hidden sm:inline">Log Out</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 mt-4 sm:mt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Clinic Photo Gallery</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add, organize, and delete photos shown to visitors in the website gallery.
            </p>
          </div>
          <a
            href="/doctor/dashboard"
            className="text-xs text-slate-500 hover:text-teal-700 flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </a>
        </div>

        <GalleryManager />
      </main>
    </div>
  );
}
