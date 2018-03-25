$(document).ready(function () {

    // Hide all pages that are not page-1 on document load
    $("#page-2").hide();

    // Initialize Firebase & get local reference to the database
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
    var userKey = "";

    // Google Maps API - Autocomplete by Cities for Destination Search 
    var input = document.getElementById('destination-name');

    var autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
    });

    // Global array of Categories accepted by Sygic Travel API
    var possActivities = ["discovering", "eating", "going_out", "relaxing", "shopping", "sightseeing"];

    // On click event listeners for destination choice    
    // If user inputs own destination, grab value and send to modal
    $("#user-trip").on("click", function () {

        console.log($("#destination-name").val());
        $("#user-destination").text($("#destination-name").val());

    });

    // If user chooses predefined destination, grab value and send to modal
    $(".predefined-trip").on("click", function () {

        $("#user-destination").text($(this).text());

    });

    // On click event listener for Submit Trip
    $("#submit-trip").on("click", function () {

        // Hide all content on page-1
        $(".page-1").hide();

        console.log($("#user-destination").text());

        // Store user inputs
        var myTrip = {
            destination: $("#user-destination").text(),
            startDate: $("#start-date").val(),
            endDate: $("#end-date").val(),
            myActivities: []
        };

        // Clear input values after storing inputs
        $("#user-destination").val("");
        $("#start-date").val("");
        $("#end-date").val("");
        $("#destination-name").val("");

        console.log(possActivities.length);

        // For loop to store user checked activities
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

    // Sygic Travel API Search
    function searchAPI(trip) {

        var city = trip.destination.substring(0, trip.destination.indexOf(","));
        var cityID = "";

        //console.log(city);

        var apiKey = "VUoBrIiIld3xOuvna78BQ2JWCOS3Ndu32EcjtGzp";
        var url = "https://api.sygictravelapi.com/1.0/en/places/list?query=" + city;

        // Sygic Travel API Search to Retrieve City ID 
        $.ajax({
            headers: {
                'x-api-key': apiKey
            },
            url: url
        })
            .done(function (data) {

                var places = data.data.places;
                console.log(places);
                cityID = places[0].id;
                console.log(cityID);

                activitySearch();
            });

        // Sygic Travel API Search to Retrieve Activity Search Results
        function activitySearch() {

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

            url = url + categories + "&limit=12";
            console.log(url);

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

                    if (places.length === 0) {
                        // modal to alert user that no activities returned
                        // then return to page-1 and hide page-2

                    } else {
                        pushFirebase(trip, places);
                    };

                });

        };

    };

    // Dynamically update page-2 with API Search Results
    function displayActivity( key ) {

        // Get reference to this user's trip from Firebase
        var trip = database.ref().child(key);

        var userTrip;

        trip.on("value", function(snapshot) {
            userTrip = snapshot.val();
        });

        console.log(userTrip);

        // Show all content on page-2
        $("#page-2").show();

        $("#destination").text(userTrip.myTrip.destination);
        $("#date-start").text(userTrip.myTrip.startDate);
        $("#date-end").text(userTrip.myTrip.endDate);

        console.log("--- displayActivity Called ---")

        var cardDeckOne = $("<div class='card-deck'>");
        var cardDeckTwo = $("<div class='card-deck'>");
        var cardDeckThree = $("<div class='card-deck'>");

        // For loop to dynamically update activities from API search results
        // Each card deck contains 4 activity cards
        // Would need to be adjusted if more than 12 activities returned
        for (var k = 0; k < userTrip.places.length; k++) {

            console.log("Activity + " + k + ": " + userTrip.places[k]);

            var eachActivity = $("<div class='card'>");

            var imageActivity = $("<img class='card-img-top' src=" + userTrip.places[k].thumbnail_url + " alt=" + userTrip.places[k].name + ">");

            var cardBody = $("<div class='card-body'>");

            var activityTitle = $("<h5 class='card-title'>");
            activityTitle.text(userTrip.places[k].name);

            var activityAbout = $("<p class='card-text'>");
            activityAbout.text(userTrip.places[k].perex);

            cardBody.append(activityTitle);
            cardBody.append(activityAbout);

            eachActivity.append(imageActivity);
            eachActivity.append(cardBody);

            if (k < 4) {
                cardDeckOne.append(eachActivity);
            } else if (k < 8) {
                cardDeckTwo.append(eachActivity);
            } else {
                cardDeckThree.append(eachActivity);
            }

        };

        $(".card-deck-container").append(cardDeckOne);
        $(".card-deck-container").append(cardDeckTwo);
        $(".card-deck-container").append(cardDeckThree);

    };

    // Push initial user trip information and API search results to Firebase Database
    function pushFirebase(myTrip, places) {

        console.log(myTrip);
        console.log(places);

        var myTrip2 = {
            myTrip,
            places
        }

        var newEntry = database.ref().push(myTrip2);
        userKey = newEntry.key;
        console.log(userKey);
        console.log(newEntry);
        displayActivity(userKey);

    };

});