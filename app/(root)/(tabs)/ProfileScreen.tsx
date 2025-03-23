import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useGlobalContext } from "@/lib/global-provider";

const ProfileScreen = () => {
  const { user, refetch } = useGlobalContext();

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-500 to-indigo-600 p-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile Card */}
        <View className="bg-white rounded-3xl shadow-lg p-6 items-center">
          {/* Profile Image */}
          <Image
            source={{ uri: user?.avatar || "https://via.placeholder.com/100" }}
            className="w-28 h-28 rounded-full border-4 border-blue-500"
          />
          <Text className="text-2xl font-bold mt-3 text-gray-800">
            {user?.name || "N/A"}
          </Text>
          <Text className="text-gray-500 text-lg">{user?.email || "N/A"}</Text>

          {/* Refresh Button */}
          <TouchableOpacity
            onPress={refetch}
            className="mt-4 bg-blue-500 px-5 py-2 rounded-full"
          >
            <Text className="text-white font-semibold text-lg">🔄 Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* User Information */}
        <View className="mt-6 bg-white p-6 rounded-3xl shadow-lg">
          <Text className="text-xl font-semibold text-gray-700 mb-3">
            👤 Account Information
          </Text>

          <View className="space-y-4">
            <DetailItem
              emoji="📅"
              label="Registered On"
              value={user?.registration}
            />
            <DetailItem
              emoji="⏳"
              label="Last Accessed"
              value={user?.accessedAt}
            />
            <DetailItem
              emoji="📧"
              label="Email Verified"
              value={user?.emailVerification ? "✅ Yes" : "❌ No"}
              highlight={
                user?.emailVerification ? "text-green-600" : "text-red-600"
              }
            />
          </View>
        </View>

        {/* App Information */}
        <View className="mt-6 bg-white p-6 rounded-3xl shadow-lg">
          <Text className="text-xl font-semibold text-gray-700 mb-3">
            📲 App Information
          </Text>
          <DetailItem emoji="🚀" label="App Version" value="1.0.0" />
          <DetailItem emoji="📆" label="Last Update" value="March 2025" />
        </View>
      </ScrollView>
    </View>
  );
};

const DetailItem = ({ emoji, label, value, highlight }) => {
  let displayValue = "N/A";

  // Ensure valid date conversion
  if (value && typeof value === "string" && !isNaN(Date.parse(value))) {
    displayValue = new Date(value).toDateString();
  } else if (value) {
    displayValue = value;
  }

  return (
    <View className="flex-row items-center">
      <Text className="text-2xl">{emoji}</Text>
      <Text className="ml-3 text-lg text-gray-700">
        {label}:{" "}
        <Text className={`font-semibold ${highlight || "text-gray-800"}`}>
          {displayValue}
        </Text>
      </Text>
    </View>
  );
};

export default ProfileScreen;
