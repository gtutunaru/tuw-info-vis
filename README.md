# Setup

* Copy the data (just the CSV for now) into `data/`. TODO: How to handle the
  geo-info-files?
* Open `index.html` in a browser.


# How it works

When the page is loaded, following happens atm:

* Load all the control-functions from `js/contro.js`. This includes e.g.
  functionality to open and close the sidebar, filter the data, or to call the
  functions that should update the visualizations. Also load the stylesheet and 
  the libraries (jQuery and d3).
* Load the data
* When data loading finished, then `updateVisualizations` function is called
* This function reads the current filter-settings (atm it's just a static
  value), filters the data based on those settings (implemented only
  rudimentarily), and update the map (currently it just adds the filtered data
  to the HTML page).


# How we could proceed

* Setup the MAP
* Add the filters to the sidebar and think about how to trigger the updates
  (probably depends on how slow the filtering + updating the map is, if it's
  fast it could be done by the `onchange` property?)
* Implement the filtering functions (`readFilters` and `filterData`), the
  current implementation is just a proof-of-concept and can be deleted entirely.
* Implement the color-variable-chooser (which defines which variable is used
  for visual encoding) - maybe fix a color scale for now and just choose the
  variable?
* If the MAP is created, update the map based on the actual filters
  (`updateMap`).
* Add a nice styling (really not a priority)
