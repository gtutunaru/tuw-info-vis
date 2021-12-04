/**
 * Contains all the code to setup and modify the map
 */


function initCharts() {
    console.log("Initializing the visualizations");
    // TODO: Setup the visualizations - DATA variable might not be available yet?
}

window.addEventListener("load", initCharts);


/**
 * Update the visualizations.
 *
 * @param dataPromise Filtered data as promise (as the global DATA variable, just filtered based on the criteria the
 * user selected)
 * @param mapConfig An object holding various configs, see {@link updateVisualizations} for a detailed description.
 */
function updateCharts(dataPromise, visualizationsConfig) {
    // TODO: Implement this function.
    console.log("Updating charts");
    const colorCodingVariableName = visualizationsConfig.colorCodingVariableName
    Promise.all([dataPromise, visualizationsConfig.sizeScalePromise, visualizationsConfig.colorScalePromise])
        .then(function (values) {
            const data = values[0].sort(function compare( a, b ) {
                return a[colorCodingVariableName] === b[colorCodingVariableName] ? 0 :
                    a[colorCodingVariableName] < b[colorCodingVariableName] ? -1 : 1;
            });
            const sizeScale = values[1];
            const colorScale = values[2];
            const ps = d3
                .select("#infovis-charts")
                .selectAll("p")
                .data(data);
            ps.enter()
                .append("p")
                .merge(ps)
                .text(d => `${colorCodingVariableName}=${d[colorCodingVariableName]}`)
                .style("background-color", d => colorScale(d[colorCodingVariableName]))
                .style("font-size", d => parseInt(sizeScale(d[colorCodingVariableName])) + "px");
        });
    console.log("Updating charts done");
}
