import { config, databases } from '@/lib/appwrite';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { ID } from 'react-native-appwrite';

const categories = [
  'Car',
  'Properties',
  'Mobiles',
  'Jobs',
  'Bikes',
  'Electronics',
  'Vehicles',
  'More Categories',
];

const PostScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit =  () => {
    
      createPropertyDocument()
      // const response = await fetch('https://cloud.appwrite.io/v1', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     category: selectedCategory,
      //     ...formData,
      //   }),
      // });

    //   if (response.ok) {
    //     Alert.alert('Success', 'Your item has been posted successfully!');
    //     // Reset form and selected category
    //     setFormData({ title: '', description: '', price: '' });
    //     setSelectedCategory(null);
    //   } else {
    //     Alert.alert('Error', 'Failed to post your item. Please try again.');
    //   }
    // } catch (error) {
    //   Alert.alert('Error', 'An error occurred. Please try again.');
    // }
  };

  async function createPropertyDocument() {
    try {
      const response = await databases.createDocument(
        config.databaseId!,
        config.propertiesCollectionId!,
        ID.unique(), // Corrected: using ID.unique() properly
        {
          name: "huj Doe",
          type: "House",
          Description: "Good",
          address: " ",
          price: 33,
          area: 34.32,
          bedrooms: 2,
          rating: 3.2,
          bathrooms: 3,
          facilities: "Gym",
          image: "https://picsum.photos/seed/picsum/200/300",
          geolocation: "",
        } // Data to insert
      );

      console.log("Document Created:", response);
      return response;
    } catch (error) {
      console.error("Error creating document:", error);
      return null;
    }
  }


  return (
    <View style={styles.container}>
      {selectedCategory ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sell your {selectedCategory}</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={formData.price}
            onChangeText={(text) => handleInputChange('price', text)}
            keyboardType="numeric"
          />
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Back" onPress={() => setSelectedCategory(null)} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>What do you want to sell?</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton} onPress={() => handleCategoryPress(category)}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  categoryButton: {
    backgroundColor: '#0061FF',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    width: '40%',
    alignItems: 'center',
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default PostScreen;