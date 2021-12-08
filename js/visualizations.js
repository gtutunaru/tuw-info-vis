/**
 * Contains all the code to setup and modify the map
 */


function histogram(data, size) {
    let min = d3.min(data);
    let max = d3.max(data);
    const bucketWidth = (max - min) / size;
    const buckets = [...Array(size  ).keys()].map(function (i) {
        const lowerBound = min + bucketWidth*i;
        const upperBound = min + bucketWidth*(i+1);
        return {
            label: `${lowerBound} - ${upperBound}`,
            lowerBound: lowerBound,
            upperBound: upperBound,
            count: 0
        };
    });

    data.forEach(value => {
        const i = Math.min(size-1, Math.max(0, Math.floor((value - min) / bucketWidth)));
        buckets[i].count += 1;
    })

    return buckets;
}


function updateHistogramChart(data, selector, title) {
    $(selector).empty();
    var margin = {top: 30, right: 30, bottom: 90, left: 60};
    const width = $(selector).width() - margin.left - margin.right;
    const height = $(selector).height() - margin.top - margin.bottom;

    var svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",  "translate(" + margin.left + "," + margin.top + ")");

    const priceHistogram = histogram(data, 20);
    const xDomain = priceHistogram.map(bucket => bucket.label);
    const yMin = d3.min(priceHistogram.map(bucket => bucket.count));
    const yMax = d3.max(priceHistogram.map(bucket => bucket.count));

    // https://www.d3-graph-gallery.com/graph/barplot_basic.html

    // X axis
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(xDomain)
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(priceHistogram)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.label); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); })
        .attr("fill", "#69b3a2");

    // Title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
}


/**
 * Update the visualizations.
 *
 * @param dataPromise Filtered data as promise (as the global DATA variable, just filtered based on the criteria the
 * user selected)
 * @param visualizationsConfig An object holding various configs, see {@link updateVisualizations} for a detailed
 * description.
 */
function updateCharts(dataPromise, visualizationsConfig) {
    Promise.all([dataPromise, visualizationsConfig.sizeScalePromise, visualizationsConfig.colorScalePromise])
        .then(function (values) {
            const data = values[0];
            [
                {data: data.map(datum => datum.price), selector: "#infovis-charts-price-histogram", title: visualizationsConfig.titles["price"]},
                {data: data.map(datum => datum.sqft_living), selector: "#infovis-charts-livingarea-histogram", title: visualizationsConfig.titles["sqft_living"]},
                {data: data.map(datum => datum.sqft_lot), selector: "#infovis-charts-lotsize-histogram", title: visualizationsConfig.titles["sqft_lot"]},
                {data: data.map(datum => datum.yr_built), selector: "#infovis-charts-constructionyear-histogram", title: visualizationsConfig.titles["yr_built"]},
            ].forEach(x => updateHistogramChart(x.data, x.selector, x.title));
        });
}
