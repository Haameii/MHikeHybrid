import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";

import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditHikeScreen from "@/src/screens/EditHikeScreen";
import HikeDetailScreen from "@/src/screens/HikeDetailScreen";
import HikeForm from "../src/components/HikeForm";
import HikeList from "../src/components/HikeList";
import MapSection from "../src/components/MapSection";
import { Coords, Hike } from "../src/types";

type RootStackParamList = {
  Home: undefined;
  HikeDetail: { hikeId: string };
  EditHike: { hikeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state (dùng cho Home / Edit)
  const [name, setName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [date, setDate] = useState("");
  const [lengthKm, setLengthKm] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");

  // GPS
  const [gpsCoords, setGpsCoords] = useState<Coords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // ===== LOAD / SAVE (persistence) =====
  useEffect(() => {
    const loadHikes = async () => {
      try {
        const json = await AsyncStorage.getItem("@hikes");
        if (json) {
          const parsed: Hike[] = JSON.parse(json);
          setHikes(parsed);
        }
      } catch (err) {
        console.log("Error loading hikes:", err);
      }
    };

    loadHikes();
  }, []);

  useEffect(() => {
    const saveHikes = async () => {
      try {
        await AsyncStorage.setItem("@hikes", JSON.stringify(hikes));
      } catch (err) {
        console.log("Error saving hikes:", err);
      }
    };

    saveHikes();
  }, [hikes]);

  // ===== FORM HELPERS =====
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setLocationText("");
    setDate("");
    setLengthKm("");
    setDifficulty("");
    setDescription("");
  };

  const validateForm = () => {
    if (!name.trim()) {
      alert("Name is required");
      return false;
    }
    if (!locationText.trim()) {
      alert("Location is required");
      return false;
    }
    if (!date.trim()) {
      alert("Date & time is required");
      return false;
    }
    if (!lengthKm.trim()) {
      alert("Length (km) is required");
      return false;
    }
    if (isNaN(parseFloat(lengthKm))) {
      alert("Length must be a number");
      return false;
    }
    return true;
  };

  const saveHike = () => {
    if (!validateForm()) return;

    const base: Omit<Hike, "id"> = {
      name: name.trim(),
      location: locationText.trim(),
      date: date.trim(),
      lengthKm: parseFloat(lengthKm),
      difficulty: difficulty.trim() || undefined,
      description: description.trim() || undefined,
      latitude: gpsCoords?.latitude,
      longitude: gpsCoords?.longitude,
    };

    if (editingId == null) {
      // create new
      const newHike: Hike = { id: Date.now().toString(), ...base };
      setHikes((prev) => [newHike, ...prev]);
    } else {
      // update
      setHikes((prev) =>
        prev.map((h) => (h.id === editingId ? { ...h, ...base } : h))
      );
    }
  };

  const deleteHike = (id: string) => {
    setHikes((prev) => prev.filter((h) => h.id !== id));
  };

  const resetDatabase = async () => {
    setHikes([]);
    await AsyncStorage.removeItem("@hikes");
    resetForm();
  };

  // ===== GPS =====
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permission to access location was denied.");
        setIsGettingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords: Coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setGpsCoords(coords);
      setLocationText(
        `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`
      );
    } catch (err: any) {
      console.log(err);
      setLocationError("Error fetching location: " + err.message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // ===== SCREENS IMPLEMENTATION inline =====

  const HomeScreen = ({ navigation }: any) => (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>M-Hike Hybrid (TypeScript)</Text>
        <Text style={styles.subtitle}>
          Features e, f, g – Persistence, GPS, Map
        </Text>

        <HikeForm
          editingId={editingId}
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
          onSave={() => {
            const isNew = editingId == null;
            saveHike();
            if (isNew) {
              resetForm();
            } else {
              // nếu đang edit từ EditHikeScreen thì không dùng Home form
            }
          }}
          onReset={resetForm}
        />

        <MapSection
          gpsCoords={gpsCoords}
          locationError={locationError}
          isGettingLocation={isGettingLocation}
          onGetCurrentLocation={getCurrentLocation}
        />

        <HikeList
          hikes={hikes}
          onEditHike={(hike) => {
            // ở Home: bấm item -> đi sang HikeDetail
            navigation.navigate("HikeDetail", { hikeId: hike.id });
          }}
          onDeleteHike={deleteHike}
          onResetDatabase={resetDatabase}
        />
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <NavigationIndependentTree>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ title: "M-Hike" }}
        >
          {(props) => <HomeScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="HikeDetail"
          options={{ title: "Hike Detail" }}
        >
          {(props) => (
            <HikeDetailScreen
              {...props}
              hikes={hikes}
              onDelete={deleteHike}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="EditHike"
          options={{ title: "Edit Hike" }}
        >
          {(props) => (
            <EditHikeScreen
              {...props}
              hikes={hikes}
              setHikes={setHikes}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    </NavigationIndependentTree>

  );
};

const PRIMARY_GREEN = "#4CAF50";
const DARK_GREEN = "#2E7D32";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: DARK_GREEN,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default App;
