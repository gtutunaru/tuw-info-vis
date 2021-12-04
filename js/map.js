/**
 * Contains all the code to setup and modify the map
 */


function initMap() {
    console.log("Initializing the map");
    // TODO: Setup the map - DATA variable might not be available yet?
}

window.addEventListener("load", initMap);


/**
 * Update the map.
 *
 * @param dataPromise Filtered data as promise (as the global DATA variable, just filtered based on the criteria the
 * user selected)
 * @param mapConfig An object holding various configs, see {@link updateVisualizations} for a detailed description.
 */
function updateMap(dataPromise, mapConfig) {
    // TODO: Implement this function.
    console.log("Updating map");
    const colorCodingVariableName = mapConfig.colorCodingVariableName
    Promise.all([dataPromise, mapConfig.sizeScalePromise, mapConfig.colorScalePromise])
        .then(function (values) {
            const data = values[0];
            const sizeScale = values[1];
            const colorScale = values[2];
            const ps = d3
                .select("#infovis-map")
                .selectAll("p")
                .data(data);
            ps.enter()
                .append("p")
                .merge(ps)
                .text(d => `${colorCodingVariableName}=${d[colorCodingVariableName]}`)
                .style("background-color", d => colorScale(d[colorCodingVariableName]))
                .style("font-size", d => parseInt(sizeScale(d[colorCodingVariableName])) + "px");
            ps.exit()
                .remove();
        });
    console.log("Updating map done");
}
