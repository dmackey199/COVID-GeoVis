    var width = 960, height = 700;

    var casesDomain = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 10000, 50000, 100000]
    var deathsDomain = [10, 50, 100, 150, 300, 500, 700, 800, 900, 1000, 1500, 2500]
    var populationDomain = [10000, 25000, 50000, 75000, 100000, 200000, 400000, 600000, 800000, 1000000, 2000000, 4000000]
    var umemploymentDomain = [1, 2, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 9, 12]

    const cases_domain = [0, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 10000, 50000, 100000]
    const deaths_domain = [0, 10, 50, 100, 150, 300, 500, 700, 800, 900, 1000, 1500, 2500]
    const population_domain = [0, 10000, 25000, 50000, 75000, 100000, 200000, 400000, 600000, 800000, 1000000, 2000000, 4000000]
    const unemployment_domain = [0, 1, 2, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 9, 12]

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
  	        .append('svg:g');

    var path = d3.geoPath()

    //globals
    var colorOption = "None";
    var bubbleOption = "None";
    var shakeOption = "None";

    var colorMomentum=false;

    var colorMap=false;
    var bubbleMap=false;
    var shakeMap=false;

    var countyShapes;
    var bubbles;

    var moveBubbles = false;
    var bubbleDir = 1;
    var firstMove = false;
    //var dist;

    var pairCasesWithID = {};
    var pairDeathsWithID = {};
    var pairCountyWithID = {};
    var pairStateWithID = {};
    var pairPopulationWithID = {};
    var pairUnemploymentWithID = {};

    queue()
        .defer(d3.json, "us.json")
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
        pairPopulationWithID[d.us_county_fips] = d.population;
    })
    labor.forEach(function(d){
        const code = d.StFIPS + d.CoFIPS
        pairUnemploymentWithID[code] = d.UnempRate.trim()
    })
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
                        pairCasesWithID[d.id] + "), \r\nDeaths(" + 
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
}; //end ready
function ShakeBubbles()
{
    bubbles
        .transition(d3.easeLinear) 
        .duration(1000)
        .attr("cx", function(d) {
            if((shakeOption === "Cases" || bubbleOption === "Cases") && !isNaN(caseScaleRadius(pairCasesWithID[d.id])))
            {
                return calculateSpeed(caseScaleRadius(pairCasesWithID[d.id])); 
            }
            else if((shakeOption === "Deaths" || bubbleOption === "Deaths") && !isNaN(deathScaleRadius(pairDeathsWithID[d.id])))
            {
                return calculateSpeed(deathScaleRadius(pairDeathsWithID[d.id])); 
            }
            else if((shakeOption === "Population" || bubbleOption === "Population") && !isNaN(populationScaleRadius(pairPopulationWithID[d.id])))
            {
                return calculateSpeed(populationScaleRadius(pairPopulationWithID[d.id])); 
            }
            else if((shakeOption === "UnemploymentRate" || bubbleOption === "UnemploymentRate") && !isNaN(unemploymentScaleRadius(pairUnemploymentWithID[d.id])))
            {
                return calculateSpeed(unemploymentScaleRadius(pairUnemploymentWithID[d.id]));
            }
            else{
                console.log("PROBLEM @" + pairCountyWithID[d.id]);
                return 1;
            }
        })
        .transition(d3.easeLinear)
        .duration(1000)
        .attr("cx", function(d) {
            if((shakeOption === "Cases" || bubbleOption === "Cases") && !isNaN(caseScaleRadius(pairCasesWithID[d.id])))
            {
                return -calculateSpeed(caseScaleRadius(pairCasesWithID[d.id])); 
            }
            else if((shakeOption === "Deaths" || bubbleOption === "Deaths") && !isNaN(deathScaleRadius(pairDeathsWithID[d.id])))
            {
                return -calculateSpeed(deathScaleRadius(pairDeathsWithID[d.id])); 
            }
            else if((shakeOption === "Population" || bubbleOption === "Population") && !isNaN(populationScaleRadius(pairPopulationWithID[d.id])))
            {
                return -calculateSpeed(populationScaleRadius(pairPopulationWithID[d.id])); 
            }
            else if((shakeOption === "UnemploymentRate" || bubbleOption === "UnemploymentRate") && !isNaN(unemploymentScaleRadius(pairUnemploymentWithID[d.id])))
            {
                return -calculateSpeed(unemploymentScaleRadius(pairUnemploymentWithID[d.id]));
            }
            else
            {
                return -1;
            }
        })
        .transition(d3.easeLinear) 
        .duration(1000)
        .attr("cx", function(d) {
            if((shakeOption === "Cases" || bubbleOption === "Cases") && !isNaN(caseScaleRadius(pairCasesWithID[d.id])))
            {
                return calculateSpeed(caseScaleRadius(pairCasesWithID[d.id])); 
            }
            else if((shakeOption === "Deaths" || bubbleOption === "Deaths") && !isNaN(deathScaleRadius(pairDeathsWithID[d.id])))
            {
                return calculateSpeed(deathScaleRadius(pairDeathsWithID[d.id])); 
            }
            else if((shakeOption === "Population" || bubbleOption === "Population") && !isNaN(populationScaleRadius(pairPopulationWithID[d.id])))
            {
                return calculateSpeed(populationScaleRadius(pairPopulationWithID[d.id])); 
            }
            else if((shakeOption === "UnemploymentRate" || bubbleOption === "UnemploymentRate") && !isNaN(unemploymentScaleRadius(pairUnemploymentWithID[d.id])))
            {
                return calculateSpeed(unemploymentScaleRadius(pairUnemploymentWithID[d.id]));
            }
            else
            {
                return 1;
            }
        })
        .transition(d3.easeLinear)
        .duration(1000)
        .attr("cx", function(d) {
            if((shakeOption === "Cases" || bubbleOption === "Cases") && !isNaN(caseScaleRadius(pairCasesWithID[d.id])))
            {
                return -calculateSpeed(caseScaleRadius(pairCasesWithID[d.id])); 
            }
            else if((shakeOption === "Deaths" || bubbleOption === "Deaths") && !isNaN(deathScaleRadius(pairDeathsWithID[d.id])))
            {
                return -calculateSpeed(deathScaleRadius(pairDeathsWithID[d.id])); 
            }
            else if((shakeOption === "Population" || bubbleOption === "Population") && !isNaN(populationScaleRadius(pairPopulationWithID[d.id])))
            {
                return -calculateSpeed(populationScaleRadius(pairPopulationWithID[d.id])); 
            }
            else if((shakeOption === "UnemploymentRate" || bubbleOption === "UnemploymentRate") && !isNaN(unemploymentScaleRadius(pairUnemploymentWithID[d.id])))
            {
                return -calculateSpeed(unemploymentScaleRadius(pairUnemploymentWithID[d.id]));
            }
            else
            {
                return -1;
            }
        })
        .transition(d3.easeLinear)
        .duration(1000)
        .attr("cx", function(d) {
            return 0;
        })
};
function calculateSpeed(radius)
{
    var speed;
    if(radius >= 10)
    {
        speed = 20;
    }
    else if(radius >= 8)
    {
        speed =  10;
    }
    else if(radius >= 5)
    {
        speed =  5;
    }
    else if(radius >= 1.5)
    {
        speed = 2;
    }
    else if(radius < 1.5)
    {
        speed = 1
    }
    return speed; 
}

