import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

const COLORS = {
  text: "#333333",
  languageBackground: "#E0E0E0",
};

type LanguageSelectorProps = {
  activeLanguage: "EN" | "NL",
  onLanguageChange: (lang: "EN" | "NL") => void,
};

const LanguageSelector = ({
  activeLanguage,
  onLanguageChange,
}: LanguageSelectorProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.languageSelector}>
        <TouchableOpacity onPress={() => onLanguageChange("EN")}>
          <View
            style={[
              styles.languageOption,
              activeLanguage === "EN" && styles.languageActiveBackground,
            ]}
          >
            <Text
              style={[
                styles.languageText,
                activeLanguage === "EN" && styles.languageActiveText,
              ]}
            >
              EN
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onLanguageChange("NL")}>
          <View
            style={[
              styles.languageOption,
              activeLanguage === "NL" && styles.languageActiveBackground,
            ]}
          >
            <Text
              style={[
                styles.languageText,
                activeLanguage === "NL" && styles.languageActiveText,
              ]}
            >
              NL
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 1,
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginLeft: 10,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  languageActiveBackground: {
    backgroundColor: COLORS.languageBackground,
  },
  languageActiveText: {
    color: COLORS.text,
  },
});

export default LanguageSelector;
