const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init(){
    //fetch the json data
    d3.json(url).then(function(data){

        //D3 to select dropdown menu
        let dropDownMenu = d3.select("#selDataset");

        let names = data.names;

        names.forEach(function(id){
            dropDownMenu.append("option").text(id).property("value");
        })

        //display first data
        chartData(names[0]);
        metaData(names[0]);
    });
};

function optionChanged(selItem){
    chartData(selItem);
    metaData(selItem);
};

function metaData(selItem){
    
    d3.json(url).then(function(data){
        
        let samples = data.metadata;

        let id = samples.filter(object => object.id == selItem);

        let sampleMetaData = d3.select("#sample-metadata").html("");

        Object.entries(id[0]).forEach(([key, value]) => {
            sampleMetaData.append("h5").text(`${key}: ${value}`);
        });
    });
};

function chartData(selItem){
    
    d3.json(url).then(function(data){
        
        let samples = data.samples;

        let id = samples.filter(object => object.id == selItem);

        let sampleValues = id[0].sample_values;
        let otuIds = id[0].otu_ids;
        let otuLabels = id[0].otu_labels;

        charts(sampleValues, otuIds, otuLabels);
    });
};

function charts(sampleValues, otuIds, otuLabels){

    d3.json(url).then(function(data){

        let bar_chart = [{
            type: "bar",
            x: sampleValues.slice(0, 10).reverse(),
            y: otuIds.slice(0, 10).map(id => `otu ${id}`).reverse(),
            text: otuLabels,
            orientation: "h"
        }];
        
        let bar_layout = {
            height: 600,
            width: 1100
        };
        
        Plotly.newPlot("bar", bar_chart, bar_layout);

        let bubble_chart = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                color: otuIds,
                colorscale: "Blackbody",
                size: sampleValues
            }
        }];

        let bubble_layout = {
            height: 600,
            width: 1100
        };

        Plotly.newPlot("bubble", bubble_chart, bubble_layout);
    });
};

init();