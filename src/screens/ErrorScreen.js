import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/sharedStyles';

const ErrorScreen = ({ onTryAgain, errorMessage }) => (
  <View style={styles.container}>
    <View style={styles.errorContainer}>
      <Icon name="warning" size={60} color="#e74c3c" />
      <Text style={styles.errorTitle}>Ocorreu um Erro</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity style={styles.errorButton} onPress={onTryAgain}>
        <Text style={styles.buttonText}>TENTAR NOVAMENTE</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default ErrorScreen;