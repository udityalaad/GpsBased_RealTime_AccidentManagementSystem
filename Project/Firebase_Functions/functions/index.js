const functions = require('firebase-functions');


const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });



/* -------------------------------------------------------
                    Global Data
------------------------------------------------------- */


/* States the Maximum Weight of Risk Level - Allowed for Accident Scenario */
var MAX_ACCIDENT_WEIGHT = 3;







//* ------------------- Test Only ------------------- */
exports.addMessage = functions.https.onCall((data, context) => {
    return {
        new_data : "abcd",
        number : "1234",
        recieved_data : data.text
    };
});
/* ------------------- End - Test Only ------------------- */




/* -------------------------------------------------------
            Firebase Cloud Messaging (FCM)
------------------------------------------------------- */

/* Function to send FCM Notification from Client Application:
    a] From User_1 to User_2
    b] From User_Client_Script to User himself - About Nearby Accidents (3 types - SIMPLE, MILD, HEAVY) */
exports.SendFCMNotificationFromClient = functions.https.onCall((data, context) => {
    Send_FCM_Notification(data);
    
});



/* Function to send FCM_Notification */
function Send_FCM_Notification (data) {
    var payload = {
        "notification" : {
            title : data.title,
            body : data.body,
            color : data.color,
            icon : "https://firebasestorage.googleapis.com/v0/b/accident-management-system.appspot.com/o/App_Icon%2FApp_Icon.png?alt=media&token=13d1c215-aeb2-4a56-993f-45bd3f9e415e"
            // click_action : "android.intent.action.VIEW" // for intent filter in Stay Safe Application
        }
    };


    admin.messaging().sendToDevice(data.reciever, payload).then(() => {
        console.log("Notification has been sent succesfully.");

        return null;
    }).catch((error) => {
        console.error(error);
    });
}





/* -------------------------------------------------------
                    Request-Response
------------------------------------------------------- */

/* ------------------- Send Request ------------------- */
exports.checkNew_Request = functions.database.ref("/Request/{pushId}").onCreate((request_snapshot, context) => {
    admin.database().ref("/User").once("value", (user_snapshot) => {
        user_snapshot.forEach((user_childSnapshot) => {
            if (user_childSnapshot.child("Email_ID").val() === request_snapshot.child("To").val()) {
                var fcm_token = user_childSnapshot.child("FCM_Token").val();
                
                if (fcm_token  !==  null) {
                    var fcm_notification_data;

                    /* Add To Emergency Contact List */
                    if (request_snapshot.child("Request_Type").val() === "Add To Emergency Contact List") {
                        fcm_notification_data = {
                            title : "Add To Emergency Contact List",
                            body : "You have received a Friend Request from " + request_snapshot.child("From").val(),
                            color : "#DAF7A6",
                            reciever : [fcm_token]
                        };
                    }
                    /* Pass Vehicle Control */
                    else if (request_snapshot.child("Request_Type").val() === "Pass Vehicle Control") {
                        fcm_notification_data = {
                            title : "Pass Vehicle Control",
                            body : "You have received a Request to accept Vehicle Control " + request_snapshot.child("From").val(),
                            color : "#DAF7A6",
                            reciever : [fcm_token]
                        };
                    }

                    Send_FCM_Notification(fcm_notification_data);

                    console.info(fcm_token);
                }
                else {
                    console.info("Token Not Found - checkNew_Request");
                }
            }
        });

        return null;
    }).catch((error) => {
        console.error(error);
    });

    return null;
});




/* ------------------- Accept Request ------------------- */
exports.checkUpdate_Request = functions.database.ref("/Request/{pushId}").onUpdate((change, context) => {
    var request_snapshot_BEFORE = change.before;
    var request_snapshot_AFTER = change.after;

    if ((request_snapshot_BEFORE.child("Response").val() !== "Accepted")  &&  (request_snapshot_AFTER.child("Response").val() === "Accepted")) {
        admin.database().ref("/User").once("value", (user_snapshot) => {
            user_snapshot.forEach((user_childSnapshot) => {
                if (user_childSnapshot.child("Email_ID").val() === request_snapshot_AFTER.child("From").val()) {
                    var fcm_token = user_childSnapshot.child("FCM_Token").val();
                    
                    if (fcm_token  !==  null) {
                        var fcm_notification_data;
                        
                        if (request_snapshot_AFTER.child("Request_Type").val() === "Add To Emergency Contact List") {
                            fcm_notification_data = {
                                title : "Add To Emergency Contact List",
                                body : "Your Friend Request has been accepted by " + request_snapshot_AFTER.child("To").val(),
                                color : "#DAF7A6",
                                reciever : [fcm_token]
                            };
                        }
                        else if (request_snapshot_AFTER.child("Request_Type").val() === "Pass Vehicle Control") {
                            fcm_notification_data = {
                                title : "Pass Vehicle Control",
                                body : "Your Vehicle Control has been accepted by " + request_snapshot_AFTER.child("To").val(),
                                color : "#DAF7A6",
                                reciever : [fcm_token]
                            };
    
                        }
    
                        Send_FCM_Notification(fcm_notification_data);
    
                        console.info(fcm_token);
                    }
                    else {
                        console.info("Token Not Found - checkUpdate_Request");
                    }
                }
            });
    
            return null;
        }).catch((error) => {
            console.error(error);
        });
    }

    return null;
});





/* -------------------------------------------------------
                        Accident
------------------------------------------------------- */

/* Hols Global Units used for Geological Distance */
var DISTANCE_UNITS = "Kilo Meters";

/* Holds the radius of Circle, in whose viscinity, the Accident(s) exists
    - For User Alerts */
var ACCIDENT_CIRCLE_RADIUS = 10   // in DISTANCE_UNITS


/* Holds the radius of Circle, in whose viscinity, the area under Emergency Service falls
    - For User Alerts
    - For Emergency Service - Alerts*/
var EMERGENCY_SERVICE_CIRCLE_RADIUS = 50   // in DISTANCE_UNITS


