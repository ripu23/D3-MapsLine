(function() {
  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  };
  const height = 500 - margin.top - margin.bottom;
  const width = 730 - margin.right - margin.left;


  d3.queue()
    .defer(d3.json, "../Lib/countries.json")
    .defer(d3.csv, "../Lib/pip.csv")
    .await(visualize);

  function visualize(err, data, population) {
    if (err) throw err;
    let keyedPopulation = _.keyBy(population, "Country Name");


    let svg = d3.select("#figure1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .call(d3.zoom().on("zoom", function() {
        svg.attr("transform", d3.event.transform)
      }))
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append('text')
      .attr('x', margin.left - 47)
      .attr('y', height + 10)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .text('Figure - 1');
    const countries = topojson.feature(data, data.objects.countries).features;
    const projection = d3.geoMercator().translate([width / 2, height / 2]).scale(125);
    const path = d3.geoPath().projection(projection);
    const colorScale = d3.scaleLinear().domain([4279, 303216039]).range([0, 1]);
    const zColor = d3.scaleSequential(d3.interpolateReds);
    const description = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("background-color", "rgba(0, 0, 0, 0.75)")
      .style("border-radius", "6px")
      .style("font", "12px sans-serif")
      .text("tooltip");


    // console.log(keyedPopulation["Aruba"]);
    // console.log(population);

    let legend = svg.selectAll(".legend")
      .data(zColor.ticks(6).slice(1).reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(" + (-10) + "," + (290 + i * 20) + ")";
      });

    legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", zColor);
    legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);


    svg.selectAll(".country")
      .data(countries)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        return fillColor(d);
      })
      .on("mouseover", function(d) {
        description.html(makeTipText(d, keyedPopulation));
        description.style("visibility", "visible");
      })
      .on("mouseout", function(d) {
        // d3.select(this).classed("overme", false);
        return description.style("visibility", "hidden");
      })
      .on("mousemove", function() {
        return description.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
      })
      .on("click", function(d) {
        console.log(d);
        drillDown(d, keyedPopulation);
      });

    function fillColor(data) {
      if (keyedPopulation[data.properties.name] != null) {
        return d3.interpolateReds(colorScale(parseInt(Object.values(keyedPopulation[data.properties.name])[0])));
      } else {
        return "#fbf4ee"
      }
    }
  }


  function makeTipText(data, keyedPopulation) {
    return "<strong>" + data.properties.name + "</strong> <br/><strong>Population: </strong>" +
      Object.values(keyedPopulation[data.properties.name])[30] / 100000 + "<small>M</small>";
  }

  function drillDown(data, population) {
    d3.select('#figure2').html('');
    let div = document.getElementById('desc');
    div.style.display = "block";
    const selectedCountry = population[data.properties.name];
    const description = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .style("padding", "8px")
      .style("background-color", "rgba(0, 0, 0, 0.75)")
      .style("border-radius", "6px")
      .style("font", "12px sans-serif")
      .text("tooltip");

    let countryObject = _.map(selectedCountry, function(val, key) {
      return {
        year: key,
        pop: parseInt(val)
      }
    });

    countryObject = _.slice(countryObject, 35, 58);
    const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.2);
    const yScale = d3.scaleLinear().range([height, 0]);


    xScale.domain(countryObject.map(function(d) {
      if (parseInt(d.year) != NaN) {
        return d.year;
      }
    }));
    yScale.domain(d3.extent(countryObject, function(d) {
      return d.pop;
    }));

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale);
    const line = d3.line()
      .x(function(d) {
        return xScale(d.year)
      })
      .y(function(d) {
        return yScale(d.pop)
      });
    let svg = d3.select('#figure2').append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + 80 + "," + margin.top + ")");
    svg.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis);
    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    svg.append("path").attr("class", "line").datum(countryObject).attr("d", line);
    svg.append('text')
      .attr('x', 330)
      .attr('y', 5)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .text('Population curve for ' + data.properties.name);
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .text('Figure - 2');


  }



})();
