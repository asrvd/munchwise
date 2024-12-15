import { useLocation, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error) {
      setProfile(data);
    }
    setLoading(false);
  };

  const isAuthPage = ["/sign-in", "/sign-up"].includes(location.pathname);
  const isLandingPage = location.pathname === "/";
  const isOnboardingPage = location.pathname === "/onboarding";
  const requiresAuth = ["/track", "/analytics", "/settings", "/onboarding"].includes(
    location.pathname
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    return <Navigate to="/track" replace />;
  }

  // Redirect unauthenticated users to sign in
  if (!user && requiresAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  // Redirect to onboarding if profile is incomplete
  if (user && profile && !profile.daily_calories && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-orange-50/60">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};