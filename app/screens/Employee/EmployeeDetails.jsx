import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView,
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Animated, 
  Alert, 
  ActivityIndicator,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const fadeAnim  = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const navigation = useNavigation();

  useEffect(() => {
    // fade & scale in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // listen for employees
    const unsubscribe = firestore()
      .collection('employees')
      .orderBy('employeeName', 'asc')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(list);
      });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Employee Details</Text>
        <Animated.View
          style={{
            ...styles.employeeList,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <FlatList
            data={employees}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <EmployeeCard item={item} />}
          />
        </Animated.View>

        <AnimatedFAB navigation={navigation} />
        <LogoutButton />
      </View>
    </SafeAreaView>
  );
};

const EmployeeCard = ({ item }) => {
  const navigation = useNavigation();
  const fade    = useState(new Animated.Value(0))[0];
  const scale   = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = async () => {
    try {
      await firestore().collection('employees').doc(item.id).delete();
      Alert.alert('Success', 'Employee deleted successfully!');
    } catch {
      Alert.alert('Error', 'Failed to delete employee');
    }
  };

  return (
    <Animated.View style={{ ...styles.card, opacity: fade, transform: [{ scale }] }}>
      <Text style={styles.cardTitle}>{item.employeeName}</Text>
      <Text style={styles.cardText}>ID: {item.employeeUniqueID}</Text>
      <Text style={styles.cardText}>Occupation: {item.occupation}</Text>
      <Text style={styles.cardText}>Designation: {item.designation}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditEmployee', { employeeUniqueId: item.id })}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AnimatedFAB = ({ navigation }) => {
  const fade  = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...styles.fabContainer,
        opacity: fade,
        transform: [{ scale }],
      }}
    >
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddEmployee')}
      >
        <Text style={styles.fabButtonText}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          setLoading(true);
          await auth().signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
      {loading ? <ActivityIndicator color="white" /> : <Text style={styles.logoutText}>Logout</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    paddingTop: Platform.OS === 'android' ? 25 : 0, // extra padding on Android status bar
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1565c0',
  },
  employeeList: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#37474f',
  },
  cardText: {
    fontSize: 16,
    color: '#455a64',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fabButton: {
    backgroundColor: '#0288d1',
    padding: 16,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmployeeDetails;
