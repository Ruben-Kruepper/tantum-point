import React, { useEffect, useState } from 'react'
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
} from 'react-native'
import DatePicker from 'react-native-date-picker'
import Geolocation from 'react-native-geolocation-service'
import axios from 'axios'

import styles from '../styles'
import config from '../config'

export default ({ navigation, route }) => {
    const [delayReason, setDelayReason] = useState('')
    const [resumeDateTime, setResumeDateTime] = useState(new Date())
    const [showDelayInterface, setShowDelayInterface] = useState(false)
    const [position, setPosition] = useState(null)
    // Mount/unmound tracking
    useEffect(() => {
        const watcherId = Geolocation.watchPosition(
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
                ).catch(error => console.error(error.response.data))
                setPosition(position)
                console.log(position.coords)
            },
            console.error,
            {
                distanceFilter: 0,
                forceRequestLocation: true,
                enableHighAccuracy: true
            }
        )
    }, [])
    const postDelayReport = async () => {
        axios.post(
            `${config.shipmentsUrl}/${route.params.tracking._id}/delay`,
            {
                delay: {
                    coordinates: {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    },
                    until: resumeDateTime,
                    reason: delayReason
                }
            },
            {
                params: {
                    editSecret: route.params.tracking.editSecret
                }
            }).catch(error => console.error(error.response.data))
        setShowDelayInterface(false)
    }

    return (
        <View style={styles.container}>
            { !showDelayInterface ? <>
                <Text style={{ ...styles.detailsText, fontWeight: 'bold' }}>Destination:</Text>
                <Text style={styles.detailsText}>{route.params.tracking.route.destination.address}</Text>
                <Text style={{ ...styles.detailsText, fontWeight: 'bold' }}>Sender:</Text>
                <Text style={styles.detailsText}>{route.params.tracking.sender.organization}</Text>

                <View style={styles.buttonRowContainer}>
                    <TouchableOpacity
                        style={styles.rowButton}
                        onPress={() => { setShowDelayInterface(true) }} >
                        <Text style={styles.rowButtonText}>Report Delay</Text>
                    </TouchableOpacity>
                </View>
            </> : <>
                <Text style={styles.inputName}>Continue Route On</Text>
                <DatePicker
                    date={resumeDateTime}
                    onDateChange={setResumeDateTime}
                    mode='datetime'
                    minuteInterval={30}
                    style={{ alignSelf: 'center' }}
                />
                <Text style={styles.inputName}>Reason (Optional)</Text>
                <TextInput
                    name='delayReason'
                    style={{ ...styles.input, height: 'auto' }}
                    onChangeText={setDelayReason}
                    multiline
                    maxHeight={90}
                    numberOfLines={2}
                />
                <Text style={{ fontSize: 20 }}>We automatically remove this delay if you get back on the road early.</Text>
                <View style={styles.buttonRowContainer}>
                    <TouchableOpacity
                        style={{ ...styles.rowButton }}
                        onPress={postDelayReport} >
                        <Text style={styles.rowButtonText}>SEND</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...styles.rowButton }}
                        onPress={() => { setShowDelayInterface(false) }} >
                        <Text style={styles.rowButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </>}
        </View>
    )
}