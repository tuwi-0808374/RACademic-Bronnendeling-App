import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { getApiBaseUrl } from "@/constants/get_ip";
import { useUser } from "@/constants/get_user_id";
import { useRouter } from "expo-router";
import Markdown, {MarkdownIt} from "react-native-markdown-display";
const API_BASE_URL = getApiBaseUrl();

const COLORS = {
  red: "#C80032",
  background: "#F8F4EF",
  backgroundDark: "#535353",
  text: "#333333",
  textLight: "#FFFFFF",
  inputLine: "#555555",
  placeholderText: "#666666",
};

// bronnen
// https://www.youtube.com/watch?v=Z20nUdAUGmM

export default function UserPosts() {
  const [postdata, setPostdata] = useState([]);
  const router = useRouter();
  const { userId, loading } = useUser();

  useEffect(() => {
    if (!loading && userId) {
      try {
        fetch(`${API_BASE_URL}/posts_by_user_id/${userId}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setPostdata(data.data);
          });
      } catch (error) {
        console.error("API request failed:", error);
      }
    }
  }, []);

  if (!postdata) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your posts</Text>
        <Text style={styles.textContent}>Geen posts gevonden</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Jouw posts</Text>
        </View>

        <ScrollView style={styles.scrollview}>
          <TouchableWithoutFeedback>
            <View style={styles.header}>
              {postdata.map((post) => (
                <View key={post["id"]} style={styles.postbox}>
                  <Text style={styles.textTitle}>{post["title"]}</Text>
                  <View style={styles.textContent}>
                    {/*https://www.npmjs.com/package/react-native-markdown-display*/}
                    <Markdown
                        markdownit={
                          MarkdownIt({typographer: true}).disable([ 'image' ])
                        }
                    >
                      {post['content']}
                    </Markdown>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/posts/edit_post",
                        params: { post_id: post["id"] },
                      })
                    }
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttontext}>edit post</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/posts/post_details",
                        params: { post_id: post["id"] },
                      })
                    }
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttontext}>post details</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flex: 1,
  },
  header: {
    marginVertical: 36,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 1,
    textAlign: "center",
  },
  textTitle: {
    fontSize: 30,
    fontWeight: "semibold",
    color: COLORS.text,
    marginBottom: 1,
  },
  textContent: {
    fontSize: 22,
    fontWeight: "semibold",
    color: COLORS.text,
    marginBottom: 1,
  },
  form: {},
  input: {},
  inputlabel: {
    fontSize: 20,
    fontWeight: "semibold",
    color: COLORS.text,
    marginBottom: 5,
    textAlign: "center",
  },
  inputcontroltitel: {
    fontSize: 15,
    fontWeight: "semibold",
    color: COLORS.text,
    height: 50,
    backgroundColor: COLORS.textLight,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 25,
  },
  inputcontrolcontent: {
    fontSize: 15,
    fontWeight: "semibold",
    color: COLORS.text,
    height: 150,
    backgroundColor: COLORS.textLight,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 25,
  },
  create: {},
  button: {
    backgroundColor: COLORS.red,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.text,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttontext: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  postbox: {
    width: "100%",
    marginHorizontal: 1,
    marginBottom: 10,
    backgroundColor: COLORS.textLight,
    padding: 20,
    borderRadius: 15,
    flexDirection: "column",
  },
  scrollview: {
    flex: 1,
  },
});
