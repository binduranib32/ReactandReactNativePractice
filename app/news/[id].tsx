import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import axios from "axios";
import { NewsDataType } from "@/types";
import { Colors } from "@/constants/Colors";

type Props = {};

const NewsDetails = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    try {
      const URL = `https://newsdata.io/api/1/news?apikey=pub_52372d93d37ce421e6e3e7205d946acfa3351&id=${id}`;
      const response = await axios.get(URL);

      //console.log("New data:", response.data);

      if (response && response.data) {
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.log("Error Message:", err.message);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="heart-outline" size={22} />
            </TouchableOpacity>
          ),
          title: "",
        }}
      />
      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          style={styles.contentContainer}
        >
          <Text style={styles.title}> {news[0].title}</Text>
          <View style={styles.newsInfoWrapper}>
            <Text style={styles.newsInfo}>{news[0].pubDate}</Text>
            <Text style={styles.newsInfo}>{news[0].source_name}</Text>
          </View>
          <Image source={{ uri: news[0].image_url }} style={styles.newsImg} />
          {news[0].content ? (
            <Text style={styles.newsContent}> {news[0].content}</Text>
          ) : (
            <Text style={styles.newsContent}> {news[0].description}</Text>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  newsImg: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  newsInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  newsInfo: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginVertical: 10,
    letterSpacing: 0.6,
  },
  newsContent: {
    fontSize: 14,
    color: "#555",
    letterSpacing: 0.8,
    lineHeight: 22,
  },
});
