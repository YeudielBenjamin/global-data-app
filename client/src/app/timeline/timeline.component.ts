import { Component, OnInit } from '@angular/core';
import { Injectable } from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
@Injectable()
export class TimelineComponent implements OnInit {

  public timelineSvg;
  public timeline;
  public timelineWidth = 550;
  public timelineHeight = 180;
  public timelineMargins = {left:40,top:10,bottom:5,right:80};
  public yearsDomain = [1980, 2014];
  public yearScale;
  public yearAxis;
  public timelineAxisGroup;

  public past;
  public rangesFirstYear;
  public rangesLastYear;
  public productionsPerYear; 

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initTimelineSvg();
  }

  public initTimelineSvg(){
    this.timelineSvg = d3.select("#timeline").append("svg")
        .attr("width", this.timelineWidth + this.timelineMargins.left + this.timelineMargins.right);

    this.timeline = this.timelineSvg.append("g")
        .attr("class", "chart")
        .attr("transform","translate("+this.timelineMargins.left+","+this.timelineMargins.top+")");

    $("#timeline svg").attr("height", (this.timelineHeight + this.timelineMargins.top + this.timelineMargins.bottom));

    this.timelineAxisGroup = this.timeline.append("g")
      .attr("class", "timeAxis")
      .attr("transform", "translate(0,"+(this.timelineHeight - 30)+")");

    this.renderTimeline();
  }

  public renderTimeline(){
    this.yearScale = d3.scaleLinear().range([0, this.timelineWidth]);
    this.yearScale.domain(this.yearsDomain);

    this.yearAxis = d3.axisBottom(this.yearScale)
      .ticks(this.timelineWidth / 70) // Algo tiene que ver con los números de abajo :v
      .tickSize(10) // Tamaño de la línea ↨
      .tickPadding(5); // De la línea al número ↨

    this.timelineAxisGroup.call(this.yearAxis);
  }

  public updateTimeline(data: any){
    
    var x = d3.scaleTime().range([0, this.timelineWidth]);
    var y = d3.scaleLinear().range([this.timelineHeight, 0]);
    var valueline = d3.line()
      .x(function(d:any) { return x(d.year); })
      .y(function(d:any) { return y(d.production); });

    //x.domain([1980, 2014]/*d3.extent(data, function(d) { return d.date; })*/);
    //y.domain([0, /*d3.max(data, function(d) { return d.close; })*/ 23046800]);

    this.yearsDomain = [data.minYear, 2014];

    //this.renderTimeline();

    x.domain([data.minYear, 2014]);
    y.domain([data.minValue, data.maxValue]);

    console.log(data);

    this.past = -1;
    this.rangesFirstYear = [];
    this.rangesLastYear = [];
    this.productionsPerYear = [];
     
    data.firstAndLastYears.forEach((element, index) => {
      console.log(element);
      let years = element.lastYear - element.firstYear;
      console.log("Years: " + years);
      //let d = data.productions.slice(past, years+past);
      this.past = this.past+1;
      this.rangesFirstYear[index] = this.past;
      this.past = this.past + years;
      this.rangesLastYear[index] = this.past;
      this.productionsPerYear[index] = (data.productions).slice(this.rangesFirstYear[index], this.rangesLastYear[index]);
      d3.select("#timeline > svg").append("path")
        .data([this.productionsPerYear[index]])
        .attr("class", "line")
        .attr("d", valueline)
        .attr("stroke", "#2c97df")
        .attr("fill", "none");
    });
    console.log(this.rangesFirstYear);
    console.log(this.rangesLastYear);
    console.log(data.productions);
    
    
  }

}
