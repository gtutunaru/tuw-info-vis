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
    updateVisualizations();
}


/*
 * Color-mapping-dropdown-stuff
 */


/**
 * id: column name
 * name: human readable name
 * type: one of "ordinal", "datetime", "numeric", "boolean"
 */
const VARIABLES_CONFIG = [
    {id: "condition", name: "Condition", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "Very bad", values: [1]}, {name: "Bad", values: [2]}, {name: "OK", values: [3]}, {name: "Good", values: [4]}, {name: "Very good", values: [5]}]}},
    {id: "yr_built", name: "Construction year", type: "numeric", nanValue: undefined,
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
    {id: "has_basement", name: "Basement", type: "boolean", nanValue: undefined,
        interaction: {method: "choice", choices: [{name: "No", values: [false]}, {name: "Yes", values: [true]}]}},
    {id: "yr_renovated", name: "Year of last renovation", type: "datetime", nanValue: undefined, interaction: undefined},
    {id: "time_since_last_renovation", name: "Time since last renovation", type: "numeric", nanValue: undefined, interaction: undefined},
    {id: "last_renovation", name: "Time since last renovation", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "Never", values: [0]}, {name: "10 years or more recently", values: [1]}, {name: "More than ten years", values: [2]}]}},
    {id: "view", name: "View", type: "ordinal", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "Very bad", values: [0]}, {name: "Bad", values: [1]}, {name: "OK", values: [2]}, {name: "Good", values: [3]}, {name: "Very good", values: [4]}]}},
    {id: "waterfront", name: "Waterfront", type: "boolean", nanValue: undefined,
        interaction: {method: "choice",
            choices: [{name: "No", values: [false]}, {name: "Yes", values: [true]}]}},
]


const VARIABLES_CONFIG_MAP = VARIABLES_CONFIG.reduce(function (obj, x) {
    obj[x.id] = x;
    return obj;
}, {});


const FILTER_VARIABLE_CONFIGS = [
    "condition",
    "price",
    "yr_built",
    "grade",
    "bathrooms",
    "bedrooms",
    "floors",
    // "date",
    "sqft_above",
    "sqft_living",
    "sqft_lot",
    "has_basement",
    "last_renovation",
    "view",
    "waterfront",
].map(variableName => VARIABLES_CONFIG_MAP[variableName]);


const VARIABLE_TO_NAME = VARIABLES_CONFIG.reduce(function (obj, x) {
    obj[x.id] = x.name;
    return obj;
}, {});


function initDropdown() {
    const colorCodingVariables = [
        "price",
        "condition",
        "yr_built",
        "grade",
        "bathrooms",
        "bedrooms",
        "floors",
        //"date",
        "sqft_above",
        "sqft_living",
        "sqft_lot",
        //"last_renovation",
        "view",
        //"waterfront",
    ].map(variableName => VARIABLES_CONFIG_MAP[variableName]);
    d3.select("#infovis-variable-color-coding")
        .selectAll("option")
        .data(colorCodingVariables)
        .enter()
        .append("option")
        .text(d => d.name)
        .attr("value", d => d.id);
}
window.addEventListener("load", initDropdown);


function initFilters() {
    const createChoiceFilter = function (variableConfig) {
        return variableConfig.interaction.choices
            .map((value, i) =>`<div><label></label><input type="checkbox" id="${variableConfig.id}-${i}" name="${variableConfig.id}" value="${i}" onclick="updateVisualizations();">${value.name}</label></div>`).join("");
    }

    const createRangeFilter = function (variableConfig) {
        return `
            <div class="range-input"><input type="number" id="${variableConfig.id}-min" name="${variableConfig.id}-min" min="${variableConfig.interaction.min}" max="${variableConfig.interaction.max}" placeholder="${variableConfig.interaction.min}" onblur="updateVisualizations();"></div>
            <div class="range-input"><input type="number" id="${variableConfig.id}-max" name="${variableConfig.id}-max" min="${variableConfig.interaction.min}" max="${variableConfig.interaction.max}" placeholder="${variableConfig.interaction.max}" onblur="updateVisualizations();"></div>
            `;
    }

    const createFilter = function (variableConfig) {
        return `
            <div class="infovis-filter">
            <fieldset>
            <div class="title">${variableConfig.name}</div>
            <div id="${variableConfig.id}-filter-values">
            ${variableConfig.interaction.method === "choice" ? createChoiceFilter(variableConfig) : createRangeFilter(variableConfig)}
            </div>
            </fieldset>
            </div>
        `;
    }

    d3.select("#infovis-sidebar-body")
        .selectAll("div")
        .data(FILTER_VARIABLE_CONFIGS)
        .enter()
        .append("div")
        .attr("class", "infovis-filter")
        .html(createFilter);
}
window.addEventListener("load", initFilters);


