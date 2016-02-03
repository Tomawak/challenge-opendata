
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
    
    canvas.addEventListener('mousemove', mouseMoving);

    canvas.addEventListener('click', mouseClicking);

    canvas2.addEventListener('click', null);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    $.getJSON("similaritiesv2.json", function(data) {
    	console.log("json charger " +(Date.now()-chrono));
    	chrono = Date.now();
    	dataGlobal=data;
    	drawMatrix(dataGlobal);
    });
}    

function findGroup(x) {
		for (var i = dataGlobal.groups.length - 1; i >= 0; i--) {
			var group =dataGlobal.groups[i];
			if ((x <= group.end) && (x >= group.begin)){
          return i;
      }
		};
    console.log("error impossible");
    console.log("----------------------------");
    return null;  
}



function differentGroupe(GroupeEncadre,groupX,groupY){
	if (GroupeEncadre.beginX!==groupX.begin) {
		return true ;
	}
	if (GroupeEncadre.beginY!==groupY.begin) {
		return true ;
	}
	if (GroupeEncadre.endX!==groupX.end) {
		return true ;
	}
	if (GroupeEncadre.endY!==groupX.end) {
		return true ;
	}
	return false;
}


function changeColorRect(x,y,width,height,color){
	var imgData=ctx.getImageData(x,y,width,height);
	for (var i=0;i<imgData.data.length;i+=4) {

		// CHANGER LA TRANSFORMATION DES COULEURS

	  imgData.data[i]=255-imgData.data[i];
	  imgData.data[i+1]=255-imgData.data[i+1];
	  imgData.data[i+2]=255-imgData.data[i+2];
	  imgData.data[i+3]=255;
  }
  ctx.putImageData(imgData,x,y);
}

function drawContour(GroupeEncadre,color){

	//carre de gauche
	changeColorRect(GroupeEncadre.beginX-2,GroupeEncadre.beginY,2,(GroupeEncadre.endY-GroupeEncadre.beginY),color);
	//carre au dessus
	changeColorRect(GroupeEncadre.beginX,GroupeEncadre.beginY-2,(GroupeEncadre.endX-GroupeEncadre.beginX),2,color);
	//carre en dessous
	changeColorRect(GroupeEncadre.beginX,GroupeEncadre.endY,(GroupeEncadre.endX-GroupeEncadre.beginX),2,color);
	//carre de droite
	changeColorRect(GroupeEncadre.endX,GroupeEncadre.beginY,2,(GroupeEncadre.endY-GroupeEncadre.beginY),color);

}

function mouseMoving(evt) {
    mousePos = getMousePos(canvas, evt);
    console.log(mousePos.x, mousePos.y);
    var groupX = dataGlobal.groups[findGroup(mousePos.x)];
    var groupY = dataGlobal.groups[findGroup(mousePos.y)];
    console.log(groupX);
    if (!GroupeEncadre) {
	    	GroupeEncadre={"beginX":groupX.begin,
	    	"endX":groupX.end,
	    	"beginY":groupY.begin,
	    	"endY":groupY.end
	    }	
	    drawContour(GroupeEncadre,"red");

    } else if (differentGroupe(GroupeEncadre,groupX,groupY)) {
    	drawContour(GroupeEncadre,"noir");
    	GroupeEncadre={"beginX":groupX.begin,
	    	"endX":groupX.end,
	    	"beginY":groupY.begin,
	    	"endY":groupY.end
	    }	
    	drawContour(GroupeEncadre,"red");
    }
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
    	for (var j = tab.links[i].length - 1; j >= 0; j--) {
    		for (var k = tab.links[i][j].length - 1; k >= 0; k--) {
    		
    		var link=tab.links[i][j][k];
	    	var color = Math.floor(37.48*Math.log(link.value+1));

	    	var x = link.source;
	    	var y = link.target;

	    	ctx.fillStyle = "rgb("+color+","+color+","+color+")";
	    	ctx.fillRect(x, y, 1, 1);
	    	ctx.fillRect(y, x, 1, 1);

	    }
	  }
	}
    console.log("matrix draw " +(Date.now()-chrono));
}



