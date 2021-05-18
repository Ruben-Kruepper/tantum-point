import React from 'react'
import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RNCamera } from 'react-native-camera'


import styles from '../styles'

export default class HomeCamera extends React.Component {
    async takePicture() {
        if (this.camera) {
            const data = await this.camera.takePictureAsync({ base64: true })
            this.props.navigation.navigate('CheckScanScreen', { image: data })
        }
    }
    render() {
        return (
            <View style={{ ...styles.container, padding: 0 }}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref
                    }}
                    style={styles.preview} >
                </RNCamera>
                <View style={styles.snapContainer}>
                    <TouchableOpacity variant='outlined' onPress={this.takePicture.bind(this)} style={styles.capture}>
                        <Text style={{ fontSize: 14 }}> SCAN </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

