/**
 * Contains all the code that provides basic functionality needed to work with
 * the application
 */


/*
 * Panel handling
 */


function togglePanel(selector) {
    const isOpen = $(selector).hasClass("opened");
    if (isOpen) {
        $(selector).removeClass("opened").addClass("closed");
    } else {
        $(selector).removeClass("closed").addClass("opened");
    }
}


/*
 * Color-mapping-dropdown-stuff
 */


/**
 * id: column name
 * name: human readable name
 * type: one of "ordinal", "datetime", "numeric", "boolean"
 */
var COLOR_CODING_VARIABLES = [
    {id: "condition", name: "Condition", type: "ordinal", nanValue: undefined},
    {id: "yr_built", name: "Construction year", type: "datetime", nanValue: undefined},
    {id: "grade", name: "Grade", type: "ordinal", nanValue: undefined},
    {id: "price", name: "Price", type: "numeric", nanValue: undefined},
    {id: "bathrooms", name: "Number of bathrooms", type: "ordinal", nanValue: undefined},
    {id: "bedrooms", name: "Number of bedrooms", type: "ordinal", nanValue: undefined},
    {id: "floors", name: "Number of floors", type: "ordinal", nanValue: undefined},
    {id: "date", name: "Selling date", type: "datetime", nanValue: undefined},
    {id: "sqft_above", name: "Size above the ground", type: "numeric", nanValue: undefined},
    {id: "sqft_living", name: "Size of living area", type: "numeric", nanValue: undefined},
    {id: "sqft_lot", name: "Size of lot", type: "numeric", nanValue: undefined},
    {id: "sqft_basement", name: "Size of the basement", type: "numeric", nanValue: undefined},
    {id: "yr_renovated", name: "Year of last renovation", type: "datetime", nanValue: undefined},
    {id: "view", name: "View", type: "ordinal", nanValue: undefined},
    {id: "waterfront", name: "Waterfront", type: "boolean", nanValue: undefined},
]


var COLOR_CODING_VARIABLES_MAP = COLOR_CODING_VARIABLES.reduce(function (obj, x) {
    obj[x.id] = x;
    return obj;
}, {});


function initDropdown() {
    d3.select("#infovis-variable-color-coding")
        .selectAll("option")
        .data(COLOR_CODING_VARIABLES)
        .enter()
        .append("option")
        .text(d => d.name)
        .attr("value", d => d.id);
}

window.addEventListener("load", initDropdown);


/*
 * Data handling and other computations
 */


/**
 * Read the current filter-settings from the
 */
function readFilters() {
    // TODO: Implement this function (the return value is not fixed, choose
    //  whatever is useful - filterData needs to be updated accordingly). The
    //  values should be taken from the filter inputs that can be set by the
    //  users.
    const filter = {
        "price": [150000, 150500],
    };
    return filter;
}


/**
 * Filter the data based on the filters defined by users
 *
 * @param filter: output from method readFilters
 * @returns {Promise<DSVRowArray<string>>}
 */
function filterData(filter) {
    // TODO: Implement this function

    return DATA.then(data => data
        .filter(datum => Object.entries(filter)
            .map(function (filterEntry) {
                const variableName = filterEntry[0];
                const filterValues = filterEntry[1];
                return datum[variableName] >= filterValues[0] && datum[variableName] <= filterValues[1];
            })
            .every(v => v === true)
        )
    );
}


/**
 * Read which variable should be encoded
 */
function readColorCoding() {
    const variable = COLOR_CODING_VARIABLES_MAP[$("#infovis-variable-color-coding").val()];
    return variable;
}


/**
 * Create a scale based on the filtered data and the variable to color
 */
function createScale(dataPromise, colorCodingVariable) {
    // Use a linear scale (from white to blue) for numeric variables (we don't have categorical variables, hence linear
    // scales should be fine). Boolean and datetime columns are also just numerical values.
    // However, maybe datetimes need a different scale, d3 supports a d3.scaleTime after all ...
    return dataPromise
        .then(data => data
            .map(datum => datum[colorCodingVariable.id])
            .filter(element => element !== colorCodingVariable.nanValue)
        )
        .then(dataColumn => d3.scaleTime()
            .domain([d3.min(dataColumn), d3.max(dataColumn)])
        );
}


/**
 * Create a color scale based on a scale
 */
function createColorScale(scalePromise) {
    return scalePromise.then(scale => scale
        .range(["rgb(255,255,255)", "rgb(0,0,255)"]) // TODO: Insert proper values
        .unknown("rgb(204,204,204)")
    );
}


/**
 * Create a size scale based on a scale
 */
function createSizeScale(scalePromise) {
    return scalePromise.then(scale => scale
        .range([5, 30]) // TODO: Insert proper values
        .unknown(3)
    );
}


/**
 * Copy a scale - this is needed because setting e. g. .range can not be changed afterwards. And computing the initial
 * scale is costly, since the data has to be iterated once.
 */
function copyScale(scalePromise) {
    return scalePromise.then(scale => scale.copy());
}


/*
 * Update visualizations
 */


/**
 * Update the views (map etc.)
 */
function updateVisualizations() {
    const filters = readFilters();
    const filteredData = filterData(filters);
    const colorCodingVariable = readColorCoding();
    const scalePromise = createScale(filteredData, colorCodingVariable);

    const mapConfig = {
        colorCodingVariableName: colorCodingVariable.id, // The name of the variable that should be used for visual encoding
        colorScalePromise: createColorScale(copyScale(scalePromise)), // The color scale for visual encoding
        sizeScalePromise: createSizeScale(copyScale(scalePromise)), // The size scale for visual encoding
    }
    updateMap(filteredData, mapConfig);

    const visualizationsConfig = {
        colorCodingVariableName: colorCodingVariable.id, // The name of the variable that should be used for visual encoding
        colorScalePromise: createColorScale(copyScale(scalePromise)), // The color scale for visual encoding
        sizeScalePromise: createSizeScale(copyScale(scalePromise)), // The size scale for visual encoding
    }
    updateCharts(filteredData, visualizationsConfig);
}
