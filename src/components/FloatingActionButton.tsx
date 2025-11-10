import React from 'react';
import { FAB } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    onPress: () => void; // Callback function triggered when the FAB is pressed
}

// Floating Action Button (FAB) component
export const FloatingActionButton: React.FC<Props> = ({ onPress }) => (
    <FAB
        icon={'plus'}
        style={{
            position: 'absolute',
            right: 16,
            bottom: 24,
            backgroundColor: '#007AFF',
        }}
        color="#fff"
        onPress={onPress}
    />
);
