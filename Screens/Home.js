import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Catalogo from './Catalogo';


const Home = () => {

    return (
        <View style={styles.container}>
          <Catalogo/>
          </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        height: '100%', 
        width: '100%',
        marginTop: 50,
      },
    });

  export default Home;
  