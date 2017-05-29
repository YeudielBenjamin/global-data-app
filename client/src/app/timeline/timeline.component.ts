import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  public timelineSvg;
  public timeline;
  public timelineWidth = 550;
  public timelineHeight = 180;
  public timelineMargins = {left:40,top:10,bottom:5,right:80};
  public yearsDomain = [1970, 2012];
  public yearScale;
  public yearAxis;
  public timelineAxisGroup;

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

    this.yearScale = d3.scalePow()
      .domain(this.yearsDomain);

    this.yearScale = d3.scaleLinear().range([0, this.timelineWidth]);
    this.yearScale.domain(this.yearsDomain);

    this.yearAxis = d3.axisBottom(this.yearScale)
      .ticks(this.timelineWidth / 70) // Algo tiene que ver con los números de abajo :v
      .tickSize(10/*, 5, this.timelineHeight*/) // Tamaño de la línea ↨
      //.tickSubdivide(4)
      .tickPadding(5); // De la línea al número ↨

    this.timelineAxisGroup.call(this.yearAxis);

  }

}
