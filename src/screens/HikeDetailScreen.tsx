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

// ✅ Sửa generic từ "Home" -> "HikeDetail"
type Props = NativeStackScreenProps<RootStackParamList, "HikeDetail"> & {
  hikes: Hike[];
  onDelete: (id: string) => void;
};

const HikeDetailScreen: React.FC<Props> = ({ route, navigation, hikes, onDelete }) => {
  const { hikeId } = route.params;
  const hike = hikes.find((h) => h.id === hikeId);

  if (!hike) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>Hike not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    onDelete(hike.id);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.screen}>

      {/* WHITE CARD CONTAINER */}
      <View style={styles.cardContainer}>
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
            onPress={() => navigation.navigate("EditHike", { hikeId })}
          >
            <Text style={styles.primaryButtonText}>Edit</Text>
          </TouchableOpacity>

          {/* Nếu muốn, có thể thêm nút Delete sử dụng handleDelete */}
          {/* 
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          */}
        </View>
      </View>
    </View>
  );
};

const PRIMARY_GREEN = "#4CAF50";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 16,
    paddingTop: 80,
  },

  backIcon: {
    paddingTop: 20,
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 10,
  },

  cardContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY_GREEN,
    marginBottom: 16,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },

  value: {
    fontSize: 14,
    color: "#333",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
    padding: 12,
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
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
  },


  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default HikeDetailScreen;
