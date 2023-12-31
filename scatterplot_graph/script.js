(async function () {
  const res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
  const data = await res.json();
      
  data.forEach(d => {
    d.Place = +d.Place;
    d.Time = new Date(1970, 0, 0, 0, 0, d.Seconds);
  })
  
  const paddingBlock = 40;
  const paddingInline = 40;
  
  const w = 900 - (paddingInline * 2);
  const h = 600 - (paddingBlock * 2);
  
  const timeFormat = d3.timeFormat("%M:%S");

  const colorRange = d3.scaleOrdinal(d3.schemePaired);

  const title = d3
    .select("body")
    .append("h1")
    .text("Doping in Professional Bicycle Racing")
    .attr("id", "title")
    .append("p")
    .attr("x", w / 2)
    .attr("y", 0 - paddingBlock)
    .style("font-size", ".75em")
    .text("35 Fastest times up Alpe d'Huez");

  const svg = d3
    .select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", w + (paddingInline * 2))
    .attr("height", h + (paddingBlock * 2))
    .attr("class", "graph")
    .append("g")
    .attr("transform", `translate(${paddingInline}, ${paddingBlock})`);
  
  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", "0")

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d =>d.Year - 1), d3.max(data, d => d.Year + 1)])
    .range([0, w])

  const xAxisGenerator = d3
    .axisBottom(xScale)
    .tickFormat(
      d3.format("d"));

  const yScale = d3
    .scaleUtc()
    .domain(d3.extent(data, d => d.Time))
    .range([0, h]);

  const yAxisGenerator = d3.axisLeft(yScale).tickFormat(timeFormat);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${h})`)
    .attr("id", "x-axis")
    .attr("class", "x-axis")
    .call(xAxisGenerator)
    .append("text")
    .attr("class", "x-labels")
    .text("Year")

  const yAxis = svg
    .append("g")
    .attr("id", "y-axis")
    .attr("class", "y-axis")
    .call(yAxisGenerator)
    .append("text")
    .attr("class", "y-labels")
    .text("Minutes")

  const spots = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Time))
    .attr("r", 5)
    .style("fill", "blue")
    .attr("class", "dot")
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Time.toISOString())
    .style("fill", d => colorRange(d.Doping != ""))
    .on("mouseover", (e,d) => {
      tooltip
        .style("opacity", "0.9")
        .attr("data-year", d.Year)
        .html(`
          ${d.Name}:${d.Nationality}
          <br/>
          Year: ${d.Year}, Time: ${timeFormat(d.Time)}
          ${d.Doping ? ("<br/><br/>" + d.Doping) : ""}
        `)
        .style("left", e.pageX + "px")
        .style("top", e.pageY - 30 + "px");
      })
    .on("mouseout", () =>
      tooltip
        .style("opacity", "0"))

  const legendBox = svg
    .append("g")
    .attr("id", "legend")

  const legendWrapper = legendBox
    .selectAll("#legend")
    .data(colorRange.domain())
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", (d, i) => `translate(0,${h/2 + i * 40})`)

  const legend = legendWrapper
    .append("rect")
    .attr("x", w - 20)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", colorRange)

  const legendText = legendWrapper
    .append("text")
    .attr("x", w - 30)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text(d => d? "Riders with doping allegations" : "No doping allegations")
})()
