import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Markdown, {MarkdownIt} from "react-native-markdown-display";

interface PostListProps {
  posts?: any[];
  showEdit: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts = [], showEdit }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {posts.map((post) => (
        <View key={post.id} style={styles.postContainer}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <View style={styles.postContent}>
            {/*https://www.npmjs.com/package/react-native-markdown-display*/}
            <Markdown
                markdownit={
                  MarkdownIt({typographer: true}).disable([ 'image' ])
                }
            >
              {post['content']}
            </Markdown>
          </View>


          <View style={styles.postActions}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/posts/post_details",
                  params: { post_id: post.id },
                })
              }
            >
              <Text style={styles.actionText}>Bekijk post</Text>
            </TouchableOpacity>

            {showEdit && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/posts/edit_post",
                    params: { post_id: post.id },
                  })
                }
              >
                <Text style={styles.actionText}>Bewerk</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  postContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  postContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionText: {
    color: "#C80032",
    fontWeight: "bold",
  },
});

export default PostList;
