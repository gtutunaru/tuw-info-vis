/**
 * Contains all the code to setup and modify the map
 */


var map; // Leaflet map object
var geojson; // Geojson layer representing the zip-code areas
var housesLayer; // Layer representing all the circles which are individual houses
var info; // Div in top-right corner containing information about a zip-code area / specific house
var legend; // Div in bottom-right corner containing information about the color scale
var house_data; // The array containg all the filtered data on houses

var averaged = {} //dictionary containing the average values for each column based on zip-code
var colorScale = function(){};
var sizeScale = function(){};
var colorCodingVariableName = 'price';

window.addEventListener("load", initLeaflet);

function updateMapElements() {
    if (legend){
        legend.update();
    }
    if(geojson) {
        map.removeLayer(geojson)
    }
    if(housesLayer) {
        map.removeLayer(housesLayer)
    }
    if(!mapZoomed()) {
        d3.json('data/King_county_zip.geojson')
                .then(data => {
                    geojson = L.geoJson(data, 
                        {
                            style: style,
                            onEachFeature: onEachFeature
                        }
                    );
                    geojson.addTo(map);
                })
    } else {
        updateMapHouses();
    }
}

// only updates the points that are inside the bounds that we see
// to not render all the 20k points in the data set
function updateMapHouses(){
    if (mapZoomed()){
        if(housesLayer) {
            map.removeLayer(housesLayer)
        }
    
        var bounds = map.getBounds();
        var n = bounds.getNorth();
        var s = bounds.getSouth();
        var e = bounds.getEast();
        var w = bounds.getWest();
    
        var houses = []
        for(const d of house_data){
            if(d.lat < n && d.lat > s && d.long > w && d.long < e){
                const circle = L.circle([d.lat, d.long], {
                    color: colorScale(d[colorCodingVariableName]),
                    fillColor: colorScale(d[colorCodingVariableName]),
                    fillOpacity: 1,
                    radius: 20
                    }
                )
                circle.on('click', function(){
                    info.update(d);
                })
                houses.push(circle);
            }
    
        }
        housesLayer = L.layerGroup(houses)
        housesLayer.addTo(map)
    }
}

// initializes the Leaflet map
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
        if (!!props && props.id){ // a house has an id, but a zip-code area does not
            this._div.innerHTML = '<h4>House Sales in King County</h4>' + 
                '<b>Price ' + new Intl.NumberFormat('de-DE').format((Math.round(props.price * 100) / 100).toFixed(2)) 
                + '</b><br /> Zip-code : ' + props.zipcode
                + '<br /> Year built : ' + props.yr_built
                + '<br /> Nb. of bedrooms : ' + props.bedrooms
                + '<br /> Nb. of bathrooms : ' + props.bathrooms
                + '<br /> Condition : ' + props.condition
                + '<br /> Waterfront : ' + (props.bathrooms ? 'Yes' : 'No')
                + '<br /> Size above the ground : ' + props.sqft_above + ' sq. feet'
                + '<br /> Size of living area : ' + props.sqft_living + ' sq. feet'
                + '<br /> Size of the basement : ' + props.sqft_basement + ' sq. feet';
        } else {
            this._div.innerHTML = '<h4>House Sales in King County</h4>' +  (props ?
                '<b>Zip-code ' + props.ZIP + '</b><br /> Average ' + colorCodingVariableName + ' : ' + 
                    (averaged[props.ZIP] ? new Intl.NumberFormat('de-DE').format((Math.round(averaged[props.ZIP][colorCodingVariableName] * 100) / 100).toFixed(2)) : 'no data')
                : 'Hover over a state');
        }
    };

    legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        this._divLegend = L.DomUtil.create('div', 'info legend');
        this.update();
        return this._divLegend;
    };

    legend.update = function () {
        if (colorScale.domain){
            grades = []
            for (let i = 0; i<=7; i++){
                grades.push(colorScale.domain()[0] + i / 7. * (colorScale.domain()[1] - colorScale.domain()[0]))
            }
            this._divLegend.innerHTML = '';

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                this._divLegend.innerHTML +=
                    '<i style="background:' + colorScale(grades[i]) + '"></i> ' +
                    new Intl.NumberFormat('de-DE').format((Math.round(grades[i] * 100) / 100).toFixed(2)) + '<br>';
            }
        }
    };

    legend.addTo(map);

    info.addTo(map);
    
    // we need to update the whole visualization since in case of zooming in and passing 
    // to showing separate points instead of zip-code areas, we need to update the scale for the colors
    map.on('zoomend', updateVisualizations);  
    map.on('moveend', updateMapHouses);

}

// Returns True if map is zoomed in enough to see separate points 
// for houses instead of aggregating by zip-code
function mapZoomed(){
    return !!map && map.getZoom() >= 13;
}

// Style of the feature representing a zip-code area
function style(feature) {
    return {
        fillColor: getColor(feature.properties.ZIP),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }
}

// Used for highlighting zip-code areas when hovering the mouse over them
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

// When the user clicks on a zip-code area
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

// Return the color for the area of a zipCode by the average value in the area
function getColor(zipCode) {
    if (!averaged[zipCode])
        return '#FFFFFF00';
    return colorScale(averaged[zipCode][colorCodingVariableName]);
}

/**
 * Update the map.
 *
 * @param dataPromise Filtered data as promise (as the global DATA variable, just filtered based on the criteria the
 * user selected)
 * @param averagedDataPromise Average by zip code of the filtered data as promise
 * @param mapConfig An object holding various configs, see {@link updateVisualizations} for a detailed description.
 */
function updateMap(dataPromise, averagedDataPromise, mapConfig) {
    console.log("Updating map");
    
    Promise.all([dataPromise, averagedDataPromise, mapConfig.sizeScalePromise, mapConfig.colorScalePromise, mapConfig.colorCodingVariableName])
        .then(function (values) {
            house_data = values[0];
            averaged = values[1]
            sizeScale = values[2];
            colorScale = values[3];
            colorCodingVariableName = values[4];
            updateMapElements();
        });

    console.log("Updating map done");
}
