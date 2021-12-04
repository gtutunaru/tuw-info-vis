/**
 * Contains all the code to load the data
 */


function loadData() {
    const parseDateTime = d3.timeParse("%Y%m%dT%H%M%S"); // e. g. 20141013T000000
    const parseYear = d3.timeParse("%Y"); // e. g. 2014
    const data = d3.csv(
        "data/kc_house_data.csv",
        function (datum) {
            // Parse datetime columns
            datum.date = parseDateTime(datum.date);
            datum.yr_built = parseYear(datum.yr_built);
            datum.yr_renovated = "" + datum.yr_renovated === "0" ? undefined : parseYear(datum.yr_renovated);
            // Parse int columns
            datum.id = Number(datum.id);
            datum.price = Number(datum.price);
            datum.bedrooms = Number(datum.bedrooms);
            datum.bathrooms = Number(datum.bathrooms);
            datum.sqft_living = Number(datum.sqft_living);
            datum.sqft_lot = Number(datum.sqft_lot);
            datum.floors = Number(datum.floors);
            datum.view = Number(datum.view);
            datum.condition = Number(datum.condition);
            datum.grade = Number(datum.grade);
            datum.sqft_above = Number(datum.sqft_above);
            datum.sqft_basement = Number(datum.sqft_basement);
            datum.zipcode = Number(datum.zipcode);
            datum.sqft_living15 = Number(datum.sqft_living15);
            datum.sqft_lot15 = Number(datum.sqft_lot15);
            // Parse boolean columns
            datum.waterfront = !!Number(datum.waterfront);
            // Parse float columns
            datum.lat = Number(datum.lat);
            datum.long = Number(datum.long);

            // Auxiliary columns
            const yearsSinceLastRenovation = datum.yr_built - datum.yr_renovated;
            datum.time_since_last_renovation = yearsSinceLastRenovation <= 0 ? 0 : yearsSinceLastRenovation;
            datum.last_renovation = yearsSinceLastRenovation === 0 ? 0 : yearsSinceLastRenovation <= 10 ? 1 : 2;
            datum.has_basement = datum.sqft_basement > 0;

            return datum;
        });
    return data;
}


var DATA = loadData();
window.addEventListener("load", function () {DATA.then(data => updateVisualizations())});
