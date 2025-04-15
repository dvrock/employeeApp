import React, { useState, useRef, useEffect } from 'react';
import { 
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Animated, 
  Easing, 
  Modal, 
  FlatList,
  Platform,
} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useToast } from 'react-native-toast-notifications';

const AddEmployeeDetails = () => {
  const user = auth().currentUser;
  const toast = useToast();

  const [occupation, setOccupation] = useState('');
  const [designation, setDesignation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOccupationModal, setShowOccupationModal] = useState(false);
  const [showDesignationModal, setShowDesignationModal] = useState(false);

  // Animations
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(0.9)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const inputAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validationSchema = yup.object().shape({
    employeeName:            yup.string().required('Employee name is required'),
    employeeUniqueNumber:    yup.string().required('Unique number is required'),
  });

  const formik = useFormik({
    initialValues: { employeeName: '', employeeUniqueNumber: '' },
    validationSchema,
    onSubmit: async (values) => {
      if (!user) {
        toast.show('User not authenticated', { type: 'danger' });
        return;
      }
      if (!occupation) {
        toast.show('Select an occupation', { type: 'danger' });
        return;
      }
      if (!designation) {
        toast.show('Select a designation', { type: 'danger' });
        return;
      }

      setLoading(true);
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start(async () => {
        try {
          await firestore().collection('employees').doc(values.employeeUniqueNumber).set({
            employeeName:           values.employeeName,
            employeeUniqueNumber:   values.employeeUniqueNumber,
            occupation,
            designation,
            createdBy:              user.uid,
            createdAt:              firestore.FieldValue.serverTimestamp(),
          });
          toast.show('Employee added successfully', { type: 'success' });
          formik.resetForm();
          setOccupation('');
          setDesignation('');
        } catch (err) {
          toast.show('Error: ' + err.message, { type: 'danger' });
        } finally {
          setLoading(false);
        }
      });
    },
  });

  const occupations  = ['Engineer', 'Manager', 'Technician'];
  const designations = ['Senior', 'Junior', 'Intern'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[
            styles.inner,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}>
            <Text style={styles.header}>Add Employee</Text>

            <Animated.View style={{ opacity: inputAnim }}>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: formik.touched.employeeName && formik.errors.employeeName ? '#e74c3c' : '#2980b9' }
                ]}
                placeholder="Employee Name"
                value={formik.values.employeeName}
                onChangeText={formik.handleChange('employeeName')}
                onBlur={formik.handleBlur('employeeName')}
              />
              {formik.touched.employeeName && formik.errors.employeeName && (
                <Text style={styles.error}>{formik.errors.employeeName}</Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  { borderColor: formik.touched.employeeUniqueNumber && formik.errors.employeeUniqueNumber ? '#e74c3c' : '#2980b9' }
                ]}
                placeholder="Employee Unique Number"
                keyboardType="numeric"
                value={formik.values.employeeUniqueNumber}
                onChangeText={formik.handleChange('employeeUniqueNumber')}
                onBlur={formik.handleBlur('employeeUniqueNumber')}
              />
              {formik.touched.employeeUniqueNumber && formik.errors.employeeUniqueNumber && (
                <Text style={styles.error}>{formik.errors.employeeUniqueNumber}</Text>
              )}
            </Animated.View>

            {/* Occupation */}
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowOccupationModal(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {occupation || "Select Occupation"}
              </Text>
            </TouchableOpacity>

            {/* Designation */}
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowDesignationModal(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {designation || "Select Designation"}
              </Text>
            </TouchableOpacity>

            {/* Submit */}
            <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
              <TouchableOpacity
                style={styles.button}
                onPress={formik.handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add Employee</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Occupation Modal */}
          <Modal
            animationType="slide"
            transparent
            visible={showOccupationModal}
            onRequestClose={() => setShowOccupationModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Occupation</Text>
                <FlatList
                  data={occupations}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setOccupation(item);
                        setShowOccupationModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowOccupationModal(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Designation Modal */}
          <Modal
            animationType="slide"
            transparent
            visible={showDesignationModal}
            onRequestClose={() => setShowDesignationModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Designation</Text>
                <FlatList
                  data={designations}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setDesignation(item);
                        setShowDesignationModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowDesignationModal(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow:     1,
    justifyContent:'center',
    alignItems:   'center',
    padding:      20,
    backgroundColor: '#f5f6fa',
  },
  inner: {
    width:       '100%',
    alignItems:  'center',
  },
  header: {
    fontSize:   36,
    fontWeight: '800',
    marginBottom:20,
    color:     '#2c3e50',
    textAlign: 'center',
  },
  input: {
    width:          '100%',
    height:         55,
    borderWidth:    2,
    borderRadius:   12,
    paddingHorizontal:15,
    marginBottom:   10,
    backgroundColor:'#fff',
    fontSize:       16,
    shadowColor:    '#000',
    shadowOpacity:  0.3,
    shadowRadius:   10,
    elevation:      5,
  },
  dropdownButton: {
    width:          '100%',
    height:         55,
    marginBottom:   20,
    justifyContent: 'center',
    alignItems:     'center',
    borderWidth:    2,
    borderRadius:   12,
    backgroundColor:'#fff',
    shadowColor:    '#000',
    shadowOpacity:  0.3,
    shadowRadius:   10,
    elevation:      5,
  },
  dropdownButtonText: {
    fontSize: 16,
    color:    '#2980b9',
  },
  error: {
    color:     '#e74c3c',
    marginBottom:10,
    alignSelf: 'flex-start',
  },
  button: {
    width:          '100%',
    height:         55,
    backgroundColor:'#2980b9',
    justifyContent: 'center',
    alignItems:     'center',
    borderRadius:   12,
    marginTop:      10,
    elevation:      5,
    shadowColor:    '#000',
    shadowOpacity:  0.3,
    shadowRadius:   10,
  },
  buttonText: {
    fontSize:   18,
    fontWeight: '700',
    color:     '#fff',
  },
  modalContainer: {
    flex:         1,
    justifyContent:'center',
    alignItems:   'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width:       '90%',
    backgroundColor:'#fff',
    padding:     20,
    borderRadius:12,
    alignItems:  'center',
    elevation:   10,
  },
  modalTitle: {
    fontSize:   20,
    fontWeight: '700',
    marginBottom:20,
  },
  modalItem: {
    paddingVertical:10,
    borderBottomWidth:1,
    borderColor:  '#ddd',
    width:       '100%',
  },
  modalItemText: {
    fontSize:   18,
    color:     '#34495e',
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop:   20,
    paddingVertical:10,
    backgroundColor:'#2980b9',
    borderRadius:12,
    width:       '100%',
    justifyContent:'center',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color:     '#fff',
    fontSize:  16,
  },
});

export default AddEmployeeDetails;
