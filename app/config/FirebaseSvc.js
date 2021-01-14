
import firebase from 'firebase';
import uuid from 'uuid';

const config = {
  apiKey: "AIzaSyBtgqOgf4eGLe7ZRSqJ9P7CGUCcQnk0lyU",
  authDomain: "boldo-892b3.firebaseapp.com",
  databaseURL: "https://boldo-892b3.firebaseio.com",
  projectId: "boldo-892b3",
  storageBucket: "boldo-892b3.appspot.com",
  messagingSenderId: "17294300561",
  appId: "1:17294300561:web:6f42d8885b72ddf7793630",
  measurementId: "G-HE1QDZM867"
}

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log("firebase apps already running...")
    }
  }

  login = async (user, success_callback, failed_callback) => {
    const output = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({ message }) {
        console.log("Failed:" + message);
      }
    } else {
      console.log("Reusing auth...");
    }
  };

  uploadImage = async uri => {
    console.log('got image to upload. uri:' + uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(uuid.v4());
      const task = ref.put(blob);

      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {
            /* noop but you can track the progress here */
          },
          reject /* this is where you would put an error callback! */,
          () => resolve(task.snapshot.downloadURL)
        );
      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
    }
  }

  updateAvatar = (url) => {
    //await this.setState({ avatar: url });
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({ avatar: url })
        .then(function () {
          alert("Avatar image is saved successfully.");
        }, function (error) {
          console.warn("Error update avatar.");
          alert("Error update avatar. Error:" + error.message);
        });
    } else {
      alert("Unable to update avatar. You must login first.");
    }
  }

  onLogout = user => {
    firebase.auth().signOut().then(function () {
    }).catch(function (error) {
    });
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('Messages');
  }
  
  get refMessage() {
    return firebase.database().ref('Messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user, read } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
      read,
    };
    return message;
  };

  refOn = (room, callback) => {
    this.ref.child(room)
      // .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  refOnMessage = (callback) => {
    this.refMessage.on('child_changed', snapshot => callback(this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = (messages, room, read) => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
        read:read
      };
      this.ref.child(room).push(message);
    }
  };

  refOff() {
    this.ref.off();
  }

  refOffMessage() {
    this.refMessage.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
