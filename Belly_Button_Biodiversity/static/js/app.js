function buildMetadata(sample) {

  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });

  });
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;

    // Pie Chart
    var piedata = [
      {
      labels: otu_ids.slice(0,10),
      values: sample_values.slice(0,10),
      hover: otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: 'pie'
    }
  ];
  
  var pieLayout = {
    margin: { t: 0, l: 0 }
  };

    //var piedata = [pietrace1];
    Plotly.newPlot("pie", piedata, pieLayout);

    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }}
      ];
    
    var bubbleLayout = {
     xaxis: {
     range: [0, 3500 ]
    },
    yaxis: {
     range: [0, 200 ]
    },
    title: "Belly Biodiversity",
    xaxis: { title: "Type of Bacteria" },
    yaxis: { title: " ID" }
  
  };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  
  
  });
}

    
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
