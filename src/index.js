import './index.css';
import * as d3 from 'd3'
import {feature,mesh} from 'topojson'
import { interpolateReds } from 'd3';
// defining variables to use 
const margin = {"top":30,"bottom":30,"left":50,"right":50}
const height = 600;
const width = 950;
const svg = d3.select("body").append("svg").attr("width",width).attr("height",height)


Promise.all([d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"),
             d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")])
            .then((data)=>{onReady(data[0],data[1])}).catch((err)=>console.error(err))

function onReady(data0,data1){

    let counties = feature(data0,data0.objects.counties).features;
    
   
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
         console.log(e)
         d3.select(".tooltip").style("left",()=>`${e.pageX-30}px`).style("top",()=>`${e.pageY-35}px`)
         .html(`county:${data1.filter((el)=>"id"+el.fips==e.target.id)[0].area_name}`)
         .transition().duration(210).style("opacity","0.9")
     });
      //coloring the map with the data
      const colrScale = d3.scaleSequential().domain([d3.min(data1,(d)=>d.bachelorsOrHigher-20),d3.max(data1,(d)=>d.bachelorsOrHigher)]).interpolator(d3.interpolateGreens)
      data1.forEach(element => {
          d3.select(`#id${element.fips}`).attr("fill",()=>{
              return colrScale(element.bachelorsOrHigher)
          });
      });
}


//complete tooltip


if(module.hot){
    module.hot.accept();
}
