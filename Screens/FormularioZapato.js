import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { db } from '../Bd/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const FormularioZapato = () => {
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [tallaZapato, setTallaZapato] = useState('');
  const [imagen, setImagen] = useState(null);
  const navigation = useNavigation();

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri); // Guardar la URI de la imagen localmente
    }
  };

  const agregarZapato = async () => {
    if (marca && categoria && precio && tallaZapato && imagen) {
      try {
        // Guardar los datos en Firestore directamente, incluyendo la URI de la imagen local
        await addDoc(collection(db, 'catalogo'), {
          marca,
          categoria,
          precio: parseFloat(precio),
          tallaZapato,
          imagen, // Guardar la URI de la imagen directamente
        });

        Alert.alert('Zapato agregado', 'El zapato se ha agregado correctamente al catálogo.');
        navigation.goBack();
      } catch (error) {
        console.error('Error al agregar zapato: ', error);
        Alert.alert('Error', `No se pudo agregar el zapato. Detalles: ${error.message}`);
      }
    } else {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar Nuevo Zapato</Text>
      <TextInput placeholder="Marca" style={styles.input} onChangeText={setMarca} value={marca} />
      <TextInput placeholder="Categoría" style={styles.input} onChangeText={setCategoria} value={categoria} />
      <TextInput placeholder="Precio" style={styles.input} keyboardType="numeric" onChangeText={setPrecio} value={precio} />
      <TextInput placeholder="Talla" style={styles.input} onChangeText={setTallaZapato} value={tallaZapato} />
      
      <TouchableOpacity style={styles.selectImageButton} onPress={seleccionarImagen}>
        <Icon name="image-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {imagen && <Image source={{ uri: imagen }} style={styles.selectedImage} />}
      
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
  selectImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
});
