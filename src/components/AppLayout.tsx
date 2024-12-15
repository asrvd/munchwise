import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showNavbar = location.pathname === "/";
  const showSidebar = !["", "/sign-in", "/sign-up", "/onboarding"].includes(
    location.pathname.substring(1)
  );

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