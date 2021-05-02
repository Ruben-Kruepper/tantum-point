import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

import axios from 'axios'

import {
    Alert,
    Image,
    Text,
    View,
} from 'react-native'

import styles from '../styles'
import config from '../config'

export default ({ navigation, route }) => {
    
    return (
        <View style={styles.container}>
            <Image
                style={styles.reviewImage}
                source={{ uri: `data:image/jpeg;base64,${route.params.image.base64}` }}
            />
            <View style={styles.snapContainer}>
                <TouchableOpacity onPress={sendImage.bind(null, navigation, route)} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}> SEND </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

async function sendImage (navigation, route) {
    const response = await axios.post(
        config.shipmentsUrl,
        route.params.image.base64,
        {
            headers: {
                'Content-Type': 'image/jpeg'
            }
        }
    )
        .catch((error) => {
            console.error(error)
            return { status: null }
        })
    if (response.status === 200) {
        navigation.navigate('CheckInputsScreen', response.data)
    } else {
        console.log(response)
        Alert.alert('Error', 'Something went wrong on our end!', [{ text: 'OK' }])
    }
}