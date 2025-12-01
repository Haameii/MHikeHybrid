import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

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


type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home"> & {
  hikes: Hike[];
  editingId: string | null;
  name: string;
  locationText: string;
  date: string;
  lengthKm: string;
  difficulty: string;
  description: string;
  gpsCoords: Coords | null;
  locationError: string | null;
  isGettingLocation: boolean;

  setName: (v: string) => void;
  setLocationText: (v: string) => void;
  setDate: (v: string) => void;
  setLengthKm: (v: string) => void;
  setDifficulty: (v: string) => void;
  setDescription: (v: string) => void;

  saveHike: () => void;
  resetForm: () => void;
  deleteHike: (id: string) => void;
  resetDatabase: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
};

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  const {
    navigation,
    hikes,
    editingId,
    name,
    locationText,
    date,
    lengthKm,
    difficulty,
    description,
    gpsCoords,
    locationError,
    isGettingLocation,
    setName,
    setLocationText,
    setDate,
    setLengthKm,
    setDifficulty,
    setDescription,
    saveHike,
    resetForm,
    deleteHike,
    resetDatabase,
    getCurrentLocation,
  } = props;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>M-Hike Hybrid</Text>
        <Text style={styles.subtitle}></Text>

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
              // chỉ reset khi tạo mới, tránh reset lúc edit
              resetForm();
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
            // bấm item -> sang màn chi tiết
            navigation.navigate("HikeDetail", { hikeId: hike.id });
          }}
          onDeleteHike={deleteHike}
          onResetDatabase={resetDatabase}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// ================== APP CHÍNH ==================

const App: React.FC = () => {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
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
        `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(
          5
        )}`
      );
    } catch (err: any) {
      console.log(err);
      setLocationError("Error fetching location: " + err.message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
          >
            {(navProps) => (
              <HomeScreen
                {...navProps}
                hikes={hikes}
                editingId={editingId}
                name={name}
                locationText={locationText}
                date={date}
                lengthKm={lengthKm}
                difficulty={difficulty}
                description={description}
                gpsCoords={gpsCoords}
                locationError={locationError}
                isGettingLocation={isGettingLocation}
                setName={setName}
                setLocationText={setLocationText}
                setDate={setDate}
                setLengthKm={setLengthKm}
                setDifficulty={setDifficulty}
                setDescription={setDescription}
                saveHike={saveHike}
                resetForm={resetForm}
                deleteHike={deleteHike}
                resetDatabase={resetDatabase}
                getCurrentLocation={getCurrentLocation}
              />
            )}
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
            options={({ navigation }) => ({
              headerTitle: "Edit Hike",
              headerTitleAlign: "center",
              headerLeft: () => (
                <TouchableOpacity
                  style={{ paddingHorizontal: 10 }}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={{ color: "#4CAF50", fontSize: 16 }}>+</Text>
                </TouchableOpacity>
              ),
            })}
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

const DARK_GREEN = "#2E7D32";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    paddingTop: 60,
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
