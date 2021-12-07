/**
 * Contains all the code to setup and modify the map
 */
    const width = 1200;
    const height = 900;

        const projection = d3.geoMercator()
                             .center([-121.5,47.2])
                             .scale(26000)
                             .translate([width / 2,height / 2]);

function initMap() {
    console.log("Initializing the map");



    const svg = d3.select('#infovis-map').append('svg').attr('width', '80%').attr('height', '90%');



    var path = d3.geoPath(projection);

    const g = svg.append('g')
                 .attr('id','g-elem');

    g.append("rect")
     .attr("class", "background")
     .attr("fill", "#cacaca")
     .attr("width", width)
     .attr("height", height);




    d3.json('data/King_county_zip.geojson')
        .then(data => {
            console.log('hello')
            console.log(data)
            console.log(data.features)
            /*const ps = d3.select("#infovis-map")
                         .selectAll("p")
                         .data(data);
            ps.enter().append("p")
                      .merge(ps)*/
            //svg.append("path").attr("g", path(data));

           /* svg.append('g')
               .selectAll('path')
               .data(data.features)
               .enter()
               .append('path')
               .attr('d', function(eachFeature){
               return path(eachFeature)
               }).attr('fill','black')*/
            //svg.append("g")
            g
             .selectAll("path")
             .data(data.features)
             .enter()
             .append("path")
             .attr('fill', 'none')
             .attr('stroke', '#222')
             .attr('stroke-width', '1')
             .style("stroke-linecap", "round")
             .style("stroke-linejoin", "round")
             .attr("d", path);



            g
             .append("circle")
             .style("opacity", .4)
             .attr("cx", 200)
             .attr("cy", 50)
             .attr("r",50)

             g.append("text")
             .style("opacity", .5)
                          .attr("x", 200)
                          .attr("y", 55)
                          .attr("text-anchor", "middle")
                          .style("font-size", "20px")
                          .style("fill", "white")

                          .text("CIRCLE");

        });


                     d3.csv("data/kc_house_data.csv").then(function(data) {
                     console.log('SUP')
                     console.log(data)


                     });
/*
    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function() {
            g.selectAll('path')
             .attr('transform', d3.event.transform);
        });

    svg.call(zoom);
    */
    var zoom = d3.zoom()
          .scaleExtent([1, 8])
          .on('zoom', function(event) {
              g.selectAll('path')
               .attr('transform', event.transform);
              g.selectAll('circle')
               .attr('transform', event.transform);
              g.select('text')
               .attr('transform', event.transform);
    });

    svg.call(zoom);

    //{ })
/*
    d3.json('data/King_county_zip.geojson')
        .then(data => {

            console.log(data)
            const counties = topojson.feature(data, data.features.Feature);
            console.log(counties)
            g.selectAll('path').data(counties).enter().append('path').attr('class', 'country').attr('d', path);


        });

    console.log('HERE1')
    d3.json("data/King_county_zip.geojson", function(err, geojson) {
    console.log('HERE2')
    svg.append("path").attr("d", path(geojson));})
*/
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
            /*
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
*/


                const g = d3.select('#g-elem')
                console.log(g)
                g.selectAll("circle").remove()
                g.selectAll("circle")
                                                .data(data)
                                                .enter()

                                                .append("circle")
                                                .attr("cx", function(d) {
                                                        return projection([Number(d.long), Number(d.lat)])[0];
                                                })
                                                .attr("cy", function(d) {
                                                        return projection([Number(d.long), Number(d.lat)])[1];
                                                })
                                                .attr("r", 1)
                                                .style("fill", "red")
                                                .attr('transform', g.selectAll('path').attr('transform'));
        });

    console.log("Updating map done");
}
