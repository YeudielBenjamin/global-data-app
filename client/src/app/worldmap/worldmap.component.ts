import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.css']
})
export class WorldmapComponent implements OnInit {

  public svg: d3.Selection<any, any, any, any>;

  constructor() {
    
    this.svg = d3.select("#worldMapSvg");
    this.svg = this.svg.append("g").attr("class", "hello");
   }

  ngOnInit() {

  }

}
