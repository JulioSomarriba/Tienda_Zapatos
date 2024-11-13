import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { db } from '../Bd/firebaseconfig';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Catalogo = () => {
  const [zapatos, setZapatos] = useState([]);
  const [selectedZapato, setSelectedZapato] = useState(null);
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [tallaZapato, setTallaZapato] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Llama a la función para suscribirse a los cambios en la colección
    const unsubscribe = obtenerZapatosTiempoReal();
    
    // Limpia la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  // Configura un listener en tiempo real en la colección 'catalogo'
  const obtenerZapatosTiempoReal = () => {
    const zapatosRef = collection(db, 'catalogo');
    return onSnapshot(zapatosRef, (snapshot) => {
      const listaZapatos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setZapatos(listaZapatos);
    });
  };

  const seleccionarZapatoParaActualizar = (zapato) => {
    setSelectedZapato(zapato.id);
    setMarca(zapato.marca);
    setCategoria(zapato.categoria);
    setPrecio(String(zapato.precio));
    setTallaZapato(zapato.tallaZapato);
  };

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
      } catch (error) {
        console.error('Error al actualizar el zapato:', error);
        Alert.alert('Error', 'No se pudo actualizar el zapato. Intenta nuevamente.');
      }
    } else {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
    }
  };

  const eliminarZapato = async (id) => {
    Alert.alert(
      'Confirmación de Eliminación',
      '¿Estás seguro de que deseas eliminar este zapato del catálogo?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Eliminación cancelada'),
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'catalogo', id));
              Alert.alert('Zapato eliminado', 'El zapato se ha eliminado correctamente.');
            } catch (error) {
              console.error('Error al eliminar el zapato:', error);
              Alert.alert('Error', 'No se pudo eliminar el zapato. Intenta nuevamente.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

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
      <Text style={styles.marca}>{item.marca}</Text>
      <Text style={styles.categoria}>Categoría: {item.categoria}</Text>
      <Text style={styles.precio}>${item.precio}</Text>
      <Text style={styles.talla}>Talla: {item.tallaZapato}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => eliminarZapato(item.id)}
        >
          <Icon name="trash" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => seleccionarZapatoParaActualizar(item)}
        >
          <Icon name="pencil" size={20} color="#fff" />
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
    backgroundColor: '#f8f9fa',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  lista: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  imagen: {
    width: '95%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  marca: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  categoria: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  precio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  talla: {
    fontSize: 16,
    color: '#34495e',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  button: {
    padding: 10,
    borderRadius: 8,
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
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
  },
  formButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
