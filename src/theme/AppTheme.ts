import { MD3LightTheme } from 'react-native-paper';

export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        outline: '#8E8E93', // ✅ darker iOS-style gray outline
    },
};

//color constant for the colors used in through out app
export const AppTheme = {
    colors: {
        primary: '#dbb311ff',
        background: '#F5F7FA',
        text: '#333',
        black: '#000',
        card: '#FFF',
        danger: '#FF3B30',
        error: '#b3261e'
    },
};
