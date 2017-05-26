import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.css']
})
export class WorldmapComponent implements OnInit {

  public svg;
    public width;
    public height;
    public background;
    public projection;
    public path;
    public rscale;
    public graticule;
    public world;
    public landColor = "#666666";
    public selectedCountry;
    public timelineMargins = {left:40,top:10,bottom:5,right:80};
    public timelineWidth = 550;
    public timelineHeight = 180;
    public timelineSvg;
    public timeline;
    public tseriesLine;
    public yearScale;
    public remittanceYearsDomain = [1970, 2012];
    public remittanceYears = [
                1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,
                1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,
                1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,
                2003,2004,2005,2006,2007,2008,
                2009,2010,2011,2012
              ];  // year 2012 is an estimation
    public tseriesScale;
    public tseries;
    public highlightedCountry;
    public selectCountry;

  constructor() {
    this.height = (window.screen.height - 310) + "px";
    this.width = (window.screen.width - 400) + "px";
  }

  public ngOnInit() {}

  public ngAfterViewInit() {
    this.initChartSvg();
    this.initTimeLine();

    //this.initTimeSeries("aid");
    //this.initTimeSeries("remittances");

    //this.updateTimeSeries();
      
    d3.json("assets/data/world-countries.json", (error, world: any) =>{

      if (error) throw error;

      //var fitMapProjection = function() {
        //this.fitProjection(this.projection, world, [[leftMargin, 60], [this.width - 20, this.height-120]], true);
      //};

      //fitMapProjection();

      this.svg.append("g")
        .attr("class", "map")
        .selectAll("path")
          .data(world.features)
          .enter().append("path")
          .attr("class", "land")
          .attr("fill", this.landColor)
          .attr("data-code", function(d:any) { return d.id; })
          .on("click", function(d:any) {
              let code = d.id;
              if (this.selectedCountry === code) {
                this.selectedCountry = null;
              } else {
                this.selectedCountry = code;
              }
              console.log(code); 
            })
          .on("mouseover", function( d /*element, index, path*/) {
              let coordinates = [0,0];
              coordinates = d3.mouse(this);  
              d3.select(this).attr("class", "land selected");
              
              let tt = $("#tooltip"), x = (coordinates[0] + 170), y = (coordinates[1] - 40);
              tt.html(d.id);
              tt.css("left", x + "px")
                .css("top", y + "px")
                .css("display", "block");
          })
          .on("mouseout", function(d:any) { 
              d3.select(this).attr("class", "land");
              $("#tooltip")
                .text("")
                .css("display", "none");
          });

        this.svg.selectAll("g.map path")
            .attr("d", this.path);
      });

    //this.updateMap();

  }

