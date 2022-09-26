var mapMargin = {top:20, right:20, bottom:10, left: 20};
var mapHeight = 800-mapMargin.top-mapMargin.bottom;
var mapWidth = 600-mapMargin.left-mapMargin.right;

var countryGraph1Margin = {top:200, right:25, bottom:150, left: 25};
var countryGraph1Height = 600-countryGraph1Margin.top-countryGraph1Margin.bottom;
var countryGraph1Width = 400-countryGraph1Margin.left-countryGraph1Margin.right;

var gLabel = d3.select("#title")
    .append("g");

var gLegend= d3.select("#leg")
    .append("g");  

var gMap = d3.select("#map")
    .append("g")
    .attr("transform", "translate(" + mapMargin.left + "," + mapMargin.top + ")");
    
var gCountryGraph1 = d3.select("#graph")
    .append("g")
    .attr("transform", "translate(" + countryGraph1Margin.left + "," + countryGraph1Margin.top + ")");

var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));
    var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));
    Promise
    .all([
        PromiseWrapper(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        PromiseWrapper(d3.csv, "../REBECCA_170767800_P/covid_south_north_america_trend.csv")
    ])
    .then(resolve => {
        createMap(resolve[0], resolve[1]);
    });

// buttons to change data sets for different views 
d3.select("#controls").append("button")
    .on("click", function(){
        var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));
        var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));
        Promise
        .all([
            PromiseWrapper(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
            PromiseWrapper(d3.csv, "north_america_covid_weekly_trend.csv")
        ])
        .then(resolve => {
            createMap(resolve[0], resolve[1]);
        });
    }).html("North America");
   

d3.select("#controls").append("button").attr("class","south")
.on("click", function(){
        var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));
        var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));
        Promise
        .all([
            PromiseWrapper(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
            PromiseWrapper(d3.csv,"covid_south_america_weekly_trend.csv")
        ])
        .then(resolve => {
            createMap(resolve[0], resolve[1]);
        });
    }).html("South America");

d3.select("#controls").append("button").attr("class","both")
.on("click", function(){
        var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));
        var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));
        Promise
        .all([
            PromiseWrapper(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
            PromiseWrapper(d3.csv, "covid_south_north_america_trend.csv")
        ])
        .then(resolve => {
            createMap(resolve[0], resolve[1]);
        });
    }).html("North and South America");