/* Grab the current value of 'Accident_Possibility' that was written to the Realtime Database */
exports.checkNewAccidentPossibility = functions.database.ref("/Accident_Possibility/{pushId}").onCreate((accident_possibility_snapshot, context) => {
    admin.database().ref("/Accident_Scenario").once("value", (accident_scenario_snapshot) => {
        var Accident_Scenario_Exists = false;
        
        if (accident_possibility_snapshot.child("User").val() !== "") {
            /* Update an already existing Pending_Accident_Scenario (if exists)  -  for the particular Blackbox*/
            accident_scenario_snapshot.forEach((accident_scenario_childSnapshot) => {
                if ((accident_scenario_childSnapshot.child("User").val() === accident_possibility_snapshot.child("User").val())  &&  (accident_scenario_childSnapshot.child("Status").val() === "Pending")) {
                    Accident_Scenario_Exists = true;

                    var description = accident_scenario_childSnapshot.child("Description").val();
                    description.push(accident_possibility_snapshot.child("Description").val());

                    var data = {
                        Current_Weight : accident_scenario_childSnapshot.child("Current_Weight").val()  +  accident_possibility_snapshot.child("Weight").val(),
                        Description : description,
                        Previous_Weight : accident_scenario_childSnapshot.child("Current_Weight").val()
                    };
                    
                    accident_scenario_childSnapshot.ref.update(data);
                    
                    console.log("Update Accident Scenario Successfull");
                }
            });
        }


        /* Add a new Pending_Accident_Scenario (if does not already exist)  -  for the particular Blackbox */
        if (!Accident_Scenario_Exists) {
            var data = {
                Blackbox : accident_possibility_snapshot.child("Blackbox").val(),
                Date_And_Time : accident_possibility_snapshot.child("Date_And_Time").val(),
                Description : [accident_possibility_snapshot.child("Description").val()],
                Emergency_Contacts_Confirmation_Sent : false,     // States whether 'Request' to get the accident confirmed by the Emergency_Contact_List of User (who has met with accident) - has already been sent or not.
                Image : accident_possibility_snapshot.child("Image").val(),
                Level_Of_Risk : accident_possibility_snapshot.child("Level_Of_Risk").val(),
                Location_Coordinates : accident_possibility_snapshot.child("Location_Coordinates").val(),
                Current_Weight : accident_possibility_snapshot.child("Weight").val(),
                Previous_Weight : 0,
                Status : "Pending",
                Simple_Alerts_Sent : false, // States whther Simple Alerts have already been sent or not
                Mild_Alerts_Sent : false, // States whther Mild Alerts have already been sent or not
                Heavy_Alerts_Sent : false, // States whther Heavy Alerts have already been sent or not
                Uploaded_By : "System",
                User : accident_possibility_snapshot.child("User").val(),
                User_Confirmation_Sent : false,     // States whether 'Request' to get the accident confirmed by the User (who has met with accident) - has already been sent or not.
                Vehicle_Registration_Number : accident_possibility_snapshot.child("Vehicle_Registration_Number").val()
                // Marked_Heavy : true     // States whether maximum Risk_Level has been reached - to stop the reaction on addition of any more weightage
            };

            accident_scenario_snapshot.ref.push().set(data);

            console.log("Add new Accident Scenario Successfull");
        }

        return null;
    }).catch((error) => {
        console.error(error);
    });
    
    // accident_scenario_snapshot.ref.child("Status").set("Read");

    return null;
});




/* Grab the current value of 'Accident_Scenario' that was written to the Realtime Database */
exports.checkNewAccidentScenario = functions.database.ref("/Accident_Scenario/{pushId}").onCreate((accident_scenario_snapshot, context) => {
    Handle_Accident_Scenario(accident_scenario_snapshot.key);

    return null;
});




/* Grab the current value of 'Accident_Scenario' that was updated to the Realtime Database */
exports.checkUpdateAccidentScenario = functions.database.ref("/Accident_Scenario/{pushId}").onUpdate((change, context) => {
    var accident_scenario_snapshot_BEFORE = change.before;
    var accident_scenario_snapshot_AFTER = change.after;


    /* Handle Accident Scenario */
    var previous_weight = accident_scenario_snapshot_AFTER.child("Previous_Weight").val();
    var current_weight = accident_scenario_snapshot_AFTER.child("Current_Weight").val();

    /* Handle accident scanario if it has not reached the maximum level yet
        i.e.: if the maximum_level (weight) has not been handled yet
                (i.e.: the course of actions to be taken has not been started yet */
    if (! ((previous_weight >= 5)  &&  (current_weight >= 5))) {     // States whether maximum Risk_Level has ALREADY been reached - to stop the reaction on addition of any more weightage
        Handle_Accident_Scenario(accident_scenario_snapshot_AFTER.key);
    }
    /* ------------------------ */

    

    /* 'Force-cancel' all pending confirmations - related 'Accident_Scenario', which is marked as 'Cleared' */
    var status_BEFORE = accident_scenario_snapshot_BEFORE.child("Status").val();
    var status_AFTER = accident_scenario_snapshot_AFTER.child("Status").val();

    if ((status_BEFORE === "Pending")  &&  (status_AFTER === "Cleared")) {
        admin.database().ref("/Accident_Confirmation").once("value").then((confirmation_snapshot) => {
            confirmation_snapshot.forEach((confirmation_childSnapshot) => {
                if ((confirmation_childSnapshot.child("Accident_Scenario").val() === accident_scenario_snapshot_AFTER.key)   &&   (confirmation_childSnapshot.child("Response").val() === "Pending")) {
                    confirmation_childSnapshot.ref.update({Response : "Cleared"});
                }
            });
            
            console.log("'Force_Cancel' pending confirmations related to cleared 'Accident_Scenario' - successfull");
            
            return null;
        }).catch((error) => {
            console.error(error);
        });
    }
    /* --------------------------------------------------------------------------------------------- */

    return null;
});



/* Grab the deleted value of 'Accident_Scenario' from Realtime Database */
exports.checkDeletedAccidentScenario = functions.database.ref("/Accident_Scenario/{pushId}").onDelete((accident_scenario_snapshot, context) => {
    console.log("delete: " + accident_scenario_snapshot.key);

    /* Delete all the confirmations related to the 'Deleted_Accident_Scenario' */
    admin.database().ref("/Accident_Confirmation").once("value").then((confirmation_snapshot) => {
        confirmation_snapshot.forEach((confirmation_childSnapshot) => {
            if (confirmation_childSnapshot.child("Accident_Scenario").val() === accident_scenario_snapshot.key) {
                confirmation_childSnapshot.ref.remove();
            }
        });
        
        console.log("Delete Confirmations related to the 'Deleted_Accident_Scenario' - successfull");

        return null;
    }).catch((error) => {
        console.error(error);
    });

    return null;
});




