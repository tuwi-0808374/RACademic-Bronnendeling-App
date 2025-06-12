import React from "react";
import { TouchableOpacity, Image, StyleSheet, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { translations } from "../../constants/translations";

const COLORS = {
  black: "#000000",
};

interface Props {
  image: string | null;
  onImageSelected: (uri: string | null) => void;
  activeLanguage: "EN" | "NL";
}

const ImageUploader: React.FC<Props> = ({
  image,
  onImageSelected,
  activeLanguage,
}) => {
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

  const removeImageText =
    translations[activeLanguage]?.register?.removeImageText || "Verwijderen";

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
        <TouchableOpacity
          onPress={removeImage}
          style={styles.removeImageButton}
        >
          <Text style={styles.removeImageButtonText}>{removeImageText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
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
  removeImageButton: {
    marginTop: 10,
    backgroundColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "center",
  },
  removeImageButtonText: {
    color: COLORS.black,
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default ImageUploader;
