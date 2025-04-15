import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const EditEmployeeDetails = ({ route }) => {
  const { employeeUniqueId } = route.params;
  const navigation = useNavigation();

  const [occupations] = useState(['Engineer', 'Manager', 'Technician', 'Analyst', 'HR']);
  const [designations] = useState(['Senior', 'Junior', 'Lead', 'Intern']);

  const [isOccupationModalVisible, setOccupationModalVisible] = useState(false);
  const [isDesignationModalVisible, setDesignationModalVisible] = useState(false);

  const fadeAnim       = useState(new Animated.Value(0))[0];
  const slideAnim      = useState(new Animated.Value(300))[0];
  const modalSlideAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const docSnap = await firestore().collection('employees').doc(employeeUniqueId).get();
        if (!docSnap.exists) {
          Alert.alert('Error', 'Employee not found');
          return navigation.goBack();
        }
        const data = docSnap.data();
        Object.keys(data).forEach(key => formik.setFieldValue(key, data[key]));
      } catch {
        Alert.alert('Error', 'Failed to fetch employee details');
      }
    };
    fetchEmployeeDetails();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 500, easing: Easing.ease, useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 500, easing: Easing.ease, useNativeDriver: true,
      }),
    ]).start();
  }, [employeeUniqueId]);

  const validationSchema = yup.object().shape({
    employeeName: yup.string().required('Employee name is required'),
    occupation:   yup.string().required('Occupation is required'),
    designation:  yup.string().required('Designation is required'),
  });

  const formik = useFormik({
    initialValues: {
      employeeName:      '',
      employeeUniqueId,
      occupation:        '',
      designation:       '',
    },
    validationSchema,
    onSubmit: async values => {
      try {
        await firestore().collection('employees').doc(employeeUniqueId).update(values);
        Alert.alert('Success', 'Employee details updated successfully');
        navigation.goBack();
      } catch {
        Alert.alert('Error', 'Failed to update employee details');
      }
    },
  });

  const openModal = type => {
    if (type === 'designation') setDesignationModalVisible(true);
    else setOccupationModalVisible(true);
    Animated.timing(modalSlideAnim, {
      toValue: 1, duration: 400, easing: Easing.ease, useNativeDriver: true,
    }).start();
  };

  const closeModal = type => {
    Animated.timing(modalSlideAnim, {
      toValue: 0, duration: 400, easing: Easing.ease, useNativeDriver: true,
    }).start(() => {
      type === 'designation'
        ? setDesignationModalVisible(false)
        : setOccupationModalVisible(false);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.inner,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.header}>Edit Employee</Text>

            <TextInput
              style={styles.input}
              placeholder="Employee Name"
              value={formik.values.employeeName}
              onChangeText={formik.handleChange('employeeName')}
            />
            {formik.touched.employeeName && formik.errors.employeeName && (
              <Text style={styles.error}>{formik.errors.employeeName}</Text>
            )}

            {/* Designation Picker */}
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => openModal('designation')}
            >
              <Text style={styles.pickerText}>
                {formik.values.designation || 'Select Designation'}
              </Text>
            </TouchableOpacity>

            {/* Occupation Picker */}
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => openModal('occupation')}
            >
              <Text style={styles.pickerText}>
                {formik.values.occupation || 'Select Occupation'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={formik.handleSubmit}
            >
              <Text style={styles.buttonText}>Update Employee</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Designation Modal */}
          <Modal visible={isDesignationModalVisible} transparent animationType="none">
            <View style={styles.modalContainer}>
              <Animated.View
                style={[
                  styles.modalContent,
                  { transform: [{ translateY: modalSlideAnim.interpolate({
                      inputRange: [0,1], outputRange: [300,0]
                    }) }] }
                ]}
              >
                <FlatList
                  data={designations}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        formik.setFieldValue('designation', item);
                        closeModal('designation');
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => closeModal('designation')}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Modal>

          {/* Occupation Modal */}
          <Modal visible={isOccupationModalVisible} transparent animationType="none">
            <View style={styles.modalContainer}>
              <Animated.View
                style={[
                  styles.modalContent,
                  { transform: [{ translateY: modalSlideAnim.interpolate({
                      inputRange: [0,1], outputRange: [300,0]
                    }) }] }
                ]}
              >
                <FlatList
                  data={occupations}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        formik.setFieldValue('occupation', item);
                        closeModal('occupation');
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => closeModal('occupation')}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </Animated.View>
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
  },
  inner: {
    width:      '100%',
    alignItems: 'center',
  },
  header: {
    fontSize:   24,
    fontWeight: 'bold',
    marginBottom:20,
    color:     '#333',
  },
  input: {
    width:          300,
    height:         40,
    borderColor:    '#007bff',
    borderWidth:    1,
    borderRadius:   12,
    padding:        10,
    backgroundColor:'white',
    marginBottom:   10,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0.1,
    shadowRadius:   5,
  },
  pickerButton: {
    width:          300,
    height:         50,
    borderColor:    '#007bff',
    borderWidth:    1,
    borderRadius:   12,
    backgroundColor:'white',
    justifyContent: 'center',
    paddingLeft:    10,
    marginBottom:   10,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0.1,
    shadowRadius:   5,
  },
  pickerText: {
    fontSize:16,
    color:   '#333',
  },
  button: {
    width:          300,
    backgroundColor:'#007bff',
    padding:        12,
    borderRadius:   12,
    alignItems:     'center',
    marginTop:      20,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 3 },
    shadowOpacity:  0.1,
    shadowRadius:   8,
  },
  buttonText: {
    color:     'white',
    fontSize:  16,
    fontWeight:'bold',
  },
  error: {
    color:     'red',
    marginBottom:10,
  },
  modalContainer: {
    flex:         1,
    justifyContent:'center',
    alignItems:   'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width:       300,
    backgroundColor:'white',
    borderRadius:12,
    padding:     20,
  },
  modalItem: {
    padding:    15,
    borderBottomWidth:1,
    borderBottomColor:'#ddd',
  },
  modalItemText: {
    fontSize:16,
  },
  modalCloseButton: {
    marginTop:  10,
    alignItems: 'center',
  },
  modalCloseText: {
    color:     '#007bff',
    fontSize: 16,
    fontWeight:'bold',
  },
});

export default EditEmployeeDetails;
