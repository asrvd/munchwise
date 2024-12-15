import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProfileCreation = (userId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const createProfile = async () => {
      if (!userId) return;

      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select()
          .eq('id', userId)
          .single();

        if (!existingProfile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: userId }]);

          if (insertError) throw insertError;

          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error creating profile:', error);
        toast({
          title: "Error",
          description: "Failed to create user profile. Please try again.",
          variant: "destructive"
        });
      }
    };

    createProfile();
  }, [userId, navigate, toast]);
};