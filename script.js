    var width = 960, height = 700;

    var casesDomain = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 10000, 50000, 100000]
    var deathsDomain = [10, 50, 100, 150, 300, 500, 700, 800, 900, 1000, 1500, 2500]
    var populationDomain = [10000, 25000, 50000, 75000, 100000, 200000, 400000, 600000, 800000, 1000000, 2000000, 4000000]
    var umemploymentDomain = [1, 2, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 9, 12]
   // var umemploymentDomain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const cases_domain = [0, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 10000, 50000, 100000]
    const deaths_domain = [0, 10, 50, 100, 150, 300, 500, 700, 800, 900, 1000, 1500, 2500]
    const population_domain = [0, 10000, 25000, 50000, 75000, 100000, 200000, 400000, 600000, 800000, 1000000, 2000000, 4000000]
    const unemployment_domain = [0, 1, 2, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 9, 12]
    // const unemployment_domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const legend_cases = ["< 500", "500+", "1000+", "1500+", "2000+", "2500+", "3000+", "4000+", "5000+", "6000+", "10000+", "50000+", "100000+"]
    const legend_deaths = ["< 10", "10+","50+", "100+", "150+", "300+", "500+", "700+", "800+", "900+", "1000+", "1500+", "2500+"]
    const legend_population = ["< 10000", "10000+","25000+", "50000+", "75000+", "100000+", "200000+", "400000+", "600000+", "800000+", "1000000+", "2000000+", "4000000+"]
    const legend_unemployment = ["< 1", "1+", "2+", "3+", "4+", "4.5+", "5+", "5.5+", "6+", "6.5+", "7+", "9+", "12+"]

    const legend_width = 73, legend_height = 20;

    var legend;
    var legend_text;

    var colorCases = d3.scaleThreshold()
        .domain(casesDomain)
		.range(["#dcdcdc", "#d0d6cd", "#bdc9be", "#aabdaf", "#97b0a0", "#84a491", "#719782", "#5e8b73", "#4b7e64", "#387255", "#256546", "#125937", "#004d28"]);

    var colorDeaths = d3.scaleThreshold()
        .domain(deathsDomain)
		.range(["#dcdcdc", "#DAB2B2", "#DB9898", "#DB8686", "#DA7575", "#DA6767", "#DC5656", "#D73F3F", "#D73434", "#D72B2B", "#D81F1F", "#D81313", "#DB0505"]);
    
    var colorPopulation = d3.scaleThreshold()
        .domain(populationDomain)
        .range(["#dcdcdc", "#C6C9DB", "#ACB1D2", "#9AA2D2", "#8A94D4", "#7884D2", "#6371D1", "#5263D0", "#4558D0", "#354AD0", "#273ED1", "#1831D1", "#031FD0"]);

    var colorUnemployment = d3.scaleThreshold()
        .domain(umemploymentDomain)
        .range(["#dcdcdc", "#faeae3", "#f7dcd0", "#f5d0bf", "#f2bfa7", "#f2b294", "#f79165", "#f78452", "#f77840", "#f56b2f", "#f55d1b", "#f5540f", "#fc4c00"]);

    var populationScaleRadius = d3.scaleSqrt()
        .domain([0, 1e6])
        .range([0, 15]);

    var caseScaleRadius = d3.scaleSqrt()
        .domain([0, 2e5])
        .range([0, 15]);

    var deathScaleRadius = d3.scaleSqrt()
        .domain([0, 5e3])
        .range([0, 15]);

    var unemploymentScaleRadius = d3.scaleLinear()
        .domain([0, 20])
        .range([0, 15]);

    var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    
    var svg = d3.select("#map")
            .attr("height", height)
            .attr("width", width)
            .append("svg:g")
            //.call(d3.zoom().on("zoom", zoomed))
  	        .append('svg:g');

    // const zoom = d3.zoom()
    // .scaleExtent([1, 8])
    // .on('zoom', zoomed);
    // const g = svg.append('g');
    // svg.call(zoom)
    
    // svg.attr("transform", "scale( " + .9 + ")");

    // function redraw() {
    //     console.log("here", d3.event.translate, d3.event.scale);
    //     svg.attr("transform",
    //         "translate(" + d3.event.translate + ")"
    //         + " scale(" + d3.event.scale + ")");
    //   }
    // function zoomed() {
    //     console.log("ZOOMING")
    //     g
    //       .selectAll('path') // To prevent stroke width from scaling
    //       .attr('transform', d3.event.transform);
    //   }

    // const projection = d3.geoMercator()
    //   .translate([width / 2, height / 2])
    //   .scale((width - 1) / 2 / Math.PI);
    var path = d3.geoPath()
        // .projection(projection);
    // var projection = d3.geoAlbersUsa()
    //         .translate([width /2 , height / 2])
    //         .scale(width);
    // var path = d3.geoPath()
    //         .projection(projection);

    //globals
    var factorOption = "NoFactor"; //factor option value
    var colorMomentum=false;
    var bubbleMomentum=false;
    var colorBox = false;
    var bubbleBox = false;
    var tbdBox = false;
    var countyShapes;
    var pairCasesWithID = {};
    var pairDeathsWithID = {};
    var pairCountyWithID = {};
    var pairStateWithID = {};
    var pairPopulationWithID = {};
    var pairUnemploymentWithID = {};

    queue()
        .defer(d3.json, "us.json")
        // .defer(d3.json, "https://d3js.org/us-10m.v1.json")
        .defer(d3.json, "countyInfo.json")
        .defer(d3.json, "population.json")
        .defer(d3.csv, "labor.csv") //Bureau of Labor Statistics
        .await(ready);

