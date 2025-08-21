import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  useEffect(() => {
    // Set status bar style
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#007AFF');
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;