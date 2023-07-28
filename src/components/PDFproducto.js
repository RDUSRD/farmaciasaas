import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

function PDFProducto({ productos }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Lista de productos</Text>
          {productos.map((producto) => (
            <View key={producto.id}>
              <Text style={styles.subtitle}>{producto.name}</Text>
              <Text style={styles.text}>ID: {producto.id}</Text>
              <Text style={styles.text}>Imagen: {producto.img}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export { PDFProducto };