function ready(error, us, countyInfo, population, labor) {
        if(error)
            console.log(err);

    countyInfo.info.forEach(function(d) {
		 pairCasesWithID[d.FIPS] = d.cases;
         pairDeathsWithID[d.FIPS] = d.deaths;
		 pairCountyWithID[d.FIPS] = d.county;
         pairStateWithID[d.FIPS] = d.state;
		 });
    population.info.forEach(function(d){
        //console.log(d.population);
        pairPopulationWithID[d.us_county_fips] = d.population;
    })
    labor.forEach(function(d){
        const code = d.StFIPS + d.CoFIPS
        pairUnemploymentWithID[code] = d.UnempRate.trim()
        // console.log(d.UnempRate)
    })
    // console.log(labor[0])
    // const code = labor[0].StFIPS + labor[0].CoFIPS
    // console.log(code)
	countyShapes = svg.append("g")
                    .attr("class", "county")
                    .selectAll("path")
                    .data(topojson.feature(us, us.objects.counties).features)
                    .enter().append("path")

    countyShapes.attr("d", path)
        .style ( "fill" , function (d) { //set default color by factor
            return "#404040";
        })
        .style("opacity", 0.8)
        .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "red");

                div.transition().duration(300)//.ease(d3.easeLinear)
                .style("opacity", 1)
                div.text(function(){
                        if(!pairCountyWithID[d.id])
                            return "No Info Available on County"
                        return pairCountyWithID[d.id] + ", " + 
                        pairStateWithID[d.id] + " : \nCases(" + 
                        pairCasesWithID[d.id] + "), \nDeaths(" + 
                        pairDeathsWithID[d.id] + "), \nPopulation(" +
                        pairPopulationWithID[d.id] + "), \nUnemployment Rate(" +
                        pairUnemploymentWithID[d.id] + ")"
                })
                .style("left", (d3.event.pageX+30) + "px")
                .style("top", (d3.event.pageY -30) + "px");
		 })
		 .on("mouseleave", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.8)
                    .style("stroke", "transparent")
		 })
         svg.append("path")
			.datum(topojson.mesh(us, us.objects.states, function(a, b) { 
                return a !== b; 
            }))
			.attr("class", "states")
			.attr("d", path);
        svg.append("path")
            .data(topojson.feature(us, us.objects.nation).features)
			.attr("class", "nation")
			.attr("d", path);
            

        bubbles = svg.append("g")
                    .attr("class", "bubble")
                    .selectAll("circle")
                    .data(topojson.feature(us, us.objects.counties).features
                    .sort(function(a, b) { 
                        return b.properties.population - a.properties.population; 
                    }))
                    .enter().append("circle")
                    .attr("transform", function(d) { 
                        return "translate(" + path.centroid(d) + ")"; 
                    })
                // .append("title")
                // .text(function(d) {
                //     return "AYO THIS WORK?"
                // });
                // .attr("r", function(d) { 
                //     //console.log(d.properties.population);
                //     return radius(pairPopulationwithID[d.id]); 
                // });
}; //end ready


