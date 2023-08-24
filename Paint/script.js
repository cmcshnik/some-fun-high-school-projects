class CellColor {
  constructor(r, g, b) {
      this.r = r;
      this.g = g;
      this.b = b;
  }
}

onload = () => {
  let canvas = document.createElement('canvas');

  const cont = document.getElementById('cont');
  cont.appendChild(canvas);

  canvas.width = 1300;
  canvas.height = 700;
  canvas.style.margin = 'auto';
  canvas.style.boxShadow = '5px 5px 10px 5px rgba(0, 0, 0, .4)';


  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Кисти


  

  



  let brush = document.getElementById('BRUSH2');

  let checkBrush1 = document.getElementById('BRUSH1_b');
  checkBrush1.onclick = function(){ 
      brush = document.getElementById('BRUSH1'); console.log(brush);
      brushCanvas = document.createElement('canvas');
      brushCanvas.style = `display:none;`;
      brushCanvas.width = brush.width ;
      brushCanvas.height = brush.height;
      brushCtx = brushCanvas.getContext('2d');
      selectColor(r, g, b);
  }

  let checkBrush2 = document.getElementById('BRUSH2_b');
  checkBrush2.onclick = function(){ 
      brush = document.getElementById('BRUSH2'); console.log(brush);
      brushCanvas = document.createElement('canvas');
      brushCanvas.style = `display:none;`;
      brushCanvas.width = brush.width ;
      brushCanvas.height = brush.height;
      brushCtx = brushCanvas.getContext('2d');
      selectColor(r, g, b);
  }


  let brushCanvas = document.createElement('canvas');
  brushCanvas.style = `display:none;`;
  brushCanvas.width = brush.width ;
  brushCanvas.height = brush.height;
  let brushCtx = brushCanvas.getContext('2d');

  
  
  const selectColor = (r, g, b) => {
      brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
      brushCtx.drawImage(brush, 0, 0, brushCanvas.width, brushCanvas.height);
      const imageData = brushCtx.getImageData(0, 0, brushCanvas.width, brushCanvas.height);
      const pixels = imageData.data;

      for (let y = 0; y < imageData.height; y++) {
          for (let x = 0; x < imageData.width; x++) {
              const offset = 4 * (y * imageData.width + x);
              pixels[offset+0] = Math.floor(r*pixels[offset+0]/255);
              pixels[offset+1] = Math.floor(g*pixels[offset+1]/255);
              pixels[offset+2] = Math.floor(b*pixels[offset+2]/255);
          }
      }
      console.log(r, g, b);

      brushCtx.putImageData(imageData, 0, 0);
  };


  let white = document.getElementById('white');
  white.onclick = function(){ selectColor(255, 255, 255); r = 255; g = 255; b = 255;}

  let red = document.getElementById('red');
  red.onclick = function(){ selectColor(255, 0, 0); r = 255; g = 0; b = 0;}

  let black = document.getElementById('black');
  black.onclick = function(){ selectColor(0, 0, 0); r = 0; g = 0; b = 0;}

  let orange = document.getElementById('orange');
  orange.onclick = function(){ selectColor(255, 165, 0); r = 255; g = 165; b = 0;}

  let yellow = document.getElementById('yellow');
  yellow.onclick = function(){ selectColor(255, 255, 0); r = 255; g = 255; b = 0;}

  let green = document.getElementById('green');
  green.onclick = function(){ selectColor(0, 128, 0); r = 0; g = 128; b = 0;}

  let blue = document.getElementById('blue');
  blue.onclick = function(){ selectColor(0, 0, 255); r = 255; g = 0; b = 255;}

  let indigo = document.getElementById('indigo');
  indigo.onclick = function(){ selectColor(75, 0, 130); r = 70; g = 0; b = 130;}

  let violet = document.getElementById('violet');
  violet.onclick = function(){ selectColor(238, 130, 238); r = 238; g = 130; b = 238;}




  let r = 0;
  let g = 0;
  let b = 0;
  

  document.getElementById('color').oninput = function () {
      let bigint = parseInt(this.value.split('#')[1], 16);
      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
      selectColor(r, g, b);
  }


  selectColor(0, 0, 0);

  let a = [];
  let c = [];

  let cell0 = document.getElementById("0");
  let col0 = new CellColor(255, 255, 255);
  a.push(col0); c.push(cell0);
  cell0.onclick = function(){ selectColor(col0.r, col0.g, col0.b)}
  
  let cell1 = document.getElementById("1");
  let col1 = new CellColor(255, 255, 255);
  a.push(col1); c.push(cell1);
  cell1.onclick = function(){ selectColor(col1.r, col1.g, col1.b)}
  
  let cell2 = document.getElementById("2");
  let col2 = new CellColor(255, 255, 255);
  a.push(col2); c.push(cell2);
  cell2.onclick = function(){ selectColor(col2.r, col2.g, col2.b)}
  
  let cell3 = document.getElementById("3");
  let col3 = new CellColor(255, 255, 255);
  a.push(col3); c.push(cell3);
  cell3.onclick = function(){ selectColor(col3.r, col3.g, col3.b)}
  
  let cell4 = document.getElementById("4");
  let col4 = new CellColor(255, 255, 255);
  a.push(col4); c.push(cell4);
  cell4.onclick = function(){ selectColor(col4.r, col4.g, col4.b)}
  
  let cell5 = document.getElementById("5");
  let col5 = new CellColor(255, 255, 255);
  a.push(col5); c.push(cell5);
  cell5.onclick = function(){ selectColor(col5.r, col5.g, col5.b)}
  
  let cell6 = document.getElementById("6");
  let col6 = new CellColor(255, 255, 255);
  a.push(col6); c.push(cell6);
  cell6.onclick = function(){ selectColor(col6.r, col6.g, col6.b)}
  
  let cell7 = document.getElementById("7");
  let col7 = new CellColor(255, 255, 255);
  a.push(col7); c.push(cell7);
  cell7.onclick = function(){ selectColor(col7.r, col7.g, col7.b)}
  
  let cell8 = document.getElementById("8");
  let col8 = new CellColor(255, 255, 255);
  a.push(col8); c.push(cell8);
  cell8.onclick = function(){ selectColor(col8.r, col8.g, col8.b)}
  
  let cell9 = document.getElementById("9");
  let col9 = new CellColor(255, 255, 255);
  a.push(col9); c.push(cell9);
  cell9.onclick = function(){ selectColor(col9.r, col9.g, col9.b)}
  
  let cell10 = document.getElementById("10");
  let col10 = new CellColor(255, 255, 255);
  a.push(col10); c.push(cell10);
  cell10.onclick = function(){ selectColor(col10.r, col10.g, col10.b)}
  
  let cell11 = document.getElementById("11");
  let col11 = new CellColor(255, 255, 255);
  a.push(col11); c.push(cell11);
  cell11.onclick = function(){ selectColor(col11.r, col11.g, col11.b)}
  

  
  let count = 0;

  let addColor = document.getElementById('adding_color');
  addColor.onclick = function(){ 
      let temp = a[count];
      c[count].style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      temp.r = r;
      temp.g = g;
      temp.b = b;
      count++;
      if (count == 12) count = 0;
  }
  




  let size = 10;
  let tinySize = document.getElementById('tiny_size');
  tinySize.onclick = function(){ size = 2 }

  let verySmallSize = document.getElementById('very_small_size');
  verySmallSize.onclick = function(){ size = 4 }

  let smallSize = document.getElementById('small_size');
  smallSize.onclick = function(){ size = 6 }

  let mediumSize = document.getElementById('medium_size');
  mediumSize.onclick = function(){ size = 10 }

  let largeSize = document.getElementById('large_size');
  largeSize.onclick = function(){ size = 14 }

  let verylargeSize = document.getElementById('very_large_size');
  verylargeSize.onclick = function(){ size = 30 }

  

  const drawBrush = (x, y) => {
    ctx.drawImage(brushCanvas, x - size/2, y - size/2, size, size);
//      ctx.fillStyle = color;
//      ctx.fillRect(x - size/2, y - size/2, size, size);
  }

  const getMouseCoords = e => {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.x, e.clientY - rect.y]
  }

  let prevX = null;
  let prevY = null;

  
  let workingBrushType = "default";


  let default_brush_button = document.getElementById('default');
  default_brush_button.onclick = function(){ 
      workingBrushType = "default";
      prevX = null;
      prevY = null;
  }

  let line_button = document.getElementById('line');
  line_button.onclick = function(){ 
      workingBrushType = "line";
      prevX = null;
      prevY = null;
  }

  let kvadrat_button = document.getElementById('kvadrat');
  kvadrat_button.onclick = function(){ 
      workingBrushType = "kvadrat";
      prevX = null;
      prevY = null;
  }
  
      

  canvas.onmousedown = e => {
      console.log(e);

    if (e.button == 0) {

    [prevX, prevY] = getMouseCoords(e);

    drawBrush(prevX + 1, prevY);

    } else if (e.button == 2 && e.ctrlKey == true) {
        ctx.fillStyle = `rgb(255, 255, 255)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    canvas.onmouseup = e => {
        'if (e.button !== 0) {return ;}'
  
      if (workingBrushType == "default"){
          prevX = null;
          prevY = null;
      } else if (workingBrushType == "line"){
          if (e.button == 0){
              [x, y] = getMouseCoords(e);
              forEachPixel(prevX, prevY, x, y, drawBrush);
          }
      } else if (workingBrushType == "kvadrat"){
          if (e.button == 0){
              [x, y] = getMouseCoords(e);
              forEachPixel(prevX, prevY, x, prevY, drawBrush);
              forEachPixel(prevX, prevY, prevX, y, drawBrush);
              forEachPixel(x, prevY, x, y, drawBrush);
              forEachPixel(prevX, y, x, y, drawBrush);
          }
      }  
      
    }
    let condition = true;
  
     
  
    canvas.onmouseover = handlerOver;
      function handlerOver(event) {
          if (event.type === 'mouseover') {
              condition = true;
              console.log(condition);
          }
      }
  
  
    onmousemove = e => {
        if (condition === true){
            canvas.onmouseout = handlerOut;
            function handlerOut(event) {
                if (event.type === 'mouseout') {
                    if (workingBrushType !== 'line' && workingBrushType !== 'kvadrat') {
                        prevX = null;
                        prevY = null;
                    }
                    condition = false;
                    console.log(condition);
                }
            } 
    
            if (workingBrushType == "default"){
                if (prevX > canvas.width) {return;}
                if (prevY > canvas.width) {return;}
        
                if (prevX == null) {return;}
        
                [x, y] = getMouseCoords(e);
        
                if (x > canvas.width) {return;}
                if (y > canvas.width) {return;}
        
                
        
                forEachPixel(prevX, prevY, x, y, drawBrush);
        
                prevX = x;
                prevY = y;
            } else if (workingBrushType == "line" || workingBrushType == "kvadrat"){
                let trash = 0;
            }
        }   
  
    };

  
  }

  
      
};



function forEachPixel(x0, y0, x1, y1, action){
  x0 = Math.round(x0)
  x1 = Math.round(x1)
  y0 = Math.round(y0)
  y1 = Math.round(y1)

  const dx = x1 - x0;
  const dy = y1 - y0;

  action(x0, y0);

  if (dx == 0 && dy == 0){ return; }

  const maxDiff = Math.max(Math.abs(dx), Math.abs(dy));
  let x = x0;
  let y = y0;
  for (let i = 0; i < maxDiff; i++){
    x += dx / maxDiff;
    y += dy / maxDiff;

    action(x, y);
  }
}
