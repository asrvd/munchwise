import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, BarChart, Utensils } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/sign-in');
  };

  const getAvatarUrl = (email: string) => {
    const seed = email || 'default';
    return `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;
  };

  return (
    <nav className="border-b border-orange-200/50 bg-orange-50/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Mealwise</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full backdrop-blur border border-orange-200/50"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={getAvatarUrl(session.user.email || "")}
                        alt={profile?.name || session.user.email || "User"}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-orange-50 text-base border border-orange-200/50 w-48"
                >
                  <DropdownMenuItem asChild className="text-base cursor-pointer">
                    <Link to="/track">
                      <Utensils className="mr-2 h-4 w-4" />
                      Track
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-base cursor-pointer">
                    <Link to="/analytics">
                      <BarChart className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-base cursor-pointer">
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-base cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;