/*
 * Data handling and other computations
 */


var readChoiceFilter = function (variableConfig) {
    const filter = {
        id: variableConfig.id,
        active: false,
        type: variableConfig.interaction.method,
        choices: undefined,
    };

    const choiceValues = new Array();
    $(`input:checkbox[name=${variableConfig.id}]:checked`).each(function() {
        choiceValues.push( parseInt($(this).val()));
    });

    if (choiceValues.length === 0) {
        return filter;
    }

    filter.active = true;
    filter.choices = new Set(choiceValues.map(i => variableConfig.interaction.choices[i].values).flat());
    return filter;
}


var readRangeFilter = function (variableConfig) {
    const filter = {
        id: variableConfig.id,
        active: false,
        type: variableConfig.interaction.method,
        min: undefined,
        max: undefined,
    };

    const minValue = variableConfig.interaction.min;
    const maxValue = variableConfig.interaction.max;
    let fromValue = parseInt($(`input#${variableConfig.id}-min`).val());
    let toValue = parseInt($(`input#${variableConfig.id}-max`).val());
    const isNotActive = isNaN(fromValue) && isNaN(toValue);
    if (isNotActive) {
        return filter;
    }

    fromValue = isNaN(fromValue) ? minValue : fromValue;
    toValue = isNaN(toValue) ? maxValue : toValue;
    if (fromValue < minValue) {
        fromValue = minValue;
        $(`input#${variableConfig.id}-min`).val(minValue);
    }
    if (toValue > maxValue) {
        toValue = maxValue;
        $(`input#${variableConfig.id}-max`).val(maxValue);
    }

    filter.active = true;
    filter.min = fromValue;
    filter.max = toValue;
    return filter;
}


var readFilter = function (variableConfig) {
    return variableConfig.interaction.method === "choice" ?
        readChoiceFilter(variableConfig) : readRangeFilter(variableConfig);
}


/**
 * Read the current filter-settings from the
 */
function readFilters() {
    const filters = FILTER_VARIABLE_CONFIGS
        .map(readFilter)
        .filter(filter => filter.active);

    return filters;
}


const filterChoice = function(filter, datum) {
    return filter.choices.has(datum[filter.id]);
}


const filterRange = function(filter, datum) {
    return filter.min <= datum[filter.id] && datum[filter.id] <= filter.max;
}


const filter = function(filter, datum) {
    return filter.type === "choice" ? filterChoice(filter, datum) : filterRange(filter, datum);
}


/**
 * Filter the data based on the filters defined by users
 *
 * @param filter: output from method readFilters
 * @returns {Promise<DSVRowArray<string>>}
 */
function filterData(filters) {
    if (filters.length === 0) {
        return DATA;
    }

    const filteredData = DATA.then(data => data
        .filter(datum => filters.map(f => filter(f, datum)).every(v => v === true))
    );

    return filteredData;
}

