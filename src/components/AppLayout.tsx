import { useLocation, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isAuthPage = ["/sign-in", "/sign-up"].includes(location.pathname);
  const requiresAuth = [
    "/track",
    "/analytics",
    "/settings",
    "/onboarding",
  ].includes(location.pathname);

  if (loading || isProfileLoading) {
    return <div>Loading...</div>;
  }

  if (user && isAuthPage) {
    return <Navigate to="/track" replace />;
  }

  if (!user && requiresAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  if (
    !profile?.daily_calories &&
    user &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-orange-50/60">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
