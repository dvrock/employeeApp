/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import auth from "./firebaseConfig"
AppRegistry.registerComponent(appName, () => App);
