import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

const AuthStack = createStackNavigator();

function AuthNavigator({ onAuthSuccess }) {

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => (
          <LoginScreen 
            {...props} 
            onAuthSuccess={onAuthSuccess} 
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>

  );
}

export default AuthNavigator;