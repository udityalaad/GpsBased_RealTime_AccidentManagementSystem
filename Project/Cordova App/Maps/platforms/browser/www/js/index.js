/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		//myMap();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();












/* -------------------------------------------------------
                    Global Data
------------------------------------------------------- */

/* States whether some user is Logged In or not */
// var LOGGED_IN = false;

/* Holds the Firebase-Database object */
var FIREBASE_DATABASE;

/* Holds the Firebase-Messaging object */
var FIREBASE_MESSAGING;

/* Holds the latest FCM Token of the User */
var FCM_TOKEN;

/* Holds the Primary Key (Email_ID) of currently Logged In user */
var CURRENT_USER_ID;

/* Holds the role parameter of currently Logged In user */
var CURRENT_USER_ROLE;

/* States whether Sign-Up process is going on or not*/
var SIGN_UP_IN_PROCESS = false;


/* States whether Log_In process (Inisitaited by user through start-up
    form), is going on or not */
var USER_LOG_IN_in_PROCESS = false;

/* Maintain Timer that runs till User is Logged_in */
var LOG_IN_TIMER;


/* Defines the parameter - 'NO_OF_DELETIONS' of function:-
    "array.slice(position, NO_OF_DELETIONS)",
    which is used to delete "NO_OF_DELETIONS" elements at position - 'position' an array; */
var NO_OF_DELETIONS = 1;



/* Contains the timer which waits for Own_Accident_Confirmation from the user */
var OWN_ACCIDENT_CONFIRMATION_TIMER;

/* Contains the timer which waits for Confirmation of 'One Click Help' from the user */
var ONE_CLICK_HELP_CONFIRMATION_TIMER;



/* ------------------- Test Only ------------------- */

/* States the Type of Current User */
var CURRENT_USER_TYPE;

/* States the ID of Blackbox used by Current_User */
var BLACKBOX_ID = "";


// var Reported_Zones = ["Reported Zone 1", "Reported Zone 2", "Reported Zone 3", "Reported Zone 4", "Reported Zone 5"];
// var Blackspots = ["Blackspot 1", "Blackspot 2", "Blackspot 3", "Blackspot 4", "Blackspot 5"];


var SENSORS = ["Accelerometer", "Proximity Sensor", "Sensor 3", "Sensor 4", "Sensor 5"];





/* ------------------- Messages ------------------- */
// /* Creates an object for Messages */
// function Message (ID, Sender, Subject, Content, Time) {
//     this.ID = ID;
//     this.Sender = Sender;
//     this.Subject = Subject;
//     this.Content = Content;
//     this.Time = Time;
// }

// /* Contains an array of Message Objects
//     with all the required information */
// var MESSAGES = [];

// /** Add Messages */
// MESSAGES =  [new Message("Message 1", "Sender 1", "Subject 1", "Content 1", "Time 1"),
//                 new Message("Message 2", "Sender 2", "Subject 2", "Content 2", "Time 1"),
//                 new Message("Message 3", "Sender 3", "Subject 3", "Content 3", "Time 1"),
//                 new Message("Message 4", "Sender 4", "Subject 4", "Content 4", "Time 1")
//             ];
/* ------------------- End - Test Only ------------------- */








/* -------------------------------------------------------
    Function to be executed on loading the application
------------------------------------------------------- */
function init () {
    // window.width = screen.width;
    // window.height = screen.height;

    Create_Firebase_Connection();

    /* Show Cancel Button and hide Go_Back Button, initially */
    Switch_Close_and_Go_Back_Buttons("Close Button");


    /* ------------------- Test Only ------------------- */
    // CURRENT_USER_ID = "pareshzambaulikar@outlook_dot_com";
    // CURRENT_USER_TYPE = "Simple_User";
    // LOGGED_IN = false;
    /* ------------------- End - Test Only ------------------- */

    
    var time = 0;
    var interval = 100;
    LOG_IN_TIMER = setInterval(function() {
        if (firebase.auth().currentUser != null  &&  !SIGN_UP_IN_PROCESS  &&  !USER_LOG_IN_in_PROCESS) {
            console.log (firebase.auth().currentUser.uid);
            CURRENT_USER_ID = firebase.auth().currentUser.uid;

            Perform_Log_In_Functions();

            clearInterval(LOG_IN_TIMER);
        }
        else {
            time += 100;
            console.log(time);
        }
    }, interval);
    
    
    /* ----------------------------------- Not Used ----------------------------------- */
    /* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
    
    /* Define the common content of all the forms */
    // Load_Common_Form_Content("Sign_Up_Simple_User_Form");
    // Load_Common_Form_Content("Sign_Up_Vehicle_User_Form");
    // Load_Common_Form_Content("Sign_Up_Emergency_Service_User_Form");
    
    // Load_Common_Form_Content("Reset_Password_Form");

    // Load_Common_Form_Content("Report_Unsafe_Zone_Form");
    // Load_Common_Form_Content("Add_Blackspot_Form");
    // Load_Common_Form_Content("View_Blackspot_Form");
    // Load_Common_Form_Content("View_Zone_Form");

    // Load_Common_Form_Content("My_Profile_Simple_User_Form");
    // Load_Common_Form_Content("My_Profile_Vehicle_User_Form");
    // Load_Common_Form_Content("My_Profile_Emergency_Service_User_Form");

    // Load_Common_Form_Content("Change_Password_Logged_In_Form");

    // Load_Common_Form_Content("View_Vehicle_Details_Form");
    // Load_Common_Form_Content("Add_Vehicle_Details_Form");
    
    /* ------------------------------------------ */

    /* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
    /* ----------------------------------- End - Not Used ----------------------------------- */
    
    
    show_hide_content("LOGIN_PAGE");

    /* Initially, set the user type of Sign_Up form to "Simple User" */
    Switch_Sign_Up_User_Type("Simple_User");

    /* Prepare Map with Current_Location, Blackspots, Active Accidents, etc */
    Set_Up_Map();


    // Adjust_Blackbox_SubMenu_Content();

    // Display_Pass_Vehicle_Control_AND_Switch_User_Type_Window();

    Reset_User_Filled_Forms();

    document.getElementById("NAVBAR").style.display = "none";
    document.getElementById("googleMap").style.display = "none";

    
    
    var most_recent_location_time_interval = 5000;
    var most_recent_location_timer = setInterval(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("step 1");

                var current_location = {
                    lat : position.coords.latitude,
                    lng : position.coords.longitude
                };

                if (firebase.auth().currentUser != null) {
                    console.log("step 2");
                    firebase.database().ref("User/" + firebase.auth().currentUser.uid).update({Most_Recent_Location : current_location});
                }
            });
        }
    }, most_recent_location_time_interval);
}








/* -------------------------------------------------------
                        Firebase
------------------------------------------------------- */

/* ------------------- Firebase Connection ------------------- */

/* Function to create Firebase Connaction */
function Create_Firebase_Connection () {
    // import firebase file
    // var firebase = require("Firebase_Connection/js/firebase.js");

    Initialize_Firebase_SDK();

    /* Get a reference to the database service */
    FIREBASE_DATABASE = firebase.database();
}


/* Function to initialize firebase SDK */
function Initialize_Firebase_SDK () {
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

    /* ------------------- Test Only ------------------- */
    // try {
    //     firebase.functions().httpsCallable("addMessage")({text : "send"}).then(function(result) {
    //         console.log(2);

    //         alert("New Data: " + result.data.new_data + "\n" +
    //             "Number: " + result.data.number + "\n" +
    //             "Recieved Data: " + result.data.recieved_data + "\n"
    //         );
    //     });

    //     // var data = {
    //     //     tokens : ["eYPd8AJMGjg:APA91bF8EmSGpTdC9FAQbKcNaV2jTP4D0IwtHyqW6lTEMeqNZ1QY1tud781oI6qf9Ltuu3slOQz8kRGqHlymcSEdsK0EQZK2sxLV7l0Solu_i_n_TbZwK7vTCYJyvb9pSorh0NtC-2dK","eRYHAC13A-8:APA91bH6heFDdRPDj4m418HOKV2yt4UGgY3_yWpomS3XrIsNMXjmqTYzrBKNn2Y8A78o1XIxmxuWp7asebLBRJOj5oYMer_2Es49ZVyC4yTlDN-XTN6_Z1HFIbK9pu5mWJe8AYTsAbRI"],
    //     //     title : "A",
    //     //     body : "B",
    //     //     color : "#DAF7A6",
    //     // }

    //     // firebase.functions().httpsCallable("SendFCMNotificationFromClient")(data);
    // }
    // catch (error) {
    //     console.log(error);
    // }
    /* ------------------- End - Test Only ------------------- */
}





/* ------------------- Firebase Storage ------------------- */

/* Upload Profile Picture to the Firebase Storage
    file - Blob or File API to be used */
function Upload_To_Firebase_Storage (file_html_object, file_directory) {
    var file = file_html_object.files[0];
    var file_NAME = file_html_object.value.split(/(\\|\/)/g).pop();
    
    
    /* ---- Create a reference to the full path of the file, including the file name ---- */
    var storageRef = firebase.storage().ref(file_directory + file_NAME);  // Create a root reference


    /* ---- Upload from a Blob or File ---- */
    var uploadtask = storageRef.put(file).then(function(snapshot) {
        console.log('File Upload Successfull')
    });



    /* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
    /* ---- Create a reference to the full path of the file, inclusing the file name ---- */
    // var storageRef = firebase.storage().ref();  // Create a root reference
    
    // var fileRef = storageRef.child(file_NAME);  // Create a refernce to "file_NAME"
    // var file_Directory_and_Ref = storageRef.child(file_directory + file_NAME);    // Create a reference to "file_directory + file_NAME'"

    // /* While the file names are the same, the references point to different files */
    // fileRef.name === file_Directory_and_Ref.name    // true
    // fileRef.fullPath === file_Directory_and_Ref.fullPath    // false


    // /* ---- Upload from a Blob or File ---- */
    // file_Directory_and_Ref.put(file).then(function(snapshot) {
    //     console.log('Profile Picture Upload Successfull')
    // });
    /* -------------------------------------------------------------------------------- */
    /* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
}



function Download_From_Firebase_Storage (file_name, file_directory, form_id, file_type) {
    /* ---- Create a Reference  ---- */
    /* Method 1 - Create a reference with an initial file path and name */
    var storage = firebase.storage();
    var pathReference = storage.ref(file_directory + file_name);

    /* Method 2 - Create a reference from a Google Cloud Storage URI */
    // var gsReference = storage.refFromURL("gs://bucket/" + file_directory + file_name);

    /* Method 3 - Create a reference from an HTTPS URL
        Note that in the URL, charcters are URL escaped! */
    // var httpsReference = storage.refFromURL("https://firebasestorage.googleapis.com/b/bucket/o/" + file_directory.replace("/","") + "%20" +  file_name);


    var url_value;
    /* ---- Download Data via URL ---- */
    pathReference.getDownloadURL().then(function(url) {
    // return pathReference.child(file_directory + file_name).getDownloadURL().then(function(url) {
        // 'url' is the download URL for 'file_directory + file_name'

        // Method 1 - This can be downloaded directly:
        // var xhr = new XMLHttpRequest();
        // xhr.responseType = 'blob';
        // xhr.onload = function(event) {
        //     var blob = xhr.response;
        // };
        // xhr.open('GET', url);
        // xhr.send();

        

        // Method 2 - Or inserted  into an <img> element:
        // var img = document.getElementById("myimg");
        // img.src = url;
        
        
        // Method 3 - Convert URL to 'file' object - (Found after research)
        // var bytestring = atob(url.split(',')[1]);
        // var ab = new ArrayBuffer(byteString.length);
        // var ia = new Uint8Array(ab);
        // for (var i = 0; i < byteString.length; i++) {
        //     ia[i] = byteString.charCodeAt(i);
        // }
        // var blob = new Blob([ia], { type: 'image/jpeg' });
        // var file = new File([blob], "image.jpg");

        
        // document.forms[form_id][file_type].value = url;
        console.log(url);
        
        return url;
    }).catch(function(error) {
        switch (error.code) {
            case 'storage/object-not-found' :
                // File doesn't exist
                break;

            case 'storage/unauthorized' :
                // User doesn't have permission to access the object
                break;

            case 'storage/canceled' :
                // User canceled the upload
                break;


            case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;
        }
        
        // Or
        // console.log(error);
    });
}






/* ------------------- Database - Query Functions ------------------- */

/* Function to delete some data from the Databse depending on requirement */
// function Delete_From_Database (data) {
//     if (data == "Account") {
//         firebase.database().ref("User/" + CURRENT_USER_ID).remove();
//     }

//     console.log("Delete " + data + " Successfull")
// }










/* -------------------------------------------------------
                    Login/Logout
------------------------------------------------------- */

/* To validate the Login Form */
function validate_Login_Form (form_id) {
    var email_id = document.forms[form_id]["EMAIL_ID"].value;
    if (email_id == "") {
		alert("Email_ID is compulsory.");
		return false;
	}

    var password = document.forms[form_id]["USER_PASSWORD"].value;
    if (password == "") {
		alert("Password is compulsory.");
		return false;
    }
    
    return true;
}



/* Contains operations to be performed after Logging In with valid credentials */ 
function Log_In (form_id) {
    USER_LOG_IN_in_PROCESS = true;
    
    var email_id = document.forms[form_id]["EMAIL_ID"].value;
    var user_password = document.forms[form_id]["USER_PASSWORD"].value;
    
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().signInWithEmailAndPassword(email_id, user_password).then(function() {
        clearInterval(LOG_IN_TIMER);
        
        // if (firebase.auth().currentUser.emailVerified) {
        // firebase.auth().currentUser.updateProfile({displayName: "Uditya Laad", photoURL: "https://firebasestorage.googleapis.com/v0/b/accident-management-system.appspot.com/o/qqqqqqqqqqq%2FScreen%20Shot%202018-12-30%20at%2016.23.24.png?alt=media&token=d02c0209-c62d-4b07-a193-3a15848bfbc4"});
            // firebase.auth().currentUser.sendEmailVerification();

            CURRENT_USER_ID = firebase.auth().currentUser.uid;

            if (document.forms[form_id]["REMEMBER_ME"].checked) {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            }
            else {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
            }

            console.log("just checking log in");

            Perform_Log_In_Functions(user_password);
        // }
        // else {
            // alert("You need to verify your Email-ID first. Go to your Mailbox and click the link that has been sent by us.");

            // firebase.auth().signOut();
            // Go_Back_To_Initial_State();
        // }
    }).catch(function (error) {
        USER_LOG_IN_in_PROCESS = false;

        alert(error.message);

        console.log (error);
    });
}






