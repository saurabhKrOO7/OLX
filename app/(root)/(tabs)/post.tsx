import { config, databases, storage, ID } from '@/lib/appwrite';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const categories = [
  'Car',
  'Properties',
  'Mobiles',
  'Jobs',
  'Bikes',
  'Electronics',
  'Vehicles',
  'Other',
];

const PostScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    price: '',
    phoneNumber: '',
    image: null as string | null, // Allow string or null
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  // Function to take a photo using the camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  // Function to upload the image to Appwrite Storage
  const uploadImage = async (imageUri: string) => {
    try {
      console.log("Bucket ID:", config.bucketId); // Debugging: Check bucketId

      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Create a file object with the required properties
      const file = {
        uri: imageUri,
        name: `image_${Date.now()}.jpg`, // Generate a unique name
        type: 'image/jpeg', // Set the MIME type
        size: blob.size,
      };

      // Upload the file to Appwrite storage
      const uploadedFile = await storage.createFile(
        config.bucketId!, // Ensure bucketId is passed
        ID.unique(),
        file
      );

      return uploadedFile.$id; // Return the file ID
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.type || !formData.phoneNumber || !formData.image) {
      Alert.alert('Error', 'Please fill all the fields and select an image');
      return;
    }

    try {
      const imageFileId = await uploadImage(formData.image);

      const response = await databases.createDocument(
        config.databaseId!,
        config.propertiesCollectionId!,
        ID.unique(),
        {
          name: formData.name,
          Description: formData.description,
          type: formData.type,
          Price: parseFloat(formData.price),
          Phone: formData.phoneNumber,
          image: imageFileId,
        }
      );

      console.log("Document Created:", response);
      Alert.alert('Success', 'Your item has been posted successfully!');
      setFormData({ name: '', description: '', price: '', type: '', phoneNumber: '', image: null });
      setSelectedCategory(categories[0]);
    } catch (error) {
      console.error("Error creating document:", error);
      Alert.alert('Error', 'Failed to post your item. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Post Your Product</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            placeholderTextColor="#999"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="#999"
            value={formData.price}
            onChangeText={(text) => handleInputChange('price', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="phone-pad"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue: string) => {
                setSelectedCategory(itemValue);
                handleInputChange('type', itemValue);
              }}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              {categories.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
          </View>

          {/* Image Picker Buttons */}
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerText}>Select Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imagePickerButton} onPress={takePhoto}>
              <Text style={styles.imagePickerText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Display selected image */}
          {formData.image && (
            <Image source={{ uri: formData.image }} style={styles.selectedImage} />
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imagePickerButton: {
    backgroundColor: '#6a11cb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6a11cb',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default PostScreen;