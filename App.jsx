import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

// Import Screens
import SignUpScreen from './app/screens/Auth/SignUpScreen';
import ForgotPassword from './app/screens/Auth/ForgotPassword';
import LoginScreen from './app/screens/Auth/LoginScreen';
import EmployeeDetails from './app/screens/Employee/EmployeeDetails';
import AddEmployeeDetails from './app/screens/Employee/AddEmployeeDetails';
import EditEmployeeDetails from './app/screens/Employee/EditEmployeeDetails';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <Stack.Navigator   screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="EmployeeDetails" component={EmployeeDetails} />
          <Stack.Screen name="AddEmployee" component={AddEmployeeDetails} />
          <Stack.Screen name="EditEmployee" component={EditEmployeeDetails} />
        </>
      ) : (
        <>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ToastProvider>
  );
}