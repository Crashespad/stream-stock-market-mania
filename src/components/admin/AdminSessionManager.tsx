
import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminAccessDenied } from "./AdminAccessDenied";

interface AdminSessionManagerProps {
  children: (session: Session, userRole: string) => ReactNode;
}

export const AdminSessionManager = ({ children }: AdminSessionManagerProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsSessionLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session?.user?.id) {
      checkUserRole();
    }
  }, [session]);

  const checkUserRole = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin panel.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      if (!data) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setUserRole(data.role);
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/');
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  if (!session) {
    navigate('/auth');
    return null;
  }

  if (!userRole) {
    return <AdminAccessDenied />;
  }

  return <>{children(session, userRole)}</>;
};
