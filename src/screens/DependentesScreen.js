import React, {
  useState
} from 'react';
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

const DependentesScreen = () => {
  const navigation = useNavigation();

  const initialDependents = [
    { id: '1', nome: 'João da Silva', parentesco: 'Filho(a)', idade: 8 },
    { id: '2', nome: 'Maria da Silva', parentesco: 'Cônjuge', idade: 35 },
    { id: '3', nome: 'Pedro da Silva', parentesco: 'Filho(a)', idade: 5 },
  ];
  const [dependentes, setDependentes] = useState(initialDependents);

  const handleAddDependent = () => {
    Alert.alert('Adicionar Dependente', 'nome, parentesco e idade', [
      { text: 'OK' },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.dependentCard}>
      <View style={styles.infoContainer}>
        <Text style={styles.dependentName}>{item.nome}</Text>
        <Text style={styles.dependentDetails}>
          {item.parentesco} / {item.idade} anos
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => Alert.alert('Editar', `Editar ${item.nome}`)}>
        <Feather name="edit" size={20} color="#3498DB" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#3498DB" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Meus Dependentes</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddDependent}>
        <Feather name="plus" size={24} color="#fff" />
        <Text style={styles.addButtonText}>ADICIONAR DEPENDENTE</Text>
      </TouchableOpacity>

      <FlatList
        data={dependentes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhum dependente cadastrado.</Text>
        )}
      />
    </View>
  );
};

export default DependentesScreen;