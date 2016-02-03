
var canvas, ctx;
var canvas2, ctx2;
//var chrono = Date.now();
var mousePos;

function init() {
    //console.log("dom charger " +(Date.now()-chrono));
    //chrono = Date.now();

    canvas = document.getElementById("CanvasPrincipal");
    ctx = canvas.getContext("2d");

    canvas2 = document.getElementById("CanvasSecondaire");
    ctx2 = canvas2.getContext("2d");

    // mouse events
    canvas.addEventListener('mousemove', mouseMoving);

    canvas.addEventListener('click', mouseClicking);

    canvas2.addEventListener('click', null);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    $.getJSON("similarity.json", function(data) {
      console.log("json charger " +(Date.now()-chrono));
      chrono = Date.now();
      drawMatrix(data);
    });
}

  function mouseMoving(evt) {
      mousePos = getMousePos(canvas, evt);
      console.log(mousePos.x, mousePos.y);
  }

  function mouseClicking(evt) {
      // créer une nouvelle matrix uniquement pour le parti du député sélectionné
      ctx2.fillStyle = "#FF0000";
      ctx2.fillRect(0, 0, 100, 100);
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

 function drawMatrix(tab) {
    var nb = tab.depute.length;
    for (var i = tab.links.length - 1; i >= 0; i--) {
      var color = Math.floor(37.48*Math.log(tab.links[i].value+1));

      var x = tab.links[i].source;
      var y = tab.links[i].target;
      if (x<=y) {console.log("c'est la merde!!!");}
      ctx.fillStyle = "rgb("+color+","+color+","+color+")";
      ctx.fillRect(x, y, x+1, y+1);
      ctx.fillRect(y, x, y+1, x+1);

    }
    console.log("matrix draw " +(Date.now()-chrono));
  }



