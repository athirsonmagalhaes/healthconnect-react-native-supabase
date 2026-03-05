import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/sharedStyles';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const { setAuth, user } = useAuth();

  async function handleSignout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Erro', 'Erro ao sair da conta');
      return;
    }
    setAuth(null);
  }

  const navigation = useNavigation();
  const menuItems = [
    {
      id: 'Consultas',
      label: 'Consultas',
      icon: 'calendar',
      iconFamily: 'Feather',
    },
    {
      id: 'Tele-consulta',
      label: 'Tele-consulta',
      icon: 'video',
      iconFamily: 'Feather',
    },
    {
      id: 'Dependentes',
      label: 'Dependentes',
      icon: 'users',
      iconFamily: 'Feather',
    },
    {
      id: 'Documentos',
      label: 'Documentos médicos',
      icon: 'file-text',
      iconFamily: 'Feather',
    },
    {
      id: 'Conta',
      label: 'Conta',
      icon: 'user',
      iconFamily: 'Feather',
    },

    {
      id: 'Ajuda',
      label: 'Assistente virtual',
      icon: 'help-circle',
      iconFamily: 'Feather',
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitleApp}>Bem-vindo</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignout}>
          <Feather name="log-out" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuButton}
              onPress={() => {navigation.navigate(item.id)}}>
              <Feather name={item.icon} size={35} color="#2563EB" />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;