/* Contains functions to performed after authenticating the user */
function Perform_Log_In_Functions () {
    /* Prepare Map with Current_Location, Blackspots, Active Accidents, etc */
    // Set_Up_Map();
    Add_Markers_On_Map();

    /* Set the View_type of Map */
    firebase.database().ref("User/" + firebase.auth().currentUser.uid).once('value').then(function(user_snapshot) {
        var map_view_type = user_snapshot.child("Map_Configuration/View_Type").val();

        if (map_view_type == "Roadmap") {
            application_map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        }
        else if (map_view_type == "Satellite") {
            application_map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        }
        else if (map_view_type == "Hybrid") {
            application_map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
        else if (map_view_type == "Terrain") {
            application_map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        }
    }).catch(function(error) {
        console.log(error);
    });


    
    firebase.database().ref('User/' + CURRENT_USER_ID).once('value').then(function(snapshot) {
        /* Open Extension - To Set Up FCM Client */
        if (navigator.userAgent.match(/android/i)) {
            window.location = ("schemename://hostName/path?userId=" + firebase.auth().currentUser.uid);

            // if (snapshot.child("FCM_Token").val() == null) {/* To download Messaging Service extension - if not already present */
            //     alert("Please download & install the messaging service.");
            //     window.location = ("https://www.google.com/search?q=stay+safe&oq=stay+safe&aqs=chrome.0.0j69i61l2j0l3.2289j0j7&sourceid=chrome&ie=UTF-8");
            // }
        }
        else if (navigator.userAgent.match(/iPad|iPhone|iPod/i)) {
            alert(2);
        }
        else if (navigator.userAgent.match(/Windows/i)) {
            FIREBASE_MESSAGING = firebase.messaging();
            
            FIREBASE_MESSAGING.requestPermission().then(function() {
                console.log('Notification permission granted.');
                // TODO(developer): Retrieve an Instance ID token for use with FCM.
                // ...
                
                return FIREBASE_MESSAGING.getToken();
            }).then(function(token) {
                firebase.database().ref("User/" + CURRENT_USER_ID).update({FCM_Token : token});

                console.log(token);
                console.log("Token Updated To Database Successfully.");
            }).catch(function(err) {
                alert('Unable to get permission to notify.', err);
            });

            
            // FIREBASE_MESSAGING.onTokenRefresh().then(function() {
            //     FIREBASE_MESSAGING.getToken().then(function(refreshedToken) {
            //         firebase.database().ref("User/" + CURRENT_USER_ID).update({FCM_Token : refreshedToken});
                    
            //         console.log("Refreshed Token Updated To Database Successfully.");
            //     });
            // }).catch(function(err) {
            //     alert('Unable to refresh token.', err);
            // });

            
            FIREBASE_MESSAGING.onMessage(function(payload) {
                console.log(payload);
                alert(payload.notification.title + ":\n" + payload.notification.body);
                
                // ...
            });
        }

        
        CURRENT_USER_TYPE = snapshot.child("Role").val().replace(/ /g, "_");
        
        Reset_User_Filled_Forms();
        
        /* ------------------- Test Only ------------------- */
        Change_User(CURRENT_USER_TYPE);
        /* ------------------- End - Test Only ------------------- */

        document.getElementById("NAVBAR").style.display = "block";
        show_hide_content("HOME_PAGE");
        
        Load_User_Details_Forms();
        
        if ((CURRENT_USER_TYPE == "Simple_User")  ||  (CURRENT_USER_TYPE == "Vehicle_User")) {
            Display_Own_Accident_Confirmation();
        }
        
        
        /* ---------------------- To display User Content in Navbar ---------------------- */
        var profile_pictures = document.getElementsByClassName("Profile_Picture_Img");
        
        if (firebase.auth().currentUser.photoURL != null) {
            for (var i = 0; i < profile_pictures.length; i++) {
                profile_pictures[i].src = firebase.auth().currentUser.photoURL;
            }
        }
        else {
            if ((CURRENT_USER_TYPE == "Simple_User")  ||  (CURRENT_USER_TYPE == "Vehicle_User")) {
                if (snapshot.child("Gender").val() == "Male"  ||  snapshot.child("Gender").val() == "Other") {
                    for (var i = 0; i < profile_pictures.length; i++) {
                        profile_pictures[i].src = "img/Profile_Pictures/Male_Profile_Picture.jpg";
                    }
                }
                else if (snapshot.child("Gender").val() == "Female") {
                    for (var i = 0; i < profile_pictures.length; i++) {
                        profile_pictures[i].src = "img/Profile_Pictures/Female_Profile_Picture.jpg";
                    }
                }
            }
            else if (CURRENT_USER_TYPE == "Emergency_Service_User") {
                for (var i = 0; i < profile_pictures.length; i++) {
                    profile_pictures[i].src = "img/Profile_Pictures/Emergency_Service_User_Profile_Picture.png";
                }
            }
        }


        var user_names = document.getElementsByClassName("user-name");
        for (var i = 0; i < user_names.length; i++) {
           user_names[i].innerHTML = firebase.auth().currentUser.displayName;
        }
        
        var user_roles = document.getElementsByClassName("user-role");
        for (var i = 0; i < user_roles.length; i++) {
            user_roles[i].innerHTML = snapshot.child("Role").val();
        }
        
        // const isOnline = require('is-online');
        // isOnline({timeout: 1000}).then(online =>{
        //     if(online) {
        //         document.getElementById("Internet_Status_Logo").style.color = "green";
        //         document.getElementById("Internet_Status").innerHTML = "Online";
        //     }
        //     else {
        //         document.getElementById("Internet_Status_Logo").style.color = "red";
        //         document.getElementById("Internet_Status").innerHTML = "Offline";
        //     }
        // });
        

        var previous_status = "Offline";

        var internet_status_online = document.getElementsByClassName("user-status-Online");
        var internet_status_offline = document.getElementsByClassName("user-status-Offline");

        var interval = 100;
        var x = setInterval(function() {
            if (navigator.onLine) {
                if (previous_status == "Offline") {
                    for (var i = 0; i < internet_status_online.length; i++) {
                        internet_status_online[i].style.display = "block";
                        internet_status_offline[i].style.display = "none";
                    }

                    previous_status = "Online";
                }
            }
            else {
                if (previous_status == "Online") {
                    for (var i = 0; i < internet_status_online.length; i++) {
                        internet_status_online[i].style.display = "none";
                        internet_status_offline[i].style.display = "block";
                    }

                    previous_status = "Offline";
                }
            }
        }, interval);
        /* ------------------------------------------------------------------------------- */


        CURRENT_USER_ROLE = snapshot.child("Role").val();

        try {
            firebase.database().ref('User/' + CURRENT_USER_ID).on('value', function(dynamic_snapshot) {
                if ((dynamic_snapshot.child("Role").val() != null)  &&  (dynamic_snapshot.child("Role").val() != CURRENT_USER_ROLE)) {
                    CURRENT_USER_ROLE = dynamic_snapshot.child("Role").val();
                    Go_Back_To_Initial_State();
                }
            });
        }
        catch (error) {
            console.log(error);
        }


        try {
            firebase.database().ref('User/' + CURRENT_USER_ID + '/FCM_Token').on('value', function(dynamic_snapshot) {
                FCM_TOKEN = dynamic_snapshot.val();
                
                document.forms["Device_ID_Form"]["DEVICE_ID"].value = FCM_TOKEN;
            });
        }
        catch (error) {
            console.log(error);
        }
    }).catch(function(error) {
        console.log(error);
    });

    console.log ("Log in Successfull");
}




/* Function to Load the details of Logged In User into all forms */
function Load_User_Details_Forms () {
    Load_Accident_Scenario_List();
    Load_Reported_Zones();
    Load_Blackspot_List();

    if (CURRENT_USER_TYPE == "Vehicle_User") {
        Load_Vehicle_Details();

        Adjust_Blackbox_SubMenu_Content();
        Load_Blackbox_Status();
    }
    
    Load_Map_Configuration();
    // Load_Location_Settings();

    if (CURRENT_USER_TYPE == "Simple_User"  ||  CURRENT_USER_TYPE == "Vehicle_User") {
        Load_Emergency_Contact_List();
    }

    Load_Requests();
    Load_Confirmations();

    // Load_Messages();

    Load_My_Profile();
}






/* Contains operations to be performed after Logging Out of the Application */
function Log_Out (method) {
    if (method == "Direct") {
        if (confirm("Are you sure, you want to Log Out?")) {
            firebase.database().ref("User/" + firebase.auth().currentUser.uid).update({FCM_Token : null}).then(function() {
                console.log("Remove FCM Token Successfull");

                firebase.auth().signOut();
                Go_Back_To_Initial_State();
                
                console.log("Log Out Successfull");
            }).catch(function(error) {
                console.log("Remove FCM Token Unsuccessfull");
                console.log("Log Out Unsuccessfull");
                console.log(error);
            });
        }
    }
    else if (method == "Indirect") {
        firebase.auth().signOut();
        
        Go_Back_To_Initial_State();
    }
}



/* Make application go back to its initial state */
function Go_Back_To_Initial_State () {
    /* unsure unsure unsure unsure unsure unsure unsure */
    location.reload();
    /* unsure unsure unsure unsure unsure unsure unsure */


    /* ----------- Incorrect Method ----------- */
    // init();
    /* ---------------------------------------- */


    // document.getElementById("LOGIN_PAGE").style.display = "block";
    // show_hide_content("LOGIN_PAGE");


    /* ------------------- Test Only ------------------- */
    // document.getElementById("Simple_User_Type").checked = true;
    /* ------------------- End - Test Only ------------------- */


    console.log("Directly Go Back To Initial State Successfull");
}







/* -------------------------------------------------------
                Forgot Password
------------------------------------------------------- */
/* To validate Verify_User_Credentials_Form */
function validate_Verify_User_Credentials_Form (form_id) {
    return true;
}


/* Function to verify Email ID with Security Questions (i.e.: To verify user credentials) */
function Verify_User_Credentials (form_id) {
    var email_id = document.forms[form_id]["EMAIL_ID"].value;

    firebase.auth().sendPasswordResetEmail(email_id).then(function() {
        alert ("Link to reset the password has been sent to " + email_id);

        Go_Back_To_Initial_State();

        console.log("Verify User Credentials Successfull");
    }).catch(function (error) {
        alert (error.message);

        console.log (error);
    });
}



/* To validate Reset_Password_Form OR/AND Change_Password_Logged_In_Form */
function validate_Reset_Password_OR_Change_Password_Form (form_id) {
    var new_password_1 = document.forms[form_id]["NEW_PASSWORD_1"].value;
    var new_password_2 = document.forms[form_id]["NEW_PASSWORD_2"].value;

    if (new_password_1 != new_password_2) {
        document.getElementById(form_id + "_Password_Match").style.color = "Red";
        document.getElementById(form_id + "_Password_Match").innerHTML = "Not Matching";

        return false;
    }


    return true;
}



/* Function to change User Account Password */
function Change_Password (form_id) {
    var new_password_1 = document.forms[form_id]["NEW_PASSWORD_1"].value;
    // var new_password_2 = document.forms[form_id]["NEW_PASSWORD_2"].value;
    
    try {
        /* Update New Password to the Database */
        firebase.auth().currentUser.updatePassword(new_password_1).then(function() {
            alert ("Password has been changed successfully");

            Display_My_Profie_Window();

            Reset_User_Filled_Forms();
            // Switch_Close_and_Go_Back_Buttons("Close Button");

            console.log ("Change Password Successfull");
        });
    }
    catch (error) {
        alert (error.meassage());

        console.log (error);
    }
}




function check_2_passwords () {
    form_id = "Change_Password_Logged_In_Form";

    var new_password_1 = document.forms[form_id]["NEW_PASSWORD_1"].value;
    var new_password_2 = document.forms[form_id]["NEW_PASSWORD_2"].value;

    if (new_password_1 == new_password_2) {
        document.getElementById(form_id + " _Password_Match").style.color = "Green";
        document.getElementById(form_id + " _Password_Match").innerHTML = "Matching";
    }
    else {
        document.getElementById(form_id + " _Password_Match").style.color = "Red";
        document.getElementById(form_id + " _Password_Match").innerHTML = "Not Matching";
    }
}







/* -------------------------------------------------------
                Own Accident Confirmation
------------------------------------------------------- */

/* Function to display Own_Accident_Confirmation modal to the user
    - When accident_scenario with 'Weight = [1,2]' is added to the database */
function Display_Own_Accident_Confirmation () {
    try {
        firebase.database().ref("Accident_Confirmation/").on("value", function(confirmation_snapshot) {
            confirmation_snapshot.forEach(function(confirmation_childSnapshot) {
                if ((confirmation_childSnapshot.child("User").val() == CURRENT_USER_ID)  &&  (confirmation_childSnapshot.child("Confirmation_Type").val() == "Confirm own accident")  &&  (confirmation_childSnapshot.child("Response").val() == "Pending")) {
                    var time_sec = 0;   // Time elapased in seconds
                    
                    var accident_confirmation_time_interval = 1000;
                    OWN_ACCIDENT_CONFIRMATION_TIMER = setInterval(function() {
                        if (time_sec < 15) {
                            document.getElementById("Confirm_Accident_Modal").setAttribute("Accident_Confirmation_ID", confirmation_childSnapshot.key);
                            
                            if (time_sec == 0) {
                                $("#Confirm_Accident_Modal").modal('show');
                            }
                            
                            confirmation_initiated = true;
                            
                            console.log(time_sec);

                            time_sec++;
                        }
                        else {
                            $("#Confirm_Accident_Modal").modal('hide');
                            
                            Accept_Confirmation(confirmation_childSnapshot.key, "Confirm own accident", CURRENT_USER_ID);
    
                            clearInterval(OWN_ACCIDENT_CONFIRMATION_TIMER);
                        }
                    }, accident_confirmation_time_interval);
                }
            });
        });
    }
    catch(error) {
        console.log(error);
    }
}


/* Function to apply the respose of Own_Accident_Confirmation by the user */
function Accept_OR_Reject_Own_Accident (response) {
    $("#Confirm_Accident_Modal").modal('hide');
    clearInterval(OWN_ACCIDENT_CONFIRMATION_TIMER);

    var confirmation_id = document.getElementById("Confirm_Accident_Modal").getAttribute("Accident_Confirmation_ID");

    if (response == "Accept") {
        Accept_Confirmation(confirmation_id, "Confirm own accident", CURRENT_USER_ID);
    }
    else if (response == "Reject") {
        Change_Confirmation_Response(confirmation_id, "Rejected");
    }
}








/* -------------------------------------------------------
            Required - Important Functions
------------------------------------------------------- */
/* Show & hide - Cancel & Go_Back Buttons, as per requirement */
function Switch_Close_and_Go_Back_Buttons (button_to_display) {
    var close_buttons = document.getElementsByClassName("fa fa-close");
    var go_back_buttons = document.getElementsByClassName("fa fa-arrow-left");

    var close_button_display;
    var go_back_button_display;

    if (button_to_display == "Close Button") {
        close_button_display = "block";
        go_back_button_display = "none";
        console.log("close");
    }
    else if (button_to_display == "Go Back Button") {
        close_button_display = "none";
        go_back_button_display = "block";
        console.log("go back");
    }


    for (var i = 0; i < close_buttons.length; i++) {
        close_buttons[i].style.display = close_button_display;
    }

    for (var i = 0; i < go_back_buttons.length; i++) {
        go_back_buttons[i].style.display = go_back_button_display;
    }
}







/* -------------------------------------------------------
                Necessary Functions
------------------------------------------------------- */

/* ----------------------------------- Not Used ----------------------------------- */
/* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
/* Function to dynamically generate Common_Content of different forms */
// function Load_Common_Form_Content (form_id) {
//     /* Specifies the Common_Table_Content - To be displayed first */
//     var common_form_content;
    
//     /* Specifies the Unique_Table_Content - To be displayed last */
//     var unique_form_content;


//     if ((form_id == "Sign_Up_Simple_User_Form")  ||  (form_id == "Sign_Up_Vehicle_User_Form")  ||  (form_id == "My_Profile_Simple_User_Form")  ||  (form_id == "My_Profile_Vehicle_User_Form")) {
//         common_form_content = '<tr>' +
//                     '<th> Full Name </th>' +
//                     '<td>' +
//                         '<input type="text" name="FIRST_NAME" placeholder=" First Name" required>  &nbsp &nbsp' +
//                         '<input type="text" name="MIDDLE_NAME" placeHolder=" Middle Name" > &nbsp &nbsp' +
//                         '<input type="text" name="LAST_NAME" placeholder=" Last Name" required>' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Email ID </th>' +
//                     '<td> <input type="email" name="EMAIL_ID" placeholder=" Email ID"> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Alternate Email ID </th>' +
//                     '<td> <input type="email" name="ALTERNATE_EMAIL_ID" placeholder=" Alternate Email ID" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Contact Number </th>' +
//                     '<td> <input type="number" name="CONTACT_NUMBER" placeholder=" Contact Number" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Alternate Contact Number </th>' +
//                     '<td> <input type="number" name="ALTERNATE_CONTACT_NUMBER" placeholder=" Alternate Contact Number"> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Nationality </th>' +
//                     '<td>' +
//                         '<select name="NATIONALITY" class="' + form_id + '_Nationality_Class" id="' + form_id + '_Nationality" required>' +
//                             '<option value="" disabled selected> Select your choice </option>' +
//                             '<option value="afghan">Afghan</option>' +
//                             '<option value="albanian">Albanian</option>' +
//                             '<option value="algerian">Algerian</option>' +
//                             '<option value="american">American</option>' +
//                         '</select>' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Date of Birth </th>' +
//                     '<td> <input type="date" name="DOB" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Gender </th>' +
//                     '<td>' +
//                         '<input type="radio" name="GENDER" id="' + form_id + '_MALE" value="Male" required> Male &nbsp' +
//                         '<input type="radio" name="GENDER" id="' + form_id + '_FEMALE" value="Female"> Female &nbsp' +
//                         '<input type="radio" name="GENDER" id="' + form_id + '_OTHER" value="Other"> Other' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Address </th>' +
//                     '<td>' +
//                         '<input type="number" name="HOUSE_NO_OR_FLAT_NO" placeHolder=" House No. / Flat No." required> &nbsp &nbsp' +
//                         '<input type="text" name="STREET_OR_BUILDING_OR_COLONY" placeholder=" Street / Building / Colony" required> &nbsp &nbsp' +
//                         '<input type="text" name="CITY" placeholder=" City" required> <br> <br>' +
//                         '<input type="text" name="STATE" placeholder=" State" required> &nbsp &nbsp' +
//                         '<input type="text" name="COUNTRY" placeholder=" Country" required> &nbsp &nbsp' +
//                         '<input type="number" name="POSTAL_CODE" placeholder=" Postal Code" required>' +

//                         '<br> <br>' +

//                         '<input type="text" name="COORDINATES" placeholder=" Coordinates" required>' +
//                         '<input type="button" value="Update" onclick="javascript: fetch_location(' + "'" + form_id + "'" + ');">' +
//                     '</td>' +
//                 '</tr>';
                
                

//         console.log(form_id);
//     }
//     else if ((form_id == "Sign_Up_Emergency_Service_User_Form")  ||  (form_id == "My_Profile_Emergency_Service_User_Form")) {
//         common_form_content = '<tr>' +
//                     '<th> Name </th>' +
//                     '<td> <input type="text" name="NAME" placeholder=" Name" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Email ID </th>' +
//                     '<td> <input type="email" name="EMAIL_ID" placeholder=" Email ID" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Alternate Email ID </th>' +
//                     '<td> <input type="email" name="ALTERNATE_EMAIL_ID" placeholder=" Alternate Email ID"> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Contact Number </th>' +
//                     '<td> <input type="number" name="CONTACT_NUMBER" placeholder=" Contact Number" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Alternate Contact Number </th>' +
//                     '<td> <input type="number" name="ALTERNATE_CONTACT_NUMBER" placeholder=" Alternate Contact Number"> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Service Type </th>' +
//                     '<td>' +
//                         '<select name="SERVICE_TYPE" required>' +
//                             '<option value="" disabled selected> Select your choice </option>' +
//                             '<option value="Air Ambulance"> Air Ambulance </option>' +
//                             '<option value="Ambulance"> Ambulance </option>' +
//                             '<option value="Disaster Management"> Disaster Management </option>' +
//                             '<option value="Fire"> Fire </option>' +
//                             '<option value="Police"> Police </option>' +
//                             '<option value="Public Works Department (PWD)"> PWD </option>' +
//                         '</select>' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Date of Establishment </th>' +
//                     '<td> <input type="date" name="DOE" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Government Organization? </th>' +
//                     '<td>' +
//                         '<input type="radio" name="GOVERNMENT_ORGANIZATION" id="' + form_id + '_GOVERNMENT_ORGANIZATION_YES" value="Yes"  required> Yes &nbsp &nbsp' +
//                         '<input type="radio" name="GOVERNMENT_ORGANIZATION" id="' + form_id + '_GOVERNMENT_ORGANIZATION_NO" value="No"> No' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Government Authorized? </th>' +
//                     '<td>' +
//                         '<input type="radio" name="GOVERNMENT_AUTHORIZED" id="' + form_id + '_GOVERNMENT_AUTHORIZED_YES" value="Yes"  required> Yes &nbsp &nbsp' +
//                         '<input type="radio" name="GOVERNMENT_AUTHORIZED" id="' + form_id + '_GOVERNMENT_AUTHORIZED_NO" value="No"> No' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Address </th>' +
//                     '<td>' +
//                         '<input type="number" name="HOUSE_NO_OR_FLAT_NO" placeHolder=" House No. / Flat No." required> &nbsp &nbsp' +
//                         '<input type="text" name="STREET_OR_BUILDING_OR_COLONY" placeholder=" Street / Building / Colony" required> &nbsp &nbsp' +
//                         '<input type="text" name="CITY" placeholder=" City" required> <br> <br>' +
//                         '<input type="text" name="STATE" placeholder=" State" required> &nbsp &nbsp' +
//                         '<input type="text" name="COUNTRY" placeholder=" Country" required> &nbsp &nbsp' +
//                         '<input type="number" name="POSTAL_CODE" placeholder=" Postal Code" required>' +

//                         '<br> <br>' +

//                         '<input type="text" name="COORDINATES" placeholder=" Coordinates" required>' +
//                         '<input type="button" value="Update" onclick="javascript: fetch_location(' + "'" + form_id + "'" + ');">' +
//                     '</td>' +
//                 '</tr>';



//         console.log(form_id);
//     }
//     else if ((form_id == "Change_Password_Logged_In_Form")  ||  (form_id == "Reset_Password_Form")) {
//         common_form_content = '<tr>' +
//                     '<th> New Password </th>' +
//                     '<td> <input type="password" name="NEW_PASSWORD_1" placeHolder=" New Password" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Re-enter New Password </th>' +
//                     '<td>' +
//                         '<input type="password" name="NEW_PASSWORD_2" placeHolder=" Re-enter New Password" required>' +
//                         '<span id="Change_Password_Logged_In_Form_Password_Match"></span>' +
//                     '</td>' +
//                 '</tr>';


//         console.log(form_id);
//     }
//     else if ((form_id == "Report_Unsafe_Zone_Form")  ||  (form_id == "Add_Blackspot_Form")  ||  (form_id == "View_Blackspot_Form")  ||  (form_id == "View_Zone_Form")) {
//         common_form_content = '<tr>' +
//                     '<th> Location </th>' +

//                     '<td>' +
//                         '<input type="text" name="COORDINATES" placeholder=" Coordinates" required>' +
//                         '<input type="button" value="Update" onclick="javascript: fetch_location(' + "'" + form_id + "'" + ');">' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Image </th>' +
//                     '<td> <input type="file" name="IMAGE" accept="image/*" capture="capture"/> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Level of Risk </th>' +
//                     '<td>' +
//                         '<select name="LEVEL_OF_RISK" required>' +
//                             '<option value="" disabled selected> Select your choice </option>' +
//                             '<option value="Very High"> Very High </option>' +
//                             '<option value="High"> High </option>' +
//                             '<option value="Medium"> Medium </option>' +
//                             '<option value="Low"> Low </option>' +
//                             '<option value="Very Low"> Very Low </option>' +
//                         '</select>' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Description </th>' +
//                     '<td> <textarea name="DESCRIPTION" placeholder=" Description" rows="4" cols="30"> </textarea> </td>' +
//                 '</tr>';
                
                
//         console.log(form_id);
//     }
//     else if ((form_id == "View_Vehicle_Details_Form")  ||  (form_id == "Add_Vehicle_Details_Form")) {
//         common_form_content = '<tr>' +
//                     '<th> Registration Number </th>' +
//                     '<td>' +
//                         '<input type="text" name="VEHICLE_REGISTRATION_NUMBER" placeholder=" Registration Number" required>' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Model </th>' +
//                     '<td> <input type="text" name="VEHICLE_MODEL" placeholder=" Model" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> RC Number </th>' +
//                     '<td> <input type="text" name="VEHICLE_RC_NUMBER" placeholder=" RC Number" required> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Insurance Number </th>' +
//                     '<td> <input type="text" name="VEHICLE_INSURANCE_NUMBER" placeholder=" Insurance Number"> </td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Safety Features</th>' +
//                     '<td>' +
//                         '<input type="checkbox" name="AIRBAGS"> Airbags  &nbsp &nbsp &nbsp' +
//                         '<input type="checkbox" name="ALL_WHEEL_DRIVE"> All-Wheel Drive' +
//                         '<br>' +
//                         '<input type="checkbox" name="ABS"> ABS  &nbsp &nbsp &nbsp' +
//                         '<input type="checkbox" name="ELECTRONIC_STABILITY_CONTROL"> Electronic Stability Control' +
//                     '</td>' +
//                 '</tr>' +

//                 '<tr>' +
//                     '<th> Vehicle Health </th>' +
//                     '<td>' +
//                         '<select name="VEHICLE_HEALTH" required>' +
//                             '<option value="" disabled> Select your choice </option>' +
//                             '<option value="Very Good"> Very Good </option>' +
//                             '<option value="Good"> Good </option>' +
//                             '<option value="Average"> Average </option>' +
//                             '<option value="Bad"> Bad </option>' +
//                             '<option value="Very Bad"> Very Bad </option>' +
//                         '</select>' +
//                     '</td>' +
//                 '</tr>';
                
                
//         console.log(form_id);
//     }
//     else {
//         console.log(form_id + "---- Not Found ----");
//     }


//     unique_form_content = document.getElementById(form_id + "_Table_Body").innerHTML;
    
//     document.getElementById(form_id + "_Table_Body").innerHTML = common_form_content + unique_form_content;
// }
/* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
/* ----------------------------------- Not Used ----------------------------------- */



/* Shows and/or hides different elements based on user needs
    e - Element to show */
function show_hide_content (e) {
    $(document).ready(function() {
        // Toogle Off the Navigation Bar
        $(".page-wrapper").removeClass("toggled");

        // Turn Off Background Image at the start
        // $(".toggle-bg").trigger("change");
    });


    /* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
        // Load_User_Details_Forms();
    /* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */


    if (e == "LOGIN_PAGE") {
        document.getElementById("LOGIN_PAGE").style.display = "block";
    }
    else {
        document.getElementById("LOGIN_PAGE").style.display = "none";
    }


    if (e == "HOME_PAGE") {
        document.getElementById("Home_Page_Title").style.display = "block";
        document.getElementById("Map_Inputs_Form").style.display = "block";
        document.getElementById("googleMap").style.display = "block";
        document.getElementById("One_Click_Help_Button").style.display = "block";
    }
    else {
        document.getElementById("Home_Page_Title").style.display = "none";
        document.getElementById("Map_Inputs_Form").style.display = "none";
        document.getElementById("googleMap").style.display = "none";
        document.getElementById("One_Click_Help_Button").style.display = "none";
    }


    var content_element = document.getElementsByClassName("Main_Page_Content");

    var i;
    for (i=0; i < content_element.length; i++) {
        if (content_element[i].id == e) {
            document.getElementById(content_element[i].id).style.display = "block";
        }
        else {
            document.getElementById(content_element[i].id).style.display = "none"; 
        }
    }


    console.log("--------------------  +++++++++++++++++++++ ++++++++++++++++++ ----------------------------------");
    /* To go back to initial page (of each navbar option) on click of a Navbar option */
    if (firebase.auth().currentUser != null) {
        console.log(firebase.auth().currentUser.email);
        console.log("--------------------  +++++++++++++++++++++ ++++++++++++++++++ ----------------------------------");


        Display_Accident_Scenario_List("Pending");
        Display_Accident_Scenario_List("Cleared");

        Display_Reported_Zone_List();
        Display_Blackspot_List();

        Display_Emergency_Contact_List_Window();
        
        // Display_Message_List();
        
        Display_My_Profie_Window();
    }

    console.log("something");
}





/* unsure unsure unsure unsure unsure unsure unsure unsure unsure unsure unsure unsure unsure */

// function Load_Initial_Pages () {

// }

/* unsure unsure unsure unsure unsure unsure unsure unsure unsure unsure unsure unsure unsure */




/* Reset/Clear all the user-filled forms */
function Reset_User_Filled_Forms () {
    var user_filled_forms = document.getElementsByClassName("User_Filled_Forms");
    for (var i = 0; i < user_filled_forms.length; i++) {
        user_filled_forms[i].reset();
    }

    console.log("Reset User Filled Forms Succesfull");
}





/* To Verify the User Account's current Password (i.e.: to verify the user) */
function Verify_Current_Password (form_id) {
    var current_password = document.forms[form_id]["CURRENT_PASSWORD"].value;

    var credential = firebase.auth.EmailAuthProvider.credential (
        firebase.auth().currentUser.email,
        current_password
    );
    
    firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
        firebase.database().ref("User/" + CURRENT_USER_ID).once('value').then(function(user_snapshot) {
            if (form_id == "Verify_Current_Password_Form_FOR_Remove_Blackbox") {
                user_snapshot.ref.update({Blackbox_ID : ""});

                firebase.database().ref("Blackbox/" + user_snapshot.child("Blackbox_ID").val()).update({User_ID : null}).then(function() {
                    // show_hide_content('HOME_PAGE');
                    // Reset_User_Filled_Forms();

                    console.log ("Remove Blackbox Successfull");
                    alert("Blackbox removed successfully.");

                    Go_Back_To_Initial_State();
                });
            }
            else if (form_id == "Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account") {
                if (document.forms[form_id]["TASK"].value == "Change Password") {
                    document.getElementById("My_Profile_Form").style.display = "none";
                    document.getElementById("Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account").style.display = "none";
                    document.getElementById("Change_Password_Logged_In_Form").style.display = "block";

                    console.log ("Change Pasword Successfull");
                }
                else if (document.forms[form_id]["TASK"].value == "Delete Account") {
                    Delete_Account();
                }
    
    
                console.log ("Verify Current Password Successfull");
            }
            else if (form_id == "Verify_Current_Password_Form_FOR_Switch_User_Type") {
                if (CURRENT_USER_TYPE == "Simple_User") {
                    document.getElementById("Verify_Current_Password_Form_FOR_Switch_User_Type").style.display = "none";
                    document.getElementById("Add_Vehicle_Details_Form").style.display = "block";

                    console.log ("Verify Current Password Successfull");
                    console.log ("Switch to Vehicle User Type Successfull");
                }
                else if (CURRENT_USER_TYPE == "Vehicle_User") {
                    if (confirm("Switching to simple user will erase details related to your Vehicle and Blackbox device. Do you still want to continue?")) {
                        firebase.database().ref("Request/").once("value").then(function(request_snapshot) {
                            request_snapshot.forEach(function(request_childSnapshot) {
                                if ((request_childSnapshot.child("Request_Type").val() == "Pass Vehicle Control")  &&  (request_childSnapshot.child("Response").val() == "Pending")  &&  (request_childSnapshot.child("From").val() == firebase.auth().currentUser.email)) {
                                    request_childSnapshot.ref.update({Response : "Force Cancelled"});
                                    alert("abc");
                                }
                            });
                            
                            
                            if (BLACKBOX_ID != "") {
                                firebase.database().ref("Blackbox/" + BLACKBOX_ID).update({User_ID : null}).then (function() {
                                    Switch_To_Simple_User ();
                                });
                            }
                            else {
                                Switch_To_Simple_User ();
                            }
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }
                }
            }

            Reset_User_Filled_Forms();
        }).catch(function (error) {
            alert(error.message);

            console.log (error);
        });
    }).catch(function (error) {
        alert(error.message);

        if (error.code.split("/")[1] == "wrong-password") {
            Log_Out("Indirect");
        }

        console.log (error);
    });
}





/* Function to switch from Simple_User_Type to Vehicle_User_Type
    i.e: - Delete Blackbox, Vehicle
         - Update Role
    Note: Updating "Occupied" status of Blackbox is already done in the calling function */
function Switch_To_Simple_User () {
    var user_type = "Simple_User";

    try {
        firebase.database().ref("User/" + CURRENT_USER_ID + "/Blackbox_ID").remove().then(function() {
            firebase.database().ref("User/" + CURRENT_USER_ID + "/Vehicle").remove().then(function() {
                alert ("Switched to " + user_type + " type successfully.");
                
                console.log ("Verify Current Password Successfull");
                console.log ("Switch to Simple User Type Successfull");
                
                firebase.database().ref("User/" + CURRENT_USER_ID).update({Role : user_type.replace(/_/g, " ")}).then(function() {
                    // Change_User(user_type);
                    
                    // show_hide_content(user_type);
    
                    // alert ("Switched to " + user_type + " type successfully.");
                    
                    // Go_Back_To_Initial_State();
    
                    // console.log ("Verify Current Password Successfull");
                    // console.log ("Switch to Simple User Type Successfull");
                });
            });
        });
    }
    catch (error) {
        console.log(error);
    }
}







/* ---- Bad Practice - multiple if_else checks will slow down the validation process ---- */
/* To validate forms - which require additional validation
    (on top of validation - done by html input "type") */
function validate_Form (form_id) {
    return true;
}
/* -------------------------------------------------------------- */






/* ------------------- Test Only ------------------- */
/* To toggle between users for specific features */
function Change_User (user_type) {
    console.log(user_type + " qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");

    form_id = "Sign_Up_User_Type_Form";

    Display_Home_Page_Content(user_type);
    
    Display_Navbar_Content(user_type);

    CURRENT_USER_TYPE = user_type;
    
    Display_My_Profie_Window();
    Display_Pass_Vehicle_Control_AND_Switch_User_Type_Window();

    Reset_User_Filled_Forms();
}





/* Function to load/display Navbar content */
function Display_Navbar_Content (user_type) {
    if (user_type == "Simple_User") {
        document.getElementById("HOME_NAVIGATION").style.display = "block";

        document.getElementById("ACCIDENT_SCENARIO_NAVIGATION").style.display = "block";
        document.getElementById("VIEW_PENDING_ACCIDENT_SCENARIOS_SUBMENU").style.display = "none";
        document.getElementById("VIEW_CLEARED_ACCIDENT_SCENARIOS_SUBMENU").style.display = "none";
        
        document.getElementById("REPORT_UNSAFE_ZONE_NAVIGATION").style.display = "block";
        document.getElementById("BLACKSPOTS_NAVIGATION").style.display = "none";
        

        document.getElementById("VEHICLE_NAVIGATION").style.display = "none";
        document.getElementById("BLACKBOX_NAVIGATION").style.display = "none";
        // document.getElementById("DEVICE_CONFIGURATION_NAVIGATION").style.display = "none";
        document.getElementById("MAP_&_LOCATION_NAVIGATION").style.display = "block";
        document.getElementById("EMERGENCY_CONTACT_NAVIGATION").style.display = "block";


        document.getElementById("REQUESTS_NAVIGATION").style.display = "block";
        document.getElementById("CONFIRMATIOINS_NAVIGATION").style.display = "block";
    }
    else if (user_type == "Vehicle_User") {
        document.getElementById("HOME_NAVIGATION").style.display = "block";

        document.getElementById("ACCIDENT_SCENARIO_NAVIGATION").style.display = "block";
        document.getElementById("VIEW_PENDING_ACCIDENT_SCENARIOS_SUBMENU").style.display = "none";
        document.getElementById("VIEW_CLEARED_ACCIDENT_SCENARIOS_SUBMENU").style.display = "none";
        
        document.getElementById("BLACKSPOTS_NAVIGATION").style.display = "none";
        
        
        document.getElementById("VEHICLE_NAVIGATION").style.display = "block";
        document.getElementById("BLACKBOX_NAVIGATION").style.display = "block";
        // document.getElementById("DEVICE_CONFIGURATION_NAVIGATION").style.display = "block";
        document.getElementById("MAP_&_LOCATION_NAVIGATION").style.display = "block";
        document.getElementById("EMERGENCY_CONTACT_NAVIGATION").style.display = "block";


        document.getElementById("REQUESTS_NAVIGATION").style.display = "block";
        document.getElementById("CONFIRMATIOINS_NAVIGATION").style.display = "block";
    }
    else if (user_type == "Emergency_Service_User") {
        document.getElementById("HOME_NAVIGATION").style.display = "block";

        document.getElementById("ACCIDENT_SCENARIO_NAVIGATION").style.display = "block";
        document.getElementById("VIEW_PENDING_ACCIDENT_SCENARIOS_SUBMENU").style.display = "block";
        document.getElementById("VIEW_CLEARED_ACCIDENT_SCENARIOS_SUBMENU").style.display = "block";

        document.getElementById("REPORT_UNSAFE_ZONE_NAVIGATION").style.display = "none";
        document.getElementById("BLACKSPOTS_NAVIGATION").style.display = "block";
        

        document.getElementById("VEHICLE_NAVIGATION").style.display = "none";
        document.getElementById("BLACKBOX_NAVIGATION").style.display = "none";
        // document.getElementById("DEVICE_CONFIGURATION_NAVIGATION").style.display = "none";
        document.getElementById("MAP_&_LOCATION_NAVIGATION").style.display = "block";
        document.getElementById("EMERGENCY_CONTACT_NAVIGATION").style.display = "none";

        
        document.getElementById("REQUESTS_NAVIGATION").style.display = "none";
        document.getElementById("CONFIRMATIOINS_NAVIGATION").style.display = "none";
    }
}




/* Function to load/display Home-Page content */
function Display_Home_Page_Content (user_type) { 
    if (user_type == "Simple_User") {
        document.getElementById("One_Click_Help_Button").style.visibility = "visible";
    }
    else if (user_type == "Vehicle_User") {
        document.getElementById("One_Click_Help_Button").style.visibility = "visible";
    }
    else if (user_type == "Emergency_Service_User") {
        document.getElementById("One_Click_Help_Button").style.visibility = "hidden";
    }
}




/* ------------------- End - Test Only ------------------- */











/* -------------------------------------------------------
                  General Features
------------------------------------------------------- */

/* 'Ask for help' on single click of a button */
function Ask_Confirmation_FOR_One_Click_Help () {
    console.log("Help is coming.");

    var time_sec = 0;   // Time elapased in seconds
    
    var one_click_help_confirmation_time_interval = 1000;
    ONE_CLICK_HELP_CONFIRMATION_TIMER = setInterval(function() {
        if (time_sec < 15) { 
            if (time_sec == 0) {
                $("#Confirm_One_Click_Help_Modal").modal('show');
            }
            
            confirmation_initiated = true;
            
            console.log(time_sec);

            time_sec++;
        }
        else {
            $("#Confirm_One_Click_Help_Modal").modal('hide');
            
            Accept_OR_Reject_One_Click_Help_Confirmation("Accept");

            clearInterval(ONE_CLICK_HELP_CONFIRMATION_TIMER);
        }
    }, one_click_help_confirmation_time_interval);
}


/* Function to confirm that the user is in need of help */
function Accept_OR_Reject_One_Click_Help_Confirmation (response) {
    $("#Confirm_One_Click_Help_Modal").modal('hide');
    clearInterval(ONE_CLICK_HELP_CONFIRMATION_TIMER);

    if (response == "Accept") {
        firebase.database().ref("User/" + CURRENT_USER_ID).once("value").then(function(user_snapshot) {
            var weight = 3;

            var data = {
                Blackbox : user_snapshot.child("Blackbox_ID").val(),
                Date_And_Time : String(new Date()),
                Description : "The use has asked for help.",
                Location_Coordinates : CURRENT_LOCATION_COORDINATES,
                Status : "Pending",
                Uploaded_By : CURRENT_USER_ID,
                User : CURRENT_USER_ID,
                Vehicle_Registration_Number : user_snapshot.child("Vehicle").child("Registration_No").val(),
                Weight : weight
            };

            var image = document.getElementById("EMPTY_FILE");
            console.log(image.files.length);
            Add_To_Database_For_Accident_Possibility(data, "Accident_Possibility", image);
        }).catch(function(error) {
            console.log(error);
        });
    }
    else if (response == "Reject") {
        // Do nothing
    }
}





/* Function to generate report of a cleared Accident_Scenario */
function Download_Accident_Scenario_Report (form_id) {
    var table = document.getElementById("Accident_Scenario_Report_Table_FOR_Download");
    
    table.innerHTML = '<tbody">' +
                        '<!-- ---------------- Unique Content ---------------- -->' +
                        '<tr>' +
                            '<th> Accident Scenario ID </th>' +
                            '<td>' +  document.forms[form_id]["ID"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> User </th>' +
                            '<td>' +  document.forms[form_id]["USER"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Blackbox </th>' +
                            '<td>' +  document.forms[form_id]["BLACKBOX"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Uploaded_By </th>' +
                            '<td>' +  document.forms[form_id]["UPLOADED_BY"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Weight </th>' +
                            '<td>' +  document.forms[form_id]["WEIGHT"].value + '</td>' +
                        '</tr>' +

                        '<!-- ---------------- End - Unique Content ---------------- -->' +
                        

                        '<!-- ---------------- Super Unique Content ---------------- --></tr>' +
                        '<tr>' +
                            '<th> Date & Time of Clearance </th>' +
                            '<td>' +  document.forms[form_id]["DATE_AND_TIME_OF_CLEARANCE"].value + '</td>' +
                        '</tr>' +
                        '<!-- ---------------- End - Super Unique Content ---------------- --></tr>' +


                        '<!-- ---------------- Common Content ---------------- -->' +
                        '<tr>' +
                            '<th> Vehicle Registration No. </th>' +
                            '<td>' +  document.forms[form_id]["VEHICLE_REGISTRATION_NUMBER"].value + '</td>' +
                        '</tr>' +
                        
                        '<tr>' +
                            '<th> Location </th>' +
                            '<td>' +  document.forms[form_id]["COORDINATES"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Level of Risk </th>' +
                            '<td>' +  document.forms[form_id]["LEVEL_OF_RISK"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Cause of Accident </th>' +
                            '<td>' +  document.forms[form_id]["CAUSE_OF_ACCIDENT"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Number of Survivors </th>' +
                            '<td>' +  document.forms[form_id]["NUMBER_OF_SURVIVORS"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Number of Injured People </th>' +
                            '<td>' +  document.forms[form_id]["NUMBER_OF_INJURED_PEOPLE"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Number of Non-Survivors </th>' +
                            '<td>' +  document.forms[form_id]["NUMBER_OF_NON_SURVIVORS"].value + '</td>' +
                        '</tr>' +

                        '<tr>' +
                            '<th> Description </th>' +
                            '<td>' +  document.forms[form_id]["DESCRIPTION"].value + '</td>' +
                        '</tr>' +
                        '<!-- ---------------- End - Common Content ---------------- -->' +
                    '</tbody>';


    var doc = new jsPDF('p', 'pt');

    doc.setFontSize(22);
    doc.text(40, 100, "Accident Report");

    // var image = new Image();
    // console.log(document.getElementById("Cleared_Accident_Scenario_Image_Object_ID").src);
    // image.src = String(document.getElementById("Cleared_Accident_Scenario_Image_Object_ID").src);
    
    // imageData = getBase64Image(image);

    // doc.addImage(imageData, 'JPEG', 10, 10, 50, 50);

    // html2canvas(document.body, {
    //     onrendered: function (canvas) {
    //         var image = convas.toDataURL("image\img");
    //         var doc = new jsPDF();

    //         doc.addImage(image, 'JPEG', 25, 20);
    //         doc.save("abc.pdf");
    //     }
    // });

    var res = doc.autoTableHtmlToJson(table);

    var options = {
        starty: 50,
        margin: {
            horizontal: 0,
            vertical: 150
        },
        bodyStyles: {
            valign: top,
        },
        columnStyles: {
            overflow: 'linebreak',
            column: 'wrap'
        },
        columnStyles: {
            1: {
                columnWidth: 'auto'
            }
        }
    };

    doc.autoTable(res.columns, res.data, options);

    doc.setFontSize(14);

    var today = new Date();

    doc.text(40, 700, "Date: " + today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear());
    console.log(String((new Date()).getDate()));

    doc.text(450, 700, "Signature");

    doc.save("Acccident_Report.pdf");
}




/* Function to convert Image source to Base64 format */
function getBase64Image (img) {
    var canvas = document.createElement("canvas");

    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0 ,0);
    var dataURL = canvas.toDataURL("img/jpeg");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/,"");
}






/* -------------------------------------------------------
                  General Features
------------------------------------------------------- */

/* ------------------- Accident Scenario ------------------- */

/* -------- Upload Accident Scenario -------- */

/* To upload accident scenario */
function Add_OR_Modify_Accident_Scenario (task, form_id) {
    var vehicle_registration_number = document.forms[form_id]["VEHICLE_REGISTRATION_NUMBER"].value;
    var location_coordinates =  {
        lat : parseFloat(document.forms[form_id]["COORDINATES"].value.split(",")[0]),
        lng : parseFloat(document.forms[form_id]["COORDINATES"].value.split(",")[1])
    }

    var image = document.forms[form_id]["IMAGE"];

    var level_of_risk = document.forms[form_id]["LEVEL_OF_RISK"].value;
    var weight;
    if ((level_of_risk == "Very Low")  ||  (level_of_risk == "Low")) {
        weight = 1;
    }
    else if ((level_of_risk == "Medium")) {
        weight = 2;
    }
    else if ((level_of_risk == "High")  ||  (level_of_risk == "Very High")) {
        weight = 3;
    }
    
    var description = document.forms[form_id]["DESCRIPTION"].value;
    
    
    if (task == "Add Accident Possibility") {
        firebase.database().ref("User/").once("value").then(function(user_snapshot) {
            var user = "";
            user_snapshot.forEach(function(user_childSnapshot) {
                if (user_childSnapshot.child("Vehicle").child("Registration_No").val() == vehicle_registration_number) {
                    user = user_childSnapshot.key;
                }
            });
            
            var blackbox = "";
            var uploaded_by = CURRENT_USER_ID;

            var data = {
                Blackbox : blackbox,
                Date_And_Time : String(new Date()),
                Description : description,
                Level_Of_Risk : level_of_risk,
                Location_Coordinates : location_coordinates,
                Status : "Pending",
                Uploaded_By : uploaded_by,
                User : user,
                Vehicle_Registration_Number : vehicle_registration_number,
                Weight : weight
            };

            if (CURRENT_USER_TYPE == "Emergency_Service_User") {
                data.Uploaded_By += " - " + FCM_TOKEN;
            }
            
            Add_To_Database_For_Accident_Possibility(data, "Accident_Possibility", image);
        });
    }
    else if (task == "Modify Accident Scenario") {
        if (validate_View_Pending_Accident_Scenario_Form(form_id)) {
            var id = document.forms[form_id]["ID"].value;
            
            var user = document.forms[form_id]["USER"].value;
            var blackbox = document.forms[form_id]["BLACKBOX"].value;
            var uploaded_by = document.forms[form_id]["UPLOADED_BY"].value;

            var cause_of_accident = document.forms[form_id]["CAUSE_OF_ACCIDENT"].value;
            var number_of_survivors = document.forms[form_id]["NUMBER_OF_SURVIVORS"].value;
            var number_of_injured_people = document.forms[form_id]["NUMBER_OF_INJURED_PEOPLE"].value;
            var number_of_non_survivors = document.forms[form_id]["NUMBER_OF_NON_SURVIVORS"].value;
            
            var data = {
                Blackbox : blackbox,
                // Date_And_Time : String(new Date()),
                Cause_Of_Accident : cause_of_accident,
                Description : description + "\n\n" + task + " - By - " + CURRENT_USER_ID + "\n-----" + FCM_TOKEN,
                // Level_Of_Risk : level_of_risk,
                Location_Coordinates : location_coordinates,
                Number_Of_Survivors : number_of_survivors,
                Number_Of_Injured_People : number_of_injured_people,
                Number_Of_Non_Survivors : number_of_non_survivors,
                Status : "Pending",
                Uploaded_By : uploaded_by,
                User : user,
                Vehicle_Registration_Number : vehicle_registration_number,
                // Weight : weight
            };

            Update_To_Database_For_Accident_Scenario(id, data, "Accident_Scenario", image, form_id);
        }
    }
    else if (task == "Mark Accident Scenario As - Cleared") {
        var id = document.forms[form_id]["ID"].value;

        var user = document.forms[form_id]["USER"].value;
        var blackbox = document.forms[form_id]["BLACKBOX"].value;
        var uploaded_by = document.forms[form_id]["UPLOADED_BY"].value;

        var cause_of_accident = document.forms[form_id]["CAUSE_OF_ACCIDENT"].value;
        var number_of_survivors = document.forms[form_id]["NUMBER_OF_SURVIVORS"].value;
        var number_of_injured_people = document.forms[form_id]["NUMBER_OF_INJURED_PEOPLE"].value;
        var number_of_non_survivors = document.forms[form_id]["NUMBER_OF_NON_SURVIVORS"].value;

        var data = {
            Blackbox : blackbox,
            Cause_Of_Accident : cause_of_accident,
            // Date_And_Time : String(new Date()),
            Date_And_Time_Of_Clearance : String(new Date()),
            Description : description + "\n\n" + task + " - By - " + CURRENT_USER_ID + "\n-----" + FCM_TOKEN,
            // Level_Of_Risk : level_of_risk,
            Location_Coordinates : location_coordinates,
            Number_Of_Survivors : number_of_survivors,
            Number_Of_Injured_People : number_of_injured_people,
            Number_Of_Non_Survivors : number_of_non_survivors,
            Status : "Cleared",
            Uploaded_By : uploaded_by,
            User : user,
            Vehicle_Registration_Number : vehicle_registration_number,
            // Current_Weight : weight
        };


        Update_To_Database_For_Accident_Scenario (id, data, "Accident_Scenario", image, form_id);
    }
}




/* Function to add new Accident_Scenario to the Database */
function Add_To_Database_For_Accident_Possibility (data, data_type, image) {
    try {
        if (image.files.length != 0) {
            var my_Ref = firebase.database().ref(data_type + "/").push();
            
            
            /* Upload Image to the Firebase Storage & set the Image URL in Database */
                var file = image.files[0];
                // var file_NAME = image.value.split(/(\\|\/)/g).pop();;

                /* ---- Create a reference to the full path of the file, including the file name ---- */
                var storageRef = firebase.storage().ref(data_type + "/" + my_Ref.key + "/Image");  // Create a root reference
                
                /* ---- Upload from a Blob or File ---- */
                var uploadtask = storageRef.put(file).then(function(snapshot) {
                    console.log('Image Upload Successfull');
                    
                    snapshot.ref.getDownloadURL().then(function(url) {
                        console.log('Image Download Successfull');
                        

                        /* Add data to Database */
                        data["Image"] = url;
                        my_Ref.set(data).then(function() {                            
                            Reset_User_Filled_Forms();
                            show_hide_content('HOME_PAGE');
                            
                            console.log("Upload " + data_type + " Successfull");
                        }).catch(function(error) {
                            console.log("Upload " + data_type + " Unsuccessfull");
                            
                            console.log(error);
                        });
                        /* -------------------- */
                    }).catch(function(error) {
                        console.log(error);
                    });
                }).catch(function(error) {
                    console.log(error);
                });
            /* ----------------------------------------------------------------- */
        }
        else {
            data.Image = null;

            /* Add data to Database */
            firebase.database().ref(data_type + "/").push().set(data).then(function() {                            
                Reset_User_Filled_Forms();
                show_hide_content('HOME_PAGE');
                
                console.log("Upload " + data_type + " Successfull");
            }).catch(function(error) {
                console.log("Upload " + data_type + " Unsuccessfull");
                
                console.log(error);
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}




/* Function to update Accident_Scenario related data to the Database */
function Update_To_Database_For_Accident_Scenario (id, data, data_type, image, form_id) {
    if (image.files.length != 0) {
        firebase.database().ref(data_type + "/" + id).update(data).then(function() {
            /* Upload Image to the Firebase Storage & set the Image URL in Database */
                var file = image.files[0];
                // var file_NAME = image.value.split(/(\\|\/)/g).pop();

                /* ---- Create a reference to the full path of the file, including the file name ---- */
                var storageRef = firebase.storage().ref(data_type + "/" + id + "/Image");  // Create a root reference
                

                firebase.database().ref(data_type + "/" + id).once("value").then(function(snapshot) {
                    if (snapshot.child("Image").val() != null) {
                        firebase.storage().refFromURL(snapshot.child("Image").val()).delete().then(function() {
                            /* ---- Upload from a Blob or File ---- */
                                var uploadtask = storageRef.put(file).then(function(imageSnapshot) {
                                    console.log('Image Upload Successfull');
                                    
                                    imageSnapshot.ref.getDownloadURL().then(function(url) {
                                        // data.Image = url;
                                        
                                        firebase.database().ref(data_type + "/" + id).update({Image : url}).then(function() {
                                            console.log('Image Download Successfull');
                                            
                                            alert ("Changes have been saved successfull");
                                            console.log ("Modify " + data_type +  " Successfull");

                                            Display_Accident_Scenario_List("Pending");
                                
                                            Reset_User_Filled_Forms();
                                            document.forms[form_id]["Remove_Picture"].value = "No";
                                        }).catch(function(error) {
                                            console.log(error);
                                        });
                                    }).catch(function(error) {
                                        console.log(error);
                                    });
                                }).catch(function(error) {
                                    console.log(error);
                                });
                            /* ----------------------------------------------------------------- */
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }
                    else {
                        /* ---- Upload from a Blob or File ---- */
                            var uploadtask = storageRef.put(file).then(function(imageSnapshot) {
                                console.log('Image Upload Successfull');
                                
                                imageSnapshot.ref.getDownloadURL().then(function(url) {
                                    // data.Image = url;
                                    
                                    firebase.database().ref(data_type + "/" + id).update({Image : url}).then(function() {
                                        console.log('Image Download Successfull');
                                        
                                        alert ("Changes have been saved successfull");
                                        console.log ("Modify " + data_type +  " Successfull");

                                        Display_Accident_Scenario_List("Pending");
                            
                                        Reset_User_Filled_Forms();
                                        document.forms[form_id]["Remove_Picture"].value = "No";
                                    }).catch(function(error) {
                                        console.log(error);
                                    });
                                }).catch(function(error) {
                                    console.log(error);
                                });
                            }).catch(function(error) {
                                console.log(error);
                            });
                        /* ----------------------------------------------------------------- */
                    }
                }).catch(function(error) {
                    console.log(error);
                });
        }).catch(function(error) {
            console.log ("Modify " + data_type +  " Unsuccessfull");

            console.log(error);
        });
    }
    else {
        // if (document.forms[form_id]["Remove_Picture"].value == "Yes") {
        //     data.Image = null;
        // }

        firebase.database().ref(data_type + "/" + id).update(data).then(function() {
            console.log ("Modify " + data_type +  " Successfull");

            console.log(document.forms[form_id]["IMAGE"].value);
            
            if (document.forms[form_id]["Remove_Picture"].value == "Yes") {
                firebase.database().ref(data_type + "/" + id).once('value').then(function(snapshot) {
                    console.log(snapshot.child("Image").val());
                    console.log(snapshot.child("Description").val());

                    if (snapshot.child("Image").val() != null) {
                        snapshot.ref.update({Image : null}).then(function() {
                            console.log("Delete Image URL storage Successfull");

                            firebase.storage().refFromURL(snapshot.child("Image").val()).delete().then(function() {
                                console.log("Delete Image from storage Successfull");
                                
                                Display_Accident_Scenario_List("Pending");
                                
                                Reset_User_Filled_Forms();
                                document.forms[form_id]["Remove_Picture"].value = "No";
                            }).catch (function(error) {
                                console.log("Delete Image from storage Unsuccessfull");
                                console.log(error);
                            });
                        }).catch (function(error) {
                            cconsole.log("Delete Image URL storage Successfull");
                            console.log(error);
                        });
                    }
                    else {
                        Display_Accident_Scenario_List("Pending");
                        
                        Reset_User_Filled_Forms();
                        document.forms[form_id]["Remove_Picture"].value = "No";
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }
            else {
                Display_Accident_Scenario_List("Pending");

                Reset_User_Filled_Forms();
                document.forms[form_id]["Remove_Picture"].value = "No";
            }
        }).catch(function(error) {
            console.log ("Modify " + data_type +  " Unsuccessfull");
    
            console.log(error);
        });
    }
}





/* To validate Upload_Accident_Scenario_Form */
function validate_Upload_Accident_Scenario_Form(form_id) {
    var location_coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (location_coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((location_coordinates[0] != parseFloat(location_coordinates[0]))  ||  (location_coordinates[1] != parseFloat(location_coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}





/* -------- View Accident Scenarios -------- */

/* To Display List_Of_Pending_Accident_Scenarios window OR List_Of_Cleared_Accident_Scenarios window*/
function Display_Accident_Scenario_List (Accident_Scenario_Status) {
    // document.getElementById(Accident_Scenario_Status + "_Accident_Scenario_Search_Bar").style.display = "block";
    document.getElementById(Accident_Scenario_Status + "_Accident_Scenario_Search_Results").style.display = "block";
    document.getElementById("View_" + Accident_Scenario_Status + "_Accident_Scenario_Form").style.display = "none";
    
    Switch_Close_and_Go_Back_Buttons("Close Button");
    
    console.log("View " + Accident_Scenario_Status + " Accident Scenarios Successfull");
}





/* Function to load Pending_Accident_Scenario_List OR Cleared_Accident_Scenario_List */
function Load_Accident_Scenario_List () {
    try {
        firebase.database().ref("Accident_Scenario/").on('value', function(snapshot) {
            var list_of_pending_accident_scenarios = "";
            var list_of_cleared_accident_scenarios = "";
            
            var child_snapshots = [];

            snapshot.forEach(function(childSnapshot) {
                var temp = childSnapshot.toJSON();
                temp.key = childSnapshot.key;

                child_snapshots.push(temp);
            });


            for (var i = child_snapshots.length - 1; i >= 0; i--) {
                if (child_snapshots[i].Status  ==  "Pending") {
                    list_of_pending_accident_scenarios += "<tr onclick='View_Accident_Scenario_Details(this.cells[1].innerHTML, " + '"View_Pending_Accident_Scenario_Form"' + ")'>" +
                            "<td> <b>" + child_snapshots[i].Date_And_Time.substring(0, 24) + "</b> </td>" +
                            "<td>" + child_snapshots[i].key + "</td>" +
                            "<td> </td>" +
                        "</tr>";
                }
                if (child_snapshots[i].Status  ==  "Cleared") {
                    list_of_cleared_accident_scenarios += "<tr onclick='View_Accident_Scenario_Details(this.cells[1].innerHTML, " + '"View_Cleared_Accident_Scenario_Form"' + ")'>" +
                            "<td> <b>" + child_snapshots[i].Date_And_Time.substring(0, 24) + "</b> </td>" +
                            "<td>" + child_snapshots[i].key + "</td>" +
                            "<td> </td>" +
                        "</tr>";
                }
            }

            document.getElementById("Pending_Accident_Scenario_Search_Results_Table_Body").innerHTML = list_of_pending_accident_scenarios;
            document.getElementById("Cleared_Accident_Scenario_Search_Results_Table_Body").innerHTML = list_of_cleared_accident_scenarios;
        });

        console.log("Accident_Scenario Search Results Successfull");
    }
    catch (error) {
        console.log(error);
    }
}




/* Function to display search Results Peding OR Cleared Accident Scenarios */
function Accident_Scenario_Search_Results (input, Accident_Scenario_Status) {
    // var row_objects = document.getElementById(Accident_Scenario_Status + "_Accident_Scenario_Search_Results").rows;

    // var table = document.createElement("table");

    // for (var i = 0; i < row_objects.length; i++) {
    //     if (row_objects[i].cells[0].innerHTML.includes(input)) {
    //         var row = document.createElement("tr");
    //         row.onclick = View_Accident_Scenario_Details(this.cells[0].innerHTML, "Accident_Scenario");
    //     }
    //     else {
    //         row_objects[i].style.display = "none";
    //     }
    // }
}



/* View details of clicked/selected Accident_Scenario */
function View_Accident_Scenario_Details (accident_scenario_id, form_id) {
    document.getElementById(form_id).reset();

    try {
        firebase.database().ref("Accident_Scenario/" + accident_scenario_id).once('value').then(function(snapshot) {
            if (snapshot.child("Status").val() == "Pending") {
                document.forms[form_id]["Remove_Picture"].value = "No";
            }

            
            /* ---------------- Unique Content ---------------- */
            document.forms[form_id]["ID"].value = snapshot.key;

            document.forms[form_id]["USER"].value = snapshot.child("User").val();
            document.forms[form_id]["BLACKBOX"].value = snapshot.child("Blackbox").val();
            document.forms[form_id]["UPLOADED_BY"].value = snapshot.child("Uploaded_By").val();
            document.forms[form_id]["VEHICLE_REGISTRATION_NUMBER"].value = snapshot.child("Vehicle_Registration_Number").val();
            document.forms[form_id]["WEIGHT"].value = snapshot.child("Current_Weight").val();
            document.forms[form_id]["DATE_AND_TIME"].value = snapshot.child("Date_And_Time").val();
            /* ---------------- End - Unique Content ---------------- */

            
            /* ---------------- Super Unique Content ---------------- */
            if (form_id == "View_Cleared_Accident_Scenario_Form") {
                document.forms[form_id]["DATE_AND_TIME_OF_CLEARANCE"].value = snapshot.child("Date_And_Time_Of_Clearance").val();
            }
            /* ---------------- End - Super Unique Content ---------------- */

            
            /* ---------------- Common Content ---------------- */
            document.forms[form_id]["COORDINATES"].value = snapshot.child("Location_Coordinates").child("lat").val() + "," + snapshot.child("Location_Coordinates").child("lng").val();
            
            if (snapshot.child("Image").val() == null) {
                document.getElementById(snapshot.child("Status").val() + "_Accident_Scenario_Image_Object_ID").src = "img/Empty_Image/Empty_Image.png";
            }
            else {
                document.getElementById(snapshot.child("Status").val() + "_Accident_Scenario_Image_Object_ID").src = snapshot.child("Image").val();
            }
            
            document.forms[form_id]["LEVEL_OF_RISK"].value = snapshot.child("Level_Of_Risk").val();
            
            var description_object = snapshot.child("Description").val();
            if (Array.isArray(description_object)) {
                var description_string = "";
                for (var i = 0; i < description_object.length; i++) {
                    description_string += (i+1) + ": " + description_object[i];
                    if (i  !=  (description_object.length - 1)) {
                        description_string += "\n";
                    }
                }
                document.forms[form_id]["DESCRIPTION"].value = description_string;
            }
            else {
                document.forms[form_id]["DESCRIPTION"].value = description_object;
            }
            
            /* ---------------- End - Common Content ---------------- */

            document.forms[form_id]["CAUSE_OF_ACCIDENT"].value = snapshot.child("Cause_Of_Accident").val();
            document.forms[form_id]["NUMBER_OF_SURVIVORS"].value = snapshot.child("Number_Of_Survivors").val();
            document.forms[form_id]["NUMBER_OF_INJURED_PEOPLE"].value = snapshot.child("Number_Of_Injured_People").val();
            document.forms[form_id]["NUMBER_OF_NON_SURVIVORS"].value = snapshot.child("Number_Of_Non_Survivors").val();

            // document.getElementById(snapshot.child("Status").val() + "_Accident_Scenario_Search_Bar").style.display = "none";
            document.getElementById(snapshot.child("Status").val() + "_Accident_Scenario_Search_Results").style.display = "none";
            document.getElementById("View_" + snapshot.child("Status").val() + "_Accident_Scenario_Form").style.display = "block";
        });

        Switch_Close_and_Go_Back_Buttons("Go Back Button");
        
        console.log ("View Accident_Scenario Details Succesfull");
    }
    catch (error) {
        console.log(error);
    }
}


/* To validate View_Pending_Accident_Scenario_Form */
function validate_View_Pending_Accident_Scenario_Form(form_id) {
    var location_coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (location_coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((location_coordinates[0] != parseFloat(location_coordinates[0]))  ||  (location_coordinates[1] != parseFloat(location_coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    
    return true;
}



/* Function to show information of User (who has met with accident) */
function Show_User_Info_FOR_Accident_Scenario (form_id) {
    firebase.database().ref("User/").once('value').then(function(user_snapshot) {
        var user_found = false;

        user_snapshot.forEach(function(user_childSnapshot) {
            if (user_childSnapshot.key == document.forms[form_id]["USER"].value) {
                alert("Name: " + user_childSnapshot.child("First_Name").val() + " " + user_childSnapshot.child("Middle_Name").val() + " " + user_childSnapshot.child("Last_Name").val() +
                    "\nContact Number: " + user_childSnapshot.child("Contact_Number").val() +
                    "\nAlternate Contact Number: " + user_childSnapshot.child("Alternate_Contact_Number").val() +
                    "\nEmail-ID: " + user_childSnapshot.child("Email_ID").val() +
                    "\nAlternate Email-ID: " + user_childSnapshot.child("Alternate_Email_ID").val()
                );

                user_found = true;
            }
        });

        if (user_found == false) {
            alert("No user-data available.");
        }
    }).catch (function(error) {
        console.log(error);
    });
}





function Clear_Accident_Scenario () {
    
}





/* To delete the selected Accident_Scenario */
function Delete_Accident_Scenario (form_id) {
    var id = document.forms[form_id]["ID"].value;

    if (confirm("Are you sure?")) {
        firebase.database().ref("Accident_Scenario/" + id).once('value').then(function(snapshot) {
            console.log(snapshot.child("Image").val());

            var image_url = snapshot.child("Image").val();

            snapshot.ref.remove().then(function() {
                console.log("Delete Accident_Scenario Successfull");

                if (image_url != null) {
                    firebase.storage().refFromURL(snapshot.child("Image").val()).delete().then(function() {
                        Display_Accident_Scenario_List("Pending");

                        console.log("Delete Image from storage Successfull");
                    }).catch (function(error) {
                        console.log("Delete Image from storage Unsuccessfull");
                        console.log(error);
                    });
                }
                else {
                    Display_Accident_Scenario_List("Pending");
                }
            }).catch (function(error) {
                console.log("Delete Accident_Scenario Unsuccessfull");
                console.log(error);
            });
        }).catch (function(error) {
            console.log(error);
        });
    }
}








/* ------------------- Report Unsafe Zones, Blackspots  ------------------- */

/* Function to add OR modify Blackspot and Reported Unsafe Zone depending on task/requirement */
function Add_OR_Modify_Blackspot_OR_Reported_Zone (task, form_id) {
    /* ---------------- Common Content ---------------- */
    var coordinates =  {
        lat : parseFloat(document.forms[form_id]["COORDINATES"].value.split(",")[0]),
        lng : parseFloat(document.forms[form_id]["COORDINATES"].value.split(",")[1])
    }

    var image = document.forms[form_id]["IMAGE"];

    var level_of_risk = document.forms[form_id]["LEVEL_OF_RISK"].value;
    var weight;
    if (level_of_risk == "Very Low") {
        weight = 1;
    }
    else if (level_of_risk == "Low") {
        weight = 2;
    }
    else if (level_of_risk == "Medium") {
        weight = 3;
    }
    else if (level_of_risk == "High") {
        weight = 4;
    }
    else if (level_of_risk == "Very High") {
        weight = 5;
    }

    var description = document.forms[form_id]["DESCRIPTION"].value;
    /* ---------------- End - Common Content ---------------- */

    if (task == 'Report Unsafe Zone') {
        var id = "";

        var level_of_risk = document.forms[form_id]["LEVEL_OF_RISK"].value;

        var data = {
            Date_And_Time : String(new Date()),
            Description : description,
            // Image : image_NAME,
            Level_Of_Risk : level_of_risk,
            Location_Coordinates : coordinates,
            Reported_By: CURRENT_USER_ID,
            Status : "Active",
            Weight : weight
        };
        
        Add_To_Database_FOR_Unsafe_Zone_OR_Blackspot(id, data, "Unsafe_Zone", image, form_id);
    }
    else if ((task == 'Add Blackspot')) {
        var id ="";
        
        var data = {
            Added_By: CURRENT_USER_ID + "--" + FCM_TOKEN,
            Current_Weight : weight,
            Date_And_Time : String(new Date()),
            Description : [description],
            // Image : image_NAME,
            Last_Updated : String(new Date()),
            Level_Of_Risk : level_of_risk,
            Location_Coordinates : coordinates,
            Previous_Weight : 0,
            Reported_By: CURRENT_USER_ID + "--" + FCM_TOKEN,
            Status : "Pending"
        };

        Add_To_Database_FOR_Unsafe_Zone_OR_Blackspot(id, data, "Blackspot", image, form_id);
    }
    else if (task == 'Modify Blackspot') {
        /* ---------------- Unique Content ---------------- */
        var id = document.forms[form_id]["ID"].value;
        /* ---------------- End - Unique Content ---------------- */

        var data = {
            Description : [description, task + " - By - " + CURRENT_USER_ID + "\n-----" + FCM_TOKEN],
            // Image : image_NAME,
            Last_Updated : String(new Date()),
            // Level_Of_Risk : level_of_risk,
            Location_Coordinates : coordinates
        };
        
        Update_Database_FOR_Unsafe_Zone_OR_Blackspot(id, data, "Blackspot", image, form_id);
    }
    else if (task == 'Modify Unsafe Zone') {
        if (validate_View_Zone_Form(form_id)) {
            /* ---------------- Unique Content ---------------- */
            var id = document.forms[form_id]["ID"].value;
            /* ---------------- End - Unique Content ---------------- */

            var data = {
                Description : description + "\n\n" + task + " - By - " + CURRENT_USER_ID + "\n-----" + FCM_TOKEN,
                // Image : image_NAME,
                Level_Of_Risk : level_of_risk,
                Location_Coordinates : coordinates,
                Weight : weight
            };
            
            Update_Database_FOR_Unsafe_Zone_OR_Blackspot(id, data, "Unsafe_Zone", image, form_id);
        }
    }
    else if (task == 'Add to Blackspots') {
        /* ---------------- Unique Content ---------------- */
        var id = document.forms[form_id]["ID"].value;
        var reporter_id = document.forms[form_id]["Reporter_ID"].value;

        var image_URL;
        if ((document.forms[form_id]["Image_URL"].value == "")  ||  (document.forms[form_id]["Remove_Picture"].value == "Yes")) {
            image_URL = null;
        }
        else {
            image_URL = document.forms[form_id]["Image_URL"].value;
        }
        
        console.log("pppppppppppppppp -"  + document.forms[form_id]["Image_URL"].value + "-")
        /* ---------------- End - Unique Content ---------------- */
        
        var data = {
            Added_By: CURRENT_USER_ID + "--" + FCM_TOKEN,
            Current_Weight : weight,
            Date_And_Time : String(new Date()),
            Description : [description],
            Image : image_URL,
            Last_Updated : String(new Date()),
            Level_Of_Risk : level_of_risk,
            Location_Coordinates : coordinates,
            Previous_Weight : 0,
            Reported_By: reporter_id,
            Status : "Pending"
        };
        
        Add_To_Database_FOR_Unsafe_Zone_OR_Blackspot(id, data, "Blackspot", image, form_id);
    }
}




/* Function to add new Unsafe Zone or Blackspot to the Database */
function Add_To_Database_FOR_Unsafe_Zone_OR_Blackspot (id, data, data_type, image, form_id) {
    if (image.files.length != 0) {
    // if ((image.files.length != 0)    ||    ((form_id == "View_Zone_Form")  &&  (document.forms[form_id]["Remove_Picture"].value == "No")  &&  (data.Image != ""))) {
        var image_URL;
        var file = image.files[0];

        // if (image.files.length != 0) {
        //     file = image.files[0];
        //     // var file_NAME = image.value.split(/(\\|\/)/g).pop();;
        // }
        // else if ((form_id == "View_Zone_Form")  &&  (document.forms[form_id]["Remove_Picture"].value == "No")  &&  (data.Image != "")) {
        //     image_URL = data.Image;
        //     data.Image = null;

        //     file = data_URL_TO_File (image_URL, "Image");
        //     // file = new File(image_URL, "image.jpg");
        // }

        var my_Ref = firebase.database().ref(data_type + "/").push();

        /* Upload Image to the Firebase Storage & set the Image URL in Database */
            /* ---- Create a reference to the full path of the file, including the file name ---- */
            var storageRef = firebase.storage().ref(data_type + "/" + my_Ref.key + "/Image");  // Create a root reference
            
            /* ---- Upload from a Blob or File ---- */
            var uploadtask = storageRef.put(file).then(function(imageSnapshot) {
                console.log('Image Upload Successfull');

                imageSnapshot.ref.getDownloadURL().then(function(url) {
                    console.log('Image Download Successfull');
                    
                    /* Update Image URL */
                    data["Image"] = url;

                    my_Ref.set(data).then(function() {
                        if (form_id == "Report_Unsafe_Zone_Form") {
                            Reset_User_Filled_Forms();
                            show_hide_content('HOME_PAGE');
                        }
                        else if (form_id == "Add_Blackspot_Form") {
                            Reset_User_Filled_Forms();
                            show_hide_content('HOME_PAGE');
                        }
                        else if (form_id == "View_Zone_Form") {
                            if (data_type == "Blackspot") {
                                try {
                                    firebase.database().ref("Unsafe_Zone/" + id).update({Status : "Used"}).then(function(snapshot) {
                                        console.log("Unsafe Zone's Status changed to 'Used' successfully.");
                                    });
                                }
                                catch (error) {
                                    console.log("Delete Unsafe Zone Unsuccessfull");
                                    console.log(error);
                                }
                            }
                            
                            Reset_User_Filled_Forms();
                            document.forms[form_id]["Remove_Picture"].value = "No";
                            
                            alert("Added " + data_type + " successfully.");
                            
                            Display_Reported_Zone_List();
                        }
                        
                        console.log("Add " + data_type + " Successfull");
                    }).catch(function(error) {
                        console.log("Add " + data_type + " Unsuccessfull");
                        
                        console.log(error);
                    });
                    /* -------------------- */
                }).catch(function(error) {
                    console.log(error);
                });
            }).catch(function(error) {
                console.log(error);
            });
        /* ----------------------------------------------------------------- */
    }
    else {
        image_URL = data.Image;
        // data.Image = null;
        console.log(data);
        firebase.database().ref(data_type + "/").push().set(data).then(function(snapshot) {
            // Upload_To_Firebase_Storage (image, "images/" + data_type + "/");
    
            if (form_id == "Report_Unsafe_Zone_Form") {
                Reset_User_Filled_Forms();
                
                show_hide_content('HOME_PAGE');
            }
            else if (form_id == "Add_Blackspot_Form") {
                Reset_User_Filled_Forms();

                show_hide_content('HOME_PAGE');
            }
            else if (form_id == "View_Zone_Form") {
                if (data_type == "Blackspot") {
                    console.log("Unsafe_Zone/" + id);
                    try {
                        firebase.database().ref("Unsafe_Zone/" + id).update({Status : "Used"}).then(function(snapshot) {
                            console.log("Unsafe Zone's Status changed to 'Used' successfully.");
                        });
                    }
                    catch (error) {
                        console.log("Delete Unsafe Zone Unsuccessfull");
                        console.log(error);
                    }
                }

                Reset_User_Filled_Forms();
                document.forms[form_id]["Remove_Picture"].value = "No";
    
                Display_Reported_Zone_List();
            }
    
            console.log("Add " + data_type + " Successfull");
        }).catch(function(error) {
            console.log("Add " + data_type + " Unsuccessfull");
    
            console.log(error);
        });
    }
}




/* Function to convert data_URL to a File*/
async function data_URL_TO_File (data_URL, file_name) {
    // var arr = data_URL.split(',');
    // var arr2 = arr[0].match(/:(.*?);/)
    // var mime = arr2[1];

    // var bstr = atob(arr[1]);
    // var n = bstr.length;

    // u8arr = Uint8Array(n);

    // while(n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    // }

    // return new File([u8arr], file_name, {type:mime});
}





/* Function to update Unsafe Zone or Blackspot related data to the Database */
function Update_Database_FOR_Unsafe_Zone_OR_Blackspot (id, data, data_type, image, form_id) {
    if (image.files.length != 0) {
        firebase.database().ref(data_type + "/" + id).update(data).then(function(snapshot) {
            /* Upload Image to the Firebase Storage & set the Image URL in Database */
                var file = image.files[0];
                // var file_NAME = image.value.split(/(\\|\/)/g).pop();

                /* ---- Create a reference to the full path of the file, including the file name ---- */
                var storageRef = firebase.storage().ref(data_type + "/" + id + "/Image");  // Create a root reference
                
                /* ---- Upload from a Blob or File ---- */
                var uploadtask = storageRef.put(file).then(function(imageSnapshot) {
                    console.log('Image Upload Successfull');
                    
                    imageSnapshot.ref.getDownloadURL().then(function(url) {
                        // data.Image = url;

                        firebase.database().ref(data_type + "/" + id).update({Image : url}).then(function() {
                            console.log('Image Download Successfull');
                            
                            alert ("Changes have been saved successfull");
                            
                            console.log ("Modify " + data_type +  " Successfull");


                            if (data_type == "Blackspot") {
                                Display_Blackspot_List();
                            }
                            else if (data_type == "Unsafe_Zone") {
                                Display_Reported_Zone_List();
                            }
                
                            Reset_User_Filled_Forms();
                            document.forms[form_id]["Remove_Picture"].value = "No";
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }).catch(function(error) {
                        console.log(error);
                    });
                }).catch(function(error) {
                    console.log(error);
                });
            /* ----------------------------------------------------------------- */
        }).catch(function(error) {
            console.log ("Modify " + data_type +  " Unsuccessfull");

            console.log(error);
        });
    }
    else {
        // if (document.forms[form_id]["Remove_Picture"].value == "Yes") {
        //     data.Image = null;
        // }

        firebase.database().ref(data_type + "/" + id).update(data).then(function() {
            console.log ("Modify " + data_type +  " Successfull");

            console.log(document.forms[form_id]["IMAGE"].value);
            
            if (document.forms[form_id]["Remove_Picture"].value == "Yes") {
                firebase.database().ref(data_type + "/" + id).once('value').then(function(snapshot) {
                    console.log(snapshot.child("Image").val());
                    console.log(snapshot.child("Description").val());

                    if (snapshot.child("Image").val() != null) {
                        snapshot.ref.update({Image : null}).then(function() {
                            console.log("Make Image_URL NULL Successfull");

                            firebase.storage().ref().child(data_type + "/" + id + "/Image").delete().then(function() {
                                console.log("Delete Image from storage Successfull");
        
                                if (data_type == "Blackspot") {
                                    Display_Blackspot_List();
                                }
                                else if (data_type == "Unsafe_Zone") {
                                    Display_Reported_Zone_List();
                                }
                                
                                Reset_User_Filled_Forms();
                                document.forms[form_id]["Remove_Picture"].value = "No";
                            }).catch (function(error) {
                                console.log("Delete Image from storage Unsuccessfull");
                                console.log(error);

                                if (data_type == "Blackspot") {
                                    Display_Blackspot_List();
                                }
                                else if (data_type == "Unsafe_Zone") {
                                    Display_Reported_Zone_List();
                                }
                                
                                Reset_User_Filled_Forms();
                                document.forms[form_id]["Remove_Picture"].value = "No";
                            });
                        }).catch (function(error) {
                            console.log("Delete Image URL storage Successfull");
                            console.log(error);
                        });
                    }
                    else {
                        if (data_type == "Blackspot") {
                            Display_Blackspot_List();
                        }
                        else if (data_type == "Unsafe_Zone") {
                            Display_Reported_Zone_List();
                        }
                        
                        Reset_User_Filled_Forms();
                        document.forms[form_id]["Remove_Picture"].value = "No";
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }
            else {
                if (data_type == "Blackspot") {
                    Display_Blackspot_List();
                }
                else if (data_type == "Unsafe_Zone") {
                    Display_Reported_Zone_List();
                }

                Reset_User_Filled_Forms();
                document.forms[form_id]["Remove_Picture"].value = "No";
            }
        }).catch(function(error) {
            console.log ("Modify " + data_type +  " Unsuccessfull");
    
            console.log(error);
        });
    }
}





/* ----------------------------------- Not Used ----------------------------------- */
/* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
/* Function to Blackspot and Reported Unsafe Zone w.r.t./using their ID */
function Delete_Blackspot_OR_Reported_Zone (form_id) {
    var id = document.forms[form_id]["ID"].value;
    
    if (form_id == "View_Blackspot_Form") {

        Display_Blackspot_List();
        
        
        console.log ("Delete Blackspot Successfull");
    }
    else if (form_id == "View_Zone_Form") {
        
        Display_Reported_Zone_List();
        
        
        console.log ("Delete Unsafe Zone Report");
    }
}
/* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */
/* ----------------------------------- End - Not Used ----------------------------------- */
 





/* To validate Report_Unsafe_Zone_Form */
function validate_Report_Unsafe_Zone_Form(form_id) {
    var location_coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (location_coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((location_coordinates[0] != parseFloat(location_coordinates[0]))  ||  (location_coordinates[1] != parseFloat(location_coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}



/* To fetch current coordinates using Device GPS */
function fetch_location (form_id) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            /* Stores latitudinal value */
            var lat = pos.coords.latitude;

            /* Stores longitudinal value */
            var long = pos.coords.longitude;
            
            document.forms[form_id]["COORDINATES"].value = lat + "," + long;


            console.log(form_id);
        })
    }
    else {
        console.log("Geolocation is not available");
    }
}







/* ------------------- Blackspots ------------------- */

/* To validate Add_Blackspot_Form */
function validate_Add_Blackspot_Form (form_id) {
    var location_coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (location_coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((location_coordinates[0] != parseFloat(location_coordinates[0]))  ||  (location_coordinates[1] != parseFloat(location_coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}



/* View Reported Zones or Blackbox Search Results */
// function View_Reported_Zones_OR_Blackspot_Search_Results (data_type) {
//     if (data_type == "Blackspot") {
//         form_id = "View_Blackspot_Form";
//     }
//     else if (data_type == "Unsafe_Zone") {
//         form_id = "View_Zone_Form";
//     }

//     var list = "";

//     try {
//         firebase.database().ref(data_type + "/").on('value', function(snapshot) {
//             if (data_type == "Blackspot") {
//                 snapshot.forEach(function(childSnapshot) {
//                     list += "<tr onclick='View_Blackspot_Details(this.cells[0].innerHTML, " + data_type + "")'>" +
//                                 "<td>" + Object.keys(childSnapshot.val())[0] + "</td>" +
//                                 "<td> </td>" +
//                             "</tr>";
//                 });

//                 document.getElementById("Blackspot_Search_Results_Table_Body").innerHTML = list;

//                 document.getElementById("Blackspot_Search_Bar").style.display = "block";
//                 document.getElementById("Blackspot_Search_Results").style.display = "block";
//                 document.getElementById("View_Blackspot_Form").style.display = "none";
//             }
//             else if (data_type == "Unsafe_Zone") {
//                 snapshot.forEach(function(childSnapshot) {
//                     list += "<tr onclick='View_Zone_Details(this.cells[0].innerHTML)'>" +
//                                 "<td>" + childSnapshot.name() + "</td>" +
//                                 "<td> </td>" +
//                             "</tr>";
//                 });
                
//                 document.getElementById("Reported_Zones_Table_Body").innerHTML = list;

//                 document.getElementById("Reported_Zones").style.display = "block";
//                 document.getElementById("View_Zone_Form").style.display = "none";
//             }
//         });

//         Switch_Close_and_Go_Back_Buttons("Close Button");

//         console.log("View " + data_type  + "s Successfull");
//     }
//     catch (error) {
//         console.log(error);
//     }
// }



// /* View details of clicked/selected Blackspot or Zone Report */
// function View_Zone_OR_Blackspot_Details (id, data_type) {
//     if (data_type == "Blackspot") {
//         form_id = "View_Blackspot_Form";
//     }
//     else if (data_type == "Unsafe_Zone") {
//         form_id = "View_Zone_Form";
//     }

//     try {
//         firebase.database().ref(data_type + "/" + id).once('value').then(function(snapshot) {
//             /* ---------------- Unique Content ---------------- */
//             document.forms[form_id]["ID"].value = snapshot.name();

//             if (data_type == "Unsafe_Zone") {
//                 document.forms[form_id]["Reporter_ID"].value = snapshot.child("Reported_By").val();
//             }
//             /* ---------------- End - Unique Content ---------------- */

//             /* ---------------- Common Content ---------------- */
//             document.forms[form_id]["COORDINATES"].value = snapshot.child("Location_Coordinates").child("lat").val() + "," + snapshot.child("Location_Coordinates").child("lng").val();
//             document.forms[form_id]["IMAGE"].file = snapshot.child("Image").val();
//             document.forms[form_id]["LEVEL_OF_RISK"].value = snapshot.child("Level_Of_Risk").val();
//             document.forms[form_id]["DESCRIPTION"].value = snapshot.child("Description").val();
//             /* ---------------- End - Common Content ---------------- */
//         });


//         if (data_type == "Unsafe_Zone") {
//             document.getElementById("Reported_Zones").style.display = "none";
//             document.getElementById("View_Zone_Form").style.display = "block";
//         }
//         else if (data_type == "Blackspot") {

//         }
    
//         Switch_Close_and_Go_Back_Buttons("Go Back Button");
    
//         console.log ("View" + data_type + "Details");
//     }
//     catch (error) {
//         console.log(error);
//     }
// }




/* -------- View Blackspots -------- */

/* To Display List_Of_Blackspots window */
function Display_Blackspot_List () {
    // document.getElementById("Blackspot_Search_Bar").style.display = "block";
    document.getElementById("Blackspot_Search_Results").style.display = "block";
    document.getElementById("View_Blackspot_Form").style.display = "none";

    Switch_Close_and_Go_Back_Buttons("Close Button");
    
    console.log("View Blackspots Successfull");
}



/* Function to load Blackspot List */
function Load_Blackspot_List () {
    try {
        firebase.database().ref("Blackspot/").on('value', function(snapshot) {
            var list_of_blackspots = "";
            var child_snapshots = [];

            snapshot.forEach(function(childSnapshot) {
                var temp = childSnapshot.toJSON();
                temp.key = childSnapshot.key;

                child_snapshots.push(temp);
            });

            for (var i = child_snapshots.length - 1; i >= 0; i--) {
                if (child_snapshots[i].Status  ==  "Active") {
                    list_of_blackspots += "<tr onclick='View_Blackspot_Details(this.cells[1].innerHTML, " + '"Blackspot"' + ")'>" +
                                "<td> <b>" + child_snapshots[i].Date_And_Time.substring(0, 24) + "</b> </td>" +
                                "<td>" + child_snapshots[i].key + "</td>" +
                            "</tr>";
                }
            }

            document.getElementById("Blackspot_Search_Results_Table_Body").innerHTML = list_of_blackspots;
        });

        console.log("Blackspot Search Results Successfull");
    }
    catch (error) {
        console.log(error);
    }
}




/* Function to display Blackspot Search Results */
function Blackspot_Search_Results (input) {
    // var row_objects = document.getElementById("Blackspot_Search_Results").rows;

    // var table = document.createElement("table");

    // for (var i = 0; i < row_objects.length; i++) {
    //     if (row_objects[i].cells[0].innerHTML.includes(input)) {
    //         var row = document.createElement("tr");
    //         row.onclick = View_Blackspot_Details(this.cells[0].innerHTML, "Blackspot");
    //     }
    //     else {
    //         row_objects[i].style.display = "none";
    //     }
    // }
}



/* View details of clicked/selected Blackspot */
function View_Blackspot_Details (blackspot_id, data_type) {
    form_id = "View_Blackspot_Form";

    document.getElementById(form_id).reset();
    document.forms[form_id]["Remove_Picture"].value = "No";

    try {
        firebase.database().ref("Blackspot/" + blackspot_id).once('value').then(function(snapshot) {
            /* ---------------- Unique Content ---------------- */
            document.forms[form_id]["ID"].value = snapshot.key;
            /* ---------------- End - Unique Content ---------------- */

            /* ---------------- Common Content ---------------- */
            document.forms[form_id]["COORDINATES"].value = snapshot.child("Location_Coordinates").child("lat").val() + "," + snapshot.child("Location_Coordinates").child("lng").val();

            if (snapshot.child("Image").val() == null) {
                document.getElementById("Blackspot_Image_Object_ID").src = "img/Empty_Image/Empty_Image.png";
            }
            else {
                document.getElementById("Blackspot_Image_Object_ID").src = snapshot.child("Image").val();
            }
            
            document.forms[form_id]["LEVEL_OF_RISK"].value = snapshot.child("Level_Of_Risk").val();
            
            var description_object = snapshot.child("Description").val();
            if (Array.isArray(description_object)) {
                var description_string = "";
                for (var i = 0; i < description_object.length; i++) {
                    description_string += (i+1) + ": " + description_object[i];
                    if (i  !=  (description_object.length - 1)) {
                        description_string += "\n";
                    }
                }
                document.forms[form_id]["DESCRIPTION"].value = description_string;
            }
            else {
                document.forms[form_id]["DESCRIPTION"].value = description_object;
            }
            /* ---------------- End - Common Content ---------------- */
        });

        // document.getElementById("Blackspot_Search_Bar").style.display = "none";
        document.getElementById("Blackspot_Search_Results").style.display = "none";
        document.getElementById("View_Blackspot_Form").style.display = "block";

        Switch_Close_and_Go_Back_Buttons("Go Back Button");
        
        console.log ("View Blackspot Details");
    }
    catch (error) {
        console.log(error);
    }
}


/* To validate View_Blackspot_Form */
function validate_View_Blackspot_Form(form_id) {
    var location_coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (location_coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((location_coordinates[0] != parseFloat(location_coordinates[0]))  ||  (location_coordinates[1] != parseFloat(location_coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}




/* To delete the selected Blackspot */
function Delete_Blackspot (form_id) {
    var id = document.forms[form_id]["ID"].value;
    var description = document.forms[form_id]["DESCRIPTION"].value;

    if (confirm("Are you sure?")) {
        try {
            var data = {
                Description : [description, "Delete Blackspot - By - " + CURRENT_USER_ID + "\n-----" + FCM_TOKEN],
                Last_Updated : String(new Date()),
                Status : "Cleared"
            }

            firebase.database().ref("Blackspot/" + id).update(data).then(function(snapshot) {
                alert("Blackspot deleted successfully.");
                console.log("Blackspot deleted successfully.");

                Display_Blackspot_List();
            });
        }
        catch (error) {
            console.log("Delete Blackspot Unsuccessfull");
            console.log(error);
        }

        // firebase.database().ref("Blackspot/" + id).once('value').then(function(snapshot) {
        //     console.log(snapshot.child("Image").val());

        //     var image_url = snapshot.child("Image").val();

        //     snapshot.ref.remove().then(function() {
        //         console.log("Delete Blackspot Successfull");

        //         if (image_url != null) {
        //             firebase.storage().ref().child("Blackspot/" + id + "/Image").delete().then(function() {
        //                 Display_Blackspot_List();

        //                 console.log("Delete Image from storage Successfull");
        //             }).catch (function(error) {
        //                 console.log("Delete Image from storage Unsuccessfull");
        //                 console.log(error);
        //             });
        //         }
        //         else {
        //             Display_Blackspot_List();
        //         }
        //     }).catch (function(error) {
        //         console.log("Delete Blackspot Unsuccessfull");
        //         console.log(error);
        //     });
        // }).catch (function(error) {
        //     console.log(error);
        // });
    }
}




/* -------- View Reported Zones -------- */

/* To Display List_Of_Reported_Zones window */
function Display_Reported_Zone_List () {
    document.getElementById("Reported_Zones").style.display = "block";
    document.getElementById("View_Zone_Form").style.display = "none";

    Switch_Close_and_Go_Back_Buttons("Close Button");
}


/* View Reported Zones */
function Load_Reported_Zones () {
    try {
        firebase.database().ref("Unsafe_Zone/").on('value', function(snapshot) {
            var list_of_reported_zones = "";
            var child_snapshots = [];

            snapshot.forEach(function(childSnapshot) {
                var temp = childSnapshot.toJSON();
                temp.key = childSnapshot.key;

                child_snapshots.push(temp);
            });

            for (var i = child_snapshots.length - 1; i >= 0; i--) {
                if (child_snapshots[i].Status  ==  "Active") {
                    list_of_reported_zones += "<tr onclick='View_Zone_Details(this.cells[1].innerHTML, " + '"Unsafe_Zone"' + ")'>" +
                                "<td> <b>" + child_snapshots[i].Date_And_Time.substring(0, 24) + " </b> </td>" +
                                "<td>" + child_snapshots[i].key + "</td>" +
                            "</tr>";
                }
            }

            document.getElementById("Reported_Zones_Table_Body").innerHTML = list_of_reported_zones;
        });

        console.log("View Reported Zones Successfull");
    }
    catch (error) {
        console.log(error);
    }
}



/* View details of clicked/selected Zone Report */
function View_Zone_Details (zone_id, data_type) {
    form_id = "View_Zone_Form";

    document.getElementById(form_id).reset();
    document.forms[form_id]["Remove_Picture"].value = "No";

    try {
        firebase.database().ref("Unsafe_Zone/" + zone_id).once('value').then(function(snapshot) {
            /* ---------------- Unique Content ---------------- */
            document.forms[form_id]["ID"].value = snapshot.key;

            if (data_type == "Unsafe_Zone") {
                document.forms[form_id]["Reporter_ID"].value = snapshot.child("Reported_By").val();

                document.forms[form_id]["Image_URL"].value = snapshot.child("Image").val();
            }
            /* ---------------- End - Unique Content ---------------- */

            /* ---------------- Common Content ---------------- */
            document.forms[form_id]["COORDINATES"].value = snapshot.child("Location_Coordinates").child("lat").val() + "," + snapshot.child("Location_Coordinates").child("lng").val();

            if (snapshot.child("Image").val() == null) {
                document.getElementById("Unsafe_Zone_Image_Object_ID").src = "img/Empty_Image/Empty_Image.png";
            }
            else {
                document.getElementById("Unsafe_Zone_Image_Object_ID").src = snapshot.child("Image").val();
            }
            
            document.forms[form_id]["LEVEL_OF_RISK"].value = snapshot.child("Level_Of_Risk").val();
            document.forms[form_id]["DESCRIPTION"].value = snapshot.child("Description").val();
            /* ---------------- End - Common Content ---------------- */
        });

        document.getElementById("Reported_Zones").style.display = "none";
        document.getElementById("View_Zone_Form").style.display = "block";

        Switch_Close_and_Go_Back_Buttons("Go Back Button");

        console.log ("View Zone Details");
    }
    catch (error) {
        console.log(error);
    }
}




/* To validate View_Zone_Form */
function validate_View_Zone_Form (form_id) {
    var location_coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (location_coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((location_coordinates[0] != parseFloat(location_coordinates[0]))  ||  (location_coordinates[1] != parseFloat(location_coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    // if (document.getElementById(form_id).validate()) {
    //     return true;
    // }
    // else {
    //     return false;
    // }

    return true;
}



/* To delete the selected Reported Zone */
function Delete_Reported_Zone () {
    var id = document.forms[form_id]["ID"].value;
    var description = document.forms[form_id]["DESCRIPTION"].value;

    if (confirm("Are you sure?")) {
        try {
            var data = {
                Description : [description, "Delete Unsafe Zone - By - " + CURRENT_USER_ID + "\n-----" + FCM_TOKEN],
                Status : "Cleared"
            }

            firebase.database().ref("Unsafe_Zone/" + id).update(data).then(function(snapshot) {
                alert("Unsafe Zone deleted successfully.");
                console.log("Unsafe Zone deleted successfully.");

                Display_Reported_Zone_List();
            });
        }
        catch (error) {
            console.log("Delete Unsafe Zone Unsuccessfull");
            console.log(error);
        }


        // firebase.database().ref("Unsafe_Zone/" + id).once('value').then(function(snapshot) {
        //     var image_url = snapshot.child("Image").val();

        //     snapshot.ref.remove().then(function() {
        //         console.log("Delete Unsafe_Zone Successfull");

        //         if (image_url != null) {
        //             firebase.storage().ref().child("Unsafe_Zone/" + id + "/Image").delete().then(function() {
        //                 Display_Reported_Zone_List();

        //                 console.log("Delete Image from storage Successfull");
        //             }).catch (function(error) {
        //                 console.log("Delete Image from storage Unsuccessfull");
        //                 console.log(error);
        //             });
        //         }
        //         else {
        //             Display_Reported_Zone_List();
        //         }
        //     }).catch (function(error) {
        //         console.log("Delete Unsafe_Zone Unsuccessfull");
        //         console.log(error);
        //     });
        // }).catch (function(error) {
        //     console.log(error);
        // });
    }
}















/* -------------------------------------------------------
                        Setting
------------------------------------------------------- */

/* ------------------- Vehicle ------------------- */

/* -------- View Details -------- */

/* Load the Vehicle_Details_Form with details of current Vehicle User */
function Load_Vehicle_Details () {
    var form_id = "View_Vehicle_Details_Form";

    try {
        firebase.database().ref("User/" + CURRENT_USER_ID + "/Vehicle").on('value', function(snapshot) {
            document.forms[form_id]["VEHICLE_REGISTRATION_NUMBER"].value = snapshot.child("Registration_No").val();
            document.forms[form_id]["VEHICLE_MODEL"].value = snapshot.child("Model").val();
            document.forms[form_id]["VEHICLE_RC_NUMBER"].value = snapshot.child("RC_No").val();
            document.forms[form_id]["VEHICLE_INSURANCE_NUMBER"].value = snapshot.child("Insurance_No").val();

            var safety_features = snapshot.child("Safety_Features").val();
            var vehicle_safety_features_CLASS_OBJECT = document.getElementsByClassName("Vehicle_Safety_Features");
            for (var i = 0; i < vehicle_safety_features_CLASS_OBJECT.length; i++) {
                if (safety_features != null) {
                    if (safety_features.includes(vehicle_safety_features_CLASS_OBJECT[i].value)) {
                        vehicle_safety_features_CLASS_OBJECT[i].checked = true;
                    }
                    else {
                        vehicle_safety_features_CLASS_OBJECT[i].checked = false;
                    }
                }
                else {
                    vehicle_safety_features_CLASS_OBJECT[i].checked = false;
                }
            }

            document.forms[form_id]["VEHICLE_HEALTH"].value = snapshot.child("Vehicle_Health").val();
        });

        console.log ("View Vehicle Details");
    }
    catch (error) {
        console.log(error);
    }
}






/* To Add/Modify Vehicle details - Depending on the requirement */
function Add_OR_Modify_Vehicle_Details (form_id) {
    /* ---------------- Common Content ---------------- */ 
    var vehicle_registration_number = document.forms[form_id]["VEHICLE_REGISTRATION_NUMBER"].value;
    var vehicle_model = document.forms[form_id]["VEHICLE_MODEL"].value;
    var vehicle_rc_number = document.forms[form_id]["VEHICLE_RC_NUMBER"].value;
    var vehicle_insurance_number = document.forms[form_id]["VEHICLE_INSURANCE_NUMBER"].value;
    
    var vehicle_safety_features = [];
    if (document.forms[form_id]["AIRBAGS"].checked) {
        vehicle_safety_features.push("Airbags");
    }
    if (document.forms[form_id]["ALL_WHEEL_DRIVE"].checked) {
        vehicle_safety_features.push("All-Wheel Drive");
    }
    if (document.forms[form_id]["ABS"].checked) {
        vehicle_safety_features.push("ABS");
    }
    if (document.forms[form_id]["ELECTRONIC_STABILITY_CONTROL"].checked) {
        vehicle_safety_features.push("Electronic Stability Control");
    }
    
    var vehicle_health = document.forms[form_id]["VEHICLE_HEALTH"].value;
    /* ---------------- End - Common Content ---------------- */

    var data = {
        Insurance_No : vehicle_insurance_number,
        Model : vehicle_model,
        RC_No : vehicle_rc_number,
        Registration_No : vehicle_registration_number,
        Safety_Features : vehicle_safety_features,
        Vehicle_Health : vehicle_health
    };

    
    if (form_id == "Add_Vehicle_Details_Form") {
        try {
            var new_user_type = "Vehicle_User";
            
            firebase.database().ref("User/" + CURRENT_USER_ID + "/Vehicle").update(data).then(function() {
                alert("Switched to " + new_user_type + " type successfully.");

                console.log("Add Vehicle Details Successfull");
                console.log("Switch to Vehicle User Type Successfull");
                firebase.database().ref("User/" + CURRENT_USER_ID).update({Blackbox_ID : "", Role : new_user_type.replace(/_/g, " ")}).then(function() {
                    // Change_User(new_user_type);

                    // show_hide_content('HOME_PAGE');
                    
                    // alert("Switched to " + new_user_type + " type successfully.");

                    // Go_Back_To_Initial_State();

                    // console.log("Add Vehicle Details Successfull");
                    // console.log("Switch to Vehicle User Type Successfull");
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    else if (form_id == "View_Vehicle_Details_Form") {
        try {
            firebase.database().ref("User/" + CURRENT_USER_ID + "/Vehicle").update(data);

            show_hide_content("HOME_PAGE");
            
            console.log ("Modify Vehicle Details Successfull");
        }
        catch (error) {
            console.log(error);
        }
    }
}




/* To validate View_Vehicle_Details_Form */
function validate_View_Vehicle_Details_Form (form_id) {
    return true;
}








/* ------------------- Blackbox ------------------- */

/* Function show/hide Blackbox SubMenus - depending on whether the
    Vehicle User has already added a blackspot or not */
function Adjust_Blackbox_SubMenu_Content () {
    firebase.database().ref("User/" + CURRENT_USER_ID + "/Blackbox_ID").on("value", function(snapshot) {
        console.log("adjust: " + snapshot.val());

        BLACKBOX_ID = snapshot.val();
        
        if (BLACKBOX_ID == "") {
            document.getElementById("Add_Blackbox_Sidebar_Submenu").style.display = "block";
            
            document.getElementById("Replace_Blackbox_Sidebar_Submenu").style.display = "none";
            document.getElementById("Check_Blackbox_Status_Sidebar_Submenu").style.display = "none";
            document.getElementById("Remove_Blackbox_Sidebar_Submenu").style.display = "none";
        }
        else {
            document.getElementById("Add_Blackbox_Sidebar_Submenu").style.display = "none";
            
            document.getElementById("Replace_Blackbox_Sidebar_Submenu").style.display = "block";
            document.getElementById("Check_Blackbox_Status_Sidebar_Submenu").style.display = "block";
            document.getElementById("Remove_Blackbox_Sidebar_Submenu").style.display = "block";
        }
    });
}




/* -------- Add Blackbox, Replace Blackbox -------- */

/* Function to replace current Blackbox with a new one */
function Add_OR_Replace_Blackbox (form_id) {
    var blackbox_id = document.forms[form_id]["BLACKBOX_ID"].value;
    var activation_code = document.forms[form_id]["ACTIVATION_CODE"].value;
    
    try {
        firebase.database().ref("Blackbox/" + blackbox_id).once('value').then(function(blackboxSnapshot) {
            if (activation_code == blackboxSnapshot.child("Activation_Code").val()) {   // Verify Avtivation Code of new Blackbox
                if (blackboxSnapshot.child("User_ID").val() == null) {    // Check if the requested Blackbox is occupied or not
                    if (form_id == "Replace_Blackbox_Form") {
                        /* Set data of Current Blackbox */
                        firebase.database().ref("User/" + CURRENT_USER_ID).once('value').then(function(userSnapshot) {
                            firebase.database().ref("Blackbox/" + userSnapshot.child("Blackbox_ID").val()).update({User_ID : null});
                        });
                    }

                    /* Update to New Blackbox */
                    firebase.database().ref("User/" + CURRENT_USER_ID).update({Blackbox_ID : blackboxSnapshot.key}).then(function() {
                        blackboxSnapshot.ref.update({User_ID : firebase.auth().currentUser.uid}).then(function() {
                            show_hide_content('HOME_PAGE');
                            Reset_User_Filled_Forms();
                            
                            if (form_id == "Add_Blackbox_Form") {
                                // Adjust_Blackbox_SubMenu_Content();
                            }

                            // Load_Blackbox_Status();

                            console.log ("Add/Replace Blackbox Successfull");
                            alert("Blackbox added successfully.")

                            Go_Back_To_Initial_State();
                        });
                    });
                }
                else {
                    alert("This blackbox is already in use! ...... Please try again with an unoccupied Blackbox");
                }
            }
            else {
                alert("Invalid Credentials! ...... Try Again");
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}


/* To validate Add_Blackbox_Form */
function validate_Add_Blackbox_Form (form_id) {
    return true;
}


/* To validate Replace_Blackbox_Form */
function validate_Replace_Blackbox_Form (form_id) {
    return true;
}



/* -------- Check Status -------- */

/* To validate Blackbox_Status_Form */
function validate_Blackbox_Status_Form (form_id) {
    return true;
}


/* Function to Load Blackbox_Status Form/Window */
function Load_Blackbox_Status () {
    firebase.database().ref("User/" + CURRENT_USER_ID + "/Blackbox_ID").once("value").then(function(user_snapshot) {
        BLACKBOX_ID = user_snapshot.val();

        console.log("load: " + BLACKBOX_ID);

        if (BLACKBOX_ID != "") {
            try {
                firebase.database().ref("Blackbox/" + BLACKBOX_ID).on("value", function(blackbox_snapshot) {
                    document.forms["Blackbox_Status_Form"]["BLACKBOX_ID"].value = BLACKBOX_ID;
                    
                    if (blackbox_snapshot.child("Blackbox_Status").val() == "On") {
                        document.getElementById("Blackbox_Status_On").style.display = "block";
                        document.getElementById("Blackbox_Status_Off").style.display = "none";
                    }
                    else if (blackbox_snapshot.child("Blackbox_Status").val() == "Off") {
                        document.getElementById("Blackbox_Status_On").style.display = "none";
                        document.getElementById("Blackbox_Status_Off").style.display = "block";
                    }
                    
                    if (blackbox_snapshot.child("Accelerometer_Status").val() == "On") {
                        document.getElementById("Accelerometer_Status_On").style.display = "block";
                        document.getElementById("Accelerometer_Status_Off").style.display = "none";
                    }
                    else if (blackbox_snapshot.child("Accelerometer_Status").val() == "Off") {
                        document.getElementById("Accelerometer_Status_On").style.display = "none";
                        document.getElementById("Accelerometer_Status_Off").style.display = "block";
                    }
                    
                    if (blackbox_snapshot.child("Proximity_Sensor_Status").val() == "On") {
                        document.getElementById("Proximity_Sensor_Status_On").style.display = "block";
                        document.getElementById("Proximity_Sensor_Status_Off").style.display = "none";
                    }
                    else if (blackbox_snapshot.child("Proximity_Sensor_Status").val() == "Off") {
                        document.getElementById("Proximity_Sensor_Status_On").style.display = "none";
                        document.getElementById("Proximity_Sensor_Status_Off").style.display = "block";
                    }
                    
                    // document.forms["Blackbox_Status_Form"]["STATUS"].value = "On";
                    
                    // document.forms["Blackbox_Status_Form"]["ACCELEROMETER_STATUS"].value = "On";
                    // document.forms["Blackbox_Status_Form"]["PROXIMITY_SENSOR_STATUS"].value = "On";
                    
                    document.forms["Blackbox_Status_Form"]["OVERALL_HEALTH"].value = blackbox_snapshot.child("Overall_Health").val();
                    
                    console.log ("Check Blsckbox Status Successfull");
                });
            }
            catch(error) {
                console.log(error);
            }
        }
    }).catch(function(error) {
        console.log(error);
    });
}




/* -------- Remove Blackbox -------- */

/* To validate Verify_Current_Password_Form_FOR_Remove_Blackbox */
function validate_Verify_Current_Password_Form_FOR_Remove_Blackbox (form_id) {
    return true;
}




/* ------------------- Map & Location Configuration ------------------- */

/* -------- Map Configuration -------- */

/* View Map Configuration */
function Load_Map_Configuration () {
    var form_id = "Map_Configuration_Form";

    try {
        firebase.database().ref("User/" + CURRENT_USER_ID + "/Map_Configuration").on('value', function(snapshot) {
            console.log ("****************************************" + document.forms[form_id]["VIEW_TYPE"].value);
            
            document.forms[form_id]["VIEW_TYPE"].value = snapshot.child("View_Type").val();

            var information_to_be_displayed_on_marker = snapshot.child("Information_To_Be_Displayed_On_Marker").val();
            var information_to_be_displayed_on_marker_CLASS_OBJECT = document.getElementsByClassName("Information_To_Be_Displayed_On_Marker_FOR_Map_Configuration_Form");
            for (var i = 0; i < information_to_be_displayed_on_marker_CLASS_OBJECT.length; i++) {
                if (information_to_be_displayed_on_marker != null) {
                    if (information_to_be_displayed_on_marker.includes(information_to_be_displayed_on_marker_CLASS_OBJECT[i].value)) {
                        information_to_be_displayed_on_marker_CLASS_OBJECT[i].checked = true;
                    }
                    else {
                        information_to_be_displayed_on_marker_CLASS_OBJECT[i].checked = false;
                    }
                }
                else {
                    information_to_be_displayed_on_marker_CLASS_OBJECT[i].checked = false;
                }
            }

            path_preference = snapshot.child("Path_Preference").val();
            if (path_preference == "Shortest Path") {
                document.getElementById(form_id + "_SHORTEST_PATH").checked = true;
            }
            else if (path_preference == "Safest Path") {
                document.getElementById(form_id + "_SAFEST_PATH").checked = true;
            }

            console.log ("View Map Configuration Successfull");
        });
    }
    catch (error) {
        console.log(error);
    };
}



/* To validate Map_Configuration_Form */
function validate_Map_Configuration_Form (form_id) {
    return true;
}



/* Modify Map Configuration */
function Modify_Map_Configuration (form_id) {
    view_type = document.forms[form_id]["VIEW_TYPE"].value;

    var information_to_be_displayed_on_marker = [];
    var information_to_be_displayed_on_marker_CLASS_OBJECT = document.getElementsByClassName("Information_To_Be_Displayed_On_Marker_FOR_Map_Configuration_Form");
    for (var i = 0; i < information_to_be_displayed_on_marker_CLASS_OBJECT.length; i++) {
        if (information_to_be_displayed_on_marker_CLASS_OBJECT[i].checked) {
            information_to_be_displayed_on_marker.push(information_to_be_displayed_on_marker_CLASS_OBJECT[i].value);
        }
    }

    var path_preference;
    if (document.getElementById(form_id + "_SHORTEST_PATH").checked) {
        path_preference = document.getElementById(form_id + "_SHORTEST_PATH").value;
    }
    else if (document.getElementById(form_id + "_SAFEST_PATH").checked) {
        path_preference = document.getElementById(form_id + "_SAFEST_PATH").value;
    }

    var data = {
        View_Type : view_type,
        Information_To_Be_Displayed_On_Marker : information_to_be_displayed_on_marker,
        Path_Preference : path_preference
    };

    try {
        if (firebase.database().ref("User/" + CURRENT_USER_ID + "/" + "Map_Configuration").update(data)) {
            console.log ("Modify Map Configuration Successfull");

            Go_Back_To_Initial_State();
        }
        else {
            console.log ("Modify Map Configuration Unsuccessfull");
        }
    }
    catch (error) {
        console.log(error);
    }
}





/* -------- Location Settings -------- */

/* Load Current User's Location Configuration */
// function Load_Location_Settings () {
//     var form_id = "Location_Settings_Form";

//     try {
//         firebase.database().ref("User/" + CURRENT_USER_ID + "/Location_Settings").on('value', function(snapshot) {
//             document.forms[form_id]["GPS_Module"].value = snapshot.child("GPS_Module").val();


//             if (snapshot.child("Use_Wifi").val() == "Yes") {
//                 document.getElementById("USE_WIFI_YES").checked = true;
//             }
//             else if (snapshot.child("Use_Wifi").val() == "No") {
//                 document.getElementById("USE_WIFI_NO").checked = true;
//             }

//             if (snapshot.child("Use_Bluetooth").val() == "Yes") {
//                 document.getElementById("USE_BLUETOOTH_YES").checked = true;
//             }
//             else if (snapshot.child("Use_Bluetooth").val() == "No") {
//                 document.getElementById("USE_BLUETOOTH_NO").checked = true;
//             }
//         });

//         console.log ("View Location Settings Successfull");
//     }
//     catch (error) {
//         console.log(error);
//     }
// }



/* To validate Location_Settings_Form */
// function validate_Location_Settings_Form (form_id) {
//     return true;
// }



/* Modify Location Setting */
// function Modify_Location_Settings (form_id) {
//     var gps_module = document.forms[form_id]["GPS_Module"].value;


//     var use_wifi;
//     if (document.getElementById("USE_WIFI_YES").checked) {
//         use_wifi = document.getElementById("USE_WIFI_YES").value;
//     }
//     else if (document.getElementById("USE_WIFI_NO").checked) {
//         use_wifi = document.getElementById("USE_WIFI_NO").value;
//     }


//     var use_bluetooth;
//     if (document.getElementById("USE_BLUETOOTH_YES").checked) {
//         use_bluetooth = document.getElementById("USE_BLUETOOTH_YES").value;
//     }
//     else if (document.getElementById("USE_BLUETOOTH_NO").checked) {
//         use_bluetooth = document.getElementById("USE_BLUETOOTH_NO").value;
//     }

//     var data = {
//         GPS_Module : gps_module,
//         Use_Wifi : use_wifi,
//         Use_Bluetooth : use_bluetooth
//     };

//     try {
//         if (firebase.database().ref("User/" + CURRENT_USER_ID + "/" + "Location_Settings").update(data)) {
//             console.log ("Modify Location Settings Successfull");
//         }
//         else {
//             console.log ("Modify Location Settings Unsuccessfull");
//         }
//     }
//     catch (error) {
//         console.log (error);
//     }
// }












/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */





/* ------------------- Emergency Contact ------------------- */

/* -------- View Contacts -------- */

/* Function to display Emergency_Contact_List Window */
function Display_Emergency_Contact_List_Window () {
    document.getElementById("View_Emergency_Contacts_Window").style.display = "block";
    document.getElementById("Add_Emergency_Contact_Form").style.display = "none";

    Switch_Close_and_Go_Back_Buttons("Close Button");
}

/* Function to load Emergency_Contact_List */
function Load_Emergency_Contact_List () {
    try {
        firebase.database().ref("User/" + CURRENT_USER_ID + "/Emergency_Contact").on('value', function(snapshot) {
            var emergency_contact_list = "";
            
            snapshot.forEach(function(childSnapshot) {
                emergency_contact_list += "<tr class='tr_multi no_hover'>" +
                            "<td class='td_multi Emergency_Contact_List_Table_Body_td'>" +
                                childSnapshot.val() +
                            "</td>" +
                            "<td>" +
                                "<i class='fa fa-close delete_icon' aria-hidden='true' style='font-size: 25px' onclick='javascript: Delete_Emergency_Contact(" + '"' + childSnapshot.val() + '"' + ");'> </i>" +
                            "</td>" +
                        "</tr>";
            });

            document.getElementById("Emergency_Contact_List_Table_Body_Id").innerHTML = emergency_contact_list;

            console.log("View Emergency Contact List Successfull");
        });
            
        Display_Emergency_Contact_List_Window();
    }
    catch(error) {
        console.log(error);
    }
}




/* -------- Add Contact -------- */

/* Function to view/display Add_Emergency_Contact_Form */
function View_Add_Emergency_Contact_Form (form_id) {
    document.getElementById("View_Emergency_Contacts_Window").style.display = "none";
    document.getElementById("Add_Emergency_Contact_Form").style.display = "block";

    Switch_Close_and_Go_Back_Buttons("Go Back Button");
}


/* Function to send request for "Add_Emergency_Contact_List" */
function Send_Request_FOR_Add_To_Emergency_Contact_List (form_id) {
    var reciever_email_id = document.forms[form_id]["EMAIL_ID"].value;

    if (reciever_email_id != firebase.auth().currentUser.email) {
        firebase.database().ref('User/').once('value').then(function(user_snapshot) {
            var exists = false;
    
            user_snapshot.forEach(function(receiver_childSnapshot) {
                if (receiver_childSnapshot.child("Email_ID").val() == reciever_email_id) {
                    console.log ("Receiver_User found successfully.");
                    
                    exists = true;

                    firebase.database().ref('User/' + CURRENT_USER_ID).once('value').then(function(current_user_snapshot) {
                        var emergency_contact_list_ARRAY = [];

                        if (current_user_snapshot.child("Emergency_Contact").val() != null) {
                            emergency_contact_list_ARRAY = current_user_snapshot.child("Emergency_Contact").val();
                        }

                        if (!emergency_contact_list_ARRAY.includes(reciever_email_id)) {
                            if (receiver_childSnapshot.child("Role").val() == "Emergency Service User") {
                                alert("The user you have entered, is an Emergency Service User! .... Please try again with a Simple or Vehicle User.");
                                
                                console.log("The user you have entered, is an Emergency Service User! .... Please try again with a Simple or Vehicle User.");
                            }
                            else {
                                firebase.database().ref("Request/").once("value").then(function(request_snapshot) {
                                    var pending_request_to_receiever_exists = false;
                                    var pending_request_from_receiever_exists = false;
                                    
                                    request_snapshot.forEach(function(request_childSnapshot) {
                                        if ((request_childSnapshot.child("From").val() == firebase.auth().currentUser.email)  &&  (request_childSnapshot.child("To").val() == reciever_email_id) &&  (request_childSnapshot.child("Request_Type").val() == "Add To Emergency Contact List")  &&  (request_childSnapshot.child("Response").val() == "Pending")) {
                                            console.log("a");
                                            pending_request_to_receiever_exists = true;
                                        }

                                        if ((request_childSnapshot.child("From").val() == reciever_email_id)  &&  (request_childSnapshot.child("To").val() == firebase.auth().currentUser.email) &&  (request_childSnapshot.child("Request_Type").val() == "Add To Emergency Contact List")  &&  (request_childSnapshot.child("Response").val() == "Pending")) {
                                            console.log("b");
                                            pending_request_from_receiever_exists = true;
                                        }
                                    });


                                    if (pending_request_to_receiever_exists) {
                                        alert("A pending request to " + reciever_email_id + " already exists! .... Please Try again with a valid user.");
                                        
                                        console.log("A pending request to " + reciever_email_id + " already exists! .... Please Try again with a valid user.");
                                    }
                                    else if (pending_request_from_receiever_exists) {
                                        alert("A pending request from " + reciever_email_id + " already exists! .... Please accept the same  OR  Try agin with a valid user.");
                                        
                                        console.log("A pending request to " + reciever_email_id + " already exists! .... Please Try again with a valid user.");
                                    }
                                    else {
                                        console.log("c");

                                        if (confirm("A request will now be sent to " + reciever_email_id + ". Are you sure you want to continue?")) {
                                            var data = {
                                                From : firebase.auth().currentUser.email,
                                                To : reciever_email_id,
                                                Request_Type : "Add To Emergency Contact List",
                                                Response : "Pending"
                                            };
                                            
                                            
                                            firebase.database().ref("Request/").push().set(data).then(function() {
                                                alert("Request to add to Emergency Contact List has been sent to " + reciever_email_id + ".\nPlease wait for response.");
                                                Reset_User_Filled_Forms();
                                                
                                                // show_hide_content('HOME_PAGE');
                                                
                                                /* View_Emergency_Contact_List */
                                                Display_Emergency_Contact_List_Window();

                                                // Switch_Close_and_Go_Back_Buttons("Close Button");
                                                
                                                // Load_Emergency_Contact_List();
                                                /* --------------------------- */
                                                
                                                
                                                
                                                console.log("Request to add to Emergency Contact List has been sent to " + reciever_email_id + ".\nPlease wait for response.");
                                            }).catch(function(error) {
                                                console.log("Sending Request Unsuccessfull");
                                                
                                                console.log(error);
                                            });
                                        }
                                    }
                                }).catch(function(error) {
                                    console.log(error);
                                });
                            }
                        }
                        else {
                            alert("Contact already exists! ... Please try again with a valid user.")
                
                            console.log("Contact already exists! ... Please try again with a valid user.");
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
            });
    
            if (!exists) {
                alert("No such user exists! .... Please try again.")
    
                console.log("No such user exists! .... Please try again.");
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    else {
        alert("You have entered your own Email ID! .... Please try again with a different user.");
        
        console.log("You have entered your own Email ID! .... Please try again with a different user.");
    }
}



/* To validate Add_Emergency_Contact_Form */
function validate_Add_Emergency_Contact_Form (form_id) {
    return true;
}





/* -------- Delete Contact -------- */

/* Delete the selected Emergency Contact */
function Delete_Emergency_Contact (email_id) {
    // var email_id = document.forms[form_id]["EMAIL_ID"].value;

    if (confirm("Are you sure?")) {
        /* Delete from "Contact 1's" List */
        firebase.database().ref("User/" + CURRENT_USER_ID + "/Emergency_Contact").once("value").then(function(emergency_contact__OF_current_user_snapshot) {
            console.log("out");

            if (emergency_contact__OF_current_user_snapshot.val() != null) {
                var emergency_contact_list_OF_current_user = emergency_contact__OF_current_user_snapshot.val();

                console.log(emergency_contact_list_OF_current_user);
                
                for (var j = 0; j < emergency_contact_list_OF_current_user.length; j++) {
                    if (emergency_contact_list_OF_current_user[j] == email_id) {
                        emergency_contact_list_OF_current_user.splice(j, NO_OF_DELETIONS);
                    }
                }

                console.log(emergency_contact_list_OF_current_user);
                firebase.database().ref("User/" + CURRENT_USER_ID).update({Emergency_Contact : emergency_contact_list_OF_current_user}).then(function() {
                    console.log("Done");
                });
            }
            
            // emergency_contact__OF_current_user_snapshot.forEach(function(emergency_contact__OF_current_user_childSnapshot) {
            //     if (emergency_contact__OF_current_user_childSnapshot.val() == email_id) {
            //         console.log("Read: " + emergency_contact__OF_current_user_childSnapshot.child("Email_ID").val() + " " + email_id);

            //         emergency_contact__OF_current_user_childSnapshot.ref.remove().then(function() {
            //             // Load_Emergency_Contact_List();
            //             Switch_Close_and_Go_Back_Buttons("Close Button");
                        
            //             console.log ("Delete Emergency Contact 1 Successfull");
            //         });
            //     }
            // });
        }).catch(function(error) {
            console.log(error);
        });


        /* Delete from Contact 2's List */
        firebase.database().ref("User/").once("value").then(function(other_user_snapshot) {
            other_user_snapshot.forEach(function(other_user_childSnapshot) {
                if (other_user_childSnapshot.child("Email_ID").val() == email_id) {
                    if (other_user_childSnapshot.child("Emergency_Contact").val() != null) {
                        var emergency_contact_list_OF_other_user = other_user_childSnapshot.child("Emergency_Contact").val();

                        for (var j = 0; j < emergency_contact_list_OF_other_user.length; j++) {
                            if (emergency_contact_list_OF_other_user[j] == firebase.auth().currentUser.email) {
                                emergency_contact_list_OF_other_user.splice(j, NO_OF_DELETIONS);
                            }
                        }

                        other_user_childSnapshot.ref.update({Emergency_Contact : emergency_contact_list_OF_other_user});
                    }

                    // other_user_childSnapshot.child("Emergency_Contact").forEach(function(emergency_contact__OF_other_user_childSnapshot) {
                    //     if (emergency_contact__OF_other_user_childSnapshot.val() == firebase.auth().currentUser.email) {
                    //         emergency_contact__OF_other_user_childSnapshot.ref.remove().then(function() { 
                    //             // Load_Emergency_Contact_List();
                    //             Switch_Close_and_Go_Back_Buttons("Close Button");
                                
                    //             console.log ("Delete Emergency Contact 2 Successfull");
                    //         });
                    //     }
                    // });
                }
            });
        }).catch(function(error) {
            console.log(error);
        });
    }
}







/* -------------------------------------------------------
            Bottom Navigation Bar - Functions
------------------------------------------------------- */

/* ------------------- Requests ------------------- */

/* To load list of Pending & Accepted Requests */
function Load_Requests () {
    try {
        firebase.database().ref("Request/").on('value', function(snapshot) {
            var list_of_pending_requests = "";
            var list_of_accepted_requests = "";
            var list_of_rejected_requests = "";

            var list_of_sent_pending_requests = "";
            var list_of_cancelled_requests = "";
            var list_of_sent_rejected_requests = "";

            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.child("To").val()  == firebase.auth().currentUser.email) {
                    if (childSnapshot.child("Response").val() == "Pending") {
                        list_of_pending_requests += "<tr>" +
                                    "<td>" +
                                        "<b>" +  childSnapshot.child("Request_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("From").val() +
                                    "</td>" +

                                    "<td>" +
                                        "<button class='Request_Buttons Accept-Request' onclick='javascript: Accept_Request(" + '"' + childSnapshot.key + '", "' + childSnapshot.child("Request_Type").val() + '"' + ")'> Accept </button> <br>" +
                                        "<button class='Request_Buttons Reject-Request' onclick='javascript: Change_Request_Response(" + '"' + childSnapshot.key + '", "' + 'Rejected' + '"' + ")'> Reject </button>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Accepted") {
                        list_of_accepted_requests += "<tr>" +
                                    "<td>" +
                                        "<b>" +  childSnapshot.child("Request_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("From").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Accepted </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Rejected") {
                        list_of_rejected_requests += "<tr>" +
                                    "<td>" +
                                        "<b>" +  childSnapshot.child("Request_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("From").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Rejected </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                }


                if (childSnapshot.child("From").val()  == firebase.auth().currentUser.email) {
                    if (childSnapshot.child("Response").val() == "Pending") {
                        list_of_sent_pending_requests += "<tr>" +
                                    "<td>" +
                                        "<b>" +  childSnapshot.child("Request_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Waiting for Response </b> <br>" +
                                        "<button class='Request_Buttons Cancel-Request' onclick='javascript: Change_Request_Response(" + '"' + childSnapshot.key + '", "' + 'Cancelled' + '"' + ")'> Cancel </button>" +
                                    "</td>" +
                                "</tr>";
                    }

                    if (childSnapshot.child("Response").val() == "Rejected") {
                        list_of_sent_rejected_requests += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Request_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Rejected </b>" +
                                    "</td>" +
                                "</tr>";
                    }


                    if (childSnapshot.child("Response").val() == "Cancelled") {
                        list_of_cancelled_requests += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Request_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Cancelled </b>" +
                                    "</td>" +
                                "</tr>";
                    }

                    if (childSnapshot.child("Response").val() == "Force Cancelled") {
                        list_of_cancelled_requests += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Request_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Force Cancelled </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                }
            });
            
            document.getElementById("Pending_Requests_List_Table_Body").innerHTML = list_of_pending_requests;
            document.getElementById("Accepted_Requests_List_Table_Body").innerHTML = list_of_accepted_requests;
            document.getElementById("Rejected_Requests_List_Table_Body").innerHTML = list_of_rejected_requests;
            
            document.getElementById("Sent_Pending_Requests_List_Table_Body").innerHTML = list_of_sent_pending_requests;
            document.getElementById("Sent_Rejected_Requests_List_Table_Body").innerHTML = list_of_sent_rejected_requests;
            document.getElementById("Cancelled_Requests_List_Table_Body").innerHTML = list_of_cancelled_requests;

            console.log("View Pending Requests List Successfull");
            console.log("View Accepted Requests List Successfull");
            console.log("View Rejected Requests List Successfull");
        });
    }
    catch (error) {
        console.log(error);
    }
}




/* To accept the clicked/selected Request */
function Accept_Request (request_key, request_type) {
    if (request_type == "Pass Vehicle Control") {
        if (confirm("Accepting this request will automatically 'Reject' the other 'Pass Vehicle Control' requests.\nAre you sure, you want to continue?")) {
            var old_user_type = "Simple_User";
            var new_user_type = "Vehicle_User";

            firebase.database().ref("Request/" + request_key).once('value').then(function(request_snapshot) {
                console.log("User Request Search Successfull.");

                request_snapshot.ref.update({Response : "Accepted"}).then(function() {
                    console.log("Mark Request as Accepted Succesfull");

                    firebase.database().ref("User/").once('value').then(function(from_snapshot) {
                        from_snapshot.forEach(function(from_childSnapshot) {
                            if (from_childSnapshot.child("Email_ID").val() == request_snapshot.child("From").val()) {
                                console.log("From_User Search Successfull");

                                firebase.database().ref("User/" + from_childSnapshot.key + "/Blackbox_ID").remove().then(function() {
                                    firebase.database().ref("User/" + from_childSnapshot.key + "/Vehicle").remove().then(function() {
                                        firebase.database().ref('User/' + from_childSnapshot.key).update({Role : old_user_type.replace(/_/g, " ")}).then(function() {
                                            var rejected_other_requests = false;

                                                firebase.database().ref("Request/").once("value").then(function(snapshot) {
                                                    var i = 0;

                                                    snapshot.forEach(function(childSnapshot) {
                                                        console.log(childSnapshot.val());

                                                        if ((childSnapshot.child("Request_Type").val() == "Pass Vehicle Control")  &&  (childSnapshot.child("Response").val() == "Pending")  &&  (childSnapshot.child("To").val() == firebase.auth().currentUser.email)) {
                                                            childSnapshot.ref.update({Response : "Rejected"});
                                                        }

                                                        console.log("hey " + i + " " + snapshot.numChildren());

                                                        if (i  ==  (snapshot.numChildren() - 1)) {
                                                            rejected_other_requests = true;
                                                        }

                                                        i++;
                                                    });
                                                });

                                                var time_interval = 100;
                                                var timer = setInterval (function() {
                                                    if (rejected_other_requests) {
                                                        clearInterval(timer);

                                                        var data = {
                                                            Blackbox_ID : from_childSnapshot.child("Blackbox_ID").val(),
                                                            Vehicle : from_childSnapshot.child("Vehicle").val(),
                                                            Role : new_user_type.replace(/_/g, " ")
                                                        }


                                                        if (from_childSnapshot.child("Blackbox_ID").val() != "") {
                                                            firebase.database().ref("Blackbox/" + from_childSnapshot.child("Blackbox_ID").val()).update({User_ID : firebase.auth().currentUser.uid}).then(function() {
                                                                console.log("Add Vehicle and Blackbox to new User Successfull.");
                                                                
                                                                alert("Pass Vehicle & Blackbox to new user successfull.");
                                                                console.log("Pass Vehicle & Blackbox to new user successfull.");
                                                                
                                                                firebase.database().ref('User/' + CURRENT_USER_ID).update(data).then(function() {
                                                                    // console.log("Add Vehicle and Blackbox to new User Successfull.");
                                                                    
                                                                    // alert("Pass Vehicle & Blackbox to new user successfull.");
                                                                    // console.log("Pass Vehicle & Blackbox to new user successfull.");
                                                                    
                                                                    // Change_User(new_user_type);
                                                                    
                                                                    // show_hide_content("HOME_PAGE");
                                                                    
                                                                    // Go_Back_To_Initial_State();
                                                                });
                                                                    });
                                                                }
                                                        else {
                                                            console.log("Add Vehicle and Blackbox to new User Successfull.");

                                                            alert("Pass Vehicle & Blackbox to new user successfull.");
                                                            console.log("Pass Vehicle & Blackbox to new user successfull.");
                                                            
                                                            firebase.database().ref('User/' + CURRENT_USER_ID).update(data).then(function() {
                                                                // console.log("Add Vehicle and Blackbox to new User Successfull.");
                                                                
                                                                // alert("Pass Vehicle & Blackbox to new user successfull.");
                                                                // console.log("Pass Vehicle & Blackbox to new user successfull.");
                                                                
                                                                // Change_User(new_user_type);
                                                                
                                                                // show_hide_content("HOME_PAGE");
                                                                
                                                                // Go_Back_To_Initial_State();
                                                            });
                                                        }
                                                        
                                                    }
                                                    else {
                                                        console.log("Still here");
                                                    }
                                                }, time_interval);
                                            });
                                        });
                                    });
                            }
                            else {
                                console.log("From_User Search Unsuccessfull");
                            }
                        });
                    });
                });
            }).catch(function(error) {
                console.log("User Request Search Unsuccessfull.");
                console.log(error);
            });
        }
    }
    else if (request_type == "Add To Emergency Contact List") {
        firebase.database().ref("Request/" + request_key).once('value').then(function(request_snapshot) {
            console.log("User Request Search Successfull.");

            request_snapshot.ref.update({Response : "Accepted"}).then(function() {
                console.log("Mark Request as Accepted Succesfull");

                /* Add Contact to "From_User" */ 
                firebase.database().ref("User/").once("value").then(function(user_snapshot) {
                    user_snapshot.forEach(function(from_user_childSnapshot) {
                        if (from_user_childSnapshot.child("Email_ID").val() == request_snapshot.child("From").val()) {
                            var emergency_contact_list_OF_from_user = [];
                            
                            if (from_user_childSnapshot.child("Emergency_Contact").val()  !=  null) {
                                emergency_contact_list_OF_from_user = from_user_childSnapshot.child("Emergency_Contact").val();
                            }

                            emergency_contact_list_OF_from_user.push(firebase.auth().currentUser.email);

                            from_user_childSnapshot.ref.update({Emergency_Contact : emergency_contact_list_OF_from_user}).then(function() {
                                console.log ("Emergency contact for From_User has been added successfully.");
                                
                                /* Add Contact to "To_User" */
                                firebase.database().ref("User/" + CURRENT_USER_ID).once("value").then(function(to_user_snapshot) {
                                    var emergency_contact_list_OF_To_User = [];

                                    if (to_user_snapshot.child("Emergency_Contact").val()  !=  null) {
                                        emergency_contact_list_OF_To_User = to_user_snapshot.child("Emergency_Contact").val();
                                    }
                                    
                                    emergency_contact_list_OF_To_User.push(request_snapshot.child("From").val());

                                    to_user_snapshot.ref.update({Emergency_Contact : emergency_contact_list_OF_To_User}).then(function () {
                                        Reset_User_Filled_Forms();

                                        alert ("Emergency contact has been added successfully.");
                                        console.log ("Emergency contact for To_User has been added successfully.");
                                    });
                                }).catch(function(error) {
                                    console.log(error);
                                });
                            });
                        }
                    });
                }).catch(function(error) {
                    console.log(error);
                });
            });
        }).catch(function(error) {
            console.log("User Request Search Unsuccessfull.");
            console.log(error);
        });
    }
}




/* To change the reponse of clicked/selected Request to "new_status" */
function Change_Request_Response (request_key, new_status) {
    firebase.database().ref("Request/" + request_key).update({Response : new_status}).then(function() {
        alert("Request has been " + new_status + " Sucessfully");
        console.log("Request has been " + new_status + " Sucessfully");
        
        // Go_Back_To_Initial_State();
    });
}


/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */








/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */


/* ------------------- Confirmations ------------------- */

/* To load list of Pending & Accepted Confirmations */
function Load_Confirmations () {
    try {
        firebase.database().ref("Accident_Confirmation/").on('value', function(snapshot) {
            var list_of_pending_confirmations = "";
            var list_of_accepted_confirmations = "";
            var list_of_rejected_confirmations = "";
            var list_of_expired_confirmations = "";
            var list_of_cleared_confirmations = "";

            var list_of_sent_pending_confirmations = "";
            var list_of_sent_accepted_confirmations = "";
            var list_of_cancelled_confirmations = "";
            var list_of_sent_rejected_confirmations = "";
            var list_of_sent_expired_confirmations = "";
            var list_of_sent_cleared_confirmations = "";

            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.child("To").val()  == firebase.auth().currentUser.email) {
                    if (childSnapshot.child("Response").val() == "Pending") {
                        list_of_pending_confirmations += "<tr>" +
                                    "<td>" +
                                        "<b>" + childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("From").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<button class='Request_Buttons Accept-Request' onclick='javascript: Accept_Confirmation(" + '"' + childSnapshot.key + '", "' + childSnapshot.child("Confirmation_Type").val() + '", "' + childSnapshot.child("User").val() + '"' + ")'> Accept </button> <br>" +
                                        "<button class='Request_Buttons Reject-Request' onclick='javascript: Change_Confirmation_Response(" + '"' + childSnapshot.key + '", "' + 'Rejected' + '"' + ")'> Reject </button>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Accepted") {
                        list_of_accepted_confirmations += "<tr>" +
                                    "<td>" +
                                        "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("From").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Accepted </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Rejected") {
                        list_of_rejected_confirmations += "<tr>" +
                                    "<td>" +
                                        "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("From").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Rejected </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Expired") {
                        list_of_expired_confirmations += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("From").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Expired </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Cleared") {
                        list_of_cleared_confirmations += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("From").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Cleared </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                }


                if (childSnapshot.child("From").val()  == firebase.auth().currentUser.email) {
                    if (childSnapshot.child("Response").val() == "Pending") {
                        list_of_sent_pending_confirmations += "<tr>" +
                                    "<td>" +
                                        "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Waiting for Response </b> <br>" +
                                        "<button class='Request_Buttons Cancel-Request' onclick='javascript: Change_Confirmation_Response(" + '"' + childSnapshot.key + '", "' + 'Cancelled' + '"' + ")'> Cancel </button>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Accepted") {
                        list_of_sent_accepted_confirmations += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Accepted </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Rejected") {
                        list_of_sent_rejected_confirmations += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Rejected </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Cancelled") {
                        list_of_cancelled_confirmations += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Cancelled </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Expired") {
                        list_of_sent_expired_confirmations += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> To: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Expired </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                    else if (childSnapshot.child("Response").val() == "Cleared") {
                        list_of_sent_cleared_confirmations += "<tr>" +
                                    "<td>" +
                                    "<b>" +  childSnapshot.child("Confirmation_Type").val() + "</b> <br>" +
                                        "<b> From: </b> " + childSnapshot.child("To").val() +
                                    "</td>" +
                                    
                                    "<td>" +
                                        "<b> Cleared </b>" +
                                    "</td>" +
                                "</tr>";
                    }
                }
            });

            
            document.getElementById("Pending_Confirmations_List_Table_Body").innerHTML = list_of_pending_confirmations;
            document.getElementById("Expired_Confirmations_List_Table_Body").innerHTML = list_of_expired_confirmations;
            document.getElementById("Accepted_Confirmations_List_Table_Body").innerHTML = list_of_accepted_confirmations;
            document.getElementById("Rejected_Confirmations_List_Table_Body").innerHTML = list_of_rejected_confirmations;
            document.getElementById("Cleared_Confirmations_List_Table_Body").innerHTML = list_of_cleared_confirmations;
            
            document.getElementById("Sent_Pending_Confirmations_List_Table_Body").innerHTML = list_of_sent_pending_confirmations;
            document.getElementById("Sent_Accepted_Confirmations_List_Table_Body").innerHTML = list_of_sent_accepted_confirmations;
            document.getElementById("Sent_Expired_Confirmations_List_Table_Body").innerHTML = list_of_sent_expired_confirmations;
            document.getElementById("Sent_Rejected_Confirmations_List_Table_Body").innerHTML = list_of_sent_rejected_confirmations;
            document.getElementById("Cancelled_Confirmations_List_Table_Body").innerHTML = list_of_cancelled_confirmations;
            document.getElementById("Sent_Cleared_Confirmations_List_Table_Body").innerHTML = list_of_sent_cleared_confirmations;

            console.log("View Pending Confirmations List Successfull");
            console.log("View Accepted Confirmations List Successfull");
            console.log("View Rejected Confirmations List Successfull");
        });
    }
    catch (error) {
        console.log(error);
    }
}




/* To accept the clicked/selected Confirmation */
function Accept_Confirmation (confirmation_id, confirmation_type, user_id) {
    firebase.database().ref("/Accident_Confirmation/" + confirmation_id).update({Response : "Accepted"}).then(function(accident_confirmation_snapshot) {
        if (confirmation_type == "Confirm own accident") {
            firebase.database().ref("/User" + firebase.auth().currentUser.uid).once("value").then(function(user_snapshot) {
                console.log("Accept Accident_Confirmation Successfull.");
                
                var date = new Date();
                
                var data = {
                    Blackbox : user_snapshot.child("Blackbox_ID").val(),
                    Date_And_Time : String(date),
                    Description : "Accident has been confirmed by the User(Driver) himself/herself.",
                    Location_Coordinates : CURRENT_LOCATION_COORDINATES,
                    User : user_id,
                    Vehicle_Registration_Number : user_snapshot.child("Vehicle").child("Registration_Number").val(),
                    Weight : 3
                };
                
                firebase.database().ref("/Accident_Possibility").push().set(data).then(function() {
                    alert("Accident has been confirmed successfully.");

                    console.log("Add Accident_Possibility Successfull.");
                });
            });
        }
        else if (confirmation_type == "Confirm friends accident") {
            firebase.database().ref("/User" + firebase.auth().currentUser.uid).once("value").then(function(user_snapshot) {
                console.log("Accept Accident_Confirmation Successfull.");

                var date = new Date();
                
                var data = {
                    Date_And_Time : String(date),
                    Description : "Accident has been confirmed by the Emergency Contact: " + firebase.auth().currentUser.email,
                    User : user_id,
                    Weight : 1
                };

                firebase.database().ref("/Accident_Possibility").push().set(data).then(function() {
                    alert("Accident has been confirmed successfully.");
                    
                    console.log("Add Accident_Possibility Successfull.");
                }).catch(function(error) {
                    console.error(error);
                });
            }).catch(function(error) {
                console.error(error);
            });
        }
    });
}




/* To change the reponse of clicked/selected Request to "new_status" */
function Change_Confirmation_Response (confirmation_id, new_status) {
    firebase.database().ref("Accident_Confirmation/" + confirmation_id).update({Response : new_status}).then(function() {
        alert("Confirmation has been " + new_status + " Sucessfully");
        console.log("Confirmation has been " + new_status + " Sucessfully");
        
        // Go_Back_To_Initial_State();
    });
}




/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
/* ------------------- Check ------------------- */
















/* ------------------- Messages ------------------- */

/* Function to display Meassage_List Window */
// function Display_Message_List () {
//     document.getElementById("Messages_List").style.display = "block";
//     document.getElementById("Message_Window").style.display = "none";

//     Switch_Close_and_Go_Back_Buttons("Close Button");
// }



// /* To load list of Messages */
// function Load_Messages () {
//     var list_of_messages = "";

//     for (var i = 0; i < MESSAGES.length; i++) {
//         list_of_messages += "<tr onclick='View_Message_Content(this.cells[0].innerHTML)'>" +
//                     "<td>" +
//                         MESSAGES[i].Subject + "<br>" +
//                         MESSAGES[i].Sender +
//                     "</td>" +
//                     "<td> </td>" +
//                 "</tr>";
//     }

//     document.getElementById("Messages_List_Table_Body").innerHTML = list_of_messages;
    
//     console.log("View Messages Successfull");
// }



// /* View Content of clicked/selected Notification */
// function View_Message_Content (message) {
//     var message_parameters = message.split("<br>");
 
//     var message_object;
//     for (var i = 0; i < MESSAGES.length; i++) {
//         if (MESSAGES[i].Subject == message_parameters[0]) {
//             message_object = MESSAGES[i];
//             break;
//         }
//     }

//     document.getElementById("Message_ID_FOR_Message_Window").innerHTML = message_object.ID;
//     document.getElementById("Message_Sender_FOR_Message_Window").innerHTML = message_object.Sender;
//     document.getElementById("Message_Subject_FOR_Message_Window").innerHTML = message_object.Subject;
//     document.getElementById("Message_Content_FOR_Message_Window").innerHTML = message_object.Content;
//     document.getElementById("Message_Time_FOR_Message_Window").innerHTML = message_object.Time;


//     document.getElementById("Messages_List").style.display = "none";
//     document.getElementById("Message_Window").style.display = "block";

//     Switch_Close_and_Go_Back_Buttons("Go Back Button");


//     console.log("View Message Content Successfull");
// }




// /* To delete the clicked/selected message */
// function Delete_Message () {
//     var message_id = document.getElementById("Message_ID_FOR_Message_Window").innerHTML;

//     Display_Message_List();
    

//     console.log("Delete " + message_id + " Successfull");
// }








/* ------------------- My Profile ------------------- */
/* Function to invoke input-type-file, to provide new_image input & Preview the new_image */
function Edit_Image (form_id, file_input_id) {
    document.forms[form_id][file_input_id].click();

    document.forms[form_id]["Remove_Picture"].value = "No";

    console.log("Edit Image - Requested");
}


/* Function to Preview selected new_image */
function Preview_Image (input, image_id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $("#"+ image_id).attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);

        console.log("Preview Image Successfull");
    }
}


/* Function to nullify the input-type-file input & clear the Preview Window by replacing the old picture with a common picture */
function Remove_Image (form_id, image_id) {
    if (form_id == "User_Profile_Info_FOR_My_Profile_Form") {
        if ((CURRENT_USER_TYPE == "Simple_User")  ||  (CURRENT_USER_TYPE == "Vehicle_User")) {
            firebase.database().ref('User/' + CURRENT_USER_ID).once('value').then(function(snapshot) {
                if (snapshot.child("Gender").val() == "Male"  ||  snapshot.child("Gender").val() == "Other") {
                    document.getElementById(image_id).src = "img/Profile_Pictures/Male_Profile_Picture.jpg";
                }
                else if (snapshot.child("Gender").val() == "Female") {
                    document.getElementById(image_id).src = "img/Profile_Pictures/Female_Profile_Picture.jpg";
                }
    
                document.getElementById(form_id).reset();
                document.forms[form_id]["Remove_Picture"].value = "Yes";
            }).catch(function(error) {
                console.log(error);
            });
        }
        else if (CURRENT_USER_TYPE == "Emergency_Service_User") {
            document.getElementById("Profile_Picture_Img_FOR_My_Profile").src = "img/Profile_Pictures/Emergency_Service_User_Profile_Picture.png";
    
            document.getElementById(form_id).reset();
            document.forms[form_id]["Remove_Picture"].value = "Yes";
        }
    }
    else {
        document.getElementById(image_id).src = "img/Empty_Image/Empty_Image.png";

        document.forms[form_id]["IMAGE"].value = null;
        document.forms[form_id]["Remove_Picture"].value = "Yes";

        console.log(image_id);
    }
}





/* To display My_Profile window */
function Display_My_Profie_Window () {
    document.getElementById("User_Profile_Info_FOR_My_Profile_Form").reset();
    document.forms["User_Profile_Info_FOR_My_Profile_Form"]["Remove_Picture"].value = "No";

    if (CURRENT_USER_TYPE == "Simple_User") {
        document.getElementById("My_Profile_Simple_User_Form").style.display = "block";
        document.getElementById("My_Profile_Vehicle_User_Form").style.display = "none";
        document.getElementById("My_Profile_Emergency_Service_User_Form").style.display = "none";
    }
    else if (CURRENT_USER_TYPE == "Vehicle_User") {
        document.getElementById("My_Profile_Simple_User_Form").style.display = "none";
        document.getElementById("My_Profile_Vehicle_User_Form").style.display = "block";
        document.getElementById("My_Profile_Emergency_Service_User_Form").style.display = "none";
    }
    else if (CURRENT_USER_TYPE == "Emergency_Service_User") {
        document.getElementById("My_Profile_Simple_User_Form").style.display = "none";
        document.getElementById("My_Profile_Vehicle_User_Form").style.display = "none";
        document.getElementById("My_Profile_Emergency_Service_User_Form").style.display = "block";
    }
    
    document.getElementById("My_Profile_Form").style.display = "block";
    document.getElementById("Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account").style.display = "none";
    document.getElementById("Change_Password_Logged_In_Form").style.display = "none";

    Switch_Close_and_Go_Back_Buttons("Close Button");
}




/* To Load My_Profile form */
function Load_My_Profile () {
    var form_id = "My_Profile_" + CURRENT_USER_TYPE + "_Form";

    // document.getElementById("User_Profile_Info_FOR_My_Profile_Form").reset();
    // document.forms["User_Profile_Info_FOR_My_Profile_Form"]["Remove_Picture"].value = "No";

    try {
        firebase.database().ref("User/" + CURRENT_USER_ID).on('value', function(snapshot) {
            console.log(CURRENT_USER_ID);
            console.log(form_id);
            console.log("--------------------------------");
    
            
            /* ---------------- Super Common Content ---------------- */
            document.forms[form_id]["EMAIL_ID"].value = firebase.auth().currentUser.email;
            document.forms[form_id]["ALTERNATE_EMAIL_ID"].value = snapshot.child("Alternate_Email_ID").val();
    
            document.forms[form_id]["CONTACT_NUMBER"].value = snapshot.child("Contact_Number").val();
            document.forms[form_id]["ALTERNATE_CONTACT_NUMBER"].value = snapshot.child("Alternate_Contact_Number").val();
    
            // Download_From_Firebase_Storage(snapshot.child("Profile_Picture").val(), "images/", form_id, "PROFILE_PICTURE");
    
            document.forms[form_id]["HOUSE_NO_OR_FLAT_NO"].value = snapshot.child("Address").child("House_OR_Flat_No").val();
            document.forms[form_id]["STREET_OR_BUILDING_OR_COLONY"].value = snapshot.child("Address").child("Street_OR_Building_OR_Colony").val();
            document.forms[form_id]["CITY"].value = snapshot.child("Address").child("City").val();
            document.forms[form_id]["STATE"].value = snapshot.child("Address").child("State").val();
            document.forms[form_id]["COUNTRY"].value = snapshot.child("Address").child("Country").val();
            document.forms[form_id]["POSTAL_CODE"].value = snapshot.child("Address").child("Postal_Code").val();
            document.forms[form_id]["COORDINATES"].value = snapshot.child("Address").child("Coordinates").child("lat").val() + "," + snapshot.child("Address").child("Coordinates").child("lng").val();
            /* ---------------- End - Super Common Content ---------------- */
    
    
            console.log(CURRENT_USER_TYPE);
    
            if (CURRENT_USER_TYPE == "Simple_User") {
                /* ---------------- Common Content ---------------- */
                document.forms[form_id]["FIRST_NAME"].value = snapshot.child("First_Name").val();
                document.forms[form_id]["MIDDLE_NAME"].value = snapshot.child("Middle_Name").val();
                document.forms[form_id]["LAST_NAME"].value = snapshot.child("Last_Name").val();
                
                document.forms[form_id]["NATIONALITY"].value = snapshot.child("Nationality").val();
    
                document.forms[form_id]["DOB"].value = snapshot.child("Date_Of_Birth").val();
    
                var gender = snapshot.child("Gender").val();
                if (gender == "Male") {
                    document.getElementById(form_id + "_MALE").checked = true;
                }
                else if (gender == "Female") {
                    document.getElementById(form_id + "_FEMALE").checked = false;
                }
                else if (gender == "Other") {
                    document.getElementById(form_id + "_OTHER").checked = false;
                }
                /* ---------------- End - Common Content ---------------- */
    
    
                /* ---------------- Unique Content ---------------- */
                // document.forms[form_id]["PASSWORD_1"].value = snapshot.child("Password").val();
                // document.forms[form_id]["PASSWORD_2"].value = snapshot.child("Password").val();
    
                // document.forms[form_id]["BIRTH_PLACE"].value = snapshot.child("Security_Question").child("Birth_Place").val();
                // document.forms[form_id]["FIRST_PETS_NAME"].value = snapshot.child("Security_Question").child("First_Pets_Name").val();
                // document.forms[form_id]["FAVORITE_DISH"].value = snapshot.child("Security_Question").child("Favorite_Dish").val();
                /* ---------------- End - Unique Content ---------------- */
    
    
                // document.getElementById("My_Profile_Simple_User_Form").style.display = "block";
                // document.getElementById("My_Profile_Vehicle_User_Form").style.display = "none";
                // document.getElementById("My_Profile_Emergency_Service_User_Form").style.display = "none"; 
                
                // Switch_Close_and_Go_Back_Buttons("Close Button");

                console.log ("View My Profile - Simple User - Successfull");
            }
            else if (CURRENT_USER_TYPE == "Vehicle_User") {
                /* ---------------- Common Content ---------------- */
                document.forms[form_id]["FIRST_NAME"].value = snapshot.child("First_Name").val();
                document.forms[form_id]["MIDDLE_NAME"].value = snapshot.child("Middle_Name").val();
                document.forms[form_id]["LAST_NAME"].value = snapshot.child("Last_Name").val();
                
                document.forms[form_id]["NATIONALITY"].value = snapshot.child("Nationality").val();
    
                document.forms[form_id]["DOB"].value = snapshot.child("Date_Of_Birth").val();
    
                var gender = snapshot.child("Gender").val();
                if (gender == "Male") {
                    document.getElementById(form_id + "_MALE").checked = true;
                }
                else if (gender == "Female") {
                    document.getElementById(form_id + "_FEMALE").checked = false;
                }
                else if (gender == "Other") {
                    document.getElementById(form_id + "_OTHER").checked = false;
                }
                /* ---------------- End - Common Content ---------------- */
    
    
                /* ---------------- Unique Content ---------------- */
                // document.forms[form_id]["PASSWORD_1"].value = snapshot.child("Password").val();
                // document.forms[form_id]["PASSWORD_2"].value = snapshot.child("Password").val();
    
                // document.forms[form_id]["BIRTH_PLACE"].value = snapshot.child("Security_Question").child("Birth_Place").val();
                // document.forms[form_id]["FIRST_PETS_NAME"].value = snapshot.child("Security_Question").child("First_Pets_Name").val();
                // document.forms[form_id]["FAVORITE_DISH"].value = snapshot.child("Security_Question").child("Favorite_Dish").val();
                /* ---------------- End - Unique Content ---------------- */
    
    
                // document.getElementById("My_Profile_Simple_User_Form").style.display = "none";
                // document.getElementById("My_Profile_Vehicle_User_Form").style.display = "block";
                // document.getElementById("My_Profile_Emergency_Service_User_Form").style.display = "none";
    
                // Switch_Close_and_Go_Back_Buttons("Close Button");
    
    
                console.log ("View My Profile - Vehicle User - Successfull");
            }
            else if (CURRENT_USER_TYPE == "Emergency_Service_User") {
                /* ---------------- Common Content ---------------- */
                document.forms[form_id]["NAME"].value = snapshot.child("Name").val();
    
                document.forms[form_id]["SERVICE_TYPE"].value = snapshot.child("Service_Type").val();
    
                document.forms[form_id]["DOE"].value = snapshot.child("Date_Of_Establishment").val();
    
                var government_organization = snapshot.child("Government_Organization").val();
                if (government_organization == "Yes") {
                    document.getElementById(form_id + "_GOVERNMENT_ORGANIZATION_YES").checked = true;
                }
                else if (government_organization == "No") {
                    document.getElementById(form_id + "_GOVERNMENT_ORGANIZATION_NO").checked = true;
                }
    
                var government_authorized = snapshot.child("Government_Authorized").val();
                if (government_authorized == "Yes") {
                    document.getElementById(form_id + "_GOVERNMENT_AUTHORIZED_YES").checked = true;
                }
                else if (government_authorized == "No") {
                    document.getElementById(form_id + "_GOVERNMENT_AUTHORIZED_NO").checked = true;
                }
                /* ---------------- End - Common Content ---------------- */
                
                
                /* ---------------- Unique Content ---------------- */
                // document.forms[form_id]["PASSWORD_1"].value = snapshot.child("Password").val();
                // document.forms[form_id]["PASSWORD_2"].value = snapshot.child("Password").val();
    
                // document.forms[form_id]["BIRTH_PLACE"].value = snapshot.child("Security_Question").child("Birth_Place").val();
                // document.forms[form_id]["FIRST_PETS_NAME"].value = snapshot.child("Security_Question").child("First_Pets_Name").val();
                // document.forms[form_id]["FAVORITE_DISH"].value = snapshot.child("Security_Question").child("Favorite_Dish").val();
                /* ---------------- End - Unique Content ---------------- */
    
    
                // document.getElementById("My_Profile_Simple_User_Form").style.display = "none";
                // document.getElementById("My_Profile_Vehicle_User_Form").style.display = "none";
                // document.getElementById("My_Profile_Emergency_Service_User_Form").style.display = "block";
    
                // Switch_Close_and_Go_Back_Buttons("Close Button");
    
    
                console.log ("View My Profile - Emergency Service User - Successfull");
            }
        });

        Reset_User_Filled_Forms();

        // document.getElementById("My_Profile_Form").style.display = "block";
        // document.getElementById("Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account").style.display = "none";
        // document.getElementById("Change_Password_Logged_In_Form").style.display = "none";

        Display_My_Profie_Window();
    }
    catch (error) {
        console.log(error);
    }
}




/* To validate My_Profile_Simple_User_Form */
function validate_My_Profile_Simple_User_Form (form_id) {
    var coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((coordinates[0] != parseFloat(coordinates[0]))  ||  (coordinates[1] != parseFloat(coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}


/* To validate My_Profile_Vehicle_User_Form */
function validate_My_Profile_Vehicle_User_Form (form_id) {
    var coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((coordinates[0] != parseFloat(coordinates[0]))  ||  (coordinates[1] != parseFloat(coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}



/* To validate My_Profile_Emergency_Service_User_Form */
function validate_My_Profile_Emergency_Service_User_Form (form_id) {
    var coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((coordinates[0] != parseFloat(coordinates[0]))  ||  (coordinates[1] != parseFloat(coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}




/* To View Verify_Current_Password_Form */
function View_Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account (task) {
    document.getElementById("My_Profile_Form").style.display = "none";
    document.getElementById("Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account").style.display = "block";
    document.getElementById("Change_Password_Logged_In_Form").style.display = "none";
    
    document.forms["Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account"]["TASK"].value = task;

    Switch_Close_and_Go_Back_Buttons("Go Back Button");
}



/* To validate Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account */
function validate_Verify_Current_Password_Form_FOR_Change_Password_OR_Delete_Account (form_id) {
    return true;
}



/* To validate Change_Password_Logged_In_Form */
// function validate_Change_Password_Logged_In_Form (form_id) {
//     return true;
// }





/* To delete the User Account */
function Delete_Account () {
    var currentUser_photoURL = firebase.auth().currentUser.photoURL;
    var currentUser_uid = firebase.auth().currentUser.uid;
    var currentUser_email = firebase.auth().currentUser.email;
    
    var blackbox_id = BLACKBOX_ID;

    firebase.auth().currentUser.delete().then(function() {
        firebase.database().ref("User/" + currentUser_uid).remove().then(function() {
            console.log("Delete User-data from Database Sucessfull");
            if (currentUser_photoURL != null) {
                firebase.storage().ref().child("User/" + currentUser_uid + "/Profile_Picture").delete().then(function() {
                    console.log ("Delete Profile Picture from Database Successfull");
                    
                    if ((CURRENT_USER_TYPE == "Vehicle_User")  &&  (blackbox_id != "")) {
                        firebase.database().ref("Blackbox/" + blackbox_id).update({User_ID : null}).then (function() {
                            Delete_User_Related_Data(currentUser_email);
                        });
                    }
                    else {
                        Delete_User_Related_Data(currentUser_email);
                    }
                }).catch(function(error) {
                    console.log ("Delete Profile Picture from Database Unsuccessfull");

                    console.log(error);
                });
            }
            else {
                if ((CURRENT_USER_TYPE == "Vehicle_User")  &&  (blackbox_id != "")) {
                    firebase.database().ref("Blackbox/" + blackbox_id).update({User_ID : null}).then (function() {
                        Delete_User_Related_Data(currentUser_email);
                    });
                }
                else {
                    Delete_User_Related_Data(currentUser_email);
                }
            }
        }).catch(function(error) {
            console.log("Delete User-data from Database Unsuccessfull");

            console.log(error);
        });
    });
}



/* Function to delete User-related data from Database */
function Delete_User_Related_Data (currentUser_email) {
    if ((CURRENT_USER_TYPE == "Simple_User")  ||  (CURRENT_USER_TYPE == "Vehicle_User")) {
        var deleted_from_REQUESTS = false;
        var deleted_from_EMERGENCY_CONTACT_LIST = false;
        
        /* Delete requests associated with currentUser */
        firebase.database().ref("Request/").once("value").then(function(snapshot) {
            var i = 0;

            snapshot.forEach(function(childSnapshot) {
                if ((childSnapshot.child("From").val() == currentUser_email)  ||  (childSnapshot.child("To").val() == currentUser_email)) {
                    console.log("Request Found");
                    childSnapshot.ref.remove();
                }

                console.log("hey " + i + " " + snapshot.numChildren());
                
                if (i  ==  (snapshot.numChildren() - 1)) {
                    deleted_from_REQUESTS = true;
                }

                i++;
            });
        }).catch(function(error) {
            console.log(error);
        });


        /* Delete currentUser from Emergency_Contact_List of other users (if present) */
        firebase.database().ref("User/").once("value").then(function(user_snapshot) {
            var i = 0;

            console.log("Email " + currentUser_email);

            user_snapshot.forEach(function(user_childSnapshot) {
                firebase.database().ref("User/" + user_childSnapshot.key + "/Emergency_Contact").once("value").then(function(emergency_contact_snapshot) {
                    if (emergency_contact_snapshot.val() != null) {
                        var emergency_contact_list = emergency_contact_snapshot.val();

                        for (var j = 0; j < emergency_contact_list.length; j++) {
                            if (emergency_contact_list[j] == currentUser_email) {
                                emergency_contact_list.splice(j, NO_OF_DELETIONS);
                            }
                        }

                        user_childSnapshot.ref.update({Emergency_Contact : emergency_contact_list});
                    }
                }).catch(function(error) {
                    console.log(error);
                });

                console.log("hey second " + i + " " + user_snapshot.numChildren());
                
                if (i  ==  (user_snapshot.numChildren() - 1)) {
                    deleted_from_EMERGENCY_CONTACT_LIST = true;
                }

                i++
            });
        }).catch(function(error) {
            console.log(error);
        });


        var time_interval = 100;
        var timer = setInterval (function() {
            if (deleted_from_REQUESTS  &&  deleted_from_EMERGENCY_CONTACT_LIST) {
                clearInterval(timer);

                alert("Account Deleted Successfully");
                
                console.log("Delete Account Successfull");

                Go_Back_To_Initial_State();
            }
            else {
                console.log("Still here");
            }
        }, time_interval);
    }
    else if (CURRENT_USER_TYPE == "Emergency_Service_User") {
        alert("Account Deleted Successfully");
        
        console.log("Delete Account Successfull");
        
        Go_Back_To_Initial_State();
    }
    
}






/* ------------------- Pass Vehicle Control ------------------- */

/* Function to Display the window of submenus - 
    1] "Pass_Vehicle_Control" window
    2] "Switch_User_Type" window of Current_User_Type */
function Display_Pass_Vehicle_Control_AND_Switch_User_Type_Window () {
    if (CURRENT_USER_TYPE == "Simple_User") {
        document.getElementById("PASS_VEHICLE_CONTROL_dropdown_menu_item").style.display = "none";

        document.getElementById("SWITCH_TO_SIMPLE_USER_TYPE_dropdown_menu_item").style.display = "none";
        document.getElementById("SWITCH_TO_VEHICLE_USER_TYPE_dropdown_menu_item").style.display = "block";

        document.getElementById("Verify_Current_Password_Form_FOR_Switch_User_Type").style.display = "block";

        document.getElementById("Add_Vehicle_Details_Form").style.display = "none";
    }
    else if (CURRENT_USER_TYPE == "Vehicle_User") {
        document.getElementById("PASS_VEHICLE_CONTROL_dropdown_menu_item").style.display = "block";

        document.getElementById("SWITCH_TO_SIMPLE_USER_TYPE_dropdown_menu_item").style.display = "block";
        document.getElementById("SWITCH_TO_VEHICLE_USER_TYPE_dropdown_menu_item").style.display = "none";

        document.getElementById("Verify_Current_Password_Form_FOR_Switch_User_Type").style.display = "block";

        document.getElementById("Add_Vehicle_Details_Form").style.display = "none";
    }
    else if (CURRENT_USER_TYPE == "Emergency_Service_User") {
        document.getElementById("PASS_VEHICLE_CONTROL_dropdown_menu_item").style.display = "none";

        document.getElementById("SWITCH_TO_SIMPLE_USER_TYPE_dropdown_menu_item").style.display = "none";
        document.getElementById("SWITCH_TO_VEHICLE_USER_TYPE_dropdown_menu_item").style.display = "none";

        document.getElementById("Verify_Current_Password_Form_FOR_Switch_User_Type").style.display = "none";

        document.getElementById("Add_Vehicle_Details_Form").style.display = "none";
    }
}



/* Function to send request for "Pass_Vehicle_Control" to a non-vehicle user */
function Send_Request_FOR_Pass_Vehicle_Control (form_id) {
    var new_controller_email_id = document.forms[form_id]["NEW_CONTROLLER_EMAIL_ID"].value;

    if (new_controller_email_id != firebase.auth().currentUser.email) {
        firebase.database().ref('User/').once('value').then(function(user_snapshot) {
            var exists = false;
    
            user_snapshot.forEach(function(user_childSnapshot) {
                if (user_childSnapshot.child("Email_ID").val() == new_controller_email_id) {
                    console.log ("User found successfully.");
    
                    exists = true;

                    
                    if (user_childSnapshot.child("Role").val() == "Emergency Service User") {
                        alert("The user you have entered, is an Emergency Service User! .... Please try again with a simple user.");
                        
                        console.log("The user you have entered, is an Emergency Service User! .... Please try again with a simple user.");
                    }
                    else if (user_childSnapshot.child("Role").val() == "Vehicle User") {
                        alert("The user you have entered, already has a vehicle! .... Please try again with an eiligible user.");
    
                        console.log("The user you have entered, already has a vehicle! .... Please try again with a eligible user.");
                    }
                    else {
                        firebase.database().ref("Request").once("value").then(function(request_snapshot) {
                            var request_already_sent = false;
                            request_snapshot.forEach(function(request_childSnapshot) {
                                if ((request_childSnapshot.child("From").val() == firebase.auth().currentUser.email)  &&  (request_childSnapshot.child("Request_Type").val() == "Pass Vehicle Control")  &&  (request_childSnapshot.child("Response").val() == "Pending")) {
                                    request_already_sent = true;
                                }
                            });

                            if (request_already_sent) {
                                alert("You have already sent a request to - Pass Vehicle Control to a user.\nPlease wait for its response OR cancel it (Before sending another).");

                                console.log("You have already sent a request to - Pass Vehicle Control to a user.\nPlease wait for its response OR cancel it (Before sending another).");
                            }
                            else {
                                if (confirm("A request will now be sent to " + new_controller_email_id + ". Are you sure you want to continue?")) {
                                    var data = {
                                        From: firebase.auth().currentUser.email,
                                        Request_Type : "Pass Vehicle Control",
                                        Response : "Pending",
                                        To : new_controller_email_id
                                    };
        
                                    firebase.database().ref("/Request").push().set(data).then(function() {
                                        alert("Request to accept vehicle control has been sent to " + new_controller_email_id + ".\nPlease wait for reply.");
                                        Reset_User_Filled_Forms();
                                        show_hide_content('HOME_PAGE');
                                        
                                        console.log("Request to accept vehicle control has been sent to " + new_controller_email_id + ".\nPlease wait for reply.");
                                    }).catch(function(error) {
                                        console.log("Sending Request Unsuccessfull");
                                        
                                        console.log(error);
                                    });
                                }
                            }
                        });
                    }
                }
            });
    
            if (!exists) {
                alert("No such user exists! .... Please try again.")
    
                console.log("No such user exists! .... Please try again.");
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    else {
        alert("You have entered your own Email ID! .... Please try again with a different user.");
        
        console.log("You have entered your own Email ID! .... Please try again with a different user.");
    }
}




/* To validate Pass_Vehicle_Control_Form */
function validate_Pass_Vehicle_Control_Form (form_id) {
    return true;
}









/* ------------------- Switch User Type ------------------- */

/* To validate Verify_Current_Password_Form_FOR_Switch_User_Type */
function validate_Verify_Current_Password_Form_FOR_Switch_User_Type (form_id) {
    return true;
}


/* To validate Add_Vehicle_Details_Form */
function validate_Add_Vehicle_Details_Form (form_id) {
    return true;
}







/* ------------------- Help ------------------- */

/* Function to submit Customer Query/Complaint */
function Submit_Query_OR_Complaint (form_id) {
    var query_OR_complaint = document.forms[form_id]["QUERY_OR_COMPLAINT"].value;

    Reset_User_Filled_Forms();


    console.log("Submit Query/Complaint Successfull");
}


/* To validate Help_Form */
function validate_Help_Form (form_id) {
    return true;
}




/* -------------------------------------------------------
                    Sign Up
------------------------------------------------------- */

/* To toggle between User Type for Sign Up Form */
function Switch_Sign_Up_User_Type (user_type) {
    if (user_type == "Simple_User") {
        document.getElementById("Sign_Up_Simple_User_Form").style.display = "block";
        document.getElementById("Sign_Up_Vehicle_User_Form").style.display = "none";
        document.getElementById("Sign_Up_Emergency_Service_User_Form").style.display = "none";
    }
    else if (user_type == "Vehicle_User") {
        document.getElementById("Sign_Up_Simple_User_Form").style.display = "none";
        document.getElementById("Sign_Up_Vehicle_User_Form").style.display = "block";
        document.getElementById("Sign_Up_Emergency_Service_User_Form").style.display = "none";
    }
    else if (user_type == "Emergency_Service_User") {
        document.getElementById("Sign_Up_Simple_User_Form").style.display = "none";
        document.getElementById("Sign_Up_Vehicle_User_Form").style.display = "none";
        document.getElementById("Sign_Up_Emergency_Service_User_Form").style.display = "block";
    }

    Reset_User_Filled_Forms();
}






/* Function to Create a new Account OR Edit/Modify an existing Account depending on task/requirement */
function Sign_Up_OR_Modify_User_Profile (task, form_id) {
    /* Contains data to be added/updated to the Database */
    var data;

    var display_Name;

    var password_1;
    var password_2;


    /* ---------------- Super Common Content ---------------- */
    var email_id = document.forms[form_id]["EMAIL_ID"].value;
    var alternate_email_id = document.forms[form_id]["ALTERNATE_EMAIL_ID"].value;

    var contact_number = document.forms[form_id]["CONTACT_NUMBER"].value;
    var alternate_contact_number = document.forms[form_id]["ALTERNATE_CONTACT_NUMBER"].value;

    var house_or_flat_no = document.forms[form_id]["HOUSE_NO_OR_FLAT_NO"].value;
    var street_or_building_or_colony = document.forms[form_id]["STREET_OR_BUILDING_OR_COLONY"].value;
    var city = document.forms[form_id]["CITY"].value;
    var state = document.forms[form_id]["STATE"].value;
    var country = document.forms[form_id]["COUNTRY"].value;
    var postal_code = document.forms[form_id]["POSTAL_CODE"].value;
    var coordinates = {
        lat : parseFloat(document.forms[form_id]["COORDINATES"].value.split(",")[0]),
        lng : parseFloat(document.forms[form_id]["COORDINATES"].value.split(",")[1])
    }
    /* ---------------- End - Super Common Content ---------------- */



    if ((form_id == "Sign_Up_Simple_User_Form")  ||  (form_id == "My_Profile_Simple_User_Form")) {
        /* ---------------- Common Content ---------------- */
        var first_name = document.forms[form_id]["FIRST_NAME"].value;
        var middle_name = document.forms[form_id]["MIDDLE_NAME"].value;
        var last_name = document.forms[form_id]["LAST_NAME"].value;

        display_Name = first_name + " " + middle_name + " " + last_name;

        var nationality = document.forms[form_id]["NATIONALITY"].value;

        var dob = document.forms[form_id]["DOB"].value;

        var gender;
        if (document.getElementById(form_id + "_MALE").checked) {
            gender = document.getElementById(form_id + "_MALE").value;
        }
        else if (document.getElementById(form_id + "_FEMALE").checked) {
            gender = document.getElementById(form_id + "_FEMALE").value;
        }
        else if (document.getElementById(form_id + "_OTHER").checked) {
            gender = document.getElementById(form_id + "_OTHER").value;
        }
        /* ---------------- End - Common Content ---------------- */



        /* ---------------- Unique Content ---------------- */
        var path_preference;
        password_1 = "";
        password_2 = "";
        var birth_place;
        var first_pets_name;
        var favorite_dish;

        if (form_id == "Sign_Up_Simple_User_Form") {
            if (document.getElementById(form_id + "_SHORTEST_PATH").checked) {
                path_preference = document.getElementById(form_id + "_SHORTEST_PATH").value;
            }
            else if (document.getElementById(form_id + "_SAFEST_PATH").checked) {
                path_preference = document.getElementById(form_id + "_SAFEST_PATH").value;
            }

            password_1 = document.forms[form_id]["PASSWORD_1"].value;
            password_2 = document.forms[form_id]["PASSWORD_2"].value;

            birth_place = document.forms[form_id]["BIRTH_PLACE"].value;
            first_pets_name = document.forms[form_id]["FIRST_PETS_NAME"].value;
            favorite_dish = document.forms[form_id]["FAVORITE_DISH"].value;
        }
        /* ---------------- End - Unique Content ---------------- */



        if (task == "Sign Up") {
            data = {
                Address : {
                    City : city,
                    Coordinates : coordinates,
                    Country : country,
                    House_OR_Flat_No : house_or_flat_no,
                    Postal_Code : postal_code,
                    State : state,
                    Street_OR_Building_OR_Colony : street_or_building_or_colony
                },
                Alternate_Contact_Number : alternate_contact_number,
                Alternate_Email_ID : alternate_email_id,
                Contact_Number : contact_number,
                Date_Of_Birth : dob,
                Email_ID : email_id,
                First_Name : first_name,
                Gender : gender,
                Last_Name : last_name,
                Location_Settings : {
                    GPS_Module : "Mobile Device GPS",
                    Use_Wifi : "No",
                    Use_Bluetooth : "No"
                },
                Map_Configuration : {
                    View_Type : "Roadmap",
                    Information_To_Be_Displayed_On_Marker : ["Location Name", "Coordinates", "Number of Accidents Occured", "Level of Risk", "Image", "Current Status", "Recommendation"],
                    Path_Preference : path_preference
                },
                Middle_Name : middle_name,
                Most_Recent_Location : coordinates,
                Nationality : nationality,
                Role : "Simple User",
                Security_Question : {
                    Birth_Place : birth_place,
                    Favorite_Dish : favorite_dish,
                    First_Pets_Name : first_pets_name
                }
            };
        }
        else if (task == "Modify") {
            /* Updates Parameters */
            data = {
                Address : {
                    City : city,
                    Coordinates : coordinates,
                    Country : country,
                    House_OR_Flat_No : house_or_flat_no,
                    Postal_Code : postal_code,
                    State : state,
                    Street_OR_Building_OR_Colony : street_or_building_or_colony
                },
                Alternate_Contact_Number : alternate_contact_number,
                Alternate_Email_ID : alternate_email_id,
                Contact_Number : contact_number,
                Date_Of_Birth : dob,
                First_Name : first_name,
                Gender : gender,
                Last_Name : last_name,
                Middle_Name : middle_name,
                Nationality : nationality
            };
        }
    }
    else if ((form_id == "Sign_Up_Vehicle_User_Form")  ||  (form_id == "My_Profile_Vehicle_User_Form")) {
        /* ---------------- Common Content ---------------- */
        var first_name = document.forms[form_id]["FIRST_NAME"].value;
        var middle_name = document.forms[form_id]["MIDDLE_NAME"].value;
        var last_name = document.forms[form_id]["LAST_NAME"].value;

        display_Name = first_name + " " + middle_name + " " + last_name;


        var nationality = document.forms[form_id]["NATIONALITY"].value;

        var dob = document.forms[form_id]["DOB"].value;

        var gender;
        if (document.getElementById(form_id + "_MALE").checked) {
            gender = document.getElementById(form_id + "_MALE").value;
        }
        else if (document.getElementById(form_id + "_FEMALE").checked) {
            gender = document.getElementById(form_id + "_FEMALE").value;
        }
        else if (document.getElementById(form_id + "_OTHER").checked) {
            gender = document.getElementById(form_id + "_OTHER").value;
        }
        /* ---------------- End - Common Content ---------------- */


        
        /* ---------------- Unique Content ---------------- */
        var path_preference;
        password_1 = "";
        password_2 = "";
        var birth_place;
        var first_pets_name;
        var favorite_dish;

        /* Vehicle Details */
        var vehicle_registration_number;
        var vehicle_model;
        var vehicle_rc_number;
        var vehicle_insurance_number;
        var vehicle_safety_features;
        var flag;
        var vehicle_health;

        if (form_id == "Sign_Up_Vehicle_User_Form") {
            if (document.getElementById(form_id + "_SHORTEST_PATH").checked) {
                path_preference = document.getElementById(form_id + "_SHORTEST_PATH").value;
            }
            else if (document.getElementById(form_id + "_SAFEST_PATH").checked) {
                path_preference = document.getElementById(form_id + "_SAFEST_PATH").value;
            }

            password_1 = document.forms[form_id]["PASSWORD_1"].value;
            password_2 = document.forms[form_id]["PASSWORD_2"].value;

            birth_place = document.forms[form_id]["BIRTH_PLACE"].value;
            first_pets_name = document.forms[form_id]["FIRST_PETS_NAME"].value;
            favorite_dish = document.forms[form_id]["FAVORITE_DISH"].value;



            /* Vehicle Details */
            vehicle_registration_number = document.forms[form_id]["VEHICLE_REGISTRATION_NUMBER"].value;
            vehicle_model = document.forms[form_id]["VEHICLE_MODEL"].value;
            vehicle_rc_number = document.forms[form_id]["VEHICLE_RC_NUMBER"].value;
            vehicle_insurance_number = document.forms[form_id]["VEHICLE_INSURANCE_NUMBER"].value;

            vehicle_safety_features = [];
            if (document.forms[form_id]["AIRBAGS"].checked) {
                vehicle_safety_features.push("Airbags");
            }
            if (document.forms[form_id]["ALL_WHEEL_DRIVE"].checked) {
                vehicle_safety_features.push("All-Wheel Drive");
            }
            if (document.forms[form_id]["ABS"].checked) {
                vehicle_safety_features.push("ABS");
            }
            if (document.forms[form_id]["ELECTRONIC_STABILITY_CONTROL"].checked) {
                vehicle_safety_features.push("Electronic Stability Control");
            }

            
            vehicle_health = document.forms[form_id]["VEHICLE_HEALTH"].value;
        }
        /* ---------------- End - Unique Content ---------------- */



        if (task == "Sign Up") {
            data = {
                Address : {
                    City : city,
                    Coordinates : coordinates,
                    Country : country,
                    House_OR_Flat_No : house_or_flat_no,
                    Postal_Code : postal_code,
                    State : state,
                    Street_OR_Building_OR_Colony : street_or_building_or_colony
                },
                Alternate_Contact_Number : alternate_contact_number,
                Alternate_Email_ID : alternate_email_id,
                Contact_Number : contact_number,
                Blackbox_ID : "",
                Date_Of_Birth : dob,
                Email_ID : email_id,
                First_Name : first_name,
                Gender : gender,
                Last_Name : last_name,
                Location_Settings : {
                    GPS_Module : "Mobile Device GPS",
                    Use_Wifi : "No",
                    Use_Bluetooth : "No"
                },
                Map_Configuration : {
                    View_Type : "Roadmap",
                    Information_To_Be_Displayed_On_Marker : ["Location Name", "Coordinates", "Number of Accidents Occured", "Level of Risk", "Image", "Current Status", "Recommendation"],
                    Path_Preference : path_preference
                },
                Middle_Name : middle_name,
                Most_Recent_Location : coordinates,
                Nationality : nationality,
                Role : "Vehicle User",
                Security_Question : {
                    Birth_Place : birth_place,
                    Favorite_Dish : favorite_dish,
                    First_Pets_Name : first_pets_name
                },
                Vehicle : {
                    Insurance_No : vehicle_insurance_number,
                    Model : vehicle_model,
                    RC_No : vehicle_rc_number,
                    Registration_No : vehicle_registration_number,
                    Safety_Features : vehicle_safety_features,
                    Vehicle_Health : vehicle_health
                }
            };
        }
        else if (task == "Modify") {
            /* Updates Parameters */
            data = {
                Address : {
                    City : city,
                    Coordinates : coordinates,
                    Country : country,
                    House_OR_Flat_No : house_or_flat_no,
                    Postal_Code : postal_code,
                    State : state,
                    Street_OR_Building_OR_Colony : street_or_building_or_colony
                },
                Alternate_Contact_Number : alternate_contact_number,
                Alternate_Email_ID : alternate_email_id,
                Contact_Number : contact_number,
                Date_Of_Birth : dob,
                First_Name : first_name,
                Gender : gender,
                Last_Name : last_name,
                Middle_Name : middle_name,
                Nationality : nationality
            };
        }
    }
    if ((form_id == "Sign_Up_Emergency_Service_User_Form")  ||  (form_id == "My_Profile_Emergency_Service_User_Form")) {
        /* ---------------- Common Content ---------------- */
        var name = document.forms[form_id]["NAME"].value;

        display_Name = name;

 
        var service_type = document.forms[form_id]["SERVICE_TYPE"].value;

        var doe = document.forms[form_id]["DOE"].value;

        var government_organization;
        if (document.getElementById(form_id + "_GOVERNMENT_ORGANIZATION_YES").checked) {
            government_organization = document.getElementById(form_id + "_GOVERNMENT_ORGANIZATION_YES").value;
        }
        else if (document.getElementById(form_id + "_GOVERNMENT_ORGANIZATION_NO").checked) {
            government_organization = document.getElementById(form_id + "_GOVERNMENT_ORGANIZATION_NO").value;
        }

        var government_authorized;
        if (document.getElementById(form_id + "_GOVERNMENT_AUTHORIZED_YES").checked) {
            government_authorized = document.getElementById(form_id + "_GOVERNMENT_AUTHORIZED_YES").value;
        }
        else if (document.getElementById(form_id + "_GOVERNMENT_AUTHORIZED_NO").checked) {
            government_authorized = document.getElementById(form_id + "_GOVERNMENT_AUTHORIZED_NO").value;
        }
        /* ---------------- End - Common Content ---------------- */



        /* ---------------- Unique Content ---------------- */
        var path_preference;
        password_1 = "";
        password_2 = "";

        // var birth_place;
        // var first_pets_name;
        // var favorite_dish;

        if (form_id == "Sign_Up_Emergency_Service_User_Form") {
            if (document.getElementById(form_id + "_SHORTEST_PATH").checked) {
                path_preference = document.getElementById(form_id + "_SHORTEST_PATH").value;
            }
            else if (document.getElementById(form_id + "_SAFEST_PATH").checked) {
                path_preference = document.getElementById(form_id + "_SAFEST_PATH").value;
            }

            password_1 = document.forms[form_id]["PASSWORD_1"].value;
            password_2 = document.forms[form_id]["PASSWORD_2"].value;

            // birth_place = document.forms[form_id]["BIRTH_PLACE"].value;
            // first_pets_name = document.forms[form_id]["FIRST_PETS_NAME"].value;
            // favorite_dish = document.forms[form_id]["FAVORITE_DISH"].value;
        }
        /* ---------------- End - Unique Content ---------------- */


        
        if (task == "Sign Up") {
            data = {
                Address : {
                    City : city,
                    Coordinates : coordinates,
                    Country : country,
                    House_OR_Flat_No : house_or_flat_no,
                    Postal_Code : postal_code,
                    State : state,
                    Street_OR_Building_OR_Colony : street_or_building_or_colony
                },
                Alternate_Contact_Number : alternate_contact_number,
                Alternate_Email_ID : alternate_email_id,
                Contact_Number : contact_number,
                Date_Of_Establishment : doe,
                Email_ID : email_id,
                Government_Authorized : government_authorized,
                Government_Organization : government_organization,
                Location_Settings : {
                    GPS_Module : "Mobile Device GPS",
                    Use_Wifi : "No",
                    Use_Bluetooth : "No"
                },
                Map_Configuration : {
                    View_Type : "Roadmap",
                    Information_To_Be_Displayed_On_Marker : ["Location Name", "Coordinates", "Number of Accidents Occured", "Level of Risk", "Image", "Current Status", "Recommendation"],
                    Path_Preference : path_preference
                },
                Most_Recent_Location : coordinates,
                Name : name,
                Role : "Emergency Service User",
                Service_Type : service_type,
            };
        }
        else if (task == "Modify") {
            /* Updates Parameters */
            data = {
                Address : {
                    City : city,
                    Coordinates : coordinates,
                    Country : country,
                    House_OR_Flat_No : house_or_flat_no,
                    Postal_Code : postal_code,
                    State : state,
                    Street_OR_Building_OR_Colony : street_or_building_or_colony
                },
                Alternate_Contact_Number : alternate_contact_number,
                Alternate_Email_ID : alternate_email_id,
                Contact_Number : contact_number,
                Date_Of_Establishment : doe,
                Government_Authorized : government_authorized,
                Government_Organization : government_organization,
                Name : name
                // Service_Type : service_type
            };
        }
    }


    if (task == "Sign Up") {
        /* ---------------- Unique Content ---------------- */
        var profile_picture = document.forms[form_id]["PROFILE_PICTURE"];
        var profile_picture_NAME = document.forms[form_id]["PROFILE_PICTURE"].value.split(/(\\|\/)/g).pop();
        /* ---------------- End - Unique Content ---------------- */

        firebase.auth().createUserWithEmailAndPassword(email_id, password_1).then(function (firebaseUser_1) {
            SIGN_UP_IN_PROCESS = true;
            console.log(SIGN_UP_IN_PROCESS);

            firebase.auth().signInWithEmailAndPassword(email_id, password_1).then(function(firebaseUser_2) {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
                
                firebase.auth().currentUser.sendEmailVerification();

                /* Write form data to Database*/
                firebase.database().ref("User/" + firebase.auth().currentUser.uid).set(data).then(function() {
                    console.log ("Add To Database Successfull");
                    
                    if (profile_picture.files.length != 0) {
                        /* Upload Profile Picture to the Firebase Storage & set the photoURL */
                            var file = profile_picture.files[0];
                            var file_NAME = profile_picture_NAME;

                            /* ---- Create a reference to the full path of the file, including the file name ---- */
                            var storageRef = firebase.storage().ref("User/" + firebase.auth().currentUser.uid + "/Profile_Picture");  // Create a root reference
                            
                            /* ---- Upload from a Blob or File ---- */
                            var uploadtask = storageRef.put(file).then(function(snapshot) {
                                console.log('Profile Picture Upload Successfull');
                                
                                snapshot.ref.getDownloadURL().then(function(url) {
                                    console.log('Profile Picture Download Successfull');

                                    firebase.auth().currentUser.updateProfile({displayName: display_Name, photoURL : url}).then(function() {
                                        firebase.auth().signOut();

                                        SIGN_UP_IN_PROCESS = false;

                                        Go_Back_To_Initial_State();
                                        Reset_User_Filled_Forms();
                                    }).catch(function(error) {
                                        console.log(error);
                                    });
                                }).catch(function(error) {
                                    console.log(error);
                                });
                            }).catch(function(error) {
                                console.log(error);
                            });
                        /* ----------------------------------------------------------------- */
                    }
                    else {
                        firebase.auth().currentUser.updateProfile({displayName: display_Name}).then(function() {
                            firebase.auth().signOut();

                            SIGN_UP_IN_PROCESS = false;

                            Go_Back_To_Initial_State();
                            Reset_User_Filled_Forms();
                        });
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }).catch(function (error) {
                alert(error.message);

                console.log (error);
            });
        }).catch(function (error) {
            alert(error.message);

            console.log (error);
        });
    }
    else if (task == "Modify") {
        /* ---------------- Unique Content ---------------- */
        var profile_picture = document.forms["User_Profile_Info_FOR_My_Profile_Form"]["PROFILE_PICTURE"];
        var profile_picture_NAME = document.forms["User_Profile_Info_FOR_My_Profile_Form"]["PROFILE_PICTURE"].value.split(/(\\|\/)/g).pop();
        /* ---------------- End - Unique Content ---------------- */


        // Get a key for new/updated Data
        // var updated_data_key = firebase.database().ref().child("Emergency_Service_User/").push().key;

        /* Write the Updated Parameters simultaneously */
        firebase.database().ref("User/" + CURRENT_USER_ID).update(data).then(function() {
            if (profile_picture.files.length != 0) {
                /* Upload Profile Picture to the Firebase Storage & set the photoURL */
                    var file = profile_picture.files[0];
                    // var file_NAME = profile_picture_NAME;

                    /* ---- Create a reference to the full path of the file, including the file name ---- */
                    var storageRef = firebase.storage().ref("User/" + firebase.auth().currentUser.uid + "/Profile_Picture");  // Create a root reference
                    
                    /* ---- Upload from a Blob or File ---- */
                    var uploadtask = storageRef.put(file).then(function(snapshot) {
                        console.log('Profile Picture Upload Successfull');
                        
                        snapshot.ref.getDownloadURL().then(function(url) {
                            console.log('Profile Picture Download Successfull');

                            firebase.auth().currentUser.updateProfile({displayName: display_Name, photoURL : url}).then(function() {
                                console.log ("displayName updated successfully");
                                console.log ("photoURL saved successfully");
                                
                                alert ("Changes have been saved successfull");
                                
                                console.log ("Changes Saved Successfully");
                                
                                document.getElementById("User_Profile_Info_FOR_My_Profile_Form").reset();

                                
                                Reset_User_Filled_Forms();
                                document.forms["User_Profile_Info_FOR_My_Profile_Form"]["Remove_Picture"].value = "No";

                                Go_Back_To_Initial_State();
                            }).catch(function(error) {
                                console.log(error);
                            });
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }).catch(function(error) {
                        console.log(error);
                    });
                /* ----------------------------------------------------------------- */
            }
            else {
                if ((document.forms["User_Profile_Info_FOR_My_Profile_Form"]["Remove_Picture"].value == "Yes")  &&  (firebase.auth().currentUser.photoURL != null)) { 
                    firebase.auth().currentUser.updateProfile({displayName: display_Name, photoURL : null}).then(function() {
                        console.log ("displayName updated successfully");
                        console.log ("photoURL made null successfully");

                        firebase.storage().ref().child("User/" + firebase.auth().currentUser.uid + "/Profile_Picture").delete().then(function() {
                            alert ("Changes have been saved successfully");
                            
                            console.log ("Changes have been saved successfully");
                            
                            Go_Back_To_Initial_State();
                            Reset_User_Filled_Forms();

                            console.log ("Profile Picture deleted from Database successfully");
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
                else {
                    firebase.auth().currentUser.updateProfile({displayName: display_Name}).then(function() {
                        console.log ("displayName updated successfully");

                        alert ("Changes have been saved successfully");

                        console.log ("Changes have been saved successfully");

                        Go_Back_To_Initial_State();
                        Reset_User_Filled_Forms();
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
            }
        }).catch(function (error) {
            alert(error.message);
            console.log (error);
        });
    }
}




/* To validate Sign_Up_Simple_User_Form */
function validate_Sign_Up_Simple_User_Form (form_id) {
    var password_1 = document.forms[form_id]["PASSWORD_1"].value;
    var password_2 = document.forms[form_id]["PASSWORD_2"].value;
    
    if (password_1 != password_2) {
        document.getElementById(form_id + "_Password_Match").style.color = "Red";
        document.getElementById(form_id + "_Password_Match").innerHTML = "Not Matching";

        return false;
    }

    var coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((coordinates[0] != parseFloat(coordinates[0]))  ||  (coordinates[1] != parseFloat(coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}



/* To validate Sign_Up_Vehicle_User_Form */
function validate_Sign_Up_Vehicle_User_Form (form_id) {
    password_1 = document.forms[form_id]["PASSWORD_1"].value;
    password_2 = document.forms[form_id]["PASSWORD_2"].value;
    
    if (password_1 != password_2) {
        document.getElementById(form_id + "_Password_Match").style.color = "Red";
        document.getElementById(form_id + "_Password_Match").innerHTML = "Not Matching";

        return false;
    }

    var coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((coordinates[0] != parseFloat(coordinates[0]))  ||  (coordinates[1] != parseFloat(coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }


    return true;
}



/* To validate Sign_Up_Emergency_Service_User_Form */
function validate_Sign_Up_Emergency_Service_User_Form (form_id) {
    password_1 = document.forms[form_id]["PASSWORD_1"].value;
    password_2 = document.forms[form_id]["PASSWORD_2"].value;
    
    if (password_1 != password_2) {
        document.getElementById(form_id + "_Password_Match").style.color = "Red";
        document.getElementById(form_id + "_Password_Match").innerHTML = "Not Matching";

        return false;
    }

    var coordinates = document.forms[form_id]["COORDINATES"].value.split(",");
    if (coordinates.length != 2) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }
    else if ((coordinates[0] != parseFloat(coordinates[0]))  ||  (coordinates[1] != parseFloat(coordinates[1]))) {
        alert("Invalid Coordinates! .... Please try again.");

        return false;
    }

    return true;
}




















/* -------------------------------------------------------
                    FCM Connection
------------------------------------------------------- */
// Retrieve Firbase Messagin object.
// const messaging = firebase.messaging();



function Set_Up_FCM_Client () {
    // try {
    //     const messaging = firebase.messaging();
    // var public_key = "BDhUyuJL1HhWOfjz7FDF5XE1bauqXVma6MSiGp34Ptrl2NSx4Zlgea2EdU3IJ8Ksze27riIgOTXaNbSCnPRuUzA";
    // // Add the public key generated from the console here.
    // firebase.messaging().usePublicVapidKey(public_key);

    // // Request permission to recieve notifications.
    // firebase.messaging().requestPermission().then(function() {
    //     console.log("Notification permission granted.");
    // }).catch(function(error) {
    //     alert(error);
    //     console.log("Unable to get permission to notify. ", error);
    // });

    // // Get Instance ID toke. Initially this makes a network call, once retrieved subsequent calls to getToken will return grom cache.
    // firebase.messaging().getToken().then(function(currentToken) {
    //     console.log("current_Token - " + currentToken);

    //     if (currentToken) {
    //         sendRokenToServer(currentToken);
    //         updateUIForPushEnabled(currentToken);
    //     }
    //     else {
    //         // Show permission request.
    //         console.log("No Instance ID token available. Request permission to generate one.");

    //         // Show permission UI.
    //         updateUIForPushPermissionRequired();
    //         setTokenSentToServer(false);
    //     }
    // }).catch(function(error) {
    //     alert(error);
    //     console.log("An error occured while retrieving toekn. ", error);

    //     showToken("Error retrieving Indtance ID token. ", error);
    //     setTokenSentToServer(false);
    // });

    // firebase.messaging().onTokenRefresh(function() {
    //     firebase.messaging().getToken().then(function(refreshedToken) {
    //         console.log("Token refreshed.");
    
    //         // Indicate that the new Instance ID token has not yet been sent to the app server
    //         setTokenSentToServer(false);
    
    //         // Send Instance ID token to app server.
    //         sendTokenToServer(refreshedToken);
    
    //         // ...
    //     }).catch(function() {
    //         alert(error);
    //         console.log("Unable to recieve refreshed toke ", error);

    //         showToken("Unable to recieve refreshed toke ", error);
    //     })
    // });
    // }
    // catch (error) {
    //     alert(error);
    // }
}































/* -------------------------------------------------------
                    Google Map Markers
------------------------------------------------------- */

/* ------------------- Services ------------------- */
/* Contains Geocoder Service Object */
var GEOCODER;

/* Contains Directions Service Object */
var DIRECTIONS_SERVICE;

/* Contains Directions_Renderer Service Object */
// var DIRECTIONS_DISPLAY;

/* Contains Directions_Renderer Service Object for Shortest_Path*/
var SHORTEST_ROUTE_DIRECTIONS_DISPLAY;

/* Contains Directions_Renderer Service Object for Safest_Path*/
var SAFEST_ROUTE_DIRECTIONS_DISPLAY;



/* ------------------- Current Location ------------------- */
/* This Object holds - latitudinal & longitudinal coordinates of the current location */
var CURRENT_LOCATION_COORDINATES;

/* Contains Marker - to show the current location of the user */
var CURRENT_LOCATION_MARKER;

/* Contains Circle - to show the viscinity of user's current location */
var CURRENT_LOCATION_CIRCLE;



/* ------------------- Blackspot ------------------- */
/* Contains Markers - to show Blackspots */
var BLACKSPOT_MARKER = [];

/* Contains Information_Window's - for Blackspot Markers */
var BLACKSPOT_MARKER_INFO_WINDOW = [];



/* ------------------- Actice Accident ------------------- */
/* Contains Markers - to show Active Accidents */
var ACTIVE_ACCIDENT_MARKER = [];

/* Contains Information_Window's - for Active_Accident Markers */
var ACTIVE_ACCIDENT_MARKER_INFO_WINDOW = [];

/* Contains Circles - to show the viscinity of Active_Accidents */
var ACTIVE_ACCIDENT_CIRCLE = [];



/* ------------------- Unsafe Zone ------------------- */
/* Contains Markers - to show Unsafe_Zone's */
var UNSAFE_ZONE_MARKER = [];

/* Contains Information_Window's  - for Unsafe_Zone's */
var UNSAFE_ZONE_MARKER_INFO_WINDOW = [];




/* ------------------- Route ------------------- */
/* Contains Marker - to show Route_Source */
var SOURCE_MARKER;

/* Contains Marker - to show Route_Destination */
var DESTINATION_MARKER;

/* Contains current Route_Destination, set by the user */
var DESTINATION;


/* Contains Timer for Real-time Route_Tracking*/
var ROUTE_TRACKING_TIMER;



/* ------------------- Main Functions ------------------- */

/* Function to set up Google Map */
function Set_Up_Map () {
    Initialize_Map_Variables();
    
    /* Hide 'Clear_Route' button on Home_Page, initially */
    document.getElementById("Map_Inputs_Clear_Route").style.display = "none"; 

    /* Create the DIV to hold the control and call the Current_Location_Control()
        constructor passing in this Div. */
        var current_location_ControlDiv = document.createElement('div');
        var current_location_Control = new Current_Location_Control(current_location_ControlDiv, application_map);

        current_location_ControlDiv.index = 1;
        application_map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(current_location_ControlDiv);
    /* -------------------------------------------------------------------------- */

    Go_To_Current_Location();

    var time_interval = 5000;
    var timer = setInterval(function() {    // For Real-Time Location - Every 5 sec
        Refresh_Current_Location();
    }, time_interval);

    // Add_Markers_On_Map();
    Change_Markers_ON_Zoom();
}


/* Initialize Map-related variables */
function Initialize_Map_Variables () {
    GEOCODER = new google.maps.Geocoder();
    DIRECTIONS_SERVICE = new google.maps.DirectionsService();
    DIRECTIONS_DISPLAY = new google.maps.DirectionsRenderer();
};


/* This is a Constructor for Custom Map Control - "Current_Location" */
function Current_Location_Control (controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    // controlUI.style.textAlign = 'center';
    controlUI.style.title = 'Click to go to Current Location';
    controlUI.style.marginRight = '10px';
    controlDiv.appendChild(controlUI);


    // Set CSS for the control interior
    var controlImg = document.createElement('div');
    // controlImg.style.color = 'rgb(25,25,25)';
    // controlImg.style.fontFamily = 'Roboto, Arial, sans-serif';
    // controlImg.style.fontSize = '16px';
    // controlImg.style.lineHeight = '38px';
    // controlImg.style.paddingLeft = '5px';
    // controlImg.style.paddingRight = '5px';
    controlImg.innerHTML = '<img src="img/Google_Maps/Custom_Markers/Get_Current_Location.png" alt="Get Current Location" style="width: 35px; height: 35px" />';
    controlImg.style.height = '35px';
    controlImg.style.width = '35px';
    controlUI.appendChild(controlImg);

    // Setup the click event listeners
    controlUI.addEventListener('click', function() {
        Go_To_Current_Location();
    })
}




/* Function to refresh Current_Location */
function Refresh_Current_Location () {
    if (CURRENT_LOCATION_MARKER != null) {
        CURRENT_LOCATION_MARKER.setAnimation(null);
        CURRENT_LOCATION_MARKER.setMap(null);

        CURRENT_LOCATION_CIRCLE.setMap(null);
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            CURRENT_LOCATION_COORDINATES = {
                lat : position.coords.latitude,
                lng : position.coords.longitude
            };
            
            CURRENT_LOCATION_MARKER = new google.maps.Marker({
                icon : {
                    url : "img/Google_Maps/Custom_Markers/Current_Location.png", // URL
                    scaledSize : new google.maps.Size(30, 30)   // Scaled Size
                },
                
                visible : true,

                position : CURRENT_LOCATION_COORDINATES,
                
                map : application_map,
                title : "Current Location"
            });

            CURRENT_LOCATION_MARKER.setAnimation(google.maps.Animation.BOUNCE);

            CURRENT_LOCATION_CIRCLE = new google.maps.Circle({
                strokeColor : "#3f48cc",
                strokeOpacity : 0.8,
                strokeWeight : 2,
                fillColor : "#3f48cc",
                fillOpacity : 0.2,
        
                visible : true,
                
                center : CURRENT_LOCATION_COORDINATES,
                radius : 100,
                
                map : application_map,
                title : "Current Location"
            });
        });
    }
    else {
        console.log("Geolocation is not supported by this browser.");
    }
}



/* Function to move Map_Center to Current Location*/
function Go_To_Current_Location () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            application_map.setCenter({
                lat : position.coords.latitude,
                lng : position.coords.longitude
            });
        });
    }
    else {
        console.log("Geolocation is not supported by this browser.");
    }

    // Refresh_Current_Location();

    application_map.setZoom(17);
}





/* Add different types of markers on Map */
function Add_Markers_On_Map() {
    /* Add Blackspots to Map */
    try {
        firebase.database().ref("User/" + firebase.auth().currentUser.uid).once('value').then(function(user_snapshot) {
            var map_configuration = user_snapshot.child("Map_Configuration/Information_To_Be_Displayed_On_Marker").val();

            firebase.database().ref("Blackspot/").on('value', function(snapshot) {
                for (var i = 0; i < BLACKSPOT_MARKER.length; i++) {
                    BLACKSPOT_MARKER[i].setMap(null);
                }

                BLACKSPOT_MARKER = [];
                BLACKSPOT_MARKER_INFO_WINDOW = [];

                var i = 0;
                snapshot.forEach(function(childSnapshot) {
                    if (childSnapshot.child("Status").val() == "Active") {
                        var contentString = '<div id="content" style="width: 150px;">' +
                            '<div>' +
                                '<b> Blackspot </b>' +
                            '</div>';

                        // var geocoder = new google.maps.Geocoder;
                        // if (map_configuration.includes("Location NAme")) {
                        //     geocoder.geocode({'location': childSnapshot.child("Location_Coordinates").val()}, function(results, status) {
                        //         if (status == 'OK') {
                        //             if (results[0]) {
                        //                 contentString += '<br>' +
                        //                     '<div>' +
                        //                         '<b>' + results[0].formatted_address + '</b>' +
                        //                     '</div>';
                        //             }
                        //         }
                        //     });
                        // }
                        
                        if (map_configuration.includes("Image")) {
                            contentString += '<br>' +
                                '<div id="Image">' +
                                    '<img src="' + childSnapshot.child("Image").val()  + '" style="width: 150px; height: auto;" />' +
                                '</div>';
                        }

                        if (map_configuration.includes("Coordinates")) {
                            contentString += '<br>' +
                                '<div>' +
                                    '<b> Coordinates: </b> ' + childSnapshot.child("Location_Coordinates").val().lat + "," + childSnapshot.child("Location_Coordinates").val().lng;
                                '</div>';
                        }

                        if (map_configuration.includes("Level of Risk")) {
                            contentString += '<br> <br>' +
                                '<div>' +
                                    '<b> Level of Risk: </b> ' + childSnapshot.child("Level_Of_Risk").val() +
                                '</div>';
                        }
                        
                        if (map_configuration.includes("Description")) {
                            contentString += '<br>' +
                                '<div>' +
                                    '<b> Description: </b> ' + childSnapshot.child("Description").val() +
                                '</div>';
                        }

                        contentString += '</div>';

                        
                        BLACKSPOT_MARKER_INFO_WINDOW.push(new google.maps.InfoWindow({
                            content : contentString
                        }));


                        BLACKSPOT_MARKER.push(new google.maps.Marker({
                            icon : {
                                url : "img/Google_Maps/Custom_Markers/Blackspot/Blackspot-" + childSnapshot.child("Level_Of_Risk").val().replace(/ /g, "_") + ".png", // URL
                                scaledSize : new google.maps.Size(50, 50)   // Scaled Size
                            },
                            
                            visible : true,

                            position : childSnapshot.child("Location_Coordinates").val(),
                            map : application_map,
                            title : childSnapshot.key
                        }));

                        (function(index) {
                            BLACKSPOT_MARKER[index].addListener('click', function() {
                                BLACKSPOT_MARKER_INFO_WINDOW[index].open(application_map, BLACKSPOT_MARKER[index]);
                            });
                        })(i);

                        i++;
                    }
                });
            });


            /* Add Active Accidents to Google Map */
            firebase.database().ref("Accident_Scenario/").on('value', function(snapshot) { 
                for (var i = 0; i < ACTIVE_ACCIDENT_MARKER.length; i++) {
                    ACTIVE_ACCIDENT_MARKER[i].setMap(null);
                    ACTIVE_ACCIDENT_CIRCLE[i].setMap(null);
                }

                ACTIVE_ACCIDENT_MARKER = [];
                ACTIVE_ACCIDENT_MARKER_INFO_WINDOW = [];
                ACTIVE_ACCIDENT_CIRCLE = [];

                var i = 0;
                snapshot.forEach(function(childSnapshot) {
                    if (childSnapshot.child("Status").val() == "Pending") {
                        var contentString = '<div id="content" style="width: 150px;">' +
                            '<div>' +
                                '<b> Active Accident </b>' +
                            '</div>';

                        // var geocoder = new google.maps.Geocoder;
                        // if (map_configuration.includes("Location NAme")) {
                        //     geocoder.geocode({'location': childSnapshot.child("Location_Coordinates").val()}, function(results, status) {
                        //         if (status == 'OK') {
                        //             if (results[0]) {
                        //                 contentString += '<br>' +
                        //                     '<div>' +
                        //                         '<b>' + results[0].formatted_address + '</b>' +
                        //                     '</div>';
                        //             }
                        //         }
                        //     });
                        // }
                        
                        if (map_configuration.includes("Image")) {
                            contentString += '<br>' +
                                '<div id="Image">' +
                                    '<img src="' + childSnapshot.child("Image").val()  + '" style="width: 150px; height: auto;" />' +
                                '</div>';
                        }

                        if (map_configuration.includes("Coordinates")) {
                            contentString += '<br>' +
                                '<div>' +
                                    '<b> Coordinates: </b> ' + childSnapshot.child("Location_Coordinates").val().lat + "," + childSnapshot.child("Location_Coordinates").val().lng;
                                '</div>';
                        }

                        if (map_configuration.includes("Level of Risk")) {
                            contentString += '<br> <br>' +
                                '<div>' +
                                    '<b> Level of Risk: </b> ' + childSnapshot.child("Level_Of_Risk").val() +
                                '</div>';
                        }
                        
                        if (map_configuration.includes("Description")) {
                            contentString += '<br>' +
                                '<div>' +
                                    '<b> Description: </b> ' + childSnapshot.child("Description").val() +
                                '</div>';
                        }

                        contentString += '</div>';


                        ACTIVE_ACCIDENT_MARKER_INFO_WINDOW.push(new google.maps.InfoWindow({
                            content : contentString
                        }));
                        
                        ACTIVE_ACCIDENT_MARKER.push(new google.maps.Marker({
                            icon : {
                                url : "img/Google_Maps/Custom_Markers/Accident.png", // URL
                                scaledSize : new google.maps.Size(55, 55)   // Scaled Size
                            },

                            visible : true,

                            position : childSnapshot.child("Location_Coordinates").val(),
                            map : application_map,
                            title : childSnapshot.key
                        }));

                        (function(index) {
                            ACTIVE_ACCIDENT_MARKER[index].addListener('click', function() {
                                ACTIVE_ACCIDENT_MARKER_INFO_WINDOW[index].open(application_map, ACTIVE_ACCIDENT_MARKER[index]);
                            });
                        })(i);


                        
                        if (application_map.getZoom() >= 15) {
                            ACTIVE_ACCIDENT_CIRCLE.push(new google.maps.Circle({
                                strokeColor : "#FF0000",
                                strokeOpacity : 0.8,
                                strokeWeight : 2,
                                fillColor : "#FF000",
                                fillOpacity : 0.35,
                
                                visible : true,
                                
                                center : childSnapshot.child("Location_Coordinates").val(),
                                radius : 400,
                                
                                map : application_map,
                                title : childSnapshot.key
                            }));
                        }
                        else {
                            ACTIVE_ACCIDENT_CIRCLE.push(new google.maps.Circle({
                                strokeColor : "#FF0000",
                                strokeOpacity : 0.8,
                                strokeWeight : 2,
                                fillColor : "#FF000",
                                fillOpacity : 0.35,
                
                                visible : false,
                                
                                center : childSnapshot.child("Location_Coordinates").val(),
                                radius : 400,
                                
                                map : application_map,
                                title : childSnapshot.key
                            }));
                        }

                        i++;
                    }
                });
            });
            

            /* Add Unsafe Zone to Google Map */
            firebase.database().ref("Unsafe_Zone/").on('value', function(snapshot) { 
                for (var i=0; i < UNSAFE_ZONE_MARKER.length; i++) {
                    UNSAFE_ZONE_MARKER[i].setMap(null);
                }

                UNSAFE_ZONE_MARKER = [];
                UNSAFE_ZONE_MARKER_INFO_WINDOW = [];
                
                var i = 0;
                snapshot.forEach(function(childSnapshot) {
                    if (childSnapshot.child("Status").val() == "Active") {
                        var contentString = '<div id="content" style="width: 150px;">' +
                            '<div>' +
                                '<b> Unsafe Zone </b>' +
                            '</div>';

                        // var geocoder = new google.maps.Geocoder;
                        // if (map_configuration.includes("Location NAme")) {
                        //     geocoder.geocode({'location': childSnapshot.child("Location_Coordinates").val()}, function(results, status) {
                        //         if (status == 'OK') {
                        //             if (results[0]) {
                        //                 contentString += '<br>' +
                        //                     '<div>' +
                        //                         '<b>' + results[0].formatted_address + '</b>' +
                        //                     '</div>';
                        //             }
                        //         }
                        //     });
                        // }
                        
                        if (map_configuration.includes("Image")) {
                            contentString += '<br>' +
                                '<div id="Image">' +
                                    '<img src="' + childSnapshot.child("Image").val()  + '" style="width: 150px; height: auto;" />' +
                                '</div>';
                        }

                        if (map_configuration.includes("Coordinates")) {
                            contentString += '<br>' +
                                '<div>' +
                                    '<b> Coordinates: </b> ' + childSnapshot.child("Location_Coordinates").val().lat + "," + childSnapshot.child("Location_Coordinates").val().lng;
                                '</div>';
                        }

                        if (map_configuration.includes("Level of Risk")) {
                            contentString += '<br> <br>' +
                                '<div>' +
                                    '<b> Level of Risk: </b> ' + childSnapshot.child("Level_Of_Risk").val() +
                                '</div>';
                        }
                        
                        if (map_configuration.includes("Description")) {
                            contentString += '<br>' +
                                '<div>' +
                                    '<b> Description: </b> ' + childSnapshot.child("Description").val() +
                                '</div>';
                        }

                        contentString += '</div>';

                        
                        UNSAFE_ZONE_MARKER_INFO_WINDOW.push(new google.maps.InfoWindow({
                            content : contentString
                        }));


                        UNSAFE_ZONE_MARKER.push(new google.maps.Marker({
                            icon : {
                                url : "img/Google_Maps/Custom_Markers/Unsafe_Zone.png", // URL
                                scaledSize : new google.maps.Size(45, 45)   // Scaled Size
                            },
                            
                            visible : true,

                            position : childSnapshot.child("Location_Coordinates").val(),
                            map : application_map,
                            title : childSnapshot.key
                        }));

                        (function(index) {
                            UNSAFE_ZONE_MARKER[index].addListener('click', function() {
                                UNSAFE_ZONE_MARKER_INFO_WINDOW[index].open(application_map, UNSAFE_ZONE_MARKER[index]);
                            });
                        })(i);

                        i++;
                    }
                });
            });
        }).catch(function(error) {
            console.log(error);
        });
    }
    catch (error) {
        console.log(error);
    }
}




/* Function to change Markers on Zoom */
function Change_Markers_ON_Zoom () {
    google.maps.event.addListener(application_map, "zoom_changed", function () {
        var zoom = application_map.getZoom();

        /* Iterate over 'BLACKSPOT_MARKER' and call setVisible */
        for (var i = 0; i < BLACKSPOT_MARKER.length; i++) {
            BLACKSPOT_MARKER[i].setVisible(zoom >= 11);
        }

        /* Iterate over 'ACTIVE_ACCIDENT_MARKER', 'ACTIVE_ACCIDENT_CIRCLE' and call setVisible */
        for (var i = 0; i < ACTIVE_ACCIDENT_MARKER.length; i++) {
            ACTIVE_ACCIDENT_MARKER[i].setVisible(zoom >= 11);
            ACTIVE_ACCIDENT_CIRCLE[i].setVisible(zoom >= 15);
        }

        /* Iterate over 'UNSAFE_ZONE_MARKER' and call setVisible */
        for (var i = 0; i < UNSAFE_ZONE_MARKER.length; i++) {
            UNSAFE_ZONE_MARKER[i].setVisible(zoom >= 13);
        }
    });
}


/* ------------------- End - Main Functions ------------------- */










/* ------------------- Route ------------------- */

/* To validate the Map_Input Form */
function validate_Map_Inputs_Form(form_id) {
    var source = document.forms[form_id]["SOURCE"].value;
    var destination = document.forms[form_id]["DESTINATION"].value;
    if (source == destination) {
		alert("Source & Destination cannot be same! .... Please try again.");
        
        return false;
    }
    
    return true;
}




/* To provide options of Safest & Shortest Raths */
function Find_Shortest_Safest_Routes (form_id) {
    var source = document.forms[form_id]["SOURCE"].value;
    var destination = document.forms[form_id]["DESTINATION"].value;

    codeAddress(source, destination);

    Display_Route(source, destination);
}





function Route_Class (Index, Route, Distance, Duration, Hits) {
    this.Index = Index;
    this.Route = Route;
    this.Distance = Distance;
    this.Duration = Duration;
    this.Hits = Hits;
}



/* Function to display the route */
function Display_Route (source, destination) {
    // DIRECTIONS_DISPLAY.setMap(null);

    if (SHORTEST_ROUTE_DIRECTIONS_DISPLAY != null) {
        SHORTEST_ROUTE_DIRECTIONS_DISPLAY.setMap(null);
        SAFEST_ROUTE_DIRECTIONS_DISPLAY.setMap(null);
    }

    var request;

    if (CURRENT_USER_TYPE == "Emrgency_Service_User") {
        request = {
            origin : source,
            destination : destination,
            travelMode : 'DRIVING',
            provideRouteAlternatives : true
        };
    }
    else {
        request = {
            origin : source,
            destination : destination,
            travelMode : 'DRIVING',
            provideRouteAlternatives : true
        };
    }

    // DIRECTIONS_SERVICE.route(request, function(result, status) {
    //     if (status == 'OK') {
    //         DIRECTIONS_DISPLAY.setDirections(result);
    //         DIRECTIONS_DISPLAY.setMap(application_map);

    //         document.getElementById("Map_Inputs_Clear_Route").style.display = "block";
    //     }
    // });


    DIRECTIONS_SERVICE.route(request, function(result, status) {
        if (status == 'OK') {
            firebase.database().ref('Accident_Scenario').once('value').then(function(accident_scenario_snapshot) {
                firebase.database().ref('Blackspot').once('value').then(function(blackspot_snapshot) {
                    var no_hits = [];
                    for (var i = 0; i < result.routes.length; i++) {
                        no_hits.push(0);
                        
                        var route_polyline = new google.maps.Polyline({
                            path: result.routes[i].overview_path
                        });

                        accident_scenario_snapshot.forEach(function(accident_scenario_childSnapshot) {
                            var accident_scenario_location = accident_scenario_childSnapshot.child("Location_Coordinates").val();
                            var accident_scenario_google_geolocation = new google.maps.LatLng(accident_scenario_location.lat, accident_scenario_location.lng);

                            if (google.maps.geometry.poly.isLocationOnEdge(accident_scenario_google_geolocation, route_polyline, 0.0005 /* 500 mts */)) {
                                no_hits[i]++;
                            }
                        });

                        blackspot_snapshot.forEach(function(blackspot_childSnapshot) {
                            var blackspot_location = blackspot_childSnapshot.child("Location_Coordinates").val();
                            var blackspot_google_geolocation = new google.maps.LatLng(blackspot_location.lat, blackspot_location.lng);
                            
                            if (google.maps.geometry.poly.isLocationOnEdge(blackspot_google_geolocation, route_polyline, 0.0005 /* 500 mts */)) {
                                no_hits[i]++;
                            }
                        });

                        console.log("no hits " + i + " : " + no_hits[i]);
                    }
                    
                    console.log(Math.min.apply(null, no_hits));

                    

                    var alternate_routes = [];
                    var safest_routes = [];

                    /* Put alternate_routes, safest_routes, i.e: Routes with minimum no_of_hits */
                    for (var i = 0; i < result.routes.length; i++) {
                        alternate_routes.push(new Route_Class(i, result.routes[i], result.routes[i].legs[0].distance.value, result.routes[i].legs[0].duration.value, no_hits[i]));

                        if (no_hits[i] == Math.min.apply(null, no_hits)) {
                            safest_routes.push(alternate_routes[i]);
                        }

                        // new google.maps.DirectionsRenderer({
                        //     map: application_map,
                        //     directions: result,
                        //     routeIndex: i
                        // });
                    }

                    console.log(alternate_routes);
                    console.log(safest_routes);

                    /* Find & display shortest of all the safest_routes */
                    SAFEST_ROUTE_DIRECTIONS_DISPLAY = new google.maps.DirectionsRenderer({
                        polylineOptions: {
                            strokeColor: "green"
                        },
                        map: application_map,
                        directions: result,
                        routeIndex: Find_Shortest_Route(safest_routes).Index
                    });

                    
                    /* Find & display shortest of all the alternate_routes */
                    SHORTEST_ROUTE_DIRECTIONS_DISPLAY = new google.maps.DirectionsRenderer({
                        polylineOptions: {
                            strokeColor: "blue"
                        },
                        map: application_map,
                        directions: result,
                        routeIndex: Find_Shortest_Route(alternate_routes).Index
                    });
                }).catch(function(error) {
                    console.log(error);
                });
            }).catch(function(error) {
                console.log(error);
            });

            document.getElementById("Map_Inputs_Clear_Route").style.display = "block";
        }
        else {
            alert("No path found! ..... Please provide valid inputs.");
        }
    });
}



/* Find shortest of an array of routes */
function Find_Shortest_Route (routes) {
    var shortest_route = routes[0];
    var min_distance = routes[0].distance;

    for (var i = 0; i < routes.length; i++) {
        if (routes[i].distance < min_distance) {
            shortest_route = routes[i];
            min_distance = routes[i].distance;
        }
    }

    return shortest_route;
}






/* Function to find Geocode of Source & Destination, and diplay markers for each */
function codeAddress (source, destination) {
    // if (SOURCE_MARKER != null) {
    //     SOURCE_MARKER.setMap(null);
    //     SOURCE_MARKER = null;
    // }
    // if (DESTINATION_MARKER != null) {
    //     DESTINATION_MARKER.setMap(null);
    //     DESTINATION_MARKER = null;
    // }

    // GEOCODER.geocode({'address' : source}, function(results, status) {
    //     if (status == 'OK') {
    //         SOURCE_MARKER = new google.maps.Marker({
    //             map: application_map,
    //             position : results[0].geometry.location
    //         });
    //     }
    //     else {
    //         alert('Geocode was not successfull for the following reason: ' + status);
    //     }
    // });

    GEOCODER.geocode({'address' : destination}, function(results, status) {
        if (status == 'OK') {
            // DESTINATION_MARKER = new google.maps.Marker({
            //     map: application_map,
            //     position : results[0].geometry.location
            // });


            DESTINATION = {
                lng : results[0].geometry.location.lng(),
                lat : results[0].geometry.location.lat()
            }
        }
        else {
            alert('Geocode was not successfull for the following reason: ' + status);
        }
    });
}



/* Function to clear Route-Directions */
function Clear_Route (form_id) {
    // DIRECTIONS_DISPLAY.setMap(null);

    SHORTEST_ROUTE_DIRECTIONS_DISPLAY.setMap(null);
    SAFEST_ROUTE_DIRECTIONS_DISPLAY.setMap(null);
    
    // if (SOURCE_MARKER != null) {
    //     SOURCE_MARKER.setMap(null);
    //     SOURCE_MARKER = null;
    // }
    // if (DESTINATION_MARKER != null) {
    //     DESTINATION_MARKER.setMap(null);
    //     DESTINATION_MARKER = null;
    // }
    
    document.forms[form_id]["SOURCE"].value = "";
    document.forms[form_id]["DESTINATION"].value = "";

    document.getElementById("Map_Inputs_Clear_Route").style.display = "none";
}






















/* ------------------------------------------------------------------- 
                            Real-Time Tracking
 ------------------------------------------------------------------- */

/* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */

/* Function to start/begin Real-time Route_Tracking */
// function Begin_Route_Tracking (form_id) {
//     var source = document.forms[form_id]["SOURCE"].value;
//     var destination = document.forms[form_id]["DESTINATION"].value;

//     codeAddress(source, destination);
    
//     var time_interval = 500;
//     ROUTE_TRACKING_TIMER = setInterval(function() {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(function(position) {
//                 if ((position.coords.longitude == DESTINATION.lng)  &&  (position.coords.latitude == DESTINATION.lat)) {
//                     Stop_Route_Tracking();
//                 }
//                 else {
//                     var source = {
//                         lng : position.coords.longitude,
//                         lat : position.coords.latitude
//                     }
                    
//                     Display_Route(source, DESTINATION);
//                 }
//             })
//         }
//         else {
//             console.log("Geolocation is not available");
//         }
//     }, time_interval);
// }





// /* Function to stop Real-time Route_Tracking */
// function Stop_Route_Tracking () {
//     DIRECTIONS_DISPLAY.setMap(null);
    
//     if (SOURCE_MARKER != null) {
//         SOURCE_MARKER.setMap(null);
//         SOURCE_MARKER = null;
//     }
//     if (DESTINATION_MARKER != null) {
//         DESTINATION_MARKER.setMap(null);
//         DESTINATION_MARKER = null;
//     }

//     clearInterval(ROUTE_TRACKING_TIMER);
// }

/* ------------------- End - Route ------------------- */

/* Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure Unsure */












