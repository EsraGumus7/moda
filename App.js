import React from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { veriEkle, veriOku } from "./firestoreTest";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Firebase Firestore Test</Text>
      <Button title="Veri Ekle" onPress={veriEkle} />
      <View style={{ height: 20 }} />
      <Button title="Veri Oku" onPress={veriOku} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
}); 