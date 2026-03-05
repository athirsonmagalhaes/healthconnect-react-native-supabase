import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/sharedStyles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext'; 
import { GEMINI_API_KEY } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const ChatBotScreen = ({ onError }) => {
  const navigation = useNavigation();
  const { user } = useAuth(); 

  const [messages, setMessages] = useState([
    {
      id: '0',
      text: `Olá${user?.name ? ', ' + user.name : ''}! Sou seu assistente de saúde virtual. Como posso ajudar hoje?`,
      sender: 'ai',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.aiText]}>
        {item.text}
      </Text>
    </View>
  )

  const callGeminiAPI = async (userMessageText, currentMessages, onError) => {
  setIsSending(true);
  try {
    const systemPrompt = `Você é o "Vitalis", um assistente de saúde virtual inteligente e empático. 
    DADOS DO USUÁRIO ATUAL:
    - Nome: ${user?.name || 'Paciente'}
    - Tipo Sanguíneo: ${user?.bloodtype || 'não informado'}

    DIRETRIZES DE RESPOSTA:
    1. Sempre chame o usuário pelo nome.
    2. Seja conciso e direto, mas acolhedor.
    3. Se o usuário perguntar algo sobre doação de sangue ou emergências, use o dado do Tipo Sanguíneo dele para dar uma resposta personalizada.
    4. AVISO LEGAL: Sempre termine orientações médicas com a frase: "Consulte sempre um médico para um diagnóstico preciso."
    5. Não invente dados médicos se não tiver certeza.`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: "Entendido. Sou o Vitalis e estou pronto para ajudar você com base no seu perfil de saúde." }]
        },
        ...currentMessages
          .filter((msg) => msg.id !== '0')
          .map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          }))
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Erro de comunicação');

    const responseText = data.candidates[0].content.parts[0].text;

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now().toString() + '_ai', text: responseText, sender: 'ai' }
    ]);

  } catch (error) {
    console.error('Erro Personalidade:', error.message);
    onError(`Erro: ${error.message}`);
  } finally {
    setIsSending(false);
  }
};

  const handleSend = () => {
    const userMessageText = inputText.trim();
    if (userMessageText === '' || isSending) return;

    const newMessage = { id: Date.now().toString(), text: userMessageText, sender: 'user' };
    const updatedHistory = [...messages, newMessage];

    setMessages(updatedHistory);
    setInputText('');
    callGeminiAPI(userMessageText, updatedHistory, onError);
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, isSending]); 

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#2563EB" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>💬 Chat com Assistente</Text>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isSending && (
          <View style={[styles.typingIndicator, { flexDirection: 'row', alignItems: 'center', marginLeft: 15 }]}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={[styles.typingText, { marginLeft: 8 }]}>Assistente está processando...</Text>
          </View>
        )}

        <View style={styles.inputContainerChat}>
          <TextInput
            style={[styles.chatInput, isSending && { backgroundColor: '#f0f0f0' }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={isSending ? "Aguarde..." : "Digite sua pergunta..."}
            placeholderTextColor="#94A3B8"
            onSubmitEditing={handleSend}
            editable={!isSending}
          />
          <TouchableOpacity
            style={[styles.sendButton, (inputText.trim() === '' || isSending) && styles.disabledButton]}
            onPress={handleSend}
            disabled={inputText.trim() === '' || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Feather name="send" size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBotScreen;