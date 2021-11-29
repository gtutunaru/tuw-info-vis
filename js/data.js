/**
 * Contains all the code to load the data
 */


function loadData() {
    const parseDateTime = d3.timeParse("%Y%m%dT%H%M%S"); // e. g. 20141013T000000
    const data = d3.csv(
        "data/kc_house_data.csv",
        function (datum) {
            // Parse datetime columns
            datum.date = parseDateTime(datum.date);
            // Parse string to int
            datum.price = parseInt(datum.price);

            // TODO: Finish this function (add all missing conversions)

            return datum;
        });
    data.then(updateVisualizations);
    return data;
}


var DATA = loadData();
