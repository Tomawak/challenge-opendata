
var canvas, ctx;
var chrono = Date.now();

function init() {
    console.log("dom charger " +(Date.now()-chrono));
    chrono = Date.now();
    canvas = document.getElementById("MonCanvas");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    $.getJSON("datdata.json", function(data) {
      console.log("json charger " +(Date.now()-chrono));
      chrono = Date.now();
      drawMatrix(data);
    });
}

 function drawMatrix(tab) {
    var nb = tab.depute.length;
    for (var i = tab.links.length - 1; i >= 0; i--) {
      var color = tab.links[i].value/500 *255;

      var x = tab.links[i].source;
      var y = tab.links[i].target;
      if (x<=y) {console.log("c'est la merde!!!");}
      ctx.fillStyle = "rgb("+color+","+color+","+color+")";
      ctx.fillRect(x, y, x+1, y+1);
      //ctx.fillRect(y, x, y+1, x+1);

    }
    console.log("matrix draw " +(Date.now()-chrono));
  }





