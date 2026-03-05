import React, {
  useState,
  useMemo,
  useEffect
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/sharedStyles';
import { useAppointments } from '../hooks/useAppointments';
import { useNavigation } from '@react-navigation/native';

const ConsultasScreen = () => {
  const navigation = useNavigation();
  
  const { 
    consultas, 
    loading: loadingConsultas, 
    buscarConsultas, 
    salvarConsulta, 
    excluirConsulta 
  } = useAppointments();

  const [estadoSelecionado, setEstadoSelecionado] = useState(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [lembrete, setLembrete] = useState(false);
  const [consultaEmEdicao, setConsultaEmEdicao] = useState(null);
  const [medicosData, setMedicosData] = useState([]);
  const [loadingMedicos, setLoadingMedicos] = useState(false);

  useEffect(() => {
    buscarConsultas();
  }, [buscarConsultas]);

  const buscarMedicos = async () => {
    if (!estadoSelecionado || !cidadeSelecionada) {
      setMedicosData([]);
      return;
    }

    setLoadingMedicos(true);
    try {
      const { data, error } = await supabase
        .from('medicos')
        .select('*')
        .eq('estado', estadoSelecionado)
        .eq('cidade', cidadeSelecionada);

      if (error) throw error;
      setMedicosData(data || []);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os médicos.');
    } finally {
      setLoadingMedicos(false);
    }
  };

  useEffect(() => {
    buscarMedicos();
  }, [estadoSelecionado, cidadeSelecionada]);

  const listaDatas = useMemo(() => {
    const datas = [];
    for (let i = 1; i <= 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      datas.push(`${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`);
    }
    return datas;
  }, []);

  const listaHorarios = useMemo(() => {
    const horarios = [];
    for (let h = 7; h <= 19; h++) {
      const hora = String(h).padStart(2, '0');
      horarios.push(`${hora}:00`);
      if (h !== 19) horarios.push(`${hora}:30`);
    }
    return horarios;
  }, []);

  const estados = [
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
  ];

  const cidadesPorEstado = {
    SP: ['São Paulo', 'Campinas', 'Santos'],
    RJ: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias'],
  };

  const getMedicosFiltrados = useMemo(() => {
    const busca = termoBusca.toLowerCase().trim();
    if (!busca) return medicosData;
    return medicosData.filter(m => 
      m.nome.toLowerCase().includes(busca) || 
      m.especialidade.toLowerCase().includes(busca)
    );
  }, [medicosData, termoBusca]);

  const resetForm = () => {
    setMedicoSelecionado(null);
    setDataSelecionada('');
    setHorarioSelecionado('');
    setLembrete(false);
    setConsultaEmEdicao(null);
    setTermoBusca('');
  };

  const handleSalvarOuAtualizarConsulta = async () => {
    if (!medicoSelecionado || !dataSelecionada || !horarioSelecionado) {
      Alert.alert('Erro', 'Selecione médico, data e horário.');
      return;
    }

    const dados = {
      medicoId: medicoSelecionado.id,
      data: dataSelecionada,
      horario: horarioSelecionado,
      lembrete
    };

    const resultado = await salvarConsulta(dados, consultaEmEdicao);

    if (resultado.success) {
      Alert.alert('Sucesso', consultaEmEdicao ? 'Reagendado!' : 'Agendado!');
      resetForm();
    } else {
      if (resultado.error.code === '23505') {
        Alert.alert('Horário Ocupado', 'Este médico já possui agendamento neste horário.');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar a consulta.');
      }
    }
  };

  const handleStartReagendamento = (consultaId) => {
    const consulta = consultas.find(c => c.id === consultaId);
    if (consulta) {
      setEstadoSelecionado(consulta.localidade.estado);
      setCidadeSelecionada(consulta.localidade.cidade);
      setMedicoSelecionado({
        id: consulta.medicoId,
        nome: consulta.medicoNome,
        especialidade: consulta.especialidade
      });
      setLembrete(consulta.lembrete || false);
      setConsultaEmEdicao(consultaId);
    }
  };

  const handleConfirmarExclusao = (id) => {
    Alert.alert('Confirmar', 'Deseja cancelar esta consulta?', [
      { text: 'Não' },
      { text: 'Sim, Cancelar', onPress: () => excluirConsulta(id), style: 'destructive' }
    ]);
  };

  const renderMedicoItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.pickerItem, medicoSelecionado?.id === item.id && styles.pickerItemSelected]}
      onPress={() => setMedicoSelecionado(item)}>
      <Text style={[styles.pickerItemText, medicoSelecionado?.id === item.id && styles.pickerItemSelectedText]}>
        {item.nome}
      </Text>
      <Text style={[styles.pickerItemSubText, medicoSelecionado?.id === item.id && styles.pickerItemSelectedText]}>
        ({item.especialidade})
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#2563EB" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>
            {consultaEmEdicao ? 'Reagendar Consulta' : 'Agendar Nova Consulta'}
          </Text>

          <Text style={styles.label}>Selecione o Estado:</Text>
          <View style={styles.localidadeRow}>
            {estados.map((est) => (
              <TouchableOpacity
                key={est.sigla}
                style={[styles.localidadePill, estadoSelecionado === est.sigla && styles.localidadePillSelected]}
                onPress={() => { setEstadoSelecionado(est.sigla); setCidadeSelecionada(null); }}>
                <Text style={[styles.localidadePillText, estadoSelecionado === est.sigla && styles.localidadePillTextSelected]}>
                  {est.sigla}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {estadoSelecionado && (
            <>
              <Text style={styles.label}>Selecione a Cidade:</Text>
              <View style={styles.localidadeRow}>
                {cidadesPorEstado[estadoSelecionado]?.map((cidade) => (
                  <TouchableOpacity
                    key={cidade}
                    style={[styles.cidadePill, cidadeSelecionada === cidade && styles.localidadePillSelected]}
                    onPress={() => setCidadeSelecionada(cidade)}>
                    <Text style={[styles.localidadePillText, cidadeSelecionada === cidade && styles.localidadePillTextSelected]}>
                      {cidade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {estadoSelecionado && cidadeSelecionada && (
            <View style={styles.medicoSelectionBlock}>
              <Text style={styles.label}>Encontre e Selecione o Médico:</Text>
              <TextInput
                style={styles.input}
                value={termoBusca}
                onChangeText={setTermoBusca}
                placeholder="Pesquisar por Nome ou Especialidade..."
              />
              <View style={styles.flatListContainer}>
                {loadingMedicos ? (
                  <ActivityIndicator color="#2563EB" />
                ) : (
                  <FlatList
                    data={getMedicosFiltrados}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMedicoItem}
                    scrollEnabled={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum médico encontrado.</Text>}
                  />
                )}
              </View>
            </View>
          )}

          {medicoSelecionado && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>Escolha a Data:</Text>
              <View style={{ backgroundColor: '#F0F4F7', borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#D1D8E0' }}>
                <Picker selectedValue={dataSelecionada} onValueChange={setDataSelecionada}>
                  <Picker.Item label="Selecione um dia..." value="" color="#7F8C8D" />
                  {listaDatas.map(dt => <Picker.Item key={dt} label={dt} value={dt} />)}
                </Picker>
              </View>

              <Text style={styles.label}>Escolha o Horário:</Text>
              <View style={{ backgroundColor: '#F0F4F7', borderRadius: 10, borderWidth: 1, borderColor: '#D1D8E0' }}>
                <Picker selectedValue={horarioSelecionado} onValueChange={setHorarioSelecionado}>
                  <Picker.Item label="Selecione um horário..." value="" color="#7F8C8D" />
                  {listaHorarios.map(hr => <Picker.Item key={hr} label={hr} value={hr} />)}
                </Picker>
              </View>
            </View>
          )}

          <View style={styles.switchRow}>
            <Text style={styles.label}>Receber lembrete da consulta:</Text>
            <Switch value={lembrete} onValueChange={setLembrete} trackColor={{ true: '#93C5FD' }} thumbColor="#2563EB" />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, consultaEmEdicao ? styles.updateButton : styles.saveButton, (!medicoSelecionado || !dataSelecionada || !horarioSelecionado) && styles.disabledButton]}
              onPress={handleSalvarOuAtualizarConsulta}
              disabled={loadingConsultas}>
              {loadingConsultas ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{consultaEmEdicao ? 'CONFIRMAR REAGENDAMENTO' : 'AGENDAR CONSULTA'}</Text>}
            </TouchableOpacity>

            {consultaEmEdicao && (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={resetForm}>
                <Text style={styles.buttonText}>CANCELAR</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Consultas Agendadas ({consultas.length})</Text>
          {consultas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma consulta agendada no momento.</Text>
          ) : (
            consultas.map((consulta) => (
              <View key={consulta.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View>
                    <Text style={styles.eventDate}>Data: {consulta.data} às {consulta.horario}</Text>
                    <Text style={styles.eventLocation}>{consulta.localidade.cidade}, {consulta.localidade.estado}</Text>
                  </View>
                  <View style={styles.eventActions}>
                    <TouchableOpacity 
                      style={styles.editButton} 
                      onPress={() => handleStartReagendamento(consulta.id)}>
                      <Text style={styles.actionButtonText}>REAGENDAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.deleteButton} 
                      onPress={() => handleConfirmarExclusao(consulta.id)}>
                      <Text style={styles.actionButtonText}>CANCELAR</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.eventName}>{consulta.medicoNome} ({consulta.especialidade})</Text>
                <Text style={styles.eventObservation}>Lembrete: {consulta.lembrete ? 'SIM' : 'NÃO'}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ConsultasScreen;