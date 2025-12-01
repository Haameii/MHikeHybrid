import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Coords } from "../types";

type Props = {
  gpsCoords: Coords | null;
  locationError: string | null;
  isGettingLocation: boolean;
  onGetCurrentLocation: () => void;
};

const MapSection: React.FC<Props> = ({
  gpsCoords,
  locationError,
  isGettingLocation,
  onGetCurrentLocation,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>GPS & Map</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onGetCurrentLocation}>
        <Text style={styles.primaryButtonText}>
          {isGettingLocation ? "Getting location..." : "Get Current GPS Location"}
        </Text>
      </TouchableOpacity>

      {locationError && <Text style={styles.errorText}>{locationError}</Text>}

      {gpsCoords && (
        <>
          <Text style={styles.gpsText}>
            Current position: {gpsCoords.latitude.toFixed(5)}, {gpsCoords.longitude.toFixed(5)}
          </Text>

          <MapView
            style={styles.map}
            region={{
              latitude: gpsCoords.latitude,
              longitude: gpsCoords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={gpsCoords}
              title="You are here"
              description="Coordinates fetched from GPS"
            />
          </MapView>

          <Text style={styles.smallNote}>
            When you save a hike, the current GPS coordinates will be saved with it
            (Feature g).
          </Text>
        </>
      )}
    </View>
  );
};

const PRIMARY_GREEN = "#4CAF50";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: PRIMARY_GREEN,
  },
  primaryButton: {
    backgroundColor: PRIMARY_GREEN,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
  gpsText: {
    marginTop: 10,
    fontSize: 14,
    color: "#00796B",
  },
  map: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
  smallNote: {
    alignItems:'center',
    marginTop: 6,
    fontSize: 12,
    color: "#555",
  },
});

export default MapSection;
