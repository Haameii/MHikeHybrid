// app/EditHikeScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import HikeForm from "../components/HikeForm";
import { Hike } from "../types";

type RootStackParamList = {
  Home: undefined;
  HikeDetail: { hikeId: string };
  EditHike: { hikeId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "EditHike"> & {
  hikes: Hike[];
  setHikes: React.Dispatch<React.SetStateAction<Hike[]>>;
};

const EditHikeScreen: React.FC<Props> = ({ route, navigation, hikes, setHikes }) => {
  const { hikeId } = route.params;
  const existing = hikes.find((h) => h.id === hikeId);

  const [name, setName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [date, setDate] = useState("");
  const [lengthKm, setLengthKm] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!existing) {
      Alert.alert("Error", "Hike not found", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
      return;
    }

    setName(existing.name);
    setLocationText(existing.location);
    setDate(existing.date);
    setLengthKm(existing.lengthKm.toString());
    setDifficulty(existing.difficulty ?? "");
    setDescription(existing.description ?? "");
  }, [existing, navigation]);

  const handleSave = () => {
    if (!existing) return;

    if (!name.trim()) {
      Alert.alert("Validation", "Name is required");
      return;
    }
    if (!locationText.trim()) {
      Alert.alert("Validation", "Location is required");
      return;
    }
    if (!date.trim()) {
      Alert.alert("Validation", "Date & time is required");
      return;
    }
    if (!lengthKm.trim() || isNaN(parseFloat(lengthKm))) {
      Alert.alert("Validation", "Length (km) must be a number");
      return;
    }

    const updated: Hike = {
      ...existing,
      name: name.trim(),
      location: locationText.trim(),
      date: date.trim(),
      lengthKm: parseFloat(lengthKm),
      difficulty: difficulty.trim() || undefined,
      description: description.trim() || undefined,
    };

    setHikes((prev) => prev.map((h) => (h.id === hikeId ? updated : h)));
    // Sau khi lưu xong, quay lại màn chi tiết của hike
    navigation.navigate("HikeDetail", { hikeId });
  };

  const resetForm = () => {
    if (!existing) return;
    setName(existing.name);
    setLocationText(existing.location);
    setDate(existing.date);
    setLengthKm(existing.lengthKm.toString());
    setDifficulty(existing.difficulty ?? "");
    setDescription(existing.description ?? "");
  };

  if (!existing) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {/* BACK ICON giống HikeDetailScreen */}
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.navigate("HikeDetail", { hikeId })}
      >
        <Ionicons name="arrow-back" size={28} color={PRIMARY_GREEN} />
      </TouchableOpacity>

      <HikeForm
        editingId={existing.id}
        name={name}
        locationText={locationText}
        date={date}
        lengthKm={lengthKm}
        difficulty={difficulty}
        description={description}
        onChangeName={setName}
        onChangeLocation={setLocationText}
        onChangeDate={setDate}
        onChangeLengthKm={setLengthKm}
        onChangeDifficulty={setDifficulty}
        onChangeDescription={setDescription}
        onSave={handleSave}
        onReset={resetForm}
      />
    </View>
  );
};

const PRIMARY_GREEN = "#4CAF50";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 16,
    paddingTop: 80, // chừa chỗ cho back icon
  },
  backIcon: {
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 10,
    paddingTop: 20,
  },
});

export default EditHikeScreen;
