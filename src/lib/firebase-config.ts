export const firebaseConfig = {
  apiKey: 'AIzaSyAoZ4dEZ2SVWbl_-ZH1IFLgCEhnBJ0lEGg',
  authDomain: 'barber-show-6771f.firebaseapp.com',
  projectId: 'barber-show-6771f',
  storageBucket: 'barber-show-6771f.firebasestorage.app',
  messagingSenderId: '912142314908',
  appId: '1:912142314908:web:14ac1dbc23506876c1ec59',
}

export const isFirebaseConfigured = () =>
  firebaseConfig.apiKey !== 'PON_TU_API_KEY_AQUI' && firebaseConfig.projectId !== 'TU_PROYECTO'
