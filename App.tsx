/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import {
  Text,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from './src/screens/Home';
import { CompetidorScreen } from './src/screens/Competidor';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#6F6989',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Competidor"
          component={CompetidorScreen}
          options={{
            tabBarLabel: 'Competidor',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-plus-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>

  );
}



export default App;