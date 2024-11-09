import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { db } from '../Bd/firebaseconfig';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Catalogo = () => {
  const [zapatos, setZapatos] = useState([]);
  const [selectedZapato, setSelectedZapato] = useState(null); // Para almacenar el zapato en edición
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [tallaZapato, setTallaZapato] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    obtenerZapatos();
  }, []);

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

  // Función para seleccionar un zapato para actualizar
  const seleccionarZapatoParaActualizar = (zapato) => {
    setSelectedZapato(zapato.id);
    setMarca(zapato.marca);
    setCategoria(zapato.categoria);
    setPrecio(String(zapato.precio)); // Convierte el precio a string para el TextInput
    setTallaZapato(zapato.tallaZapato);
  };

  // Función para actualizar el zapato
  const actualizarZapato = async () => {
    if (marca && categoria && precio && tallaZapato) {
      try {
        const zapatoRef = doc(db, 'catalogo', selectedZapato);
        await updateDoc(zapatoRef, {
          marca,
          categoria,
          precio: parseFloat(precio),
          tallaZapato,
        });

        Alert.alert('Zapato actualizado', 'El zapato se ha actualizado correctamente.');
        resetForm();
        obtenerZapatos(); // Recargar los zapatos actualizados
      } catch (error) {
        console.error('Error al actualizar el zapato:', error);
        Alert.alert('Error', 'No se pudo actualizar el zapato. Intenta nuevamente.');
      }
    } else {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
    }
  };

  // Función para eliminar un zapato
  const eliminarZapato = async (id) => {
    try {
      await deleteDoc(doc(db, 'catalogo', id));
      Alert.alert('Zapato eliminado', 'El zapato se ha eliminado correctamente.');
      obtenerZapatos(); // Recargar los zapatos después de eliminar
    } catch (error) {
      console.error('Error al eliminar el zapato:', error);
      Alert.alert('Error', 'No se pudo eliminar el zapato. Intenta nuevamente.');
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setSelectedZapato(null);
    setMarca('');
    setCategoria('');
    setPrecio('');
    setTallaZapato('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imagen }} style={styles.imagen} />
      <Text style={styles.marca}>Marca: {item.marca}</Text>
      <Text style={styles.categoria}>Categoría: {item.categoria}</Text>
      <Text style={styles.precio}>Precio: ${item.precio}</Text>
      <Text style={styles.talla}>Talla: {item.tallaZapato}</Text>
      
      {/* Botones para eliminar y actualizar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => eliminarZapato(item.id)}
        >
          <Icon name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => seleccionarZapatoParaActualizar(item)}
        >
          <Icon name="pencil" size={20} color="#fff" />
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Catálogo de Zapatos</Text>

      {selectedZapato && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Actualizar Zapato</Text>
          <TextInput
            style={styles.input}
            placeholder="Marca"
            value={marca}
            onChangeText={setMarca}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoría"
            value={categoria}
            onChangeText={setCategoria}
          />
          <TextInput
            style={styles.input}
            placeholder="Precio"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Talla"
            value={tallaZapato}
            onChangeText={setTallaZapato}
          />
          
          <View style={styles.formButtonContainer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={actualizarZapato}>
              <Icon name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={resetForm}>
              <Icon name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={zapatos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
      />

      {/* Botón circular flotante para agregar un nuevo zapato */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('FormularioZapato')}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  updateButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  formButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
