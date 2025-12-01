import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  editingId: string | null;
  name: string;
  locationText: string;
  date: string;
  lengthKm: string;
  difficulty: string;
  description: string;
  onChangeName: (v: string) => void;
  onChangeLocation: (v: string) => void;
  onChangeDate: (v: string) => void;
  onChangeLengthKm: (v: string) => void;
  onChangeDifficulty: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onSave: () => void;
  onReset: () => void;
};

const HikeForm: React.FC<Props> = ({
  editingId,
  name,
  locationText,
  date,
  lengthKm,
  difficulty,
  description,
  onChangeName,
  onChangeLocation,
  onChangeDate,
  onChangeLengthKm,
  onChangeDifficulty,
  onChangeDescription,
  onSave,
  onReset,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const onSelectDate = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      // format: "YYYY-MM-DD HH:mm"
      const formatted =
        selectedDate.toISOString().replace("T", " ").substring(0, 16);
      onChangeDate(formatted);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {editingId ? "Edit Hike" : "Add New Hike"}
      </Text>

      {/* Name */}
      <TextInput
        style={styles.input}
        placeholder="Hike name *"
        value={name}
        onChangeText={onChangeName}
      />

      {/* Location */}
      <TextInput
        style={styles.input}
        placeholder="Location *"
        value={locationText}
        onChangeText={onChangeLocation}
      />

      {/* Date & Time */}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.selectButton}
      >
        <Text style={styles.selectButtonText}>
          {date ? `Selected: ${date}` : "Select Date & Time *"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          // iOS dùng datetime, Android chỉ dùng date
          mode={Platform.OS === "ios" ? "datetime" : "date"}
          display="default"
          onChange={onSelectDate}
        />
      )}


      {/* Length */}
      <TextInput
        style={styles.input}
        placeholder="Length (km) *"
        keyboardType="numeric"
        value={lengthKm}
        onChangeText={onChangeLengthKm}
      />

      {/* Difficulty Picker */}
      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={difficulty || "Easy"}
          onValueChange={(value) => onChangeDifficulty(value)}
        >
          <Picker.Item label="Easy" value="Easy" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Hard" value="Hard" />
        </Picker>
      </View>

      {/* Description */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (optional)"
        multiline
        value={description}
        onChangeText={onChangeDescription}
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
          <Text style={styles.primaryButtonText}>
            {editingId ? "Update Hike" : "Save Hike"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onReset}>
          <Text style={styles.secondaryButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
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
    color: PRIMARY_GREEN,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  selectButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: PRIMARY_GREEN,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectButtonText: {
    color: PRIMARY_GREEN,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
    padding: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    borderColor: PRIMARY_GREEN,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: PRIMARY_GREEN,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default HikeForm;
