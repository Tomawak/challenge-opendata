
var canvas, ctx;
var canvas2, ctx2;
var chrono = Date.now();
var mousePos;
var dataGlobal;
var GroupeEncadre;
var marginWriting = 143; // in pixels



var oldTopGroup = null;
var oldRightGroup = null;

function writeTopGroupName(context,group,color,shouldEraseOldGroup) {
    if(shouldEraseOldGroup && oldTopGroup) {
        writeTopGroupName(context,oldTopGroup,"black",false)
    }
    context.save();
    context.font="10px Arial";
    context.textAlign = "start";
    context.textBaseline= "middle";
    context.fillStyle = color;
    var middlePoint = group.begin+(group.end-group.begin)/2;
    context.translate(middlePoint,-5);
    context.rotate(-Math.PI/5);
    context.clearRect(0,-6,500,12);
    context.fillText(group.name, 0, 0);
    context.restore();
    oldTopGroup = group;
}

function writeRightGroupName(context,group,color,shouldEraseOldGroup) {
    if(shouldEraseOldGroup && oldRightGroup) {
        writeRightGroupName(context,oldRightGroup,"black",false)
    }
    context.save();
    context.font="10px Arial";
    context.textAlign = "start";
    context.textBaseline="middle";
    context.fillStyle = color;
    var middlePoint = Math.floor(group.begin+(group.end-group.begin)/2);
    context.translate(575+5,middlePoint);
    context.clearRect(0,-10,500,20);
    context.fillText(group.name,0,0);
    context.restore();
    oldRightGroup = group;
}

