$(document).ready( function () {

    // Initial File: JavaScript, jQuery, AJAX, API's, and Firebase
    // Retreive user trip region, dates, and activities
    // .push() user inputs to Firebase server to store under unique ID
    // Send user inputs via AJAX to correct API's, based on region / activities
    // Retreive and locate needed information from API call
    // Dynamically update HTML with user's trip information

    var possActivities = ["outdoors","shopping","attractions","music","accommodations","sports"];

    // On click event listeners for destination choice    
    // If user inputs own destination, grab value and send to modal
    $("#user-trip").on("click", function() {

        console.log($("#destination-name").val());
        $("#user-destination").text( $("#destination-name").val() );

    });
    // If user chooses predefined destination, grab value and send to modal
    $(".predefined-trip").on("click", function() {

        $("#user-destination").text( $(this).val() );

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
            if ( $("#activity-" + possActivities[i])[0].checked ) {
                console.log( true );
                myTrip.myActivities.push( possActivities[i] );
            }
        }

        // pass myTrip to searchAPI, then to Firebase
        console.log( myTrip );
        searchAPI ( myTrip );

    });

    function searchAPI( trip ){
        
        //Start Sygic Travel API Search
        var apiKey = "VUoBrIiIld3xOuvna78BQ2JWCOS3Ndu32EcjtGzp";
        var url = "https://api.sygictravelapi.com/1.0/en/places/list?query=" + "dallas";    

        $(document).ready(function(){
          $.ajax({
              headers: {
                  'x-api-key': apiKey
              },
              url: url
            })  
            .done(function(data) {

                console.log(url);
                var places = data.data.places;
                console.log(places);

            });    
        });

    };
 

    // on child_added to user profile in Firebase
    // Initiate AJAX
    // Send destination, date range, and selected activities to
    // API's
    // Retreive and locate needed information from API call
    // Dynamically update HMTL with user's trip information


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