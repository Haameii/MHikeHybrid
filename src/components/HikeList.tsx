import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Hike } from "../types";

type Props = {
  hikes: Hike[];
  onEditHike: (hike: Hike) => void;
  onDeleteHike: (id: string) => void;
  onResetDatabase: () => void;
};

const HikeList: React.FC<Props> = ({
  hikes,
  onEditHike,
  onDeleteHike,
  onResetDatabase,
}) => {
  // 👇 Hàm confirm xóa
  const confirmDeleteHike = (id: string, name?: string) => {
    Alert.alert(
      "Delete Hike",
      name
        ? `Are you sure you want to delete "${name}"?`
        : "Are you sure you want to delete this hike?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteHike(id),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Saved Hikes</Text>

        <TouchableOpacity style={styles.resetButton} onPress={onResetDatabase}>
          <Text style={styles.resetButtonText}>Reset DB</Text>
        </TouchableOpacity>
      </View>

      {hikes.length === 0 ? (
        <Text style={styles.emptyText}>No hikes yet. Add one above.</Text>
      ) : (
        hikes.map((item) => (
          <View key={item.id} style={styles.hikeItem}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => onEditHike(item)}
            >
              <Text style={styles.hikeName}>{item.name}</Text>
              <Text style={styles.hikeText}>{item.location}</Text>
              <Text style={styles.hikeText}>
                Date: {item.date} | {item.lengthKm} km
              </Text>

              {item.difficulty && (
                <Text style={styles.hikeText}>
                  Difficulty: {item.difficulty}
                </Text>
              )}

              {item.latitude !== undefined &&
                item.longitude !== undefined && (
                  <Text style={styles.hikeGps}>
                    GPS: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                  </Text>
                )}
            </TouchableOpacity>

            {/* 🔥 Delete icon button với confirm */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDeleteHike(item.id, item.name)}
            >
              <FontAwesome name="trash" size={20} color="#da8483ff" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

const PRIMARY_GREEN = "#4CAF50";
const DARK_GREEN = "#2E7D32";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: PRIMARY_GREEN,
  },
  resetButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF9800",
  },
  resetButtonText: {
    color: "#FF9800",
    fontWeight: "600",
  },
  emptyText: {
    color: "#777",
  },
  hikeItem: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  hikeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: DARK_GREEN,
  },
  hikeText: {
    fontSize: 13,
    color: "#555",
  },
  hikeGps: {
    fontSize: 12,
    color: "#00796B",
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HikeList;
