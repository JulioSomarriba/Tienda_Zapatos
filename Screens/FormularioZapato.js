// FormularioZapato.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../Bd/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const FormularioZapato = () => {
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [tallaZapato, setTallaZapato] = useState('');
  const [imagen, setImagen] = useState('');
  const navigation = useNavigation();

  const agregarZapato = async () => {
    try {
      await addDoc(collection(db, 'catalogo'), {
        marca,
        categoria,
        precio: parseFloat(precio),
        tallaZapato,
        imagen,
      });
      navigation.goBack(); // Vuelve al catálogo después de agregar
    } catch (error) {
      console.error('Error al agregar zapato: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar Nuevo Zapato</Text>
      <TextInput placeholder="Marca" style={styles.input} onChangeText={setMarca} value={marca} />
      <TextInput placeholder="Categoría" style={styles.input} onChangeText={setCategoria} value={categoria} />
      <TextInput placeholder="Precio" style={styles.input} keyboardType="numeric" onChangeText={setPrecio} value={precio} />
      <TextInput placeholder="Talla" style={styles.input} onChangeText={setTallaZapato} value={tallaZapato} />
      <TextInput placeholder="URL de la Imagen" style={styles.input} onChangeText={setImagen} value={imagen} />
      <Button title="Guardar Zapato" onPress={agregarZapato} />
    </View>
  );
};

export default FormularioZapato;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
  },
});
