import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Animated, 
  StyleSheet 
} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(-50)).current;
  const [toastMsg, setToastMsg] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await auth().sendPasswordResetEmail(values.email);
        showToast('Password reset link sent!', 'success');
        setTimeout(() => navigation.goBack(), 1500);
      } catch (error) {
        showToast('Failed to send reset link!', 'error');
      }
    },
  });

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(scaleAnim, {
      toValue: 1.05,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const showToast = (message, type) => {
    setToastMsg(message);
    Animated.timing(toastAnim, {
      toValue: 50,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.header}>Forgot Password</Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TextInput
          style={[
            styles.input, 
            { borderColor: isFocused ? '#007bff' : 'gray' }
          ]}
          placeholder="Enter your email"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={() => {
            formik.handleBlur('email');
            handleBlur();
          }}
          onFocus={handleFocus}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Animated.View>

      {formik.touched.email && formik.errors.email && (
        <Text style={styles.error}>{formik.errors.email}</Text>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={formik.handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* Custom Toast Notification */}
      <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastAnim }] }]}>
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: 320,
    height: 50,
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    backgroundColor: 'white',
    marginBottom: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    width: 200,
    height: 55,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    elevation: 7,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 6,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPassword;
