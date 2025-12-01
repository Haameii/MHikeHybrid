// app/HikeDetailScreen.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Hike } from "../types";

type RootStackParamList = {
  Home: undefined;
  HikeDetail: { hikeId: string };
  EditHike: { hikeId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "HikeDetail"> & {
  hikes: Hike[];
  onDelete: (id: string) => void;
};

const HikeDetailScreen: React.FC<Props> = ({ route, navigation, hikes, onDelete }) => {
  const { hikeId } = route.params;
  const hike = hikes.find((h) => h.id === hikeId);

  if (!hike) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Hike not found.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    onDelete(hike.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hike.name}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{hike.location}</Text>

      <Text style={styles.label}>Date & Time:</Text>
      <Text style={styles.value}>{hike.date}</Text>

      <Text style={styles.label}>Length (km):</Text>
      <Text style={styles.value}>{hike.lengthKm}</Text>

      {hike.difficulty && (
        <>
          <Text style={styles.label}>Difficulty:</Text>
          <Text style={styles.value}>{hike.difficulty}</Text>
        </>
      )}

      {hike.description && (
        <>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{hike.description}</Text>
        </>
      )}

      {hike.latitude !== undefined && hike.longitude !== undefined && (
        <>
          <Text style={styles.label}>GPS Coordinates:</Text>
          <Text style={styles.value}>
            {hike.latitude.toFixed(5)}, {hike.longitude.toFixed(5)}
          </Text>
        </>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("EditHike", { hikeId: hike.id })}
        >
          <Text style={styles.primaryButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const PRIMARY_GREEN = "#4CAF50";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY_GREEN,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
  },
  backButton: {
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_GREEN,
    alignItems: "center",
  },
  backButtonText: {
    color: PRIMARY_GREEN,
    fontWeight: "600",
  },
});

export default HikeDetailScreen;
