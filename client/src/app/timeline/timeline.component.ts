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

  }

}