/* Function/Algorithm to Handle an Accident_Scenario */
function Handle_Accident_Scenario (accident_scenario_id) {
    console.error(accident_scenario_id);
    admin.database().ref("/Accident_Scenario/" + accident_scenario_id).once("value").then((accident_scenario_snapshot) => {
        if (accident_scenario_snapshot.child("Status").val() !== "Cleared") {
            var current_weight = accident_scenario_snapshot.child("Current_Weight").val();
            
            var user_confirmation_sent = accident_scenario_snapshot.child("User_Confirmation_Sent").val();
            var emergency_contacts_confirmation_sent =  accident_scenario_snapshot.child("Emergency_Contacts_Confirmation_Sent").val();
            
            var user_id = accident_scenario_snapshot.child("User").val();

            if ((current_weight >= 1)  &&  (current_weight <= 2)) {
                accident_scenario_snapshot.ref.update({Level_Of_Risk : "Low"});

                if (!accident_scenario_snapshot.child("Simple_Alerts_Sent").val()) {
                    /* Send SIMPLE alerts to nearby USERS - About possibility of active accident
                    - Can be done on Client-Side - Add 'Real_Time_Location' parameter to Users */
                    Send_Alerts_To_Nearby_Users("Simple", accident_scenario_snapshot.toJSON(), user_id);
                    /* --------------------------------------------------------------------------- */

                    /* Send SIMPLE alerts to nearby EMERGENCY_SERVICES - About possibility of active accident */
                    Send_Alerts_To_Emergency_Services("Simple", accident_scenario_snapshot.toJSON(), user_id);
                    /* --------------------------------------------------------------------------- */

                    /* To avoid sending multiple Simple Alerts */
                    var simple_alerts_data = {
                        Simple_Alerts_Sent : true,
                    };

                    admin.database().ref("/Accident_Scenario/" + accident_scenario_id).update(simple_alerts_data);
                }
                
                console.log(2);

                if (user_id !== "") {
                    /* Get accident confirmed with the user */
                    if (!user_confirmation_sent) {
                        Get_Accident_Confirmed_With_User(accident_scenario_id, user_id);

                        Send_Alert_To_User("Simple", accident_scenario_snapshot, user_id);
                    }
                    /* ------------------------------ */


                    /* To avoid sending multiple confirmations */
                    var data_1 = {
                        User_Confirmation_Sent : true,
                    };

                    admin.database().ref("/Accident_Scenario/" + accident_scenario_id).update(data_1);
                    /* --------------------------------------- */
                }
                
            }
            else if (current_weight === 3) {
                accident_scenario_snapshot.ref.update({Level_Of_Risk : "Medium"});

                if (!accident_scenario_snapshot.child("Mild_Alerts_Sent").val()) {
                    /* Send MILD alerts to nearby USERS - For possibility of an accident
                        - Can be done on Client-Side - Add 'Real_Time_Location' parameter to Users */
                    Send_Alerts_To_Nearby_Users("Mild", accident_scenario_snapshot.toJSON(), user_id);
                    /* --------------------------------------------------------------------------- */

                    /* Send MILD alerts to nearby EMEGENCY_SERVICES - For possibility of an accident */
                    Send_Alerts_To_Emergency_Services("Mild", accident_scenario_snapshot.toJSON(), user_id);
                    /* ----------------------------------------------------------------------------- */

                    /* To avoid sending multiple Mild Alerts */
                    var mild_alerts_data = {
                        Mild_Alerts_Sent : true,
                    };

                    admin.database().ref("/Accident_Scenario/" + accident_scenario_id).update(mild_alerts_data);
                }


                console.log(3);

                if (user_id !== "") {
                    /* Get accident confirmed with the user */
                    if (!user_confirmation_sent  &&  (user_id !== "")) {
                        Get_Accident_Confirmed_With_User(accident_scenario_id, user_id);

                        Send_Alert_To_User("Mild", accident_scenario_snapshot, user_id);
                    }
                    /* ------------------------------ */


                    /* Get accident confirmed with Emergency_Contact_List of (user) */
                    if (!emergency_contacts_confirmation_sent  &&  (user_id !== "")) {
                        Get_Accident_Confirmed_With_Emergency_Contacts(accident_scenario_id, user_id);

                        Send_Alerts_To_Emergency_Contacts("Mild", accident_scenario_snapshot.toJSON(), user_id);
                    }
                    /* ------------------------------------------------------------ */

                    /* To avoid sending multiple confirmations
                        - Both are updated together because it will generate multiple confirmations for either one
                            => When updates before the other - thus triggering the '.onUpdate()' function/query
                                - with one of the 'Confirmations_Sent' status (Given below) - Still set to 'false' */
                    var data_2 = {
                        User_Confirmation_Sent : true,
                        Emergency_Contacts_Confirmation_Sent : true,
                    };

                    admin.database().ref("/Accident_Scenario/" + accident_scenario_id).update(data_2);
                    /* ------------------------------------------------------------------------------------------- */
                }
            }
            else if (current_weight >= 4) {
                accident_scenario_snapshot.ref.update({Level_Of_Risk : "Very High"});

                console.log("Providing Rescue");

                if (!accident_scenario_snapshot.child("Heavy_Alerts_Sent").val()) {
                    /* Send HEAVY alerts to the User (who has met with accident)
                        - To assure him/her that help is coming */
                    Send_Alert_To_User("Heavy", accident_scenario_snapshot, user_id);
                    /* --------------------------------------------------------------------------- */

                    /* Send HEAVY alerts to nearby USERS - About active accident 
                        - Can be done on Client-Side - Add 'Real_Time_Location' parameter to Users */
                    Send_Alerts_To_Nearby_Users("Heavy", accident_scenario_snapshot.toJSON(), user_id);
                    /* --------------------------------------------------------------------------- */
                    
                    
                    /* Send HEAVY alerts to nearby EMERGENCY_SERVICES - About active accident */
                    Send_Alerts_To_Emergency_Services("Heavy", accident_scenario_snapshot.toJSON(), user_id);
                    /* ---------------------------------------------------------------------- */
                    
                    
                    /* Send HEAVY alert EMERGENCY_CONTACT_LIST of USER (who has met with accident) */
                    if (user_id !== "") {
                        Send_Alerts_To_Emergency_Contacts("Heavy", accident_scenario_snapshot.toJSON(), user_id);
                    }



                    /* To avoid sending multiple Heavy Alerts */
                    var heavy_alerts_data = {
                        Heavy_Alerts_Sent : true,
                    };

                    admin.database().ref("/Accident_Scenario/" + accident_scenario_id).update(heavy_alerts_data);
                    /* --------------------------------------------------------------------------- */
                }
            }
        }

        return null;
    }).catch((error) => {
        console.error(error);
    });
}






