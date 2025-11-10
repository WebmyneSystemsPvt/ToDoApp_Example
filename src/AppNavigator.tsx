import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from './screens/HomeScreen';
import { AddTodoScreen } from './screens/AddTodoScreen';
import { theme } from './theme/AppTheme';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerTransparent: false,
                headerBlurEffect: undefined,

                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                }

            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddTodo" component={AddTodoScreen} />
        </Stack.Navigator>
    </NavigationContainer>
);