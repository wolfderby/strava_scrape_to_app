Project documentation


Strava data download from

https://gist.github.com/scottpdawson/74f85f60a7cf7fcc8ee527592dadf498

```
var maxPage = 25; // calculate this using (activities/20 + 1)
var activityType = "Run"; // change to the workout type you want, or blank for all
var p = 1;
var done = 0;
var url;
var nw = window.open("workouts.html");
nw.document.write("[");
while (p <= maxPage) {
    url = "https://www.strava.com/athlete/training_activities" +
        "?keywords=&activity_type=" + activityType + "&workout_type=&commute=&private_activities=" +
        "&trainer=&gear=&new_activity_only=false" +
        "&page=" + p + "&per_page=20";
    jQuery.ajax({
        url: url,
        dataType: "json",
        method: "GET",
        success: function(data, textStatus, jqXHR) {
            for (i in data.models) {
                nw.document.write(JSON.stringify(data.models[i]) + "," + "");
            }
            done++;
            if (done >= maxPage) {
                nw.document.write("]");
                nw.document.close();
            }
            window.open("workouts.html");
        }
    });
    p++;
};
window.open("workouts.html");
```

Go to https://www.strava.com/athlete/training after signing in.
Open Chrome’s developer tools and navigate to console window.
Set maxPage and activityType above.
Paste code into console.
Copy new window's content into https://konklone.io/json to convert to CSV.

