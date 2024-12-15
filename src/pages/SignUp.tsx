import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCreation } from "@/hooks/useProfileCreation";

const SignUp = () => {
  const [userId, setUserId] = useState<string>();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      setUserId(session?.user?.id);
    }
  });

  useProfileCreation(userId);

  return (
    <div className="container mx-auto max-w-sm px-4 py-8">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google", "github"]}
        redirectTo={`${window.location.origin}/onboarding`}
      />
    </div>
  );
};

export default SignUp;