  public initChartSvg(){
    this.svg = d3.select("#chart").append("svg");

    this.background = this.svg.append("rect")
      .attr("fill", "#111")
      .attr("id", "svgFill");

    this.projection = d3.geoProjection(function(x, y) {return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))]});

    this.path = d3.geoPath()
        .projection(this.projection);

    this.rscale = d3.scaleSqrt();

    this.initSizes();
  }

  public initTimeLine(){
    this.timelineSvg = d3.select("#timeline").append("svg")
        .attr("width", this.timelineWidth + this.timelineMargins.left + this.timelineMargins.right);

    this.timeline = this.timelineSvg.append("g")
        .attr("class", "chart")
        .attr("transform","translate("+this.timelineMargins.left+","+this.timelineMargins.top+")");

    $("#timeline svg").attr("height", (this.timelineHeight + this.timelineMargins.top + this.timelineMargins.bottom));
  
    this.tseriesLine = d3.line()
      //.interpolate("monotone")
      .defined(function(d:any) {
        return !isNaN(d.value)});

    this.yearScale = d3.scaleLinear()
      .domain(this.remittanceYearsDomain);

    this.tseriesScale = d3.scaleLinear()
      .range([this.timelineHeight, 2]);

      

  }

  public fitProjection(projection, data, box, center) {
    // get the bounding box for the data - might be more efficient approaches
    var left = Infinity,
        bottom = -Infinity,
        right = -Infinity,
        top = Infinity;
      // reset projection
      projection
          .scale(1)
          .translate([0, 0]);
      data.features.forEach(function(feature) {
          d3.geoBounds(feature).forEach(function(coords) {
              coords = projection(coords);
              var x = coords[0],
                  y = coords[1];
              if (x < left) left = x;
              if (x > right) right = x;
              if (y > bottom) bottom = y;
              if (y < top) top = y;
          });
      });
      // project the bounding box, find aspect ratio
      function width(bb) {
          return (bb[1][0] - bb[0][0])
      }
      function height(bb) {
          return (bb[1][1] - bb[0][1]);
      }
      function aspect(bb) {
          return width(bb) / height(bb);
      }
      var startbox = [[left, top],  [right, bottom]],
          a1 = aspect(startbox),
          a2 = aspect(box),
          widthDetermined = a1 > a2,
          scale = widthDetermined ?
              // scale determined by width
              width(box) / width(startbox) :
              // scale determined by height
              height(box) / height(startbox),
          // set x translation
          transX = box[0][0] - startbox[0][0] * scale,
          // set y translation
          transY = box[0][1] - startbox[0][1] * scale;
          //console.log(startbox);
      // center if requested
      if (center) {
          if (widthDetermined) {
              transY = transY - (transY + startbox[1][1] * scale - box[1][1])/2;
          } else {
              transX = transX - (transX + startbox[1][0] * scale - box[1][0])/2;
          }
      }
      return projection.scale(scale).translate([transX, transY])
  }

  /*public selectCountry(code, dontUnselect) {
    if (this.selectedCountry === code) {
      if (dontUnselect) return;
      this.selectedCountry = null;
    } else {
      this.selectedCountry = code;
    }
    console.log(code);
  }*/

  public highlightCountry(code) {
    this.highlightedCountry = code;
    this.svg.selectAll("path.land")
      .sort(function(a, b) {
        if (a.id === this.selectedCountry) return 1;
        if (b.id === this.selectedCountry) return -1;
        if (a.id === code) return 1;
        if (b.id === code) return -1;
        return 0;
      });
  }

  public initSizes(){
    this.background
      .attr("width", this.width)
      .attr("height", this.height);
    //this.projection.translate([this.width/2.3,this.height/2]);
    this.svg
      .attr("width", this.width)
      .attr("height", this.height);
    this.rscale.range([0, this.height/45]);
  }

  public initTimeSeries(name){
    this.tseries = this.timeline.select("g.tseries");
    if (this.tseries.empty()) {
      this.tseries = this.timeline.append("g")
        .attr("class", "tseries");
    }

    this.path = this.tseries.select("path." + name);
    if (this.path.empty) {
      this.tseriesLine
        .x(function(d) { return this.yearScale(d.year); })
        .y(function(d) { return this.tseriesScale(d.value); });

      this.tseries.append("path")
        .attr("class", name)
        .attr("fill", "none");
    }
  }

  public updateTimeSeries(){
    
    this.renderTimeSeries("aid", {});
   
    this.renderTimeSeries("remittances", {});
  }

  public renderTimeSeries(name, data){
    this.tseries = this.timeline.select("g.tseries");
    this.path = this.tseries.select("path." + name);

    if (data == null) data = {};
    var years = this.remittanceYears; // d3.keys(data).sort();



    this.tseries.datum(years.map(function(y) { return { year:y,  value: data[y] }; }), years)
      .select("path." + name)
        .attr("d", function(d) {
          var line = this.tseriesLine(d);
          if (line == null) line = "M0,0";
          return line;
        });
  }

  public updateMap(){
    this.svg.selectAll("g.map path")
            .attr("d", this.path);
  }

  

}