function updateMap()
{
    if(colorOption !== "None")
    {
        if(colorMap)
        {
            countyShapes.transition().duration(1000).ease(d3.easeSinIn)
            .style ("fill" , function (d) {
                if(colorOption === "Cases")
                {
                    return colorCases(pairCasesWithID[d.id]);
                }
                else if(colorOption === "Deaths")
                {
                    return colorDeaths(pairDeathsWithID[d.id])
                }
                else if(colorOption === "Population")
                {
                    return colorPopulation(pairPopulationWithID[d.id]);
                }
                else if(colorOption === "UnemploymentRate")
                {
                    return colorUnemployment(pairUnemploymentWithID[d.id]);
                }
                return "#404040";
            })
        }
        if(colorMomentum) //change legend
        {
            if(legend && legend_text)
            {
                legend.remove();
                legend_text.remove();
            }
            legend = svg.selectAll("g.legend")
                .data(function(){
                    if(colorOption === "Cases")
                        return cases_domain;
                    else if(colorOption === "Deaths")
                        return deaths_domain;
                    else if(colorOption === "Population")
                        return population_domain;
                    else if(colorOption === "UnemploymentRate")
                        return unemployment_domain;
                })
                .enter().append("g")
                .attr("class", "legend");
        
            legend_text = svg.append("text")
                .attr("x", 10)
                .attr("y", 640)
                .attr("class", "legend_title")
                .text(function(){
                    if(colorOption === "Cases")
                    {
                        return "Cases";
                    }
                    else if(colorOption === "Deaths")
                    {
                        return "Deaths";
                    }
                    else if(colorOption === "Population")
                    {
                        return "Population";
                    }
                    else if(colorOption === "UnemploymentRate")
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
                    if(colorOption === "Cases")
                    {
                        return colorCases(d); 
                    }
                    else if(colorOption === "Deaths")
                    {
                        return colorDeaths(d); 
                    }
                    else if(colorOption === "Population")
                    {
                        return colorPopulation(d); 
                    }
                    else if(colorOption === "UnemploymentRate")
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
                    if(colorOption === "Cases")
                        return legend_cases[i]; 
                    else if(colorOption === "Deaths")
                        return legend_deaths[i]; 
                    else if(colorOption === "Population")
                        return legend_population[i]; 
                    else if(colorOption === "UnemploymentRate")
                        return legend_unemployment[i];
            });
        }
    }
    else //nothing to color
    {
        if(!colorMap)
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
        if(!bubbleMap)
        {
            bubbles.transition().duration(1000).ease(d3.easeLinear)
            .attr("r", function(d) {
                return populationScaleRadius(0); 
            });
        }
    }
    if(bubbleOption !== "None")
    {
        if(bubbleMap)
        {
            bubbles.transition().duration(1000).ease(d3.easeLinear)
            .attr("r", function(d) { 
                if(bubbleOption === "Cases" && !isNaN(caseScaleRadius(pairCasesWithID[d.id])))
                {
                    return caseScaleRadius(pairCasesWithID[d.id]); 
                }
                else if(bubbleOption === "Deaths" && !isNaN(deathScaleRadius(pairDeathsWithID[d.id])))
                {
                    return deathScaleRadius(pairDeathsWithID[d.id]); 
                }
                else if(bubbleOption === "Population" && !isNaN(populationScaleRadius(pairPopulationWithID[d.id])))
                {
                    return populationScaleRadius(pairPopulationWithID[d.id]); 
                }
                else if(bubbleOption === "UnemploymentRate" && !isNaN(unemploymentScaleRadius(pairUnemploymentWithID[d.id])))
                {
                    return unemploymentScaleRadius(pairUnemploymentWithID[d.id]);
                }
            });
        }
    }
    else //no bubbles
    {
        bubbles.transition().duration(1000).ease(d3.easeLinear)
            .attr("r", function(d) {
                return populationScaleRadius(0); 
            });
    }
    if(shakeOption !== "None")
    {
        if(shakeMap)
        {
            bubbles.transition().duration(1000).ease(d3.easeLinear)
            .attr("r", function(d) { 
                if(shakeOption === "Cases" && !isNaN(caseScaleRadius(pairCasesWithID[d.id])))
                {
                    return caseScaleRadius(pairCasesWithID[d.id]); 
                }
                else if(shakeOption === "Deaths" && !isNaN(deathScaleRadius(pairDeathsWithID[d.id])))
                {
                    return deathScaleRadius(pairDeathsWithID[d.id]); 
                }
                else if(shakeOption === "Population" && !isNaN(populationScaleRadius(pairPopulationWithID[d.id])))
                {
                    return populationScaleRadius(pairPopulationWithID[d.id]); 
                }
                else if(shakeOption === "UnemploymentRate" && !isNaN(unemploymentScaleRadius(pairUnemploymentWithID[d.id])))
                {
                    return unemploymentScaleRadius(pairUnemploymentWithID[d.id]);
                }
            });
            ShakeBubbles();
        }
    }
    else //no shake
    {
        if(!bubbleMap)
        {
            bubbles.transition().duration(1000).ease(d3.easeLinear)
                .attr("r", function(d) {
                    return populationScaleRadius(0); 
                });
        }
    }
}

