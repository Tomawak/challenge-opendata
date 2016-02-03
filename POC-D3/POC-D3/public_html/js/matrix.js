
var canvas, ctx;
var canvas2, ctx2;
var chrono = Date.now();
var mousePos;
var dataGlobal;

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

    $.getJSON("datdata.json", function(data) {
      console.log("json charger " +(Date.now()-chrono));
      chrono = Date.now();
      dataGlobal=data;
      drawMatrix(dataGlobal);
    });
    
    
    
    function hsv_to_rgb(h, s, v) {  
        var c = v * s;  
        var h1 = h / 60;  
        var x = c * (1 - Math.abs((h1 % 2) - 1));  
        var m = v - c;  
        var rgb;  

        if (typeof h == 'undefined') rgb = [0, 0, 0];  
        else if (h1 < 1) rgb = [c, x, 0];  
        else if (h1 < 2) rgb = [x, c, 0];  
        else if (h1 < 3) rgb = [0, c, x];  
        else if (h1 < 4) rgb = [0, x, c];  
        else if (h1 < 5) rgb = [x, 0, c];  
        else if (h1 <= 6) rgb = [c, 0, x];  

        return [255 * (rgb[0] + m), 255 * (rgb[1] + m), 255 * (rgb[2] + m)];  
      }   
    }
    
        function rgb2hsv (r,g,b) {
            var computedH = 0;
            var computedS = 0;
            var computedV = 0;

            //remove spaces from input RGB values, convert to int
            var r = parseInt( (''+r).replace(/\s/g,''),10 ); 
            var g = parseInt( (''+g).replace(/\s/g,''),10 ); 
            var b = parseInt( (''+b).replace(/\s/g,''),10 ); 

            if ( r==null || g==null || b==null ||
                isNaN(r) || isNaN(g)|| isNaN(b) ) {
              alert ('Please enter numeric RGB values!');
              return;
            }
            if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
              alert ('RGB values must be in the range 0 to 255.');
              return;
            }
            r=r/255; g=g/255; b=b/255;
            var minRGB = Math.min(r,Math.min(g,b));
            var maxRGB = Math.max(r,Math.max(g,b));

            // Black-gray-white
            if (minRGB==maxRGB) {
             computedV = minRGB;
             return [0,0,computedV];
            }

            // Colors other than black-gray-white:
            var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
            var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
            computedH = 60*(h - d/(maxRGB - minRGB));
            computedS = (maxRGB - minRGB)/maxRGB;
            computedV = maxRGB;
            return [computedH,computedS,computedV];
        }


  /*function findGroupX(x) {
      dataGlobal.groups.forEach(function(group){
               if (x<group.end && x>group.begin){
                   return x;
               }
            });
      console.log("error impossible");
      return null;
      
  }*/
  
  /*function findGroupY(y) {
     dataGlobal.groups.forEach(function(group){
               if (y<group.end && y>group.begin){
                   return y;
               }
            });
      console.log("error impossible");
      return null;
      
  }*/

  function mouseMoving(evt) {
      mousePos = getMousePos(canvas, evt);
      console.log(mousePos.x, mousePos.y);
    /*  var groupX = dataGlobal.groups[findGroupX(mousPos.x)];
      var groupY = dataGlobal.groups[findGroupX(mousPos.y)];
      
      groupX.begin */
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
      if (x<=y) {console.log("error");}
      ctx.fillStyle = "rgb("+color+","+color+","+color+")";
      ctx.fillRect(x, y, 1, 1);
      ctx.fillRect(y, x, 1, 1);

    }
    console.log("matrix draw " +(Date.now()-chrono));
  }



