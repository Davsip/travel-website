$(document).ready(function () {



    // Aaron code start at 450
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyALW0-UOjpyY6rH54nDllLk5E22R2LAkYI",
        authDomain: "travel-website-c3bdf.firebaseapp.com",
        databaseURL: "https://travel-website-c3bdf.firebaseio.com",
        projectId: "travel-website-c3bdf",
        storageBucket: "",
        messagingSenderId: "560299774902"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#page-2").hide();

    // Initial File: JavaScript, jQuery, AJAX, API's, and Firebase
    // Retreive user trip region, dates, and activities
    // .push() user inputs to Firebase server to store under unique ID
    // Send user inputs via AJAX to correct API's, based on region / activities
    // Retreive and locate needed information from API call
    // Dynamically update HTML with user's trip information

    var possActivities = ["discovering", "eating", "going_out", "relaxing", "shopping", "sightseeing"];

    // On click event listeners for destination choice    
    // If user inputs own destination, grab value and send to modal
    $("#user-trip").on("click", function () {

        console.log($("#destination-name").val());
        $("#user-destination").text($("#destination-name").val());

    });
    // If user chooses predefined destination, grab value and send to modal
    $(".predefined-trip").on("click", function () {

        $("#user-destination").text($(this).attr("value"));

    });

    // Modal
    // Destination
    // Date Range (try to limit range to under 14-days)
    // Activities Boxes: Food, Sports, Music, Outdoor, Shopping, Nightlife, Attractions
    // Submit button: See My Trip

    // On click event listener for See My Trip
    // Get destination value, format to accepted input for API's (i.e. latitude & latitude)
    // Get date range, check if acceptable range, format to accepted input for API's
    // Get all selected activities
    $("#submit-trip").on("click", function () {

        $(".page-1").hide();


        console.log($("#user-destination").text());

        var myTrip = {
            destination: $("#user-destination").text(),
            startDate: $("#start-date").val(),
            endDate: $("#end-date").val(),
            myActivities: []

        }

        // figure out how to get activities from select boxes
        // store selected activities in string array
        // push array to myTrip
        console.log(possActivities.length);
        for (var i = 0; i < possActivities.length; i++) {
            console.log("check: activity-" + possActivities[i]);
            if ($("#activity-" + possActivities[i])[0].checked) {
                console.log(true);
                myTrip.myActivities.push(possActivities[i]);
            }
        }

        // pass myTrip to searchAPI, then to Firebase
        console.log(myTrip);
        searchAPI(myTrip);

    });

    function searchAPI(trip) {

        var city = trip.destination.substring(0, trip.destination.indexOf(","));
        var cityID = "";

        //console.log(city);

        //Start Sygic Travel API Search
        var apiKey = "VUoBrIiIld3xOuvna78BQ2JWCOS3Ndu32EcjtGzp";
        var url = "https://api.sygictravelapi.com/1.0/en/places/list?query=" + city;


        $.ajax({
            headers: {
                'x-api-key': apiKey
            },
            url: url
        })
            .done(function (data) {
                //console.log(url);
                var places = data.data.places;
                console.log(places);
                cityID = places[0].id;
                console.log(cityID);

                url = "https://api.sygictravelapi.com/1.0/en/places/list?parents=" + cityID + "&categories=";
                var categories = "";

                if (trip.myActivities.length > 1) {

                    console.log("--- More than 1 activity chosen ---");

                    for (var j = 0; j < trip.myActivities.length - 1; j++) {
                        categories = categories + trip.myActivities[j] + ",";
                        console.log(categories);
                    }

                    categories = categories + trip.myActivities[trip.myActivities.length - 1];
                    console.log(categories);

                } else {
                    console.log("--- Only 1 activity chosen ---");
                    categories = trip.myActivities[0];
                    console.log(categories);
                }

                url = url + categories + "&limit=5";
                console.log(url);

                activitySearch(trip);
            });


        function activitySearch(trip) {

            $.ajax({
                headers: {
                    'x-api-key': apiKey
                },
                url: url
            })
                .done(function (data) {
                    //console.log(url);
                    var places = data.data.places;
                    console.log(places);

                    //displayActivity(places);
                    pushFirebase(trip, places);
                });

        };

        // pass information to Firebase as new unique trip
        // displayActivity()
        // in displayActivity retreive Firebase trip object

    };

    // <div class="card">
    // <img class="card-img-top" src="..." alt="Card image cap">
    // <div class="card-body">
    // <h5 class="card-title">Card title</h5>
    // <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This
    // content is a little bit longer.</p>
    // </div>
    // </div>

    function displayActivity(places) {
    //function displayActivity() {
        $("#page-2").show();

        console.log("--- displayActivity Called ---")

        // if places.length > 5
        // have card-deck for first 5 activities
        // have card-deck for last 5 activities (start l @ index 5)

        var numActivities = snapshot.val().places.length;
        console.log(numActivities);

        snapshot.val().destination

        for (var k = 0; k < places.length; k++) {

            console.log("Activity + " + k + ": " + places[k]);

            var eachActivity = $("<div>");
            eachActivity.attr("class", "card");

            var imageActivity = $("<img>");
            imageActivity.attr("class", "card-img-top");
            imageActivity.attr("src", places[k].thumbnail_url);
            imageActivity.attr("alt", places[k].name);

            var cardBody = $("<div>");
            cardBody.attr("class", "card-body");

            var activityTitle = $("<h5>");
            activityTitle.attr("class", "activity-title");
            activityTitle.text(places[k].name);

            var activityAbout = $("<p>");
            activityAbout.text(places[k].perex);

            cardBody.append(activityTitle);
            cardBody.append(activityAbout);

            eachActivity.append(imageActivity);
            eachActivity.append(cardBody);

            $(".card-deck").append(eachActivity);

        }

    }


    // on child_added to user profile in Firebase
    // Initiate AJAX
    // Send destination, date range, and selected activities to
    // API's
    // Retreive and locate needed information from API call
    // Dynamically update HMTL with user's trip information





















































































































































































































































    database.ref("/user-trip").on("child_added", function (snapshot) {
        console.log(snapshot.val());

    }, function (errorObject) {

        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
    });

    function pushFirebase(myTrip, places) {

        console.log(myTrip);
        console.log(places);

        var myTrip2 = {
            myTrip,
            places
        }

        $("#user-destination").val("");
        $("#start-date").val("");
        $("#end-date").val("");

        database.ref("/user-trip").push(myTrip2);
    };

    //////////////////////////////////////
    // on submit trip, run these functions
    // toggleSignIn()
    // initApp() - throw all app code in this function
    //////////////////////////////////////
    //     function toggleSignIn() {
    //         if (firebase.auth().currentUser) {
    //             // [START signout]
    //             firebase.auth().signOut();
    //             // [END signout]
    //         } else {
    //             // [START authanon]
    //             firebase.auth().signInAnonymously().catch(function (error) {
    //                 // Handle Errors here.
    //                 var errorCode = error.code;
    //                 var errorMessage = error.message;
    //                 // [START_EXCLUDE]
    //                 if (errorCode === 'auth/operation-not-allowed') {
    //                     alert('You must enable Anonymous auth in the Firebase Console.');
    //                 } else {
    //                     console.error(error);
    //                 }
    //                 // [END_EXCLUDE]
    //             });
    //             // [END authanon]
    //         }
    //         document.getElementById('submit-trip').disabled = true;
    //     }
    //     /**
    //    * initApp handles setting up UI event listeners and registering Firebase auth listeners:
    //    *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
    //    *    out, and that is where we update the UI.
    //    */
    //     function initApp() {
    //         // Listening for auth state changes.
    //         // [START authstatelistener]
    //         firebase.auth().onAuthStateChanged(function (user) {
    //             if (user) {
    //                 // User is signed in.
    //                 var isAnonymous = user.isAnonymous;
    //                 var uid = user.uid;
    //                 // [START_EXCLUDE]
    //                 // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
    //                 // document.getElementById('quickstart-sign-in').textContent = 'Sign out';
    //                 // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
    //                 // [END_EXCLUDE]
    //             } else {
    //                 // User is signed out.
    //                 // [START_EXCLUDE]
    //                 // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
    //                 // document.getElementById('quickstart-sign-in').textContent = 'Sign in';
    //                 // document.getElementById('quickstart-account-details').textContent = 'null';
    //                 // [END_EXCLUDE]
    //             }
    //             // [START_EXCLUDE]
    //             document.getElementById('submit-trip').disabled = false;
    //             // [END_EXCLUDE]
    //         });
    //         // [END authstatelistener]
    //         document.getElementById('submit-trip').addEventListener('click', toggleSignIn, false);
    //     }

    //     //initApp();

});

// #user-trip, id for the explore button after search destination input field
// #user-destination, id for modal header where html with destination will go
// #destination-name, id for the destination input field before pressing explore button
// .predefined-trip, class for all of the predefined trip locations
// $(this).val(), currently using this to capture predefined trip location, can change to .attr("value") if you set value="city"
// #submit-trip, id for save changes button in modal
// #start-date, id for start date in modal
// #end-date, id for end date in modal
// #activity-name, id for each activity, i.e. activity-nightlife, activity-shopping, etc
