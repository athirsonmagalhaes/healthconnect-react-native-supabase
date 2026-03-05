import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from '../styles/sharedStyles';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation();

  const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleDateChange = (text) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 2) {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length > 5) {
      cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9);
    }
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }
    setBirthDate(cleaned);
  };

  const validateBirthDate = (dateString) => {
    if (dateString.length !== 10) return false;
    const parts = dateString.split('/');
    if (parts.length !== 3) return false;

    const [dayStr, monthStr, yearStr] = parts;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const date = new Date(year, month - 1, day);
    
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) return false;
    if (year < 1900) return false;
    return true;
  };

  async function handleSignUp() {
    if (!name || !email || !password || !birthDate || !bloodType) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        const [day, month, year] = birthDate.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              name: name,
              birthdate: formattedDate,
              bloodtype: bloodType,
            },
          ]);

        if (profileError) throw new Error("Usuário criado, mas erro ao salvar perfil.");
      }

      Alert.alert('Sucesso', 'Conta e perfil criados com sucesso!');
      navigation.navigate('Login');

    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.authContainer}>
            <Text style={styles.authTitle}>Criar Conta</Text>

            <Text style={styles.authSubtitle}>Preencha seus dados para começar</Text>

            <View style={styles.authCard}>
              <TextInput
                style={styles.authInput}
                placeholder="Nome"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />

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
                style={[
                  styles.authInput,
                  birthDate.length === 10 && !validateBirthDate(birthDate) && {
                    borderColor: '#EF4444',
                    borderWidth: 2,
                  },
                ]}
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                placeholderTextColor="#94A3B8"
                value={birthDate}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
              />

              <Text style={[styles.label, { marginTop: 4, marginBottom: 10 }]}>
                Tipo Sanguíneo (Obrigatório):
              </Text>
              
              <View style={styles.bloodTypeRow}>
                {TIPOS_SANGUINEOS.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.bloodTypePill,
                      bloodType === type && styles.bloodTypePillSelected,
                    ]}
                    onPress={() => setBloodType(type)}>
                    <Text
                      style={[
                        styles.bloodTypePillText,
                        bloodType === type && styles.bloodTypePillTextSelected,
                      ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.authInput}
                placeholder="Senha"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.authButton} onPress={handleSignUp}>
                <Text style={styles.authButtonText}>
                  {loading ? 'Carregando...' : 'Cadastrar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.authLink}>Já tem conta? Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;