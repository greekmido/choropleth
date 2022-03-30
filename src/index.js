import './index.css';
import * as d3 from 'd3'
import {feature,mesh} from 'topojson'
// defining variables to use 

const height = 600;
const width = 950;
const svg = d3.select("body").append("svg").attr("width",width).attr("height",height)


Promise.all([d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"),
             d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")])
            .then((data)=>{onReady(data[0],data[1])}).catch((err)=>console.error(err));

function onReady(data0,data1){
                
    let counties = feature(data0,data0.objects.counties).features;
                
    const colrScale = d3.scaleSequential().domain([d3.min(data1,(d)=>d.bachelorsOrHigher-20),d3.max(data1,(d)=>d.bachelorsOrHigher)]).interpolator(d3.interpolateGreens)
    const scaleAxis = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);
    const xAxis= d3.axisBottom(scaleAxis).tickSize(21).tickSizeOuter(0).tickFormat((d,i)=>`${d}%`);
    svg.selectAll("rect").data(d3.range(2.6,75.1,1)).enter().append("rect")
    .attr("fill",(d)=>colrScale(d)).attr("width","4").attr("height","20").attr("x",(d)=>scaleAxis(d));
    svg.call(xAxis)
    //drawing the states borders 
      svg.append("path").datum(mesh(data0,data0.objects.states,(a,b)=>a!==b))
      .attr("fill","transparent")
      .attr("stroke-width","0.5")
      .attr("stroke", "white")
      .attr("d", d3.geoPath());
    //drawing the whole country border
      svg.append("path").datum(mesh(data0,data0.objects.nation,(a,b)=>a===b))
      .attr("fill","transparent")
      .attr("stroke","black")
      .attr("stroke-width","0.3")
      .attr("d",d3.geoPath());
     //drawing the counties borders
     svg.append("g").selectAll("path")
     .data(counties)
     .enter().append("path")
     .attr("d", d3.geoPath())
     .attr("fill","transparent")
     .attr("class","county")
     .attr("stroke","wheat")
     .attr("stroke-width","0.2")
     .attr("id",(d)=>{return `id${d.id}`})
     .on("mouseover",(e)=>{
         const targetE = data1.filter((el)=>"id"+el.fips==e.target.id)[0];
         d3.select(".tooltip").style("left",()=>`${e.pageX-70}px`).style("top",()=>`${e.pageY-80}px`)
         .html(`${targetE.area_name}  ${targetE.state}<br>bachelors or higher:<br><span>${targetE.bachelorsOrHigher}%</span>`)
         .transition().duration(210).style("opacity","0.9")
     })
     .on("mouseout",(e)=>{
         d3.select(".tooltip").transition().duration(200).style("opacity","0")
     })
      //coloring the map with the data
      data1.forEach(element => {
          d3.select(`#id${element.fips}`).attr("fill",()=>{
              return colrScale(element.bachelorsOrHigher)
          });
      });
}




if(module.hot){
    module.hot.accept();
}
