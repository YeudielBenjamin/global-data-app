import { Component, OnInit } from '@angular/core';
import { Injectable } from "@angular/core";
import { Country } from "../models/country";
import * as d3 from 'd3';

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.css']
})
@Injectable()
export class WorldmapComponent implements OnInit {

    public svg;
    public width;
    public height;
    public background;
    public projection;
    public path;
    public landColor = "#666666";
    public country: Country[] = [];

  constructor() {
    this.height = (window.screen.height - 310) + "px";
    this.width = (window.screen.width - 400) + "px";
  }

  public ngOnInit() {}

  public ngAfterViewInit() {
    this.initChartSvg();
      
    d3.json("assets/data/world-countries.json", (error, world: any) =>{

      if (error) throw error;

      this.svg.append("g")
        .attr("class", "map")
        .selectAll("path")
          .data(world.features)
          .enter().append("path")
          .attr("class", "land")
          .attr("fill", this.landColor)
          .attr("data-code", function(d:any) { return d.id; })
          .on("click", (d:any) => {
              console.log("Country: " + this.country);
              console.log("Background: " + this.background);
              if (this.country != []){
                  
                  $("#worldData").append( this.country[0]._id + ", " +
                                        this.country[0].fruits + ", " +
                                        this.country[0].increasePercentage);
              }
              let code = d.id;
              console.log(code);
            }) 
          .on("mouseover", function( d /*element, index, path*/) {
              let coordinates = [0,0];
              coordinates = d3.mouse(this);  
              d3.select(this).attr("class", "land selected");
              
              let tooltip = $("#tooltip"), x = (coordinates[0] + 170), y = (coordinates[1] - 40);
              /*if (this.country != null){
                this.country.
              }*/
              tooltip.html(d.id);
              tooltip.css("left", x + "px")
                .css("top", y + "px")
                .css("display", "block");
          })
          .on("mouseout", function(d:any) { 
              d3.select(this).attr("class", "land");
              $("#tooltip")
                .text("")
                .css("display", "none");
          });

          this.updateMap();
        
      });


  }

  public initChartSvg(){
    this.svg = d3.select("#chart").append("svg");

    this.background = this.svg.append("rect")
      .attr("fill", "#111")
      .attr("id", "svgFill");

    this.projection = d3.geoProjection(function(x, y) {return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))]});

    this.path = d3.geoPath().projection(this.projection);

    this.initSizes();
  }

  public initSizes(){
    this.background
      .attr("width", this.width)
      .attr("height", this.height);
    //this.projection.translate([this.width/2.3,this.height/2]);
    this.svg
      .attr("width", this.width)
      .attr("height", this.height);
  }

  public updateMap(){
    this.svg.selectAll("g.map path")
            .attr("d", this.path);
  }

  public changeProjection(projection){
    console.log(projection);
      
    switch (projection.trim()) {
        case "mercator":
            //this.projection = d3.geoMercator();
            this.projection = d3.geoProjection(function(x, y) {return [x, Math.log(Math.tan(Math.PI / 4 + y / 2))]});
            break;
        case "azimuthal":
            this.projection = d3.geoAzimuthalEqualArea();
            break;
        case "azimuthalEquidistant":
            this.projection = d3.geoAzimuthalEquidistant();
            break;
        case "gnomonic":
            this.projection = d3.geoGnomonic();
            break;
        case "orthographic":
            this.projection = d3.geoOrthographic();
            break;
        case "stereographic":
            this.projection = d3.geoStereographic();
            break;
        case "conicConformal":
            this.projection = d3.geoConicConformal();
            break;
        case "equalAreaConic":
            this.projection = d3.geoConicEqualArea();
            break;
        case "conicEquidistant":
            this.projection = d3.geoConicEquidistant();
            break;
        case "equirectangular":
            this.projection = d3.geoEquirectangular();
            break;
        case "transverseSphericalMercator":
            this.projection = d3.geoTransverseMercator();
            break;
        default:
            break;
        }

    this.path = d3.geoPath().projection(this.projection);
    this.updateMap();
  }

    public addCountryData(data: any){
        this.country.push(new Country(data.country, "", data.fruits, data.percentagesIncrease));
        let str = "";
        data.fruits.forEach((element, index) => {
            str+= "Se estima que la fruta " + element + " incrementará su producción en un " + data.percentagesIncrease[index] + "% su producción por año.<br>";
        });
        console.log(str);
        let modal:any = $("#myModal");
        $("#results").html(str);
        modal.modal();
    }
}
