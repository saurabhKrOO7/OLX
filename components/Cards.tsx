import React from "react";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";
import { storage, config } from "@/lib/appwrite";

interface Props {
  item: Models.Document;
  onPress?: () => void;
}

export const FeaturedCard = ({ item, onPress }: Props) => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        console.log("FeaturedCard: item.image:", item.image);
        if (item.image) {
          if (typeof item.image === "string" && item.image.startsWith("http")) {
            setImageUrl(item.image);
          } else {
            const file = await storage.getFileView(
              config.bucketId!,
              item.image
            );
            console.log("FeaturedCard fetched file:", file);
            setImageUrl(file.href);
          }
        }
      } catch (error) {
        console.error("Error fetching image URL in FeaturedCard:", error);
        setImageUrl("https://example.com/placeholder.jpg"); // Fallback image
      }
    };

    fetchImageUrl();
  }, [item.image]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1, // Take up equal space in the grid
        margin: 8, // Add margin for spacing between cards
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: "100%",
            height: 230,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 160,
            backgroundColor: "#e5e5e5",
          }}
        />
      )}

      <Image
        source={images.cardGradient}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "800", color: "white" }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: "white" }}>
            ₹{item.Price}
          </Text>
          <Image source={icons.heart} style={{ width: 20, height: 20 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
