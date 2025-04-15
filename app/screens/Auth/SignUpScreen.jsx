import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { Formik } from 'formik';
import * as yup from 'yup';

const SignUpSchema = yup.object({
  username: yup.string().required('Username is required'),
  email:    yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const SignUpScreen = () => {
  const toast      = useToast();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [fadeAnim]   = useState(new Animated.Value(0));
  const [buttonAnim] = useState(new Animated.Value(1));
  const [shakeAnim]  = useState(new Animated.Value(0));

  // … your checkEmailExists, handleSignUp, triggerShakeAnimation, useEffect …

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
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
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={SignUpSchema}
            onSubmit={handleSignUp}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <>
                <Animated.Text style={[styles.header, { opacity: fadeAnim }]}>
                  Sign Up
                </Animated.Text>

                {/** Username **/}
                <Animated.View style={[styles.inputWrapper, { transform: [{ translateX: shakeAnim }] }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                  />
                  {touched.username && errors.username && (
                    <Text style={styles.error}>{errors.username}</Text>
                  )}
                </Animated.View>

                {/** Email **/}
                <Animated.View style={[styles.inputWrapper, { transform: [{ translateX: shakeAnim }] }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}
                </Animated.View>

                {/** Password **/}
                <Animated.View style={[styles.inputWrapper, { transform: [{ translateX: shakeAnim }] }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </Animated.View>

                {/** Submit Button **/}
                <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: buttonAnim }] }]}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                <Text style={styles.signUpText}>
                  Already have an account?
                  <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
                    {' '}Login
                  </Text>
                </Text>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems:  'center',
    padding:     20,
    backgroundColor: 'linear-gradient(45deg, #6a11cb, #2575fc)',
  },
  header: {
    color:     'white',
    fontSize:  34,
    fontWeight:'bold',
    marginBottom: 30,
    fontFamily:   'Montserrat-Bold',
  },
  inputWrapper: {
    width:       '100%',
    marginBottom:'15px',
  },
  input: {
    width:            '100%',
    height:           50,
    backgroundColor:  '#ffffff',
    borderColor:      '#ccc',
    borderWidth:      1,
    borderRadius:     12,
    paddingHorizontal:15,
    fontSize:         16,
    fontFamily:       'Montserrat-Regular',
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 2 },
    shadowOpacity:    0.1,
    shadowRadius:     5,
  },
  error: {
    color:     'red',
    marginTop: 5,
    fontSize:  14,
  },
  buttonWrapper: {
    width:     '100%',
    marginTop: 20,
  },
  button: {
    width:         '100%',
    backgroundColor:'#1E90FF',
    borderRadius:   12,
    padding:        15,
    alignItems:     'center',
    elevation:      5,
  },
  buttonText: {
    color:     'white',
    fontWeight:'bold',
    fontSize: 18,
  },
  signUpText: {
    color:     'white',
    fontSize:  16,
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    color:    '#1E90FF',
  },
});

export default SignUpScreen;