/* ------------------- Accident Confirmations ------------------- */

/* Function to get accident confirmed with the user (who has met with accident) */
function Get_Accident_Confirmed_With_User (accident_scenario_id, user_id) {
    admin.database().ref("/User/" + user_id).once("value").then((user_snapshot) => {
        var data = {
            Accident_Scenario : accident_scenario_id,
            From : "System",
            To : user_snapshot.child("Email_ID").val(),
            Confirmation_Type : "Confirm own accident",
            Response : "Pending",
            Date_And_Time : String(new Date()),
            User : user_snapshot.key
        }
        

        admin.database().ref("/Accident_Confirmation").push().set(data);
        
        console.log("Accident confirmation sent to User successfully.");

        return null;
    }).catch((error) => {
        console.error(error);
    });
}



/* Function to get accident confirmed with the Emergency Contacts of the user (who has met with accident) */
function Get_Accident_Confirmed_With_Emergency_Contacts (accident_scenario_id, user_id) {
    admin.database().ref("/User/" + user_id).once("value").then((user_snapshot) => {
        var emergency_contact = user_snapshot.child("Emergency_Contact").val();

        for (var i = 0; i < emergency_contact.length; i++) {
            var data = {
                Accident_Scenario : accident_scenario_id,
                From : user_snapshot.child("Email_ID").val(),
                To : emergency_contact[i],
                Confirmation_Type : "Confirm friends accident",
                Response : "Pending",
                Date_And_Time : String(new Date()),
                User : user_snapshot.key
            }
            
            admin.database().ref("/Accident_Confirmation").push().set(data);
        }

        console.log("Accident confirmation sent to Emergency_Contacts successfully.");

        return null;
    }).catch((error) => {
        console.error(error);
    });
}



/* Expire Confirmation_Alert (to "Emergency Contact") after passing 30 minutes */
// var time_interval_FOR_Update_Confirmation_Status = 5000;
// var Update_Confirmation_Status = setInterval(() => {
//     admin.database().ref("/Accident_Confirmation").once("value", (snapshot) => {
//         var minutes_60 = 36000000;   // (60 minutes = 1 hour) in milliseconds(ms)
//         var minutes_30 = 18000000;   // 30 minutes in milliseconds(ms)
        
//         snapshot.forEach((childSnapshot) => {
//             if (childSnapshot.child("Response").val() === "Pending") {
//                 var confirmation_arrival_time = new Date(childSnapshot.child("Date_And_Time").val());
//                 var current_time = new Date();

//                 var time_elapsed = current_time.getTime() - confirmation_arrival_time.getTime();

//                 if ((childSnapshot.child("Confirmation_Type").val() === "Confirm own accident")  &&  (time_elapsed > minutes_60)) {
//                     childSnapshot.ref.update({Response : "Expired"});
//                 }
//                 else if ((childSnapshot.child("Confirmation_Type").val() === "Confirm friends accident")  &&  (time_elapsed > minutes_30)) {
//                     childSnapshot.ref.update({Response : "Expired"});
//                 }
//             }
//         });

//         return null;
//     }).catch((error) => {
//         console.error(error);
//     });
// }, time_interval_FOR_Update_Confirmation_Status);







/* ------------------- Accident Alerts ------------------- */

/* Function to send alert to User - who has met with accident */
function Send_Alert_To_User (alert_type, accident_scenario, user_id) {
    admin.database().ref("/User/" + user_id).once("value").then((user_snapshot) => {
        var fcm_token = user_snapshot.child("FCM_Token").val();

        console.info(fcm_token);

        if (fcm_token  !==  null) {
            var fcm_notification_data;

            if (alert_type === "Simple") {
                fcm_notification_data = {
                    title : "Confirm Your Own Accident",
                    body : "The system has detected the possibilty of your accident. Please confirm the same.",
                    color : "#DAF7A6",
                    reciever : fcm_token
                };
            }
            else if (alert_type === "Mild") {
                fcm_notification_data = {
                    title : "Confirm Your Own Accident",
                    body : "The system has detected the possibilty of your accident. Please confirm the same.",
                    color : "#DAF7A6",
                    reciever : fcm_token
                };
            }
            else if (alert_type === "Heavy") {
                fcm_notification_data = {
                    title : "Help is coming",
                    body : "The system has detected your accident.\nHelp is on the way.",
                    color : "#DAF7A6",
                    reciever : fcm_token
                };
            }

            Send_FCM_Notification(fcm_notification_data);
        }
        else {
            console.log("No Token Found - Send_Alerts_To_User");
        }

        return null;
    }).catch((error) => {
        console.error(error);
    });
}



