import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Share,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAppwrite } from "@/lib/useAppwrite";
import { getPropertyById, storage, config } from "@/lib/appwrite"; // Import storage and config

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;

  const { data: property } = useAppwrite({
    fn: getPropertyById,
    params: { id: id! },
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFavorited, setFavorited] = useState(false);

  // Fetch the image URL from Appwrite Storage
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        if (property?.image) {
          const file = await storage.getFileView(config.bucketId!, property.image);
          setImageUrl(file.href);
        }
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageUrl("https://example.com/placeholder.jpg"); // Fallback image
      }
    };

    fetchImageUrl();
  }, [property?.image]);

  // Show loading indicator while fetching data
  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 📤 Share Property Function
  const handleShare = async () => {
    try {
      const shareMessage = `Check out this property: ${property?.name}\n\n${property?.Phone}\n\nPrice: ₹${property?.Price}\n\nView details: [https://play.google.com/store/apps?hl=en_IN]`;
      await Share.share({ message: shareMessage });
    } catch (error) {
      console.log("Error sharing property:", error);
    }
  };

  // ❤️ Toggle Like Function
  const toggleLike = () => {
    setFavorited(!isFavorited);
  };

  // 🔗 Handle Booking (Redirect to Razorpay)
  const handleBookNow = () => {
    Linking.openURL("https://rzp.io/rzp/g0H9MHW");
  };

  // 📞 Handle Call Functions
  const handleCallSeller = () => {
    Linking.openURL(`tel:${property?.Phone || "9999999999"}`);
  };

  const handleCallCustomerService = () => {
    const customerServiceNumber = "1234567890"; // Keep your customer service number
    Linking.openURL(`tel:${customerServiceNumber}`);
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        {/* Property Image */}
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="size-full"
              resizeMode="cover"
            />
          ) : (
            <View className="size-full bg-gray-200" />
          )}
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />

          {/* Top Bar */}
          <View
            className="z-50 absolute inset-x-7"
            style={{ top: Platform.OS === "ios" ? 70 : 20 }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              {/* Share & Favorite Buttons */}
              <View className="flex flex-row items-center gap-3">
                <TouchableOpacity onPress={handleShare}>
                  <Image source={icons.send} className="size-7" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleLike}>
                  <Image
                    source={icons.heart}
                    className="size-7"
                    tintColor={isFavorited ? "red" : "#191D31"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Property Details */}
        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {property?.name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary-300">
                {property?.type}
              </Text>
            </View>
          </View>

          {/* Overview */}
          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik mt-2">
              {property?.Description}
            </Text>
          </View>

          {/* Contact Section (Seller + Customer Service) */}
          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Contact
            </Text>

            <View className="flex flex-row justify-between items-center mt-4">
              {/* Seller Contact */}
              <View className="flex flex-col items-center">
                <Text className="text-black-200 text-sm font-rubik-bold">
                  Seller
                </Text>
                <Text className="text-black-300 text-base font-rubik mt-1">
                  {property?.Phone || "9999999999"}
                </Text>
                <TouchableOpacity
                  onPress={handleCallSeller}
                  className="mt-2 flex items-center justify-center bg-blue-500 size-12 rounded-full"
                >
                  <Image
                    source={icons.phone}
                    className="size-6"
                    tintColor="white"
                  />
                </TouchableOpacity>
              </View>

              {/* Customer Support */}
              <View className="flex flex-col items-center">
                <Text className="text-black-200 text-sm font-rubik-bold">
                  Customer Support
                </Text>
                <Text className="text-black-300 text-base font-rubik mt-1">
                  1234567890
                </Text>
                <TouchableOpacity
                  onPress={handleCallCustomerService}
                  className="mt-2 flex items-center justify-center bg-blue-500 size-12 rounded-full"
                >
                  <Image
                    source={icons.phone}
                    className="size-6"
                    tintColor="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Section */}
      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary-300 text-start text-2xl font-rubik-bold"
            >
              ₹{property?.Price}
            </Text>
          </View>

          {/* Book Now Button */}
          <TouchableOpacity
            onPress={handleBookNow}
            className="flex-1 flex flex-row items-center justify-center bg-primary-300 py-3 rounded-full shadow-md shadow-zinc-400"
          >
            <Text className="text-white text-lg text-center font-rubik-bold">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;