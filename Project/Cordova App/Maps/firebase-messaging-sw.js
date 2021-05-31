importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');



// Initialize Firebase
var config = {
    apiKey: "AIzaSyA7Ie_hTwwuJdTaN4TRjNrVhfdX57LvyCs",
    authDomain: "accident-management-system.firebaseapp.com",
    databaseURL: "https://accident-management-system.firebaseio.com",
    projectId: "accident-management-system",
    storageBucket: "accident-management-system.appspot.com",
    messagingSenderId: "33456599278"
  };

firebase.initializeApp(config);


/* Control Notifications received in background */
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const title = 'Hello World';
  
  const options = {
      body: payload.data.status
  };

  return self.registration.showNotification(title, options);
});