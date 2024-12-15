import { useLocation, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthPage = ["/sign-in", "/sign-up", "/"].includes(location.pathname);
  const requiresAuth = ["/track", "/analytics", "/settings"].includes(location.pathname);

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

  // Show navbar only on landing page
  const showNavbar = location.pathname === "/";
  
  // Show sidebar only on authenticated dashboard pages
  const showSidebar = !isAuthPage && user;

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="flex min-h-screen w-full">
        {showSidebar ? (
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
              <SidebarTrigger className="m-4" />
              {children}
            </main>
          </SidebarProvider>
        ) : (
          <main className="flex-1">{children}</main>
        )}
      </div>
    </>
  );
};