/* Function to send Accident Alerts to nearby Users */
function Send_Alerts_To_Nearby_Users (alert_type, accident_scenario, user_id) {
    admin.database().ref("/User").once("value").then((user_snapshot) => {
        var tokens = [];

        user_snapshot.forEach((user_childSnapshot) => {
            // if (user_childSnapshot.child("Role").val() !== "Emergency Service User") {
            if ((user_childSnapshot.child("Role").val() !== "Emergency Service User")  &&  (user_childSnapshot.key !== user_id)) {
                // if (Distance_Between_Locations(user_childSnapshot.child("Most_Recent_Location").toJSON(), accident_scenario.Location_Coordinates) < ACCIDENT_CIRCLE_RADIUS) {
                    var fcm_token = user_childSnapshot.child("FCM_Token").val();

                    console.info(fcm_token);

                    if (fcm_token  !==  null) {
                        tokens.push(fcm_token);
                    }
                // }
            }
        });
        

        if (tokens.length !== 0) {
            var fcm_notification_data;

            if (alert_type === "Simple") {
                fcm_notification_data = {
                    title : alert_type + " Accident Alert",
                    body : "There might be a low possibility of an accident near your location.\n - Of User: " + user_id,
                    color : "#DAF7A6",
                    reciever : tokens
                };
            }
            else if (alert_type === "Mild") {
                fcm_notification_data = {
                    title : alert_type + " Accident Alert",
                    body : "There is a mild possibility of an accident near your location.\n - Of User: " + user_id,
                    color : "#DAF7A6",
                    reciever : tokens
                };
            }
            else if (alert_type === "Heavy") {
                fcm_notification_data = {
                    title : alert_type + " Accident Alert",
                    body : "There is a Very High possibility of an accident near your location.\n - Of User: " + user_id,
                    color : "#DAF7A6",
                    reciever : tokens
                };
            }

            Send_FCM_Notification(fcm_notification_data);
        }
        else {
            console.log("No Tokens Found - Send_Alerts_To_Nearby_Users");
        }
        
        return null;
    }).catch((error) => {
        console.error(error);
    });
}




/* Function to send Accident Alerts to Emergency Services (- closest to the location of accident) */
function Send_Alerts_To_Emergency_Services (alert_type, accident_scenario, user_id) {
    admin.database().ref("/User").once("value").then((user_snapshot) => {
        var tokens = [];

        user_snapshot.forEach((user_childSnapshot) => {
            if (user_childSnapshot.child("Role").val() === "Emergency Service User") {
                // if (Distance_Between_Locations(user_childSnapshot.child("Most_Recent_Location").toJSON(), accident_scenario.Location_Coordinates) < EMERGENCY_SERVICE_CIRCLE_RADIUS)) {
                    var fcm_token = user_childSnapshot.child("FCM_Token").val();

                    console.info(fcm_token);

                    if (fcm_token  !==  null) {
                        tokens.push(fcm_token);
                    }
                // }
            }
        });
        

        if (tokens.length !== 0) {
            var fcm_notification_data;

            if (alert_type === "Simple") {
                fcm_notification_data = {
                    title : alert_type + " Accident Alert",
                    body : "There might be a low possibility of an accident in your locality.\n - Of User " + user_id,
                    color : "#DAF7A6",
                    reciever : tokens
                };
            }
            else if (alert_type === "Mild") {
                fcm_notification_data = {
                    title : alert_type + " Accident Alert",
                    body : "There is a mild possibility of an accident in your locality.\n - Of User " + user_id,
                    color : "#DAF7A6",
                    reciever : tokens
                };
            }
            else if (alert_type === "Heavy") {
                fcm_notification_data = {
                    title : alert_type + " Accident Alert",
                    body : "There is a Very High possibility of an accident in your locality.\n - Of User " + user_id,
                    color : "#DAF7A6",
                    reciever : tokens
                };
            }

            Send_FCM_Notification(fcm_notification_data);
        }
        else {
            console.log("No Tokens Found - Send_Alerts_To_Emergency_Services");
        }
        
        return null;
    }).catch((error) => {
        console.error(error);
    });
}



/* Function to send Accident Alerts to Emergency Contacts of User (who has met with accident) */
function Send_Alerts_To_Emergency_Contacts (alert_type, accident_scenario, user_id) {
    admin.database().ref("/User/" + user_id).once("value").then((accident_user_snapshot) => {
        var emergency_contacts = accident_user_snapshot.child("Emergency_Contact").val();

        if (emergency_contacts !== null) {
            admin.database().ref("/User").once("value").then((user_snapshot) => {
                var tokens = [];

                user_snapshot.forEach((user_childSnapshot) => {
                    if (emergency_contacts.includes(user_childSnapshot.child("Email_ID").val())) {
                        var fcm_token = user_childSnapshot.child("FCM_Token").val();

                        console.info(fcm_token);

                        if (fcm_token  !==  null) {
                            tokens.push(fcm_token);
                        }
                    }
                });
                

                if (tokens.length !== 0) {
                    var fcm_notification_data;

                    if (alert_type === "Mild") {
                        fcm_notification_data = {
                            title : "Confirm Friend's Accident",
                            body : "Please confirm your friend's accident.\n - Email: " + user_id,
                            color : "#DAF7A6",
                            reciever : tokens
                        };
                    }
                    else if (alert_type === "Heavy") {
                        fcm_notification_data = {
                            title : alert_type + " Accident Alert - of Friend",
                            body : "Your friend has met with an accident.\n - Email: " + user_id,
                            color : "#DAF7A6",
                            reciever : tokens
                        };
                    }

                    Send_FCM_Notification(fcm_notification_data);
                }
                else {
                    console.log("No Tokens Found - Send_Alerts_To_Emergency_Contacts");
                }
        
                return null;
            }).catch((error) => {
                console.error(error);
            });
        }
         
        return null;
    }).catch((error) => {
        console.error(error);
    });
}






/* ------------------- Distance Between 2 Geolocations ------------------- */

/* Function to find distance between 2 Location_Coordinates */
function Distance_Between_Locations (location_1, location_2) {
    if ((location_1.lat === location_2.lat)  &&  (location_1.lng === location_2.lng)) {
        return 0;
    }
    else {
        var radLat1 = Math.PI * (location_1.lat / 180);
        var radLat2 = Math.PI * (location_2.lat / 180);

        var theta = location_1.lng - location_2.lng;
        var radTheta = Math.PI * (theta / 180);

        var dist = (Math.sin(radLat1) * Math.sin(radLat2))  +  (Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta));

        if (dist > 1) {
            dist = 1;
        }

        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;

        if (DISTANCE_UNITS === "Kilo Meters") {
            dist = dist * 1.609344;
        }
        else if (DISTANCE_UNITS === "Nautical Miles") {
            dist = dist * 0.8684;
        }

        return dist;
    }
}



/* Converts Numerical_Degrees to Radians */
function toRad(value) {
    return value * Math.PT / 180;
}












/* -------------------------------------------------------
                    Blackspot
------------------------------------------------------- */

/* Holds the radius of Circle, in whose viscinity, the Blackspot(s) exists */
var BLACKSPOT_CIRCLE_RADIUS = 0.1   // in DISTANCE_UNITS


