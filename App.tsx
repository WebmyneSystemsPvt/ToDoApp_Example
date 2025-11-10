import React from 'react';
import 'react-native-get-random-values';


import { Provider } from 'react-redux';
import { AppNavigator } from './src/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import store from './src/store/Store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from './src/theme/AppTheme';


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider settings={{
          icon: (props) => <Icon {...props} />, // ✅ ensures proper icon mapping
        }} theme={theme}>
          <AppNavigator />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}