const fetchData = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  );
  const { data } = await res.json();
  const getQuarter = await data.map(d => {
    let month = d[0].substring(5,7);
    let quarter = "";
    switch(month) {
      case "01":
        quarter = "Q1";
        break;
      case "04":
        quarter = "Q2";
        break;
      case "07":
        quarter = "Q3";
        break;
      case "10":
        quarter = "Q4";
        break;
    }
    return d[0].substring(0,4) + " " + quarter;
  })

  const getYearDate = await data.map(d => new Date(d[0]));

  const minYear = new Date(d3.min(getYearDate));
  const maxYear = new Date(d3.max(getYearDate));

  maxYear.setMonth(maxYear.getMonth() + 3);

  const padding = 40;
  const w = 900;
  const h = 600;
  const barWidth = w / data.length;
  
  const title = d3
    .select("body")
    .append("g")
    .attr("id", "title")
    .append("h1")
    .text("United States GDP")
    .append("p")
    .text("From 1947 to 2015")
    .style("font-size", ".75em")

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", "0")

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w + padding * 2)
    .attr("height", h + padding * 2)

  const xScale = d3
    .scaleUtc()
    .domain([minYear, maxYear])
    .range([0, w])

  const xAxisGenerator = d3
    .axisBottom()
    .scale(xScale);

  const xAxis = svg
    .append("g")
    .call(xAxisGenerator)
    .attr("transform", `translate(${padding},${h})`)
    .attr("id", "x-axis")
    .attr("class", "tick");

  
  const getGDP = await data.map(d => d[1]);

  const gdpScale = d3
    .scaleLinear()
    .domain([0, d3.max(getGDP)])
    .range([0, h]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(getGDP)])
    .range([h, 0]);
  
  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale);

  const yAxis = svg
    .append("g")
    .call(yAxisGenerator)
    .attr("transform", `translate(${padding},0)`)
    .attr("id", "y-axis")
    .attr("class", "tick");
  
  const bars = svg
    .selectAll("rect")
    .data(getGDP.map(gdp => gdpScale(gdp)))
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", "royalblue")
    .attr("x", (d, i) => padding + xScale(getYearDate[i]))
    .attr("y", (d) => h - d)
    .attr("width", barWidth)
    .attr("height", (d) => d)
    .attr("data-date", (d, i) => data[i][0])
    .attr("data-gdp", (d, i) => getGDP[i])
    .attr("data-index", (d,i) => i)
    .on("mouseover", (e,d) => {
      const i = e.target.dataset.index;

      tooltip
        .transition()
        .duration(300)
        .style("opacity", "1")

        tooltip
        .attr("data-date", data[i][0])
        .html(`${getQuarter[i]}<br>${getGDP[i]}`)            
        .style("left", e.pageX + "px")
        .style("top", e.pageY + "px")
    })
    .on("mouseout", () => tooltip
      .style("opacity", "0"))
};

  fetchData();