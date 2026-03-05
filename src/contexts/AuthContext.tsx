import { User } from '@supabase/supabase-js'
import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface UserProfile extends User {
    name?: string;
    birthdate?: string;
    bloodtype?: string;
}

interface AuthContextProps{
    user: (UserProfile | null);
    setAuth: (authUser: User|null)=> Promise<void>;
    loading: boolean;
}

const AuthContext = createContext({} as AuthContextProps)

export const AuthProvider = ({children }: {children: ReactNode})=>{

    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true);

    async function setAuth(supabaseUser: User | null) {
        setLoading(true);
        
        if (!supabaseUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('users') 
                .select('name, birthdate, bloodtype')
                .eq('id', supabaseUser.id)
                .single();

            if (error) {
                setUser(supabaseUser as UserProfile);
            } else {
                setUser({
                    ...supabaseUser,
                    ...data
                });
            }
        } catch (err) {
            console.error("Erro inesperado no AuthContext:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);