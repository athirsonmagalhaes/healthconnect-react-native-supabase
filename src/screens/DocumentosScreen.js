import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/sharedStyles';
import { useNavigation } from '@react-navigation/native';

const DocumentosScreen = () => {
  const navigation = useNavigation();
  
  const documentos = [
    {
      id: 'd1',
      nome: 'Receita de Óculos - 2023',
      tipo: 'Receita',
      data: '15/08/2023',
    },
    {
      id: 'd2',
      nome: 'Exames de Sangue - 01/2024',
      tipo: 'Exame',
      data: '10/01/2024',
    },
    {
      id: 'd3',
      nome: 'Atestado Médico - COVID',
      tipo: 'Atestado',
      data: '20/12/2022',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.documentCard}>
      <Feather name="file" size={30} color="#7C3AED" />
      <View style={styles.docInfo}>
        <Text style={styles.documentName}>{item.nome}</Text>
        <Text style={styles.documentDetails}>
          {item.tipo} | Data: {item.data}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => Alert.alert('Download', `Baixando ${item.nome}`)}>
        <Feather name="file-plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#2563EB" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Meus Documentos</Text>
      <FlatList
        data={documentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhum documento encontrado.</Text>
        )}
      />
    </View>
  );
};

export default DocumentosScreen;