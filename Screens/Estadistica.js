import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import { db } from '../Bd/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

const Estadistica = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [sizeData, setSizeData] = useState([]);
  const barChartRef = useRef();
  const pieChartRef = useRef();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'catalogo'));
      const zapatos = querySnapshot.docs.map((doc) => doc.data());

      const categoryCount = zapatos.reduce((acc, zapato) => {
        acc[zapato.categoria] = (acc[zapato.categoria] || 0) + 1;
        return acc;
      }, {});

      const sizeCount = zapatos.reduce((acc, zapato) => {
        acc[zapato.tallaZapato] = (acc[zapato.tallaZapato] || 0) + 1;
        return acc;
      }, {});

      setCategoryData(
        Object.entries(categoryCount).map(([key, value]) => ({ label: key, value }))
      );

      setSizeData(
        Object.entries(sizeCount).map(([key, value]) => ({ name: key, population: value }))
      );
    } catch (error) {
      console.error('Error al obtener datos para las estadísticas:', error);
    }
  };

  const generarPDFBarChart = async () => {
    try {
      const uri = await captureRef(barChartRef, {
        format: 'png',
        quality: 1,
        width: screenWidth - 30,
        height: 300,
      });

      const doc = new jsPDF();
      doc.text('Reporte de Gráfico de Barras - Categorías de Zapatos', 10, 10);

      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      doc.addImage(`data:image/png;base64,${chartImage}`, 'PNG', 10, 20, 180, 120);

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_bar_chart.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error al generar o compartir el PDF de gráfico de barras: ', error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF de gráfico de barras.');
    }
  };

  const generarPDFPieChart = async () => {
    try {
      const uri = await captureRef(pieChartRef, {
        format: 'png',
        quality: 1,
        width: screenWidth - 30,
        height: 300,
      });

      const doc = new jsPDF();
      doc.text('Reporte de Gráfico Circular - Tallas de Zapatos', 10, 10);

      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      doc.addImage(`data:image/png;base64,${chartImage}`, 'PNG', 10, 20, 180, 120);

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_pie_chart.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error al generar o compartir el PDF de gráfico circular: ', error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF de gráfico circular.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas de Zapatos</Text>

      <View ref={barChartRef} collapsable={false} style={styles.chartContainer}>
        <BarChart
          data={{
            labels: categoryData.map((item) => item.label),
            datasets: [{ data: categoryData.map((item) => item.value) }],
          }}
          width={screenWidth - 30}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={styles.chart}
        />     
      </View>
      <View style={styles.button}>
          <Button title="Generar PDF del Gráfico de Barras" onPress={generarPDFBarChart} />
        </View>

      <View ref={pieChartRef} collapsable={false} style={styles.chartContainer}>
        <PieChart
          data={sizeData.map((item) => ({
            name: `Talla ${item.name}`,
            population: item.population,
            color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          }))}
          width={screenWidth - 30}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chart}
        />      
      </View>
      <View style={styles.button}>
          <Button title="Generar PDF del Gráfico Circular" onPress={generarPDFPieChart} />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  button: {
    marginTop: 10,
  },
});

export default Estadistica;
