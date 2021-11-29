/**
 * Contains all the code that provides basic functionality needed to work with
 * the application
 */


/*
 * Sidebar handling
 */

function toggleSidebar() {
    const isOpen = $("#infovis-sidebar").hasClass("opened");
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}


function openSidebar() {
    $("#infovis-sidebar").removeClass("closed").addClass("opened");
    $("#infovis-sidebar-header button").html("<<");
}


function closeSidebar() {
    $("#infovis-sidebar").removeClass("opened").addClass("closed");
    $("#infovis-sidebar-header button").html(">>");
}


/*
 * Data handling
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
 * @returns {string}
 */
function readColorCoding() {
    return "price";
}


/*
 * Update the views (map etc.)
 */


function updateVisualizations() {
    const filters = readFilters();
    const filteredData = filterData(filters);
    filteredData.then(data => console.log("Size of filtered data: " + data.length))
    // TODO: incorporate the color-coding-things
    updateMap(filteredData);
}
