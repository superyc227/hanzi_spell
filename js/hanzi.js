
function createText(hanzi, pinyin, preChDraw)
{ 
    var pinyinArea = document.createElement("div");  
    pinyinArea.name="pinyinId";  
    pinyinArea.style.cssText ="line-height: 30px; text-align: center; width: 60px;"
    pinyinArea.innerText = pinyin;

    var drawArea = document.createElement("div");  
    drawArea.id="drawId"; 
    drawArea.innerHTML = '';
    var option = {
        clear: false,
        el: drawArea,
        style: {
            radicalColor: null,
            backgroundColor: '#eee',
            length: 60
            },
        type: cnchar.draw.TYPE.ANIMATION,
        animation:{    
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 100,            
            autoAnimate: false
        }
    }
    
    window.pro_elt_addEventListener=HTMLDivElement.prototype.addEventListener;
    HTMLDivElement.prototype.addEventListener=function(){        
    };
    
    var draw = cnchar.draw(hanzi, option); 
    
    HTMLDivElement.prototype.addEventListener = window.pro_elt_addEventListener;       
    
    var drawTestArea = document.createElement("div");  
    drawTestArea.id="drawTestId"; 
    drawTestArea.style.cssText ="position:absolute; top: 110px;"
    drawTestArea.innerHTML = '';
    var optionTest = {
        clear: false,
        el: drawTestArea,
        style: {
            radicalColor: null,
            backgroundColor: '#eee',
            strokeColor: '#111',
            length: 60
            },
        type: cnchar.draw.TYPE.TEST,   
        line: {
        	lineColor: '#f00',
        	borderColor: '#f00'
        }  
    }    
    var test = cnchar.draw(hanzi, optionTest); 
    drawTestArea.ondblclick = ()=>{        			
        			test.writers.forEach((writer, index) => {
                    writer.quiz();
                });};
    
    var area = document.createElement("div");  
    area.name="textAreaId";
    area.appendChild(pinyinArea);
    area.appendChild(drawArea);
    area.appendChild(drawTestArea);
    
    drawArea.addEventListener('click', ()=>{draw.animate();});

    if (preChDraw != null)
    {
        preChDraw.option.animateComplete = ()=>{draw.animateStart();}; 
    }

    var chArea;
    var chDraw;
    return {chArea: area, chDraw: draw};  

}

function createString(strTexts)
{        
    var stringArea = document.createElement("div"); 
    var left =0;
    var leftspan = 70;
    var top = 0;
    var linespan = 180;
    var space = 0;

    var preChDraw = null;
    var firstChDraw = null;
           
    for(var i = 0; i < strTexts.length; i++)
    {
        var lineData = strTexts[i];
        space = 0;            
        for (var j = 0; j < lineData.length; j++)
      	{
      		ch = lineData[j];
      		if (!cnchar.isCnChar(ch["hanzi"]))
      		{      			
      			continue;
      		}           	  
      	      	
          var result = createText(ch["hanzi"], ch["pinyin"], preChDraw);
          
          if (preChDraw == null) 
          {
              firstChDraw = result.chDraw;
          }
          
          preChDraw = result.chDraw;
          result.chArea.style.position="absolute";
          result.chArea.style.left =(left+ space+ leftspan * j) + "px";	            
          result.chArea.style.top = (top + linespan * i) + "px";
          stringArea.appendChild(result.chArea); 
        }
    }

    firstChDraw.animateStart();
   return stringArea;
}