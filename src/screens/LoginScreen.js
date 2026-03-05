import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import styles from '../styles/sharedStyles';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('user@teste.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      Alert.alert('Erro', error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    onAuthSuccess(data.user);
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.authContainer}>
            <Text style={styles.logo}>HealthConnect</Text>

            <View style={styles.authCard}>
              <Text style={styles.authSubtitle}>Acesse sua conta para continuar</Text>

              <TextInput
                style={styles.authInput}
                placeholder="Email"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.authInput}
                placeholder="Senha"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              
              <TouchableOpacity 
                style={styles.authButton} 
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.authButtonText}>
                  {loading ? 'Carregando...' : 'Entrar'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.authLink}>Não tem conta? Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;