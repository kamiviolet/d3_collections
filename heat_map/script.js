d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then(data => {
  const { baseTemperature, monthlyVariance } = data;
  
  const startYear = monthlyVariance[0].year
  const endYear = monthlyVariance[monthlyVariance.length - 1].year

  monthlyVariance.forEach(i => i.month -= 1);

  const padding = 80;
  const w = Math.ceil(monthlyVariance.length / 12) * 5 - (padding * 2);
  const h = (12 * 50) - (padding * 2);

  const header = d3
    .select("body")
    .style("font-family", "sans-serif")
    .append("header")
    .append("h1")
    .text("Monthly Global Land-Surface Temperature")
    .attr("id", "title")
    .style("text-align", "center")
  
  const subtitle = header
    .append("p")
    .text(`${startYear} - ${endYear}: base temperature: ${baseTemperature} `)
    .attr("id", "description")
    .style("font-size", ".75em")
    .style("font-weight", "400")

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w + (padding * 2))
    .attr("height", h + (padding * 2))
    .append("g")
    .attr("transform", `translate(${padding}, ${padding})`)

  const xScale = d3
    .scaleBand()
    .domain(monthlyVariance.map(d=>d.year))
    .range([0, w])

  const xAxisGenerator = d3
    .axisBottom()
    .scale(xScale)
    .tickValues(xScale.domain().filter(y => y % 10 == 0))
    .tickFormat(d3.format("d"))

  const xAxis = svg
    .append("g")
    .call(xAxisGenerator)
    .attr("transform", `translate(0, ${h})`)
    .attr("id", "x-axis")

  const yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([0, h]);

  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale)
    .tickValues(yScale.domain())
    .tickFormat(m => {
      let date = new Date().setUTCMonth(m);
      let format = d3.utcFormat("%B")
      return format(date)
    })
    .tickSize(20,1)
  
  const yAxis = svg
    .append("g")
    .attr("id", "y-axis")
    .attr("class", "y-axis")
    .call(yAxisGenerator)
    .attr("transform", "translate(0, 0)")
    .selectAll("text")
    .attr("class", "month")

  var listOfVariance = monthlyVariance.map((val) => val.variance);
  var minTemp = baseTemperature + Math.min(...listOfVariance);
  var maxTemp = baseTemperature + Math.max(...listOfVariance);

})
.catch(err => console.log(err))