//visualizations 
function createMap(countries, covidData) {
    gMap.selectAll("*").remove();
    gLabel.selectAll("*").remove();
    gLegend.selectAll("*").remove();

    var continent;
    var yTranslate;
    var xTranslate;
    var sizeScale;
    
    if (covidData.length <=15){
        continent = "South America";
        sizeScale = 475;
        xTranslate = 775;
        yTranslate = 150;
    }
    else if (covidData.length <=37){
        continent = "North America";
        sizeScale = 225;
        xTranslate = 650;
        yTranslate = 700;
    }
    else if (covidData.length <=51){
        continent = "North and South America"
        sizeScale = 195;
        xTranslate = 575;
        yTranslate = 550;
    }

     
    //display name of map maybe if statement
    gLabel.append("text").attr("x", 150).attr("y", 50).text(continent).style("font-size", "30px")
    
    //display current case and previous week cases 
    var currentCases = 0;
    var previousCases = 0;
    for (var i = 0; i<covidData.length;i++){
        currentCases = parseInt(covidData[i].Cases_last_7) + currentCases;
    }
    for (var i = 0; i<covidData.length;i++){
        previousCases = parseInt(covidData[i].Cases_preceding_7) + previousCases;
    }

    var radiusScale;
    if (previousCases > currentCases){
        radiusScale = d3.scaleLinear().domain([0,previousCases]).range([0,35]);
    }
    else{
        radiusScale = d3.scaleLinear().domain([0, currentCases]).range([0,35]);
    }
    gLabel.append("text").attr("x", 25).attr("y", 100).text("Current Case Count:").style("font-size", "16px")
    gLabel.append("circle").attr("cx", 200).attr("cy", 100).attr("r", radiusScale(currentCases)).style("fill","#adb5bd")
    gLabel.append("text").attr("x", 180).attr("y", 100).text(currentCases).style("font-size", "13px")
     
    gLabel.append("text").attr("x", 300).attr("y", 100).text("Previous Week Case Count:").style("font-size", "16px")
    gLabel.append("circle").attr("cx", 525).attr("cy", 100).attr("r", radiusScale(previousCases)).style("fill","#adb5bd")
    gLabel.append("text").attr("x", 505).attr("y",100).text(previousCases).style("font-size", "13px")

    //legend
    gLegend.append("text").attr("x", 25).attr("y", 35).text("Cases increased/reduced from previous week").style("font-size", "16px")

    gLegend.append("text").attr("x", 75).attr("y", 65).text("Increased").style("font-size", "13px")
    gLegend.append("rect").attr("x", 135).attr("y", 55).attr("height", 12).attr("width", 25).style("fill", "#ba181b")
    gLegend.append("text").attr("x", 75).attr("y", 92.5).text("Reduced").style("font-size", "13px")
    gLegend.append("rect").attr("x", 135).attr("y",82.5).attr("height", 12).attr("width", 25).style("fill", "#2a6f97")
    gLegend.append("text").attr("x", 75).attr("y", 115).text("No Change").style("font-size", "13px")
    gLegend.append("rect").attr("x", 135).attr("y",105).attr("height", 12).attr("width", 25).style("fill", "#8ac926")

    gLegend.append("text").attr("x", 350).attr("y", 35).text("Top 5 and Bottom 5 country cases per 1 million").style("font-size", "16px")

    gLegend.append("text").attr("x", 400).attr("y", 70).text("Top 5").style("font-size", "13px")
    gLegend.append("rect").attr("x", 460).attr("y", 60).attr("height", 12).attr("width", 25).style("fill", "#ff7b00")
    gLegend.append("text").attr("x", 400).attr("y", 97.5).text("Bottom 5").style("font-size", "13px")
    gLegend.append("rect").attr("x", 460).attr("y",87.5).attr("height", 12).attr("width", 25).style("fill", "#5e60ce")
    
    
    
    //scale of the map
    var aProjection = d3.geoMercator()
    .scale(sizeScale)
    .translate([xTranslate, yTranslate]);
    
    var geoPath = d3.geoPath().projection(aProjection);
    
    // display map 
    gMap.selectAll("path").data(countries.features)
    .enter()
    .append("path")
        .attr("d", geoPath)
        .attr("class", "countries")

    // //map colour fill
    d3.select("#fill_differences").on("click", () =>{fillDifferences()});

    function fillDifferences(){
        var colour;
    
        gMap.selectAll("path").data(countries.features)
        .attr("fill", function(d){
           for(var i =0; i < covidData.length; i++){
                if (d.properties.name == covidData[i].Country){ 
                    
                    if (parseInt(covidData[i].Cases_last_7) - parseInt(covidData[i].Cases_preceding_7) <= -1){
                        
                        colour = "#2a6f97"
                    }
                    else if (parseInt(covidData[i].Cases_last_7) - parseInt(covidData[i].Cases_preceding_7) >= 1){
                        
                        colour = "#ba181b"
                    }
                    else {
                        
                        colour = "#8ac926"
                    }
                    return colour
                    } 
            }  
        });
    }

    d3.select("#fill_top_bottom").on("click", () =>{fillTopBottom()});

    function fillTopBottom(){
        
        var colour;
        covidData = covidData.sort((a, b) => d3.descending(parseInt(a.Cases_last_7_per_million), parseInt(b.Cases_last_7_per_million)));

        gMap.selectAll("path").data(countries.features)
        .attr("fill", function(d){
            for(var i =0; i <=5; i++){
                if (d.properties.name == covidData[i].Country){ 
                        colour = "#ff7b00"
                    return colour
                    } 
            }
            for (var j = (covidData.length -5); j < covidData.length;j++)  {
                if (d.properties.name == covidData[j].Country){ 

                        colour = "#5e60ce"
                    return colour
                    } 
            }
        });
    }


    // hover over functions 
    gMap.selectAll("path.countries")
        .on("mouseover", addData);

    function addData(d){
        // box around country
        gMap.selectAll("rect.bbox").remove();
        var thisBounds = geoPath.bounds(d);
        
        gMap.append("rect")
            .attr("class", "bbox")
            .attr("x", thisBounds[0][0])
            .attr("y", thisBounds[0][1])
            .attr("width", thisBounds[1][0] - thisBounds[0][0])
            .attr("height", thisBounds[1][1] - thisBounds[0][1]);

        //graphs with data
        gCountryGraph1.selectAll("*").remove();
    
        for (var i = 0; i < covidData.length; i++){

            if (d.properties.name == covidData[i].Country){
                gCountryGraph1.append("text")
                    .attr("y", -150)
                    .attr("x", countryGraph1Width/3)
                    .text(covidData[i].Country)
                    .style("font-size", "30px");

                gCountryGraph1.append("text")
                    .attr("y", -100)
                    .attr("x", (countryGraph1Width/6))
                    .text("Population: ")
                    .style("font-size", "30px");

                gCountryGraph1.append("text")
                    .attr("y", -100)
                    .attr("x", (countryGraph1Width/6)+150)
                    .text(covidData[i].Population)
                    .style("font-size", "30px");

                var yScale = d3.scaleLinear()
                .domain([covidData[i].Cases_preceding_7, 0])
                .range([0, countryGraph1Height]);

                gCountryGraph1.append("line")
                    .data(covidData)
                    .attr("y1", yScale(covidData[i].Cases_preceding_7))
                    .attr("x1", 100)
                    .attr("y2", yScale(covidData[i].Cases_last_7))
                    .attr("x2", 300)
                    .style("stroke", "#e63946");

                gCountryGraph1.append("circle").data(covidData)
                    .attr("cy", yScale(covidData[i].Cases_preceding_7))
                    .attr("cx", 100)
                    .attr("r", 10);
                gCountryGraph1.selectAll(".dots")
                    .data(covidData)
                    .enter()
                    .append("text")
                        .attr("class", "dots")
                        .attr("y", yScale(covidData[i].Cases_preceding_7))
                        .attr("x", 70)
                        .attr("dx", "1em")
                        .attr("dy","1.5em")
                        .text(covidData[i].Cases_preceding_7);

                gCountryGraph1.append("circle").data(covidData)
                    .attr("cy", yScale(covidData[i].Cases_last_7))
                    .attr("cx", 300)
                    .attr("r", 10);
                gCountryGraph1.selectAll(".dots1")
                    .data(covidData)
                    .enter()
                    .append("text")
                        .attr("class", "dots1")
                        .attr("y", yScale(covidData[i].Cases_last_7))
                        .attr("x", 275)
                        .attr("dx", "1em")
                        .attr("dy","1.5em")
                        .text(covidData[i].Cases_last_7);
                
                gCountryGraph1.append("text")
                    .attr("y", yScale(covidData[i].Cases_preceding_7)-50)
                    .attr("x",110)
                    .text("Weekly Case Change: " + covidData[i].Weekly_Case_Change + "%")
                    .style("fill","#e63946");

                gCountryGraph1.append("text")
                    .attr("y", yScale(covidData[i].Cases_preceding_7) )
                    .attr("x",10)
                    .text("Cases");

                var yScale2 = d3.scaleLinear()
                    .domain([covidData[i].Deaths_preceding_7, 0])
                    .range([countryGraph1Height/2, countryGraph1Height]);

                gCountryGraph1.append("line")
                    .data(covidData)
                    .attr("y1", yScale2(covidData[i].Deaths_preceding_7)+100)
                    .attr("x1", 100)
                    .attr("y2", yScale2(covidData[i].Deaths_last_7)+100)
                    .attr("x2", 300)
                    .style("stroke", "#05668d");

                gCountryGraph1.append("circle").data(covidData)
                    .attr("cy", yScale2(covidData[i].Deaths_preceding_7)+100)
                    .attr("cx", 100)
                    .attr("r",10);
                gCountryGraph1.selectAll(".dots2")
                    .data(covidData)
                    .enter()
                    .append("text")
                        .attr("class", "dots2")
                        .attr("y", yScale2(covidData[i].Deaths_preceding_7)+100)
                        .attr("x", 70)
                        .attr("dx", "1em")
                        .attr("dy","1.5em")
                        .text(covidData[i].Deaths_preceding_7);

                gCountryGraph1.append("circle").data(covidData)
                    .attr("cy", yScale2(covidData[i].Deaths_last_7)+100)
                    .attr("cx", 300)
                    .attr("r", 10);
                gCountryGraph1.selectAll(".dots3")
                    .data(covidData)
                    .enter()
                    .append("text")
                        .attr("class", "dots3")
                        .attr("y", yScale2(covidData[i].Deaths_last_7)+100)
                        .attr("x", 275)
                        .attr("dx", "1em")
                        .attr("dy","1.5em")
                        .text(covidData[i].Deaths_last_7);

                gCountryGraph1.append("text")
                    .attr("y", yScale2(covidData[i].Deaths_preceding_7) +100 )
                    .attr("x",10)
                    .text("Deaths");

                gCountryGraph1.append("text")
                    .attr("y", yScale2(covidData[i].Deaths_preceding_7)+50)
                    .attr("x",110)
                    .text("Weekly Death Change: " + covidData[i].Weekly_Death_Change + "%")
                    .style("fill","#05668d");


                gCountryGraph1.append("text")
                    .attr("y", yScale2(covidData[i].Deaths_last_7)+200)
                    .attr("x",50)
                    .text("Preceeding 7 Days");
                gCountryGraph1.append("text")
                    .attr("y", yScale2(covidData[i].Deaths_last_7)+200)
                    .attr("x",250)
                    .text("Last 7 Days");

            }
        }
    }

    
}