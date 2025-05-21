import Constants from 'expo-constants';

export function getApiBaseUrl() {
  let ip = 'localhost'; 

  if (Constants.expoConfig?.hostUri) {
    ip = Constants.expoConfig.hostUri.split(':')[0]; 
  } else if (Constants.manifest?.debuggerHost) {
    ip = Constants.manifest.debuggerHost.split(':')[0];
  }

  return `http://${ip}:5000`; 
}