//Control Panel

d3.select("#casesRep").on("change", function(d) {
    const sel = d3.select("#cases option:checked").text()
    var prevColor = colorMap;
    if(sel === "None")
    {        
        if(colorOption === "Cases")
        {
            colorMap = false;
            colorOption = sel;
        }
        if(bubbleOption === "Cases")
        {
            bubbleMap = false;
            bubbleOption = sel;
        }
        if(shakeOption === "Cases")
        {
            shakeMap = false;
            shakeOption = sel;
        }
        shakeMap = false;
    }    
    else if(sel === "Color Map")
    {
        if(bubbleOption === "Cases")
        {
            bubbleMap = false;
            bubbleOption = "None";
        }
        if(shakeOption === "Cases")
        {
            shakeMap = false;
            shakeOption = "None";
        }
        if(colorOption !== "Cases")
        {
            prevColor = false;
        }
        colorMap = true;
        colorOption = "Cases";
    }
    else if(sel === "Bubble Map")
    {
        if(colorOption === "Cases")
        {
            colorMap = false;
            colorOption = "None";
        }
        if(shakeOption === "Cases")
        {
            shakeOption = "None";
        }
        shakeMap = false;
        bubbleMap = true;
        bubbleOption = "Cases";
    }
    else if(sel === "Shake Bubbles")
    {
        if(colorOption === "Cases")
        {
            colorMap = false;
            colorOption = "None";
        }
        if(bubbleOption === "Cases")
        {
            bubbleMap = false;
            bubbleOption = "None";
        }
        shakeMap = true;
        shakeOption = "Cases";
    }
    colorMomentum = (!prevColor && colorMap) ? true : false;
    updateMap();
})
d3.select("#deathsRep").on("change", function(d) {
    const sel = d3.select("#deaths option:checked").text()
    var prevColor = colorMap;
    if(sel === "None")
    {        
        if(colorOption === "Deaths")
        {
            colorMap = false;
            colorOption = sel;
        }
        if(bubbleOption === "Deaths")
        {
            bubbleMap = false;
            bubbleOption = sel;
        }
        if(shakeOption === "Deaths")
        {
            shakeOption = sel;
        }
        shakeMap = false;
    }    
    else if(sel === "Color Map")
    {
        if(bubbleOption === "Deaths")
        {
            bubbleMap = false;
            bubbleOption = "None";
        }
        if(shakeOption === "Deaths")
        {
            shakeMap = false;
            shakeOption = "None";
        }
        if(colorOption !== "Deaths")
        {
            prevColor = false;
        }
        colorMap = true;
        colorOption = "Deaths";
    }
    else if(sel === "Bubble Map")
    {
        if(colorOption === "Deaths")
        {
            colorMap = false;
            colorOption = "None";
        }
        if(shakeOption === "Deaths")
        {
            shakeOption = "None";
        }
        shakeMap = false;
        bubbleMap = true;
        bubbleOption = "Deaths";
    }
    else if(sel === "Shake Bubbles")
    {
        if(colorOption === "Deaths")
        {
            colorMap = false;
            colorOption = "None";
        }
        if(bubbleOption === "Deaths")
        {
            bubbleMap = false;
            bubbleOption = "None";
        }
        shakeMap = true;
        shakeOption = "Deaths";
    }
    colorMomentum = (!prevColor && colorMap) ? true : false;
    updateMap();
})
d3.select("#populationRep").on("change", function(d) {
    const sel = d3.select("#population option:checked").text()
    var prevColor = colorMap;
    if(sel === "None")
    {        
        if(colorOption === "Population")
        {
            colorMap = false;
            colorOption = sel;
        }
        if(bubbleOption === "Population")
        {
            bubbleMap = false;
            bubbleOption = sel;
        }
        if(shakeOption === "Population")
        {
            shakeOption = sel;
        }
        shakeMap = false;
    }    
    else if(sel === "Color Map")
    {
        if(bubbleOption === "Population")
        {
            bubbleMap = false;
            bubbleOption = "None";
        }
        if(shakeOption === "Population")
        {
            shakeMap = false;
            shakeOption = "None";
        }
        if(colorOption !== "Population")
        {
            prevColor = false;
        }
        colorMap = true;
        colorOption = "Population";
    }
    else if(sel === "Bubble Map")
    {
        if(colorOption === "Population")
        {
            colorMap = false;
            colorOption = "None";
        }
        if(shakeOption === "Population")
        {
            shakeOption = "None";
        }
        shakeMap = false;
        bubbleMap = true;
        bubbleOption = "Population";
    }
    else if(sel === "Shake Bubbles")
    {
        if(colorOption === "Population")
        {
            colorMap = false;
            colorOption = "None";
        }
        if(bubbleOption === "Population")
        {
            bubbleMap = false;
            bubbleOption = "None";
        }
        shakeMap = true;
        shakeOption = "Population";
    }
    colorMomentum = (!prevColor && colorMap) ? true : false;
    updateMap();
})
d3.select("#unemploymentRep").on("change", function(d) {
    const sel = d3.select("#unemployment option:checked").text()
    var prevColor = colorMap;
    var prevBubble = bubbleMap;
    if(sel === "None")
    {        
        if(colorOption === "UnemploymentRate")
        {
            colorMap = false;
            colorOption = sel;
        }
        if(bubbleOption === "UnemploymentRate")
        {
            bubbleMap = false;
            bubbleOption = sel;
        }
        if(shakeOption === "UnemploymentRate")
        {
            shakeOption = sel;
        }
        shakeMap = false;
    }    
    else if(sel === "Color Map")
    {
        if(bubbleOption === "UnemploymentRate")
        {
            bubbleMap = false;
            bubbleOption = "None";
        }
        if(shakeOption === "UnemploymentRate")
        {
            shakeMap = false;
            shakeOption = "None";
        }
        if(colorOption !== "UnemploymentRate")
        {
            prevColor = false;
        }
        colorMap = true;
        colorOption = "UnemploymentRate";
    }
    else if(sel === "Bubble Map")
    {
        if(colorOption === "UnemploymentRate")
        {
            colorMap = false;
            colorOption = "None";
        }
        if(shakeOption === "UnemploymentRate")
        {
            shakeOption = "None";
        }
        shakeMap = false;
        bubbleMap = true;
        bubbleOption = "UnemploymentRate";
    }
    else if(sel === "Shake Bubbles")
    {
        if(colorOption === "UnemploymentRate")
        {
            colorMap = false;
            colorOption = "None";
        }
        if(bubbleOption === "UnemploymentRate")
        {
            bubbleMap = false;
            bubbleOption = "None";
        }
        shakeMap = true;
        shakeOption = "UnemploymentRate";
    }
    colorMomentum = (!prevColor && colorMap) ? true : false;
    updateMap();
})
d3.select("#button").on("click", function(d) {
    if(bubbleMap || shakeMap)
        ShakeBubbles();
    else
        console.log("NO BUBBLES TO SHAKE");
})
