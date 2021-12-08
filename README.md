# Setup

* Start a server (this could be easily done with the help of the extension
  'Live Server' for VSCode).
* Open `index.html` in a browser.


# How it works

When the page is loaded, following happens atm:

* Load all the control-functions from `js/control.js`. This includes e.g.
  functionality to open and close the sidebar, filter the data, or to call the
  functions that should update the visualizations. Also load the stylesheet and 
  the libraries (jQuery and d3).
* Load the data
* When data loading finished, then `updateVisualizations` function is called
* This function reads the current filter-settings, filters the data based on 
  those settings, and updates the map.