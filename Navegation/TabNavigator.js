import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Importaciones de iconos para usar en la navegación
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Importaciones de Screens para la navegación
import HomeScreen from '../Screens/Home';
import Statistics from '../Screens/Estadistica';
import FormularioZapato from '../Screens/FormularioZapato';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configura las pestañas de navegación
function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="HomeScreen">
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Catalogo',
          tabBarIcon: ({ color, size }) => <AntDesign name="appstore-o" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={Statistics}
        options={{
          tabBarLabel: 'Estadísticas',
          tabBarIcon: ({ color, size }) => <FontAwesome name="bar-chart-o" size={24} color={color} />,
          headerShown: false,
        }}
      />
   
    </Tab.Navigator>
  );
}

// Configura el Stack Navigator que contiene las pestañas y el formulario
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FormularioZapato"
        component={FormularioZapato}
        options={{ title: 'Agregar Zapato' }}
      />
    </Stack.Navigator>
  );
}

// Componente principal de navegación
export default function Navegacion() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
