import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { fetchBookmarks } from './src/store/slices/bookmarksSlice';

const Bootstrap = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);
  return children;
};

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
        <Bootstrap>
          <AppNavigator />
        </Bootstrap>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
