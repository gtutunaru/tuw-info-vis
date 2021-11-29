/**
 * Contains all the code to setup and modify the map
 */


function initMap() {
    console.log("Initializing the map");
    // TODO: Setup the map - DATA variable might not be available yet?
}
window.onload(initMap);


function updateMap(dataPromise) {
    // TODO: Implement this function. The variable that should define the colors
    //  + the color itself will probably be other parameters for this function.
    console.log("Updating map");
    dataPromise.then(data => d3
        .select("#infovis-map")
        .selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(d => "id=" + d.id + " price=" + d.price + " bedrooms=" + d.bedrooms));
    console.log("Updating map done");
}
