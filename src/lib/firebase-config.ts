export const firebaseConfig = {
  apiKey: 'PON_TU_API_KEY_AQUI',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
  storageBucket: 'TU_PROYECTO.appspot.com',
  messagingSenderId: 'TU_SENDER_ID',
  appId: 'TU_APP_ID',
}

export const isFirebaseConfigured = () =>
  firebaseConfig.apiKey !== 'PON_TU_API_KEY_AQUI' && firebaseConfig.projectId !== 'TU_PROYECTO'
