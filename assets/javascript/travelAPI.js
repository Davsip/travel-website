$(document).ready( function () {

    // Initial File: JavaScript, jQuery, AJAX, API's, and Firebase
    // Retreive user trip region, dates, and activities
    // .push() user inputs to Firebase server to store under unique ID
    // Send user inputs via AJAX to correct API's, based on region / activities
    // Retreive and locate needed information from API call
    // Dynamically update HTML with user's trip information

    var possActivities = ["t1","t2","t3","t4"];

    // On click event listeners for destination choice    
    // If user inputs own destination, grab value and send to modal
    $("#user-trip").on("click", function() {

        $("#user-destination").text( $(".destination-name").val().trim() );

    });
    // If user chooses predefined destination, grab value and send to modal
    $("#predefined-trip").on("click", function() {

        $("#user-destination").text( $(".destination-name").val() );

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
    $("#submit-trip").on("click", function() {

        var myActivities = [];

        var myTrip = {
            destination: $("#user-destination").val(),
            startDate = $("#start-date").val(),
            endDate = $("#end-date").val(),

        }

        // figure out how to get activities from select boxes
        // store selected activities in string array
        // push array to myTrip
        for (var i = 0; i < possActivities.length(); i++) {
            if ( $("#activity-" + possActivities[i]).checked ) {
                myActivities.push( possActivities[i] );
            }
        }

        myTrip.push( myActivities );

    });

    // AJAX
    // Send destination, date range, and selected activities to
    // API's
    // Retreive and locate needed information from API call
    // Dynamically update HMTL with user's trip information
    



});