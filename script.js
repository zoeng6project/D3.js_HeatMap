let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
let req = new XMLHttpRequest()
let value = []
let data

let yScale
let xScale
let xAxisScale
let yAxisScale
const formatMonth = d3.utcFormat("%B");

let width = 1200
let height = 600
let padding = 60
let tooltip = d3.select('#tooltip')


let svg = d3.select('svg')
let drawCanvas =() => {
    svg.attr('width',width)
    svg.attr('height',height)
}

let generateScales = () => {

    minYear = d3.min(value, (d) => {return d.year})
    maxYear = d3.max(value, (d) => {return d.year})

    xScale = d3.scaleLinear()
    .domain([minYear, maxYear+1 ])
    .range([padding, width - padding]);


    yScale = d3.scaleTime()
    .domain([new Date(0,0,0,0,0,0,0), new Date(0,12,0,0,0,0.0)])
    .range([ padding, height - padding]);


}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    svg.append('g')
        .call(xAxis) 
        .attr('id','x-axis')
        .attr('transform','translate(0,' + (height-padding) + ')')

    let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'))
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)
        .attr('id','y-axis')
    

}

let drawRect = () => {
    svg.selectAll('rect')
    .data(value)
    .enter()
    .append('rect')
    .attr('class','cell')
    .attr('fill', (d) => {
        variance = d['variance'] 
        if (variance <= -1){
            return 'Blue'
        } else if (variance <= 0){
            return 'yellow'
        } else if (variance <= 1){
            return 'orange'
        } else {return 'red'}
    })
    .attr('data-year' , (d) => {
        return d.year
    })
    .attr('data-month' , (d) => {
        return (d.month)-1
    })
    .attr('data-temp' , (d) => {
        return 8.66 + d.variance
    })
    .attr('height', (height - (2*padding))/12)
    .attr('y', (d) => {
        return yScale(new Date(0, d.month -1,0,0,0,0,0))
    })
    .attr('width', (d)=> {
        let numberOfYears = maxYear - minYear
        return (width - (2 * padding))/ numberOfYears
    })
    .attr('x' , (d) => {
        return xScale(d.year)
    })

    .on ('mouseover',(d)=>{
        tooltip.transition()
                .style('visibility', 'visible')
                .text("Year: "+ d.year + " | Var:  " + d.variance + " | Temp: " + (8.66+ d.variance)  )
                .attr('data-year',d.year)

    })

    .on ('mouseout', (d) => {
        tooltip.transition()
        .style('visibility', 'hidden')
    })

}


req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    value = data.monthlyVariance
    console.log(value)
    drawCanvas()
    generateScales()
    generateAxes()
    drawRect()
    
}
req.send()