import React, { useState } from 'react'
import axios from 'axios'

import {
    View,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native'
import styles from '../styles'
import config from '../config'

export default ({ navigation, route }) => {
    const [shipmentData, setShipmentData] = useState(route.params.created)
    const setDestinationAddress = value => {
        setShipmentData({
            ...shipmentData, 
            destinationAddress: value
        })
    }
    const setCustomerId = value => {
        setShipmentData({
            ...shipmentData, 
            customerId: value
        })
    }
    const setInternalShipmentId = value => {
        setShipmentData({
            ...shipmentData, 
            internalShipmentId: value
        })
    }
    const patchAndNavigate = async () => {
        const response = await axios.patch(
            `${config.shipmentsUrl}/${shipmentData._id}`,
            {
                update: shipmentData,
            },
            {
                params: {
                    editSecret: shipmentData.editSecret
                }
            }
        )
        if (response.status === 200) {
            navigation.navigate('TrackingScreen', { tracking: response.data.updated })
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <Text style={styles.inputName}>Destination Address</Text>
                <TextInput
                    name='destinationAddress'
                    style={styles.input}
                    defaultValue={shipmentData.destinationAddress}
                    onChangeText={setDestinationAddress}
                />
            </View>
            <View style={styles.searchSection}>
                <Text style={styles.inputName}>Customer ID</Text>
                <TextInput
                    name='customerId'
                    style={styles.input}
                    defaultValue={shipmentData.customerId}
                    onChangeText={setCustomerId}
                />
            </View>
            <View style={styles.searchSection}>
                <Text style={styles.inputName}>Shipment ID</Text>
                <TextInput
                    name='internalShipmentId'
                    style={styles.input}
                    defaultValue={shipmentData.internalShipmentId}
                    onChangeText={setInternalShipmentId}
                />
            </View>
            <View style={styles.buttonRowContainer}>
                <TouchableOpacity
                    style={styles.rowButton}
                    onPress={patchAndNavigate}
                >
                    <Text style={styles.rowButtonText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
