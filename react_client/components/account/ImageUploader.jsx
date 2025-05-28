import React from "react";
import { TouchableOpacity, Image, StyleSheet, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  image: string | null;
  onImageSelected: (uri: string | null) => void;
}

const ImageUploader: React.FC<Props> = ({ image, onImageSelected }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    onImageSelected(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <View>
          <Image
            source={
              image
                ? { uri: image }
                : require("../../assets/images/profile.png")
            }
            style={styles.image}
          />
          <View style={styles.editIcon}>
            <MaterialIcons name="edit" size={20} color="white" />
          </View>
        </View>
      </TouchableOpacity>

      {image && (
        <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Verwijder</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#C80032",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#000000",
    borderRadius: 12,
    padding: 4,
  },
  removeButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: "#C80032",
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
  },
  container: {
    alignItems: "center",
  },
});

export default ImageUploader;
