import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { db } from '../Bd/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener este paquete instalado

const Catalogo = () => {
  const [zapatos, setZapatos] = useState([]);
  const navigation = useNavigation(); // Hook para la navegación

  useEffect(() => {
    const obtenerZapatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'catalogo'));
        const listaZapatos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setZapatos(listaZapatos);
      } catch (error) {
        console.error('Error al obtener los zapatos: ', error);
      }
    };

    obtenerZapatos();
  }, []);

  // Renderizado de cada zapato en la lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imagen }} style={styles.imagen} />
      <Text style={styles.marca}>Marca: {item.marca}</Text>
      <Text style={styles.categoria}>Categoría: {item.categoria}</Text>
      <Text style={styles.precio}>Precio: ${item.precio}</Text>
      <Text style={styles.talla}>Talla: {item.tallaZapato}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Catálogo de Zapatos</Text>
      <FlatList
        data={zapatos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
      />

      {/* Botón circular flotante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('FormularioZapato')} // Navega a FormularioZapato
      >
        <Icon name="add-circle" size={60} color="#007bff" />
      </TouchableOpacity>
    </View>
  );
};

export default Catalogo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imagen: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  marca: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoria: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8449',
  },
  talla: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
  },
});
