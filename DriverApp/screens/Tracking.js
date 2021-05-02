import React, { useEffect } from 'react'
import {
    View,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import axios from 'axios'

import styles from '../styles'
import config from '../config'

export default ({ navigation, route }) => {
    useEffect(() => {
        Geolocation.watchPosition(
            position => {
                axios.patch(
                    `${config.shipmentsUrl}/${route.params.tracking._id}/position`,
                    {
                        coordinates: {
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        }
                    },
                    {
                        params: {
                            editSecret: route.params.tracking.editSecret
                        }
                    }
                )
                console.log(position)

            },
            console.error,
            {
                distanceFilter: 0
            }
        )
    }, [])
    return (
        <View style={styles.container}>
            <Text style={[styles.detailsText], { fontWeight: 'bold' }}>Destination:</Text>
            <Text style={styles.detailsText}>{route.params.tracking.destinationAddress}</Text>
        </View>
    )
}