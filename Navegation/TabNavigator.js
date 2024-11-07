// Importaciones de React Navigation para la navegación en la app
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// Importaciones de iconos para usar en la navegación
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Importaciones de Screens para la navegación
import HomeScreen from "../Screens/Home"
import Statistics from "../Screens/Estadistica"


const Tab = createBottomTabNavigator();
function Tabs() {

    return (
        <Tab.Navigator initialRouteName='HomeScreen'>
            <Tab.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={30} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name='Statistics'
                component={Statistics}
                options={{
                    tabBarLabel: 'Estadisticas',
                    tabBarIcon: ({ color, size }) => (
                      <FontAwesome name="bar-chart-o" size={24}  color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

// Componente principal que envuelve toda la navegación en un contenedor
export default function Navegacion() {
   
    return (
      <NavigationContainer>
        <Tabs/>
      </NavigationContainer>
    );
  }
  