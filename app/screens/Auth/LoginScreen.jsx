import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import PasswordInput from '../../components/PasswordField';
import auth from '@react-native-firebase/auth';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import firestore from '@react-native-firebase/firestore';
import * as yup from 'yup';

const loginSchema = yup.object({
  email:    yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginScreen = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // useRef so Animated.Values persist
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = async values => {
    setLoading(true);
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 200,
      useNativeDriver: true,
    }).start();

    try {
      const snapshot = await firestore()
        .collection('User')
        .where('email', '==', values.email)
        .get();
      const userExists = snapshot.docs.length > 0;

      if (!userExists) {
        toast.show('User does not exist in DB', { type: 'error' });
      } else {
        await auth().signInWithEmailAndPassword(values.email, values.password);
        toast.show('Logged In successfully', { type: 'success' });
        navigation.replace('EmployeeDetails');
      }
    } catch (error) {
      toast.show(error.message, { type: 'danger' });
    }

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <Animated.View style={{ width: '100%', opacity: fadeAnim }}>
                <Text style={styles.header}>Login</Text>

                <Animated.View style={[styles.inputContainer, { transform: [{ scale: scaleAnim }] }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                </Animated.View>
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <PasswordInput
                  formik={{ handleChange, handleBlur, values }}
                />
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Animated.Text style={styles.buttonText}>
                    {loading ? 'Logging In...' : 'Login'}
                  </Animated.Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.link}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonSecondary}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow:  1,
    justifyContent: 'center',
    alignItems:    'center',
    padding:       16,
    backgroundColor:'#f5f5f5',
  },
  header: {
    fontSize:   28,
    fontWeight: 'bold',
    color:      '#2c3e50',
    marginBottom:20,
  },
  inputContainer: {
    width:       '100%',
    marginBottom:10,
  },
  input: {
    width:          '100%',
    height:         50,
    backgroundColor:'white',
    borderRadius:   8,
    paddingLeft:    15,
    fontSize:       16,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.1,
    shadowRadius:   5,
  },
  button: {
    width:          '100%',
    backgroundColor:'#2980b9',
    borderRadius:   8,
    padding:        15,
    alignItems:     'center',
    marginTop:      10,
    elevation:      5,
  },
  buttonSecondary: {
    width:          '100%',
    backgroundColor:'#e67e22',
    borderRadius:   8,
    padding:        15,
    alignItems:     'center',
    marginTop:      10,
    elevation:      5,
  },
  buttonText: {
    color:     'white',
    fontSize:  18,
    fontWeight:'bold',
  },
  link: {
    marginTop:15,
  },
  linkText: {
    color:    '#2980b9',
    fontSize: 16,
  },
  error: {
    color:      'red',
    width:      '100%',
    textAlign:  'left',
    marginBottom:10,
  },
});

export default LoginScreen;