/* Holds the radius of Circle, in whose viscinity, the Blackspot(s) exists
    - For User Alerts */
var BLACKSPOT_USER_CIRCLE_RADIUS = 10;


/* Holds the valus of minimum number of factors, required to create a blackspot */
var MINIMUM_NO_OF_FACTORS_FOR_BLACKSPOT = 3;


/* Grab the current value of 'Blackspot' that was written to the Realtime Database */
exports.checkNewBlackspot = functions.database.ref("/Blackspot/{pushId}").onCreate((new_blackspot_snapshot, context) => {
    admin.database().ref("/Blackspot").once("value").then((all_blackspots_snapshot) => {
        var found_blackspot_id = Look_For_Blackspot(new_blackspot_snapshot.child("Location_Coordinates").val(), all_blackspots_snapshot.toJSON());

        if (found_blackspot_id  !==  null) {
            admin.database().ref("/Blackspot/" + found_blackspot_id).once("value").then((found_blackspot_snapshot) => {
                var current_weight = found_blackspot_snapshot.child("Current_Weight").val() + 1;
                
                var description_to_be_added = "ANOTHER BLACKSPOT ADDED: By - "  +  found_blackspot_snapshot.child("Added_By").val()  +  ";   Dated: " + found_blackspot_snapshot.child("Date_And_Time").val();
                var description_object = found_blackspot_snapshot.child("Description").val();
                var description;
                if (Array.isArray(description_object)) {
                    description = description_object;
                    description.push(description_to_be_added);
                }
                else {
                    description = [description_object, description_to_be_added];
                }

                var data = {
                    Current_Weight : current_weight,
                    Description : description,
                    Last_Updated : String(new Date()),
                    Level_Of_Risk : Find_Level_Of_Risk_By_Weight_FOR_Blackspot(current_weight),
                    Previous_Weight : found_blackspot_snapshot.child("Current_Weight").val(),
                    Status : "Active"
                };
                
                found_blackspot_snapshot.ref.update(data);

                return null;
            }).catch((error) => {
                console.error(error);
            });

            admin.database().ref("/Blackspot/" + new_blackspot_snapshot.key).update({Status : "Used"});
        }
        else {
            new_blackspot_snapshot.ref.update({Status : "Active"});

            Send_Blackspot_Alerts_To_Nearby_Users(new_blackspot_snapshot.toJSON(), new_blackspot_snapshot.key);
            Send_Blackspot_Alerts_To_Emergency_Services(new_blackspot_snapshot.toJSON(), new_blackspot_snapshot.key);
        }

        return null;
    }).catch((error) => {
        console.error(error);
    });
    
    return null;
});




/* Function to search for a Blackspot within the a Particular Radius of the given "location_coordinates" */
function Look_For_Blackspot (location_coordinates, blackspots) {
    var found_blackspot_id = null;

    Object.keys(blackspots).forEach((key) => {
        if (found_blackspot_id === null) {
            if ((blackspots[key].Status === "Active")  &&  (Distance_Between_Locations(location_coordinates, blackspots[key].Location_Coordinates) < BLACKSPOT_CIRCLE_RADIUS)) {
                found_blackspot_id = key;
            }
        }
    });

    return found_blackspot_id;
}



/* Function to send alerts to nearby users, when a new Blackspot has been made Active" */
function Send_Blackspot_Alerts_To_Nearby_Users (blackspot, blackspot_id) {
    admin.database().ref("/User").once("value").then((user_snapshot) => {
        var tokens = [];

        user_snapshot.forEach((user_childSnapshot) => {
            if (user_childSnapshot.child("Role").val() !== "Emergency Service User") {
                // if (Distance_Between_Locations(user_childSnapshot.child("Most_Recent_Location").toJSON(), blackspot.Location_Coordinates) < BLACKSPOT_USER_CIRCLE_RADIUS) {
                    var fcm_token = user_childSnapshot.child("FCM_Token").val();

                    console.info(fcm_token);
                    
                    if (fcm_token  !==  null) {
                        tokens.push(fcm_token);
                    }
                // }
            }
        });
        

        if (tokens.length !== 0) {
            var fcm_notification_data;

            fcm_notification_data = {
                title : "New " + blackspot.Level_Of_Risk + " Risk Blackspot Alert",
                body : "A new " + blackspot.Level_Of_Risk + " Risk Blackspot has recently been made active near your location. Be careful.\n - Blackspot ID: " + blackspot_id,
                color : "#DAF7A6",
                reciever : tokens
            };

            Send_FCM_Notification(fcm_notification_data);
        }
        else {
            console.log("No Tokens Found - Send_Blackspot_Alerts_To_Nearby_Users");
        }
        
        return null;
    }).catch((error) => {
        console.error(error);
    });
}




/* Function to send alerts to nearby Emergency Service, when a new Blackspot has been made Active" */
function Send_Blackspot_Alerts_To_Emergency_Services (blackspot, blackspot_id) {
    admin.database().ref("/User").once("value").then((user_snapshot) => {
        var tokens = [];

        user_snapshot.forEach((user_childSnapshot) => {
            if (user_childSnapshot.child("Role").val() === "Emergency Service User") {
                // if (Distance_Between_Locations(user_childSnapshot.child("Most_Recent_Location").toJSON(), blackspot.Location_Coordinates) < EMERGENCY_SERVICE_CIRCLE_RADIUS) {
                    var fcm_token = user_childSnapshot.child("FCM_Token").val();

                    console.info(fcm_token);
                    
                    if (fcm_token  !==  null) {
                        tokens.push(fcm_token);
                    }
                // }
            }
        });
        

        if (tokens.length !== 0) {
            var fcm_notification_data;
            
            fcm_notification_data = {
                title : "NEW " + blackspot.Level_Of_Risk + " Risk Blackspot Alert",
                body : "A new " + blackspot.Level_Of_Risk + " Risk Blackspot has recently been made active in your locality.\n - Blackspot ID: " + blackspot_id,
                color : "#DAF7A6",
                reciever : tokens
            };

            Send_FCM_Notification(fcm_notification_data);
        }
        else {
            console.log("No Tokens Found - Send_Blackspot_Alerts_To_Emergency_Services");
        }
        
        return null;
    }).catch((error) => {
        console.error(error);
    });
}








