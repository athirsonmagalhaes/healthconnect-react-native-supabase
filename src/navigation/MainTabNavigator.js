import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import ConsultasScreen from '../screens/ConsultasScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import AccountScreen from '../screens/AccountScreen';
import TeleconsultaScreen from '../screens/TeleconsultaScreen';
import DependentesScreen from '../screens/DependentesScreen';
import DocumentosScreen from '../screens/DocumentosScreen';

const Tab = createBottomTabNavigator();

function MainTabNavigator({ user, onError }) {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = { Home: 'home', Consultas: 'calendar', Ajuda: 'help-circle', Conta: 'user', Documentos: 'file-text' };
          return <Feather name={icons[route.name]} size={size} color={color} />;
        }, 
        headerShown: false,
      })}
    >

      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Consultas" component={ConsultasScreen} />
      <Tab.Screen name="Documentos" component={DocumentosScreen} />
      <Tab.Screen name="Conta" component={AccountScreen} />
      <Tab.Screen name="Ajuda" component={ChatBotScreen} />
      <Tab.Screen name="Tele-consulta" component={TeleconsultaScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      <Tab.Screen name="Dependentes" component={DependentesScreen} options={{ tabBarItemStyle: { display: 'none' } }} />
      
    </Tab.Navigator>
  );
}

export default MainTabNavigator;