
var canvas, ctx;
var canvas2, ctx2;
var chrono = Date.now();
var mousePos;
var dataGlobal;
var GroupeEncadre;

function init() {

    canvas = document.getElementById("CanvasPrincipal");
    ctx = canvas.getContext("2d");

    canvas2 = document.getElementById("CanvasSecondaire");
    ctx2 = canvas2.getContext("2d");

    // mouse events
    
   // canvas.addEventListener('mousemove', mouseMoving);

    canvas.addEventListener('click', mouseClicking);

    canvas2.addEventListener('click', null);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    $.getJSON("similarity.json", function(data) {
    	console.log("json charger " +(Date.now()-chrono));
    	chrono = Date.now();
    	dataGlobal=data;
    	drawMatrix(dataGlobal);
    });
}    

function findGroupX(x) {
    dataGlobal.groups.forEach(function(group){
        if (x<group.end && x>group.begin){
            return x;
        }
    });
    console.log("error impossible");
    return null;  
}

function findGroupY(y) {
    dataGlobal.groups.forEach(function(group){
        if (y<group.end && y>group.begin){
            return y;
        }
    });
    console.log("error impossible");
    return null;

}

function differentGroup(GroupeEncadre,groupX,groupY){
	if (GroupeEncadre.beginX!=groupX.begin) {
		return true ;
	}
	if (GroupeEncadre.beginY!=groupY.begin) {
		return true ;
	}
	if (GroupeEncadre.endX!=groupX.end) {
		return true ;
	}
	if (GroupeEncadre.endY!=groupX.end) {
		return true ;
	}
	return false;
}

function drawContour(GroupeEncadre){
	ctx.fillStyle = "rgb("+color+","+color+","+color+")";
  ctx.fillRect(x, y, 1, 1);
  ctx.fillRect(y, x, 1, 1);
}

/*function mouseMoving(evt) {
    mousePos = getMousePos(canvas, evt);
    console.log(mousePos.x, mousePos.y);
    var groupX = dataGlobal.groups[findGroupX(mousPos.x)];
    var groupY = dataGlobal.groups[findGroupX(mousPos.y)];
    if (!GroupeEncadre) {

	    	GroupeEncadre={"beginX":groupX.begin,
	    	"endX":groupX.end,
	    	"beginY":groupY.begin,
	    	"endY":groupY.end
	    }	
	    drawContour(GroupeEncadre);

    } else if (differentGroupe(GroupeEncadre,groupX,groupY)) {
    	//on enleve le contour
    	GroupeEncadre={"beginX":groupX.begin,
	    	"endX":groupX.end,
	    	"beginY":groupY.begin,
	    	"endY":groupY.end
	    }	
    	//on dessine le contour
    }
}*/

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



