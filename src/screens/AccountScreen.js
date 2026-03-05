import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/sharedStyles';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const AccountScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#2563EB" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Minha Conta (Perfil)</Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{user?.name || 'N/A'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Data de Nascimento:</Text>
          <Text style={styles.infoValue}>
            {user?.birthdate || 'Não informada'}
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Tipo Sanguíneo:</Text>
          <Text style={styles.infoValue}>{user?.bloodtype || 'N/A'}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.authButtonText}>
          ALTERAR SENHA (Não implementado)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;