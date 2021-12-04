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
var VARIABLES_CONFIG = [
    {id: "condition", name: "Condition", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "Very bad", values: [1]}, {name: "Bad", values: [2]}, {name: "OK", values: [3]}, {name: "Good", values: [4]}, {name: "Very good", values: [5]}]}},
    {id: "yr_built", name: "Construction year", type: "datetime", nanValue: undefined,
        interaction: {method: "range", min: 1900, max: 2015}},
    {id: "grade", name: "Grade", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "Very bad", values: [1, 2, 3]}, {name: "Bad", values: [4, 5, 6]}, {name: "OK", values: [7, 8, 9]}, {name: "Good", values: [10, 11, 12]}, {name: "I'm rich", values: [13]}]}},
    {id: "price", name: "Price", type: "numeric", nanValue: undefined,
        interaction: {method: "range", min: 75_000, max: 7_700_000}},
    {id: "bathrooms", name: "Number of bathrooms", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "< 1", values: [0, 0.5, 0.75]}, {name: "1 .. <2", values: [1.0, 1.25, 1.5, 1.75]}, {name: "2 .. <3", values: [2.0, 2.25, 2.5, 2.75]}, {name: "3 .. <4", values: [3.0, 3.25, 3.5, 3.75]}, {name: "I'm rich", values: [4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.5, 7.75, 8.0]}]}},
    {id: "bedrooms", name: "Number of bedrooms", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "0", values: [0]}, {name: "1", values: [1]}, {name: "2", values: [2]}, {name: "3", values: [3]}, {name: "4", values: [4]}, {name: "I'm rich", values: [5, 6, 7, 8, 9, 10, 11, 33]}]}},
    {id: "floors", name: "Number of floors", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "1 or 1.5", values: [1.0, 1.5]}, {name: "2 or 2.5", values: [2.0, 2.5]}, {name: "3 or 3.5", values: [3.0, 3.5]}]}},
    {id: "date", name: "Selling date", type: "datetime", nanValue: undefined,
        interaction: {method: "range", min: new Date("2014-05-02T22:00:00.000Z"), max: new Date("2015-05-27T22:00:00.000Z")}},
    {id: "sqft_above", name: "Size above the ground", type: "numeric", nanValue: undefined,
        interaction: {method: "range", min: 290, max: 9_410}},
    {id: "sqft_living", name: "Size of living area", type: "numeric", nanValue: undefined,
        interaction: {method: "range", min: 290, max: 13_540}},
    {id: "sqft_lot", name: "Size of lot", type: "numeric", nanValue: undefined,
        interaction: {method: "range", min: 520, max: 1_651_359}},
    {id: "sqft_basement", name: "Size of the basement", type: "numeric", nanValue: undefined, interaction: undefined},
    {id: "has_baseement", name: "Basement", type: "boolean", nanValue: undefined,
        interaction: {method: "choice", choices: [{name: "No", values: [false]}, {name: "Yes", values: [true]}]}},
    {id: "yr_renovated", name: "Year of last renovation", type: "datetime", nanValue: undefined, interaction: undefined},
    {id: "time_since_last_renovation", name: "Time since last renovation", type: "numeric", nanValue: undefined, interaction: undefined},
    {id: "last_renovation", name: "Time since last renovation", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "Never", values: [0]}, {name: "10 years or earlier", values: [1]}, {name: "More than ten years", values: [2]}]}},
    {id: "view", name: "View", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "Very bad", values: [0]}, {name: "Bad", values: [1]}, {name: "OK", values: [2]}, {name: "Good", values: [3]}, {name: "4", values: [4]}]}},
    {id: "waterfront", name: "Waterfront", type: "boolean", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "No", values: [false]}, {name: "Yes", values: [true]}]}},
]


var VARIABLES_CONFIG_MAP = VARIABLES_CONFIG.reduce(function (obj, x) {
    obj[x.id] = x;
    return obj;
}, {});


function initDropdown() {
    const colorCodingVariables = ["condition",
        "yr_built",
        "grade",
        "price",
        "bathrooms",
        "bedrooms",
        "floors",
        "date",
        "sqft_above",
        "sqft_living",
        "sqft_lot",
        "sqft_basement",
        "last_renovation",
        "view",
        "waterfront",
    ].map(variable_name => VARIABLES_CONFIG_MAP[variable_name]);
    d3.select("#infovis-variable-color-coding")
        .selectAll("option")
        .data(colorCodingVariables)
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
    const variable = VARIABLES_CONFIG_MAP[$("#infovis-variable-color-coding").val()];
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
