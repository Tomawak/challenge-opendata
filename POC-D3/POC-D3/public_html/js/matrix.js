

var nombreDeVote = 100;
var margin = {top: 80, right: 0, bottom: 10, left: 80},
  width = 720,
  height = 720;
var chrono = Date.now();

var x = d3.scale.ordinal().rangeBands([0, width]),
    z = d3.scale.linear().domain([0, nombreDeVote]).clamp(true),
    c = d3.scale.category10().domain(d3.range(10));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //permet la translation

d3.xhr("http://localhost:3000/server/public/similarity.json").get( function(err,rep) {
    if ( err ) alert('error');
    var deputes = JSON.parse(rep.response);
    console.log("1 "+(Date.now()-chrono));
    chrono=Date.now();
 // d3.json("deputeExemple.json", function(error, deputes) {
  var matrix = [],
      nodes = deputes.depute,
      n = nodes.length;
      
     
    for (i = 0; i < n; i++) { 
         for (j = i+1; j < n; j++) { 
                deputes.links.push({ "source":i,
                    "target":j,
                    "value":Math.floor(Math.random()*100)});
        }
    }
    
    console.log("2 "+(Date.now()-chrono));
    chrono=Date.now();  
      
  // Compute index per node.
  nodes.forEach(function(node, i) {
      
    node.index = i;
    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; }); //pour chaque element
      
  });
  console.log("2.1 "+(Date.now()-chrono));
  chrono=Date.now();

  // Convert links to matrix; count character occurrences.
  deputes.links.forEach(function(link) {
    matrix[link.source][link.target].z += link.value;
    matrix[link.target][link.source].z += link.value;
    matrix[link.source][link.source].z = nombreDeVote;
    matrix[link.target][link.target].z = nombreDeVote;
  });
  console.log("2.2 "+(Date.now()-chrono));
  chrono=Date.now();

  // Precompute the orders.
  var orders = {
    name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
    parti: d3.range(n).sort(function(a, b) { return nodes[b].parti - nodes[a].parti; })
  };

  // The default sort order.
  x.domain(orders.parti);
  
  console.log("2.3 "+(Date.now()-chrono));
chrono=Date.now();
  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .style("stroke","black");

  var row = svg.selectAll(".row")
      .data(matrix)
      .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; }) //permet la translation des lignes
      .each(row);
      
      
    console.log("3   "+(Date.now()-chrono));
    chrono=Date.now();

  //row.append("line")
 //     .attr("x2", width);

  row.append("text")
      .attr("x", -6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) { return" "; /* nodes[i].name;*/ });

  var column = svg.selectAll(".column")
      .data(matrix)
      .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; }); //permet la translation et rotation des colonnes

  //column.append("line")
    //  .attr("x1", -width);

  column.append("text")
      .attr("x", 6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return" "; /* nodes[i].name;*/ });
      
     
    console.log("4 "+(Date.now()-chrono));
    chrono=Date.now();

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row)
        .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", function(d) { return d.x==d.y ? nombreDeVote :  z(d.z)  ; })
        .style("fill", function(d) { return d.x==d.y ? "white" : "black"; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
  }

  function mouseover(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
    d3.selectAll(".row rect") .style("stroke-width",3);
    d3.selectAll(".row rect").style("stroke",function(d) {return  d.y==p.y && d.x==p.x ? "yellow" : "null"/*(d.x==d.y ? "white": "black")*/;});
    d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
    
  }

  function mouseout() {
    d3.selectAll("text").classed("active", false);
    d3.selectAll("rect").classed("active", false);
    d3.selectAll(".row rect").style("stroke",null);
  }

  d3.select("#order").on("change", function() {
    order(this.value);
  });

  function order(value) {
    x.domain(orders[value]);

    var t = svg.transition().duration(2000);

    t.selectAll(".row")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .selectAll(".cell")
        .delay(function(d) { return x(d.x) * 4; })
        .attr("x", function(d) { return x(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
  }
console.log("5 "+(Date.now()-chrono));
    chrono=Date.now();
});
