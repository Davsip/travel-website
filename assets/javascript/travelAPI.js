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

        // Prevent user from exploring if no destination entered
        if ( $("#destination-name").val() === "") {

            $("#no-results").modal("hide");    
            return false;
        } else {

            $("#user-destination").text($("#destination-name").val());
        };
    });

    // If user chooses predefined destination, grab value and send to modal
    $(".predefined-trip").on("click", function () {

        $("#user-destination").text($(this).text());
    });

    // On click event listener for Submit Trip
    $("#submit-trip").on("click", function () {

        // Hide all content on page-1
        $(".page-1").hide();

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

        // For loop to store user checked activities
        for (var i = 0; i < possActivities.length; i++) {

            if ($("#activity-" + possActivities[i])[0].checked) {

                myTrip.myActivities.push(possActivities[i]);
            };
        };

        // Clear checkboxes after storing checked activities
        $("input[type=checkbox]").each(function () {
            this.checked = false;
        });

        // pass myTrip to searchAPI, then to Firebase
        searchAPI(myTrip);
    });

    // Sygic Travel API Search
    function searchAPI(trip) {

        var city = trip.destination.substring(0, trip.destination.indexOf(","));
        var cityID = "";

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
                cityID = places[0].id;

                activitySearch();
            });

        // Sygic Travel API Search to Retrieve Activity Search Results
        function activitySearch() {

            url = "https://api.sygictravelapi.com/1.0/en/places/list?parents=" + cityID + "&categories=";
            var categories = "";

            // Build categories portion of url based on number of activities returned from Sygic Travel API search
            if (trip.myActivities.length > 1) {

                for (var j = 0; j < trip.myActivities.length - 1; j++) {
                    categories = categories + trip.myActivities[j] + "%7C"; 
                }

                categories = categories + trip.myActivities[trip.myActivities.length - 1];

            } else {
                categories = trip.myActivities[0];
            }

            url = url + categories + "&limit=12";

            // Sygic Travel API search to retrieve possible activity results
            $.ajax({
                headers: {
                    'x-api-key': apiKey
                },
                url: url
            })
                .done(function (data) {
                    var places = data.data.places;

                    // Display modal to alert user that no activities returned, else keep moving on
                    if (places.length === 0) {

                        $("#no-results").modal("show");
                        $("#page-2").hide();
                        $(".page-1").show();

                    } else {
                        pushFirebase(trip, places);
                    };
                });
        };
    };

    // Dynamically update page-2 with API Search Results
    function displayActivity(key) {

        // Get reference to this user's trip from Firebase
        var trip = database.ref().child(key);
        var userTrip;

        trip.on("value", function (snapshot) {
            userTrip = snapshot.val();
        });

        // Show all content on page-2
        $("#page-2").show();

        $("#destination").text(userTrip.myTrip.destination);
        $("#date-start").text(userTrip.myTrip.startDate);
        $("#date-end").text(userTrip.myTrip.endDate);

        var cardDeckOne = $("<div class='card-deck'>");
        var cardDeckTwo = $("<div class='card-deck'>");
        var cardDeckThree = $("<div class='card-deck'>");

        // For loop to dynamically update activities from API search results
        // Each card deck contains 4 activity cards
        // Would need to be adjusted if allow more than 12 activities to be returned
        for (var k = 0; k < userTrip.places.length; k++) {

            var eachActivity = $("<div class='card'>");

            var activityImage = userTrip.places[k].thumbnail_url;

            // Display default image if Sygic Travel API does not return thumbnail_url, otherwise display thumbnail_url
            if (activityImage === undefined) {
                var imageActivity = $("<img class='card-img-top' src='./assets/images/default-no-image.png' alt='Default Image'>");
            } else {
                var imageActivity = $("<img class='card-img-top' src=" + userTrip.places[k].thumbnail_url + " alt=" + userTrip.places[k].name + ">");
            };

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

    // Push user trip information and API search results to Firebase Database
    function pushFirebase(myTrip, places) {

        var myTrip2 = {
            myTrip,
            places
        }

        var newEntry = database.ref().push(myTrip2);
        userKey = newEntry.key;
        displayActivity(userKey);
    };

});