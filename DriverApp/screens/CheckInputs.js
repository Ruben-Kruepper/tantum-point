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
    const [edited, setEdited] = useState(false)
    const setDestinationAddress = value => {
        setEdited(true)
        setShipmentData({
            ...shipmentData,
            route: {
                ...shipmentData.route,
                destination: {
                    ...shipmentData.route.destination,
                    address: value
                }
            }
        })
    }
    const setSenderOrganization = value => {
        setEdited(true)
        setShipmentData({
            ...shipmentData,
            sender: {
                ...shipmentData.sender,
                organization: value
            }
        })
    }
    const patchAndNavigate = async () => {
        if (edited) {
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
        } else {
            navigation.navigate('TrackingScreen', { tracking: shipmentData })
        }
    }
    return (
        <View style={{ ...styles.container }}>
            <View style={styles.searchSection}>
                <Text style={styles.inputName}>Destination Address</Text>
                <TextInput
                    name='destinationAddress'
                    style={{ ...styles.input, height: 'auto' }}
                    defaultValue={shipmentData.route.destination.address}
                    onChangeText={setDestinationAddress}
                    multiline
                    maxHeight={120}
                    numberOfLines={3}
                />
            </View>
            <View style={styles.searchSection}>
                <Text style={styles.inputName}>Sender Organization</Text>
                <TextInput
                    name='customerId'
                    style={styles.input}
                    defaultValue={shipmentData.sender.organization}
                    onChangeText={setSenderOrganization}
                    multiline
                    maxHeight={60}
                    numberOfLines={3}
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
