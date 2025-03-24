import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';

// Tipos e Interfaces
interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: {
    email: (email: string, password: string) => Promise<void>;
    google: () => Promise<void>;
    facebook: () => Promise<void>;
  };
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Criação do Contexto de Autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar a autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Provedor de Autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estados
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Funções de Autenticação
  const authServices = {
    // Busca o perfil do usuário
    async fetchProfile(userId: string) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    },

    // Login com email e senha
    async signInWithEmail(email: string, password: string) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },

    // Login com Google
    async signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/projects`,
        },
      });
      if (error) throw error;
    },

    // Login com Facebook
    async signInWithFacebook() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/projects`,
        },
      });
      if (error) throw error;
    },

    // Cadastro de novo usuário
    async signUpWithEmail(email: string, password: string, name: string) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, name });
        if (profileError) throw profileError;
      }
    },

    // Logout
    async signOutUser() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  };

  // Efeito para gerenciar o estado da autenticação
  useEffect(() => {
    // Configuração inicial
    const setupAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) await authServices.fetchProfile(session.user.id);
      setLoading(false);
    };

    // Listener de mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) await authServices.fetchProfile(session.user.id);
        else setProfile(null);
        setLoading(false);
      }
    );

    setupAuth();

    // Limpeza do listener
    return () => subscription.unsubscribe();
  }, []);

  // Valor do contexto
  const contextValue = {
    user,
    profile,
    session,
    loading,
    signIn: {
      email: authServices.signInWithEmail,
      google: authServices.signInWithGoogle,
      facebook: authServices.signInWithFacebook,
    },
    signUp: authServices.signUpWithEmail,
    signOut: authServices.signOutUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}