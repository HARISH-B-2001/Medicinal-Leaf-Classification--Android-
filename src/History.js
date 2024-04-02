import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ImageBackground, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import backgroundImage from '../assets/background.jpg';

const History = () => {
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const storedPredictions = await AsyncStorage.getItem('predictions');
                if (storedPredictions) {
                    const parsedPredictions = JSON.parse(storedPredictions);
                    setPredictions(parsedPredictions);
                }
            } catch (error) {
                console.error('Error fetching predictions from AsyncStorage:', error);
            }
        };

        fetchPredictions();
    }, []);

    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem('predictions');
            setPredictions([]);
            Alert.alert('History Cleared', 'Your prediction history has been cleared successfully.');
        } catch (error) {
            console.error('Error clearing history:', error);
            Alert.alert('Error', 'An error occurred while clearing history. Please try again.');
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.container}>
            <Text style={styles.heading}>Classification History</Text>
            {predictions.length > 0 ? (
                <>
                    <FlatList
                        data={predictions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.predictionItem}>
                                <Text style={styles.class}>{item.class}</Text>
                                <Text style={styles.score}>{item.score.toFixed(2)}%</Text>
                            </View>
                        )}
                    />
                    <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                        <Ionicons name="trash-outline" size={24} color="white" />
                        <Text style={styles.clearButtonText}>Clear History</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.noDataText}>No predictions available</Text>
            )}
        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 80,
    },
    predictionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    class: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    score: {
        fontSize: 16,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 100,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    noDataText: {
        fontSize: 16,
        fontStyle: 'italic',
        marginTop: 20,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
});

export default History;
