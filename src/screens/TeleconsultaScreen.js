import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles/sharedStyles';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const TeleconsultaScreen = () => {
  const navigation = useNavigation();

  const [callState, setCallState] = useState('parado');
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const intervalRef = useRef(null);
  const formatTime = useCallback((totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, []);
  useEffect(() => {
    if (callState === 'ativo' && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCallTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [callState]);
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };
  const toggleCamera = () => {
    setIsCameraOff((prev) => !prev);
  };
  const toggleCall = () => {
    if (callState !== 'parado') {
      setCallState('parado');
      setCallTime(0);
    } else {
      setCallState('conectando');
      setTimeout(() => {
        setCallState('ativo');
      }, 3000);
    }
  };

  const isActive = callState === 'ativo';
  const isConnecting = callState === 'conectando';
  const isCalling = callState !== 'parado';

  const buttonColor = isCalling ? '#E74C3C' : '#2ECC71';
  let statusText = 'Pressione em "Ligar" para iniciar a teleconsulta';
  let doctorName = '';
  let specialty = '';
  if (isConnecting) {
    statusText = 'Aguardando atendimento...';
    doctorName = 'Buscando médico...';
  } else if (isActive) {
    statusText = formatTime(callTime);
    doctorName = 'Dra. Sofia Martins';
    specialty = 'Clínico geral';
  }

  const micIconName = isMuted ? 'mic-off' : 'mic';
  const micColor = isMuted ? '#E74C3C' : '#95A5A6';
  const cameraIconName = isCameraOff ? 'video-off' : 'video';
  const cameraColor = isCameraOff ? '#E74C3C' : '#95A5A6';

  return (
    <View style={styles.callContainer}>
      <View style={styles.videoContainer}>
        <View
          style={[styles.remoteVideo, isCameraOff && styles.remoteVideoOff]}>
          {isActive ? (
            <View style={styles.infoContainer}>
              {isCameraOff && (
                <Feather name="video-off" size={60} color="#fff" />
              )}
              <Text
                style={
                  isConnecting ? styles.statusTextConnecting : styles.statusText
                }>
                {statusText}
              </Text>
              <Text style={styles.nameText}>{doctorName}</Text>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <View style={styles.doctorCircle}>
                <Feather name="user" size={80} color="#fff" />
              </View>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          )}
        </View>
        <View style={styles.localVideo}>
          <Text style={styles.localVideoText}>Sua Câmera</Text>
        </View>
      </View>
      <View style={styles.controlButtonsContainer}>
        {isActive ? (
          <>
            <TouchableOpacity
              style={[styles.smallControlButton, { backgroundColor: micColor }]}
              onPress={toggleMute}>
              <Feather name={micIconName} size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.callButton,
                { backgroundColor: buttonColor, marginBottom: 0 },
              ]}
              onPress={toggleCall}>
              <Feather name={'phone-off'} size={30} color="#FFFFFF" />
              <Text style={styles.callButtonText}>{'Desligar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.smallControlButton,
                { backgroundColor: cameraColor },
              ]}
              onPress={toggleCamera}>
              <Feather name={cameraIconName} size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.callButton,
              { backgroundColor: buttonColor, marginBottom: 0 },
            ]}
            onPress={toggleCall}>
            <Feather name={'phone'} size={30} color="#FFFFFF" />
            <Text style={styles.callButtonText}>{'Ligar'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TeleconsultaScreen;