
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

const PasswordInput = ({ formik }) => {
  const [secureText, setSecureText] = useState(true);
  
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={secureText}
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
      />
      <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.iconContainer}>
        <Image 
          source={{
            uri: secureText 
              ? 'https://img.icons8.com/ios-filled/50/000000/closed-eye.png' 
              : 'https://img.icons8.com/ios-filled/50/000000/visible.png',
          }}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#555',
  },
});

export default PasswordInput;
