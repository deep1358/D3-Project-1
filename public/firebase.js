var firebaseConfig = {
        apiKey: "AIzaSyBubUU3nCmnBBsw-60zaZ-HnpcRQdP4_KM",
        authDomain: "d3-project-1-3e96f.firebaseapp.com",
        databaseURL: "https://d3-project-1-3e96f-default-rtdb.firebaseio.com",
        projectId: "d3-project-1-3e96f",
        storageBucket: "d3-project-1-3e96f.appspot.com",
        messagingSenderId: "727108553669",
        appId: "1:727108553669:web:18bdc63d1cfc260f6219ac",
      };

      firebase.initializeApp(firebaseConfig);

      const db = firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      db.settings(settings);