/* Grab the current value of 'Accident_Scenario' that was written to the Realtime Database */
exports.checkNew_AccidentScenario_FOR_Blackspot = functions.database.ref("/Accident_Scenario/{pushId}").onCreate((new_accident_scenario_snapshot, context) => {
    Blackspot_Based_On_Unsafe_Zone_AND_ACCIDENT_SCENARIO("Accident_Scenario", new_accident_scenario_snapshot.key, new_accident_scenario_snapshot.toJSON());

    return null;
});




/* Grab the current value of 'Unsafe_Zone' that was written to the Realtime Database */
exports.checkNew_UnsafeZone_FOR_Blackspot = functions.database.ref("/Unsafe_Zone/{pushId}").onCreate((new_unsafe_zone_snapshot, context) => {
    Blackspot_Based_On_Unsafe_Zone_AND_ACCIDENT_SCENARIO("Unsafe_Zone", new_unsafe_zone_snapshot.key, new_unsafe_zone_snapshot.toJSON());

    Send_Reported_Unsafe_Zones_Alerts_To_Emergency_Services (new_unsafe_zone_snapshot.toJSON(), new_unsafe_zone_snapshot.key);

    return null;
});



/* Function to send alerts to nearby Emergency Service, when a new Unsafe Zone has been Reported */
function Send_Reported_Unsafe_Zones_Alerts_To_Emergency_Services (unsafe_zone, unsafe_zone_id) {
    admin.database().ref("/User").once("value").then((user_snapshot) => {
        var tokens = [];

        user_snapshot.forEach((user_childSnapshot) => {
            if (user_childSnapshot.child("Role").val() === "Emergency Service User") {
                // if (Distance_Between_Locations(user_childSnapshot.child("Most_Recent_Location").toJSON(), unsafe_zone.Location_Coordinates) < EMERGENCY_SERVICE_CIRCLE_RADIUS) {
                    var fcm_token = user_childSnapshot.child("FCM_Token").val();

                    console.info(fcm_token);
                    
                    if (fcm_token  !==  null) {
                        tokens.push(fcm_token);
                    }
                // }
            }
        });
        

        if (tokens.length !== 0) {
            var fcm_notification_data;
            
            fcm_notification_data = {
                title : "NEW " + unsafe_zone.Level_Of_Risk + " Risk Unsafe Zone Alert",
                body : "A new " + unsafe_zone.Level_Of_Risk + " Risk Unsafe Zone has recently been reported in your locality.\n - Unsafe Zone ID: " + unsafe_zone_id,
                color : "#DAF7A6",
                reciever : tokens
            };

            Send_FCM_Notification(fcm_notification_data);
        }
        else {
            console.log("No Tokens Found - Send_Reported_Unsafe_Zones_Alerts_To_Emergency_Services");
        }
        
        return null;
    }).catch((error) => {
        console.error(error);
    });
}






/* Function to CREATE or UPDATE a Blackspot, based on:
    - 1] Existing Blackspot
      2] Number of Accident_Scenarios & Unsafe_Zones
    in the viscinity of given Location_Coordinates */
function Blackspot_Based_On_Unsafe_Zone_AND_ACCIDENT_SCENARIO (data_type, data_id, data_snapshot) {
    admin.database().ref("/Blackspot").once("value").then((all_blackspots_snapshot) => {
        var found_blackspot_id = Look_For_Blackspot(data_snapshot.Location_Coordinates, all_blackspots_snapshot.toJSON());

        if (found_blackspot_id !== null) {
            admin.database().ref("/Blackspot/" + found_blackspot_id).once("value").then((found_blackspot_snapshot) => {
                var current_weight = found_blackspot_snapshot.child("Current_Weight").val() + 1;
                
                
                var description_to_be_added;
                var description_object = found_blackspot_snapshot.child("Description").val();
                var description;
                if (data_type === "Accident_Scenario") {
                    description_to_be_added = "ACCIDENT OCCURRED: "  +  data_snapshot.Vehicle_Registration_Number  +  ";  Dated: " + data_snapshot.Date_And_Time;
                }
                else if (data_type === "Unsafe_Zone") {
                    description_to_be_added = "REPORTED AS UNSAFE ZONE: By - "  +  data_snapshot.Reported_By  +  ";  Dated: " + data_snapshot.Date_And_Time;
                }

                if (Array.isArray(description_object)) {
                    description = description_object;
                    description.push(description_to_be_added);
                }
                else {
                    description = [description_object, description_to_be_added];
                }


                var data = {
                    Current_Weight : current_weight,
                    Description : description,
                    Last_Updated : String(new Date()),
                    Level_Of_Risk : Find_Level_Of_Risk_By_Weight_FOR_Blackspot(current_weight),
                    Previous_Weight : found_blackspot_snapshot.child("Current_Weight").val(),
                    Status : "Active"
                };
                
                found_blackspot_snapshot.ref.update(data);

                return null;
            }).catch((error) => {
                console.error(error);
            });

            
            if (data_type === "Accident_Scenario") {
                // admin.database().ref("/Accident_Scenario/" + new_accident_scenario_snapshot.key).update({Status : "Used"});
            }
            else if (data_type === "Unsafe_Zone") {
                admin.database().ref("/Unsafe_Zone/" + data_id).update({Status : "Used"});
            }
            
            
            console.log(data_type + " used to update existing Blackspot Successully.");
        }
        else {      // Check for more factors - needed to create a blackspot
            admin.database().ref("/Accident_Scenario").once("value").then((all_accident_scenarios_snapshot) => {
                admin.database().ref("/Unsafe_Zone").once("value").then((all_unsafe_zones_snapshot) => {
                    var all_affecting_factors = Check_For_All_Factors(data_snapshot.Location_Coordinates, all_accident_scenarios_snapshot.toJSON(), all_unsafe_zones_snapshot.toJSON());

                    if (all_affecting_factors.Weight >= MINIMUM_NO_OF_FACTORS_FOR_BLACKSPOT) {
                        // var description_to_be_added;
                        // var description_object = all_affecting_factors.Description;
                        // var description;

                        // if (data_type === "Accident_Scenario") {
                        //     description_to_be_added = "ACCIDENT OCCURRED: "  +  new_accident_scenario_snapshot.child("Vehicle_Registration_Number").val()  +  ";   Dated: " + new_accident_scenario_snapshot.child("Date_And_Time").val();
                        // }
                        // else if (data_type === "Unsafe_Zone") {
                        //     description_to_be_added = "REPORTED AS UNSAFE ZONE: By - "  +  new_unsafe_zone_snapshot.child("Reported_By").val()  +  ";   Dated: " + new_unsafe_zone_snapshot.child("Date_And_Time").val();
                        // }

                        // if (Array.isArray(description_object)) {
                        //     description = description_object;
                        //     description.push(description_to_be_added);
                        // }
                        // else {
                        //     description = [description_object, description_to_be_added];
                        // }

                        var description = all_affecting_factors.Description;
                        
                        var image = null;
                        if (data_snapshot.hasOwnProperty("Image")) {
                            image = data_snapshot.Image;
                            console.info("a -- ");
                        }

                        var data = {
                            Added_By : "System",
                            Current_Weight : all_affecting_factors.Weight,
                            Date_And_Time : String(new Date()),
                            Description : description,
                            Image : image,
                            Last_Updated : String(new Date()),
                            Level_Of_Risk : Find_Level_Of_Risk_By_Weight_FOR_Blackspot(all_affecting_factors.Weight),
                            Location_Coordinates : data_snapshot.Location_Coordinates,
                            Previous_Weight : 0,
                            Reported_By : "System",
                            Status : "Pending"
                        };
                        
                        admin.database().ref("/Blackspot").push().set(data);
                        
                        Mark_Unsafe_Zones_AS_Used (all_affecting_factors.Unsafe_Zones_Used);

                        console.log("Blackspot created with Multiple Factors Succesfully.");
                    }
                    else {
                        console.log("Not enough factors available, to create a blackspot.");
                    }

                    return null;
                }).catch((error) => {
                    console.error(error);
                });

                return null;
            }).catch((error) => {
                console.error(error);
            });
        }

        return null;
    }).catch((error) => {
        console.error(error);
    });
}




