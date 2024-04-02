import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, ActivityIndicator, Animated, Easing, StatusBar,ScrollView, Linking } from 'react-native';
import axios from 'axios'; 
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';



// Import your custom icons
import chooseImageIcon from '../assets/upload.png';
import takePhotoIcon from '../assets/cam.gif';
import logoImage from '../assets/title.png'; // Import your logo image
import backgroundImage from '../assets/background.jpg'; // Import your background image
import newImage from '../assets/topimg.jpg'; // Import your new image

const DetectObject = () => {
    const [imageUri, setImage] = useState(null);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultVisible, setResultVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const pickImage = async (fromCamera = false) => {
        let result;
        try {
            if (fromCamera) {
                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: false,
                    quality: 1,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                    quality: 1,
                });
            }

            if (!result.cancelled) {
                setImage(result.assets[0].uri);
                setResultVisible(false); // Hide result when new image is selected
            }
        } catch (error) {
            console.error('Error picking image', error);
        }
    }

    const analyzeImage = async () => {
        try {
            if (!imageUri) {
                alert('Please select an image');
                return;
            }
    
            setLoading(true);
            setResultVisible(true); // Show result container
    
            const apiURL = 'https://us-central1-med-leaf-414615.cloudfunctions.net/predict';
    
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                name: 'image.jpg',
                type: 'image/jpeg',
            });
    
            const apiResponse = await axios.post(apiURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Extract class and score from the API response
            const predictedClass = apiResponse.data.class;
            const score = apiResponse.data.confidence;
    
            // Retrieve existing predictions from AsyncStorage
            const existingPredictions = await AsyncStorage.getItem('predictions');
            let predictions = [];
            if (existingPredictions !== null) {
                predictions = JSON.parse(existingPredictions);
            }
    
            // Append new prediction to the list
            predictions.push({ class: predictedClass, score: score });
    
            // Store the updated list of predictions in AsyncStorage
            await AsyncStorage.setItem('predictions', JSON.stringify(predictions));
    
            // Update the state with the labels
            setLabels([{ class: predictedClass, score: score, description: apiResponse.data.description, plantlink: apiResponse.data.plantlink }]);
    
        } catch (error) {
            console.error('Error analyzing image', error);
            alert('Error analyzing image. Please try again later.');
        } finally {
            setLoading(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        }
    };
    

    const handleLinkPress = (plantlink) => {
        const wikipediaURL = `${plantlink}`;
        Linking.openURL(wikipediaURL);
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <Image source={newImage} style={styles.newImage} />
            <Image source={logoImage} style={styles.logo} />
            <View style={styles.roundedContainer}>
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <ScrollView>
                <View style={styles.container}>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={() => pickImage(true)} style={styles.button}>
                            <View style={[styles.iconContainer, styles.shadow]}>
                                <Image source={takePhotoIcon} style={styles.icon} />
                            </View>
                            <Text style={styles.iconButtonText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImage()} style={styles.button}>
                            <View style={[styles.iconContainer, styles.shadow]}>
                                <Image source={chooseImageIcon} style={styles.icon} />
                            </View>
                            <Text style={styles.iconButtonText}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    )}
                    <TouchableOpacity onPress={analyzeImage} style={styles.analyzeButton}>
                        <Text style={styles.analyzeButtonText}>Analyze Image</Text>
                    </TouchableOpacity>
                    {loading && (
                        <ActivityIndicator size="large" color="#000000" />
                    )}
                    {resultVisible && (
                        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
                            {labels.map((label, index) => (
                                <View key={index} style={styles.resultItem}>
                                    <Text style={styles.label}>{label.class}</Text>
                                    <Text style={styles.score}>{label.score.toFixed(2)}%</Text>
                                </View>
                            ))}

                            {labels.map((label, index) => (
                                <View key={index} style={styles.resultItem}>
                                    <Text style={[styles.label]}>Description:</Text>
                                </View>
                            ))}

                            {labels.map((label, index) => (
                                <View key={index} style={styles.resultItem2}>
                                    <Text style={styles.description}>
                                        ⦿{label.description[0]}{"\n"}{"\n"}
                                        ⦿{label.description[1]}{"\n"}
                                        <TouchableOpacity onPress={() => handleLinkPress(label.plantlink)}>
                                            <Text style={styles.link}>
                                                (wiki)more detail...
                                            </Text>
                                        </TouchableOpacity>
                                    </Text>
                                </View>
                            ))}
                        </Animated.View>
                    )}
                </View>
                </ScrollView>
            </ImageBackground>
            </View>
        </>
    );
}

export default DetectObject;

const styles = StyleSheet.create({
    roundedContainer: {
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
        marginTop: 250,
        borderTopLeftRadius: 80, // Adjust this value for more or less roundness on the top left corner
        borderTopRightRadius: 80, // Adjust this value for more or less roundness on the top right corner
        overflow: 'hidden', // Ensures child elements are clipped to the container's shape
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
        position: 'relative',
    },
    logo: {
        width: 220, // Set the width of the logo image
        height: 120, // Set the height of the logo image
        margin: 50,
        position: 'absolute',
        top: 30,
    },
    buttonsContainer: {
        width: '30%',
    },
    button: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Add this line to prevent child elements from overflowing
    },
    iconContainer: {
        borderRadius: 35,
        backgroundColor: '#000000', // Set background color for the icon container
        marginTop: 10,
    },
    icon: {
        width: 70,
        height: 70,
        borderRadius: 25,
        
    },
    iconButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    newImage: {
        position: 'absolute',
        width: '100%', // Adjust the width as needed
        height: 340, // Adjust the height as needed
        resizeMode: 'cover', // Adjust how the image should be resized
        marginBottom: 10, // Add some space below the image
       
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
        borderRadius: 10,
    },
    analyzeButton: {
        backgroundColor: '#307B51',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    analyzeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultContainer: {
        alignItems: 'center',
        margin:10,
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    resultItem2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 80,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    score: {
        fontSize: 18,
        color: '#333',
    },
    description: {
        fontSize: 18,
        color: '#333',
        textAlign: 'left',
    },
    link: {
        fontSize: 18,
        color: 'blue',
        textAlign: 'auto',
        textDecorationLine: 'underline',
    },
});