function writeGroupsName(context,groups) {
    for (var i = groups.length - 1; i >= 0; i--) {
        writeTopGroupName(context,groups[i],"black",false);
    };
    for (var i = groups.length - 1; i >= 0; i--) {
        writeRightGroupName(context,groups[i],"black",false);
    };
}

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

    $.getJSON("simv4.json", function(data) {
    	console.log("json loaded in : " +(Date.now()-chrono));
    	chrono = Date.now();
    	dataGlobal=data;
        ctx.translate(0,marginWriting);
        writeGroupsName(ctx,data.groups);
        oldTopGroup = null;
        oldBottomGroup = null;
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
    return null;
}



function differentGroupe(GroupeEncadre,groupX,groupY){
<<<<<<< HEAD
	if (GroupeEncadre.beginX!==groupX.begin) {
		return true ;
	}
	if (GroupeEncadre.beginY!==groupY.begin) {
		return true ;
	}
	if (GroupeEncadre.endX!==groupX.end) {
		return true ;
	}
	if (GroupeEncadre.endY!==groupY.end) {
		return true ;
	}
	return false;
=======
	return GroupeEncadre.beginX!==groupX.begin
        || GroupeEncadre.beginY!==groupY.begin
        || GroupeEncadre.endX!==groupX.end
		|| GroupeEncadre.endY!==groupY.end
>>>>>>> 34af7f33af335a19822b27bfdf69a7f353345c9f
}


function changeColorRect(x,y,width,height,color){
    if( (x<0) || (y<0) || (x+width>576) || (y+height>576) ) {
        return ;
    }
    //getImgData prend la valeur absolu, il faut donc ajouter la marge
    var imgData=ctx.getImageData(x,y+marginWriting,width,height);

   for (var i=0;i<imgData.data.length;i+=4) {
       var colorHSV = rgbToHsv( imgData.data[i], imgData.data[i+1], imgData.data[i+2]);

     if (color=="erase"){
         colorHSV[1]=0;
       } else if (color=="add"){
           colorHSV[0]=0.333;
           colorHSV[1]=1;
                  }

     var colorRGB = hsvToRgb(colorHSV[0],colorHSV[1],colorHSV[2]);
     imgData.data[i]=colorRGB[0];
     imgData.data[i+1]=colorRGB[1];
     imgData.data[i+2]=colorRGB[2];
     imgData.data[i+3]=255;
  }
    //putImgData prend la valeur absolu, il faut donc ajouter la marge
    ctx.putImageData(imgData,x,y+marginWriting);
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
    var groupIdX = findGroup(mousePos.x);
    var groupIdY = findGroup(mousePos.y);
    var groupX = dataGlobal.groups[groupIdX];
    var groupY = dataGlobal.groups[groupIdY];
    if(!groupX || !groupY){
        return;
    }
    if (!GroupeEncadre) {
	    GroupeEncadre={"beginX":groupX.begin,
	    	"endX":groupX.end,
	    	"beginY":groupY.begin,
	    	"endY":groupY.end
	    };
	    drawContour(GroupeEncadre,"add");
    } else if (differentGroupe(GroupeEncadre,groupX,groupY)) {
        drawContour(GroupeEncadre,"erase");
    	GroupeEncadre={"beginX":groupX.begin,
	    	"endX":groupX.end,
	    	"beginY":groupY.begin,
	    	"endY":groupY.end
	    };
	drawContour(GroupeEncadre,"add");
        writeTopGroupName(ctx,groupX,"red",true);
        writeRightGroupName(ctx,groupY,"red",true);
    }
}

function mouseClicking(evt) {
    // créer une nouvelle matrix uniquement pour le parti du député sélectionné
    ctx2.clearRect(0,0,canvas2.width,canvas2.height);

    var groupIdX = findGroup(mousePos.x);
    var groupIdY = findGroup(mousePos.y);
    var groupX = dataGlobal.groups[groupIdX];
    var groupY = dataGlobal.groups[groupIdY];

    drawMatrix2(dataGlobal, 1, 1, groupIdX, groupIdY, ctx2);
}

function drawMatrix2(tab, rx, ry, parti1, parti2, context) {
  
  var firstX = tab.groups[parti1].begin;
  var firstY = tab.groups[parti2].begin;




  for (var i = tab.links[parti1][parti2].length-1; i >=0; i--) {
    var link = tab.links[parti1][parti2][i];
    

    var color = Math.floor(37.48*Math.log(link.value+1))/255;
    var colortab=hsvToRgb(0.3333,0,color);

    var x = link.source;
    var y = link.target;

    context.fillStyle = "rgb("+colortab[0]+","+colortab[1]+","+colortab[2]+")";

    if (firstX > firstY) {
      context.fillRect(x, y, 1, 1);
      context.fillRect(y, x, 1, 1);
    }else if (firstX < firstY) {

    }else{
      context.fillRect(x-firstX, y-firstY, rx, ry);
      context.fillRect(y-firstY, x-firstX, ry, rx);
    }

  }
/*
  firstX = tab.groups[parti2].begin;
  firstY = tab.groups[parti1].begin;



  for (var i = tab.links[parti2][parti1].length-1; i >=0; i--) {
    var link = tab.links[parti2][parti1][i];
    

    var color = Math.floor(37.48*Math.log(link.value+1))/255;
    var colortab=hsvToRgb(0.3333,0,color);

    var x = link.source;
    var y = link.target;

    context.fillStyle = "rgb("+colortab[0]+","+colortab[1]+","+colortab[2]+")";

    if (firstX > firstY) {
      context.fillRect(x-firstX, y-firstY, 1, 1);
      context.fillRect(y-firstY, x-firstX, 1, 1);
    }else if (firstX < firstY) {

    }else{
      context.fillRect(x-firstX, y-firstY, rx, ry);
      context.fillRect(y-firstY, x-firstX, ry, rx);
    }

  }

  var nb = tab.depute.length;
    for (var i = tab.links.length - 1; i >= 0; i--) {
        for (var j = tab.links[i].length - 1; j >= 0; j--) {
            for (var k = tab.links[i][j].length - 1; k >= 0; k--) {
                if ((i==parti1 && j==parti2)  ){
            var link=tab.links[i][j][k];
            var color = Math.floor(37.48*Math.log(link.value+1))/255;
            var colortab=hsvToRgb(0.3333,0,color);


            var x = link.source;
            var y = link.target;

            context.fillStyle = "rgb("+colortab[0]+","+colortab[1]+","+colortab[2]+")";
            context.fillRect(x, y, 1, 1);
            context.fillRect(y, x, 1, 1);
            }
        }
      }
    }
*/

  
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
    	x: evt.clientX - rect.left,
    	y: evt.clientY - rect.top - marginWriting
    };
}

function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}



function drawMatrix(tab) {
    var nb = tab.depute.length;
    for (var i = tab.links.length - 1; i >= 0; i--) {
    	for (var j = tab.links[i].length - 1; j >= 0; j--) {
    		for (var k = tab.links[i][j].length - 1; k >= i; k--) {

    		var link=tab.links[i][j][k];
	    	var color = Math.floor(37.48*Math.log(link.value+1))/255;
	    	var colortab=hsvToRgb(0.3333,0,color);


	    	var x = link.source;
	    	var y = link.target;

	    	ctx.fillStyle = "rgb("+colortab[0]+","+colortab[1]+","+colortab[2]+")";
	    	ctx.fillRect(x, y, 1, 1);
	    	//ctx.fillRect(y, x, 1, 1);

	    }
	  }
	}
    console.log("matrix drawn in : " +(Date.now()-chrono));
}



