/**
 * Contains all the code to setup and modify the map
 */

// const width = 1200;
// const height = 900;

var map;
var geojson;
var info;

var averaged = {}
var colorScale = function(){};
var sizeScale = function(){};
var colorCodingVariableName = 'price';

/*
const projection = d3.geoMercator()
                        .center([-121.5,47.2])
                        .scale(26000)
                        .translate([width / 2,height / 2]);

var geojson;
var housesLayer;
var house_data;


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
                      .merge(ps)
            //svg.append("path").attr("g", path(data));

            svg.append('g')
               .selectAll('path')
               .data(data.features)
               .enter()
               .append('path')
               .attr('d', function(eachFeature){
               return path(eachFeature)
               }).attr('fill','black')
            //svg.append("g")
            g.selectAll("path")
             .data(data.features)
             .enter()
             .append("path")
             .attr('fill', 'none')
             .attr('stroke', '#222')
             .attr('stroke-width', '1')
             .style("stroke-linecap", "round")
             .style("stroke-linejoin", "round")
             .attr("d", path);



            g.append("circle")
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


    /*d3.csv("data/kc_house_data.csv").then(function(data) {
        console.log('SUP')
        console.log(data)
    });

    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function() {
            g.selectAll('path')
             .attr('transform', d3.event.transform);
        });

    svg.call(zoom);
    
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

}
*/
}

var popup = L.popup();
function onMapClick(e) {
console.log('CLICK')
    popup
         .setLatLng(e.latlng)
         .setContent("You clicked the map at " + e.latlng.toString())
         .openOn(map);
}
function onZoomChange(e) {
console.log(map.getZoom());
var bounds = map.getBounds();
console.log(bounds.getNorth());
console.log(bounds.getSouth());
console.log(bounds.getEast());
console.log(bounds.getWest());
updateMapElements();
}


function updateMapElements() {

            console.log('updateMapElements')
            if(geojson) {
                map.removeLayer(geojson)
            }
            if(housesLayer) {
                map.removeLayer(housesLayer)
            }
            if(map.getZoom() < 13) {

                d3.json('data/King_county_zip.geojson')
                    .then(data => {
                        geojson = L.geoJson(data, {style: style})
                        geojson.addTo(map);
                    })
            } else {
                var bounds = map.getBounds();
                var n = bounds.getNorth();
                var s = bounds.getSouth();
                var e = bounds.getEast();
                var w = bounds.getWest();

                var houses = []
                //var nr = 0
                console.log(house_data)
                for(const d of house_data){
                    //nr++;
                    if(d.lat < n && d.lat > s && d.long > w && d.long < e){
                        console.log('d.lat')
                        houses.push(L.circle([d.lat, d.long], {
                                            color: 'red',
                                            //fillColor: '#f03',
                                            fillColor: 'red',
                                            fillOpacity: 1,
                                            radius: 20
                                            }));
                    }

                }
                housesLayer = L.layerGroup(houses)
                housesLayer.addTo(map)
            }
}
function initLeaflet(){
    console.log("Initializing the leaflet map");
    map = L.map('infovis-map-l', {
        center: [47.5, -121.8],
        zoom: 10
    });



    var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);

    L.control.scale().addTo(map);

    info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>House Sales in King County</h4>' +  (props ?
            '<b>Zip-code ' + props.ZIP + '</b><br /> Average ' + colorCodingVariableName + ' : ' + 
                (averaged[props.ZIP] ? new Intl.NumberFormat('de-DE').format((Math.round(averaged[props.ZIP][colorCodingVariableName] * 100) / 100).toFixed(2)) : 'no data')
            : 'Hover over a state');
    };

    info.addTo(map);

    map.on('zoomend', updateVisualizations);

	map.on('click', onMapClick);
    //map.on('zoom', onZoomChange);
    map.on('moveend', function() {
         updateMapElements();
    });

}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.ZIP),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
    }
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function getColor(zipCode) {
    if (!averaged[zipCode])
        return '#FFFFFF00';
    return colorScale(averaged[zipCode][colorCodingVariableName]);
}

//window.addEventListener("load", initMap);
window.addEventListener("load", initLeaflet);


/**
 * Update the map.
 *
 * @param dataPromise Filtered data as promise (as the global DATA variable, just filtered based on the criteria the
 * user selected)
 * @param averagedDataPromise Average by zip code of the filtered data as promise
 * @param mapConfig An object holding various configs, see {@link updateVisualizations} for a detailed description.
 */
function updateMap(dataPromise, averagedDataPromise, mapConfig) {
    // TODO: Implement this function.
    console.log("Updating map");


    
    Promise.all([dataPromise, averagedDataPromise, mapConfig.sizeScalePromise, mapConfig.colorScalePromise, mapConfig.colorCodingVariableName])
        .then(function (values) {
            house_data = values[0];
            averaged = values[1]
            sizeScale = values[2];
            colorScale = values[3];
            colorCodingVariableName = values[4];

            console.log(colorScale, sizeScale, colorCodingVariableName);

            if (map)
                map.eachLayer(function (layer) {
                    if (!!layer.toGeoJSON) {
                        map.removeLayer(layer);
                    }
                });
            d3.json('data/King_county_zip.geojson')
                .then(data => {
                    geojson = L.geoJson(data, 
                        {
                            style: style,
                            onEachFeature: onEachFeature
                        }
                    )
                    .addTo(map);
                })

            updateMapElements();
            
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


            /*
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
            */
        });

    console.log("Updating map done");
}