/* Function to check for factors (other than the one currently detected) to Add a Blackspot */
function Check_For_All_Factors (location_coordinates, accident_scenarios, unsafe_zones) {
    var weight = 0;

    var description = [];

    var unsafe_zones_used = [];

    Object.keys(accident_scenarios).forEach((key) => {
        if (((accident_scenarios[key].Status === "Pending") || (accident_scenarios[key].Status === "Cleared"))  &&  (Distance_Between_Locations(location_coordinates, accident_scenarios[key].Location_Coordinates) < BLACKSPOT_CIRCLE_RADIUS)) {
            console.info("Factor: " + key);
            
            weight += 1;
            description.push("ACCIDENT OCCURRED: "  +  accident_scenarios[key].Vehicle_Registration_Number  +  ";  Dated: " + accident_scenarios[key].Date_And_Time);
        }
    });
    
    
    Object.keys(unsafe_zones).forEach((key) => {
        if (((unsafe_zones[key].Status === "Active") || (unsafe_zones[key].Status === "Cleared"))  &&  (Distance_Between_Locations(location_coordinates, unsafe_zones[key].Location_Coordinates) < BLACKSPOT_CIRCLE_RADIUS)) {
            console.info("Factor: " + key);

            weight += 1;
            description.push("REPORTED AS UNSAFE ZONE: By - "  +  unsafe_zones[key].Reported_By  +  ";  Dated: " + unsafe_zones[key].Date_And_Time);

            unsafe_zones_used.push(key);
        }
    });
    
    data = {
        Weight : weight,
        Description : description,
        Unsafe_Zones_Used : unsafe_zones_used
    }
    
    return data;
}





/* Function to find the Level_Of_Risk corresponding to the given weight */
function Find_Level_Of_Risk_By_Weight_FOR_Blackspot (weight) {
    if (weight === 1) {
        return "Very Low";
    }
    else if (weight === 2) {
        return "Low";
    }
    else if (weight === 3) {
        return "Medium";
    }
    else if (weight === 4) {
        return "High";
    }
    else if (weight >= 5) {
        return "Very High";
    }
}





/* Function to change the status of Unsafe_Zone to "Used"
    - Only of those Unsafe_Zones which have been used to create the Blackspot */
function Mark_Unsafe_Zones_AS_Used (unsafe_zones_used) {
    admin.database().ref("/Unsafe_Zone").once("value").then((unsafe_zone_snapshot) => {
        unsafe_zone_snapshot.forEach((unsafe_zone_childSnapshot) => {
            if (unsafe_zones_used.includes(unsafe_zone_childSnapshot.key)) {
                unsafe_zone_childSnapshot.ref.update({Status : "Used"});
            }
        });
        
        return null;
    }).catch((error) => {
        console.error(error);
    });
}







/* Downgrade a "Blackspot" (Decrement Weightage) - Every 6 months */
// var time_interval_FOR_Downgrade_Blackspot = 86400000;    // (24 hours = 1 days) in millisceonds(ms)
// var Downgrade_Blackspot = setInterval(() => {
//     admin.database().ref("/Blackspot").once("value", (snapshot) => {
//         var months_6 = 86400000 * 180;   // (60 minutes = 1 hour) in milliseconds(ms)
        
//         snapshot.forEach((childSnapshot) => {
//             var last_updated = new Date(childSnapshot.child("Last_Updated").val());
//             var now = new Date();

//             var time_elapsed = now.getTime() - last_updated.getTime();
            
//             console.info(time_elapsed);
//             if (childSnapshot.child("Status").val() === "Active") {
                
                
//                 if ((childSnapshot.child("Current_Weight").val() > 1)  &&  (time_elapsed > months_6)) {
//                     var weight = childSnapshot.child("Current_Weight").val();
//                     var data = {
//                         Current_Weight : weight - 1,
//                         Last_Updated : String(new Date()),
//                         Level_Of_Risk : Find_Level_Of_Risk_By_Weight_FOR_Blackspot(weight - 1),
//                         Previous_Weight : weight
//                     };

//                     childSnapshot.ref.update(data);
//                 }
//             }
//         });

//         return null;
//     }).catch((error) => {
//         console.error(error);
//     });
// }, time_interval_FOR_Downgrade_Blackspot);