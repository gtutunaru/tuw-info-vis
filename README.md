# Setup

* Start a server (this could be easily done with the help of the extension
  'Live Server' for VSCode, or calling `python3 -m http.server`)
* Open `index.html` in a browser (in case of `http.server` open
  [http://localhost:8000/index.html](http://localhost:8000/index.html)).


# Features

* Show some properties aggregated per county (heatmap of the counties)
* Zoom in into the map to see details - the houses appear
* Filter the houses (open the filter panel possible using the button on the top
  left) - the map only shows the selected houses
* Click on a house to see it's details on the top right corner
* Change the variable color the houses (in the filter-panel on the bottom)
* Show some histograms (e.g. price or square feet of the living area) of the
  selected houses by clicking on the button in the top right corner). Note:
  the visualizations are not always properly drawn, just select and deselect
  a checkbox of the filter-panel, or blur and unblur an input in the same
  panel to trigger a redrawing.
