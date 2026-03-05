import React, { useState, useEffect} from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import ErrorScreen from './src/screens/ErrorScreen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import { supabase } from './src/lib/supabase';

export default function RootLayout(){
  return(
    <AuthProvider>
      <App/>
    </AuthProvider>
  ) 
}



const App = () => {
  const { user, setAuth } = useAuth();
  const [erro, setErro] = useState(null);

  useEffect(()=>{
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session)=>{ 
        setAuth(session?.user ?? null) 
      });

      return ()=> subscription.unsubscribe();
      
  }, [])


  
  // Tratamento de Erro Global (Pode ser mantido ou virar uma Screen no Stack)
  if (erro) {
    return (
      <ErrorScreen
        errorMessage={erro}
        onTryAgain={() => setErro(null)}
      />
    );
  }

  return (
    // 2. O NavigationContainer agora gerencia o fluxo de telas
    <NavigationContainer>
      {user ? (
        /* 3. Navegação Condicional: Se logado, mostra as Abas Principais*/
        <MainTabNavigator />
      ) : (
        /* Se deslogado, mostra o fluxo de Login/SignUp*/
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};