function updateMap()
{
    if(factorOption !== "NoFactor")
    {
        // if(!colorBox)
        // {
        //     countyShapes.transition().duration(1000).ease(d3.easeSinIn)
        //         .style ("fill" , function (d) {
        //             return "#404040";
        //         })
        //     if(legend && legend_text)
        //     {
        //         legend.remove();
        //         legend_text.remove();
        //     }
        // }
        //else 

        if(colorMomentum)
        {
            countyShapes.transition().duration(1000).ease(d3.easeSinIn)
            .style ("fill" , function (d) {
                if(factorOption === "Cases")
                {
                    return colorCases(pairCasesWithID[d.id]);
                }
                else if(factorOption === "Deaths")
                {
                    return colorDeaths(pairDeathsWithID[d.id])
                }
                else if(factorOption === "Population")
                {
                    return colorPopulation(pairPopulationWithID[d.id]);
                }
                else if(factorOption === "UnemploymentRate")
                {
                    return colorUnemployment(pairUnemploymentWithID[d.id]);
                }
                return "#404040";
            })
            if(legend && legend_text)
            {
                legend.remove();
                legend_text.remove();
            }
            legend = svg.selectAll("g.legend")
                .data(function(){
                    if(factorOption === "Cases")
                        return cases_domain;
                    else if(factorOption === "Deaths")
                        return deaths_domain;
                    else if(factorOption === "Population")
                        return population_domain;
                    else if(factorOption === "UnemploymentRate")
                        return unemployment_domain;
                })
                .enter().append("g")
                .attr("class", "legend");
        
            legend_text = svg.append("text")
                .attr("x", 10)
                .attr("y", 640)
                .attr("class", "legend_title")
                .text(function(){
                    if(factorOption === "Cases")
                    {
                        return "Cases";
                    }
                    else if(factorOption === "Deaths")
                    {
                        return "Deaths";
                    }
                    else if(factorOption === "Population")
                    {
                        return "Population";
                    }
                    else if(factorOption === "UnemploymentRate")
                    {
                        return "Unemployment Rate";
                    }
                    return "None";
                    });
                
            legend.append("rect")
                .transition().duration(500).ease(d3.easeQuadOut)
                .attr("x", function(d, i){ return width - (i*legend_width) - legend_width;})
                .attr("y", 650)
                .attr("width", legend_width)
                .attr("height", legend_height)
                .style("fill", function(d, i) { 
                    if(factorOption === "Cases")
                    {
                        return colorCases(d); 
                    }
                    else if(factorOption === "Deaths")
                    {
                        return colorDeaths(d); 
                    }
                    else if(factorOption === "Population")
                    {
                        return colorPopulation(d); 
                    }
                    else if(factorOption === "UnemploymentRate")
                    {
                        return colorUnemployment(d);
                    }
                })
                .style("opacity", 0.8);
                
            legend
                .append("text")
                .transition().duration(500).ease(d3.easeSinIn)
                .attr("x", function(d, i){ return width - (i*legend_width) - legend_width;})
                .attr("y", 685)
                .text(function(d, i){ 
                    if(factorOption === "Cases")
                        return legend_cases[i]; 
                    else if(factorOption === "Deaths")
                        return legend_deaths[i]; 
                    else if(factorOption === "Population")
                        return legend_population[i]; 
                    else if(factorOption === "UnemploymentRate")
                        return legend_unemployment[i];
            });
        }
        // else
        // {
        //     legend = svg.selectAll("g.legend")
        //         .data(function(){
        //             if(factorOption === "Cases")
        //                 return cases_domain;
        //             else if(factorOption === "Deaths")
        //                 return deaths_domain;
        //             else if(factorOption === "Population")
        //                 return population_domain;
        //         })
        //         .enter().append("g")
        //         .attr("class", "legend");
        
        //     legend_text = svg.append("text")
        //         .attr("x", 10)
        //         .attr("y", 640)
        //         .attr("class", "legend_title")
        //         .text(function(){
        //             if(factorOption === "Cases")
        //             {
        //                 return "Cases";
        //             }
        //             else if(factorOption === "Deaths")
        //             {
        //                 return "Deaths";
        //             }
        //             else if(factorOption === "Population")
        //             {
        //                 return "Population";
        //             }
        //             return "None";
        //             });
                
        //     legend.append("rect")
        //         .attr("x", function(d, i){ return width - (i*legend_width) - legend_width;})
        //         .attr("y", 650)
        //         .attr("width", legend_width)
        //         .attr("height", legend_height)
        //         .style("fill", function(d, i) { 
        //             if(factorOption === "Cases")
        //             {
        //                 return colorCases(d); 
        //             }
        //             else if(factorOption === "Deaths")
        //             {
        //                 return colorDeaths(d); 
        //             }
        //             else if(factorOption === "Population")
        //             {
        //                 return colorPopulation(d); 
        //             }
        //         })
        //         .style("opacity", 0.8);
                
        //     legend
        //         .append("text")
        //         .attr("x", function(d, i){ return width - (i*legend_width) - legend_width;})
        //         .attr("y", 685)
        //         .text(function(d, i){ 
        //             if(factorOption === "Cases")
        //                 return legend_cases[i]; 
        //             else if(factorOption === "Deaths")
        //                 return legend_deaths[i]; 
        //             else if(factorOption === "Population")
        //                 return legend_population[i]; 
        //     });
        // }
        // if(!bubbleBox)
        // {
        //     bubbles.transition().duration(1000).ease(d3.easeLinear)
        //     .attr("r", function(d) {
        //         return populationScaleRadius(0); 
        //     });
        // }
        if(bubbleMomentum)
        {
            bubbles.transition().duration(1000).ease(d3.easeLinear)
            .attr("r", function(d) { 
                //console.log(d.properties.population);
                // if(isNaN(radius(pairPopulationwithID[d.id])))
                // {
                //     console.log(pairPopulationwithID[d.id])
                // }
                if(factorOption === "Cases" && !isNaN(caseScaleRadius(pairCasesWithID[d.id])))
                {
                    return caseScaleRadius(pairCasesWithID[d.id]); 
                }
                else if(factorOption === "Deaths" && !isNaN(deathScaleRadius(pairDeathsWithID[d.id])))
                {
                    return deathScaleRadius(pairDeathsWithID[d.id]); 
                }
                else if(factorOption === "Population" && !isNaN(populationScaleRadius(pairPopulationWithID[d.id])))
                {
                    return populationScaleRadius(pairPopulationWithID[d.id]); 
                }
                else if(factorOption === "UnemploymentRate" && !isNaN(unemploymentScaleRadius(pairUnemploymentWithID[d.id])))
                {
                    return unemploymentScaleRadius(pairUnemploymentWithID[d.id]);
                }
                //INCLUDE MORE....
            });
        }
        if(!tbdBox)
        {

        }
        else if(tbdBox)
        {

        }
    }
    else //nofactor
    {
        if(!colorBox)
        {
            countyShapes.transition().duration(1000).ease(d3.easeLinear)
                .style ("fill" , function (d) {
                    return "#404040";
                })
            if(legend && legend_text)
            {
                legend.remove();
                legend_text.remove();
            }
        }
        if(!bubbleBox)
        {
            bubbles.transition().duration(1000).ease(d3.easeLinear)
            .attr("r", function(d) {
                return populationScaleRadius(0); 
            });
        }
    }
}

//Control Panel
d3.select("#factormenu").on("change", function(d) {
    if(d3.select("#NoFactor").property("checked"))
        factorOption = "NoFactor"
    else if(d3.select("#Cases").property("checked"))
        factorOption = "Cases"
    else if(d3.select("#Deaths").property("checked"))
        factorOption = "Deaths"
    else if(d3.select("#Population").property("checked"))
        factorOption = "Population"
    else if(d3.select("#UnemploymentRate").property("checked"))
        factorOption = "UnemploymentRate"
    console.log(factorOption)
    //updateMap();
})
d3.select("#vizrep").on("change", function(d) {
    const prevColor = colorBox;
    const prevBubble = bubbleBox;

    colorBox = d3.select("#colorBox").property("checked");
    bubbleBox = d3.select("#bubbleBox").property("checked");
    tbdBox = d3.select("#tbdBox").property("checked");

    colorMomentum = (!prevColor && colorBox) ? true : false;
    bubbleMomentum = (!prevBubble && bubbleBox) ? true : false;

    updateMap();
})