/**
 * Calculate the average over the zip codes
 */
 function averageByZipCode(filteredData) {
    if (filteredData.length === 0) {
        return {};
    }

    const averagedByZipCode = filteredData.then( data => {
        const reduced = data.reduce(function(m, d){
            if(!m[d.zipcode]){
              m[d.zipcode] = {...d, count: 1};
              return m;
            }
            m[d.zipcode].yr_built += d.yr_built;
            if (d.yr_renovated)
                m[d.zipcode].yr_renovated += d.yr_renovated;
            m[d.zipcode].price += d.price;
            m[d.zipcode].bedrooms += d.bedrooms;
            m[d.zipcode].bathrooms += d.bathrooms;
            m[d.zipcode].sqft_living += d.sqft_living;
            m[d.zipcode].sqft_lot += d.sqft_lot;
            m[d.zipcode].floors += d.floors;
            m[d.zipcode].view += d.view;
            m[d.zipcode].condition += d.condition;
            m[d.zipcode].grade += d.grade;
            m[d.zipcode].sqft_above += d.sqft_above;
            m[d.zipcode].sqft_basement += d.sqft_basement;
            m[d.zipcode].sqft_living15 += d.sqft_living15;
            m[d.zipcode].sqft_lot15 += d.sqft_lot15;
            m[d.zipcode].waterfront += d.waterfront;
            m[d.zipcode].count += 1;
            return m;
         },{});
         
         // Create new array from grouped data and compute the average
         const averaged =  Object.keys(reduced).map(function(k){
             const item  = reduced[k];
             return {
                 zipcode:       item.zipcode,
                 yr_built:      item.yr_built/item.count,
                 yr_renovated:  item.yr_renovated/item.count,
                 price:         item.price/item.count,
                 bedrooms:      item.bedrooms/item.count,
                 bathrooms:     item.bathrooms/item.count,
                 sqft_living:   item.sqft_living/item.count,
                 sqft_lot:      item.sqft_lot/item.count,
                 floors:        item.floors/item.count,
                 view:          item.view/item.count,
                 condition:     item.condition/item.count,
                 grade:         item.grade/item.count,
                 sqft_above:    item.sqft_above/item.count,
                 sqft_basement: item.sqft_basement/item.count,
                 sqft_living15: item.sqft_living15/item.count,
                 sqft_lot15:    item.sqft_lot15/item.count,
                 waterfront:    item.waterfront/item.count
             }
         })

        // create dictionary for faster value retrival for a specific zip code
        const dictionary = averaged.reduce((a,x) => ({...a, [x.zipcode]: x}), {})

        return dictionary;
    });

    return averagedByZipCode;
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
    return dataPromise
        .then(data => {
            array = []
            //transform dict to array
            for (key in data)
                array.push(data[key])
            return array.map(datum => datum[colorCodingVariable.id])
                        .filter(element => element !== colorCodingVariable.nanValue)
        })
        .then(dataColumn => d3.scaleLinear()
                            .domain([d3.min(dataColumn), d3.max(dataColumn)])
            );
}


/**
 * Create a color scale based on a scale
 */
function createColorScale(scalePromise) {
    return scalePromise.then(scale => scale
        .range(["#ffeda0", "#800026"])
        .unknown("rgb(204,204,204)")
    );
}


/**
 * Create a size scale based on a scale - Not used in the end
 */
function createSizeScale(scalePromise) {
    return scalePromise.then(scale => scale
        .range([5, 30])
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


/**
 * Update the views (map etc.)
 */
function updateVisualizations() {
    const filters = readFilters();
    const filteredData = filterData(filters);
    const averagedByZipCode = averageByZipCode(filteredData);
    const colorCodingVariable = readColorCoding();
    var scalePromise;
    if (mapZoomed())
       scalePromise = createScale(filteredData, colorCodingVariable);
    else
        scalePromise = createScale(averagedByZipCode, colorCodingVariable);

    const mapConfig = {
        colorCodingVariableName: colorCodingVariable.id, // The name of the variable that should be used for visual encoding
        colorScalePromise: createColorScale(copyScale(scalePromise)), // The color scale for visual encoding
        sizeScalePromise: createSizeScale(copyScale(scalePromise)), // The size scale for visual encoding
    }
    updateMap(filteredData, averagedByZipCode, mapConfig);

    // TODO: Properly set visualizationsConfig depending on the actual needs of the visualization. See especially the
    //  comment in function createScale.
    const visualizationsConfig = {
        colorCodingVariableName: colorCodingVariable.id, // The name of the variable that should be used for visual encoding
        colorScalePromise: createColorScale(copyScale(scalePromise)), // The color scale for visual encoding
        sizeScalePromise: createSizeScale(copyScale(scalePromise)), // The size scale for visual encoding
        titles: VARIABLE_TO_NAME,
    }
    updateCharts(filteredData, visualizationsConfig);
}
