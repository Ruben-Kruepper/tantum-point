/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'

// react / react-native
import React from 'react'

// navigation
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

// screens
import HomeCameraScreen from './screens/HomeCamera'
import CheckScanScreen from './screens/CheckScan'
import CheckInputsScreen from './screens/CheckInputs'
import TrackingScreen from './screens/Tracking'

const Stack = createStackNavigator()

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="HomeCameraScreen"
                    component={HomeCameraScreen}
                    options={{ title: 'Scan' }}
                />
                <Stack.Screen
                    name="CheckScanScreen"
                    component={CheckScanScreen}
                    options={{ title: 'Send or Retake' }}
                />
                <Stack.Screen
                    name="CheckInputsScreen"
                    component={CheckInputsScreen}
                    options={{ title: 'Check Information' }}
                />
                <Stack.Screen
                    name="TrackingScreen"
                    component={TrackingScreen}
                    options={{ title: 'Tracking' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default App
