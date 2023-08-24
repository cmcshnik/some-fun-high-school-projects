onload = () => {
    const canvas = document.getElementById('CANVAS');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    let allPoints = [];
    let cellside = 10;
    let grid = newGrid(ctx,cellside);
    let threshold = 0.9;
    let radius_vl = 60;

    let html_radius_vl = document.getElementById("radius_vl");
    let radius_vl_display = document.getElementById("radius_vl_display");
    html_radius_vl.onclick = function() {
        radius_vl = parseInt(html_radius_vl.value);
        radius_vl_display.innerHTML = parseInt(html_radius_vl.value);
        grid.clearGrid();
        setup(radius_vl);
    } 

    let vl_plus =  document.getElementById("vl_plus");
    vl_plus.onclick = function() {
        html_radius_vl.value = parseInt(html_radius_vl.value) + 5;
        radius_vl = parseInt(html_radius_vl.value);
        radius_vl_display.innerHTML = parseInt(html_radius_vl.value);
        grid.clearGrid();
        setup(radius_vl);
    }
    
    let vl_minus =  document.getElementById("vl_minus");
    vl_minus.onclick = function() {
        html_radius_vl.value = parseInt(html_radius_vl.value) - 5;
        radius_vl = parseInt(html_radius_vl.value);
        radius_vl_display.innerHTML = parseInt(html_radius_vl.value);
        grid.clearGrid();
        setup(radius_vl);
    }



    let html_threshold = document.getElementById("threshold");
    let threshold_display = document.getElementById("threshold_display");
    html_threshold.onclick = function() {
        threshold = parseFloat(html_threshold.value);
        threshold_display.innerHTML = parseFloat(html_threshold.value);
        grid.clearGrid();
        setup(radius_vl);
    } 
    let threshold_minus = document.getElementById("threshold_minus");
    threshold_minus.onclick = function() {
        html_threshold.value = parseFloat(html_threshold.value) - 0.1;
        threshold = parseFloat(html_threshold.value);
        threshold_display.innerHTML = parseFloat(html_threshold.value);
        grid.clearGrid();
        setup(radius_vl);
    }
    let threshold_plus = document.getElementById("threshold_plus");
    threshold_plus.onclick = function() {
        html_threshold.value = parseFloat(html_threshold.value) + 0.1;
        threshold = parseFloat(html_threshold.value);
        threshold_display.innerHTML = parseFloat(html_threshold.value);
        grid.clearGrid();
        setup(radius_vl);
    }

    function getMouseCoords(e) {
        const rect = canvas.getBoundingClientRect();
        return [e.clientX - rect.x, e.clientY - rect.y];
    }

    function marshingSquares(){
        let segments = [];
        let segments2 = [];
        let segments3 = [];
        let segments4 = [];
        let segments5 = [];
        for(let i = 0; i < grid.ncols - 1; i++) {
            for(let j = 0; j < grid.nrows - 1; j++) {
                const cellPoints = [
                    grid.getNode(j, i),
                    grid.getNode(j, i + 1),
                    grid.getNode(j + 1, i + 1),
                    grid.getNode(j + 1, i)
                ]
                for (const s of getSegments(cellPoints, threshold)) {
                    segments.push(s);
                }
                for (const s of getSegments(cellPoints, threshold*5)) {
                    segments2.push(s);
                }
                for (const s of getSegments(cellPoints, threshold*4)) {
                    segments3.push(s);
                }
                for (const s of getSegments(cellPoints, threshold*3)) {
                    segments4.push(s);
                }
                for (const s of getSegments(cellPoints, threshold*2)) {
                    segments5.push(s);
                }
            }
        }
        return [segments, segments2, segments3, segments4, segments5];
    }

    function drawingLines(segments, color){
        ctx.strokeStyle = color;
        for (const s of segments) {
            ctx.beginPath();
            ctx.moveTo(s[0].x, s[0].y);
            ctx.lineTo(s[1].x, s[1].y);
            ctx.stroke();
        } 
    }


    function setup(radius){
        

        for (const point of allPoints) {
            grid.applyInfluence(point.x, point.y, radius);
        }

        for (const point of allPoints) {
            grid.applyInfluence(point.x, point.y, radius - 40);
        }

        for (const point of allPoints) {
            grid.applyInfluence(point.x, point.y, radius - 30);
        }

        for (const point of allPoints) {
            grid.applyInfluence(point.x, point.y, radius - 20);
        }

        for (const point of allPoints) {
            grid.applyInfluence(point.x, point.y, radius - 10);
        }
        let [segments, segments2, segments3, segments4, segments5] = marshingSquares();

        drawingLines(segments, "white");
        drawingLines(segments2, "red");
        drawingLines(segments3, "orange");
        drawingLines(segments4, "yellow");
        drawingLines(segments5, "green");
    }


    let default_mode = true;
    let advanced_mode = false;

    let html_default_button = document.getElementById("default");
    html_default_button.onclick = function(){
        default_mode = true;
        advanced_mode = false;
    }

    let html_advanced_button = document.getElementById("advanced");
    html_advanced_button.onclick = function(){
        default_mode = false;
        advanced_mode = true;
    }

    let flag = false;
    canvas.onmousedown = e => {
        flag = true;
        if (advanced_mode){
            grid.clearGrid();
            [x, y] = getMouseCoords(e);
            grid.clearGrid();
            allPoints.push({x, y});
            setup(radius_vl);
            allPoints.pop();
        }
        if (default_mode){
            grid.clearGrid();
            [x, y] = getMouseCoords(e);
            allPoints.push({x, y});
            setup(radius_vl);
        }
    }

    canvas.onmouseup = e => {
        flag = false;
        grid.clearGrid();
        setup(radius_vl);
    }

    let count = 0;
    canvas.onmousemove = e => {
        if (advanced_mode){
            if (flag){
                [x, y] = getMouseCoords(e);
                count ++;
                if (count == 3){
                    grid.clearGrid();
                    allPoints.push({x, y});
                    setup(radius_vl);
                    allPoints.pop();
                    count = 0;
                }
                canvas.onmouseout = handlerOut;
                function handlerOut(event) {
                    if (event.type === 'mouseout') {
                        flag = false;
                        grid.clearGrid();
                        setup(radius_vl);
                    }
                }
            }
        }
    }
}

function newGrid(ctx, cellSide) {
    const ncols = Math.ceil(ctx.canvas.width / cellSide) + 1;
    const nrows = Math.ceil(ctx.canvas.height / cellSide) + 1;

    const nodeValues = [];
    for (let x = 0; x < ncols; x++) {
        for (let y = 0; y < nrows; y++) {
            nodeValues.push(0);
        }
    }

    const getIndex = (numX, numY) => numX*nrows + numY;

    return {
        cellSide,
        nodeValues,
        ncols,
        nrows,

        getNode: (numX, numY) => { 
            if (numX < 0 || numX >= ncols) { throw `wrong numX: ${numX}`; }
            if (numY < 0 || numY >= nrows) { throw `wrong numY: ${numY}`; }
            
            const x = numX*cellSide;
            const y = numY*cellSide;
           
            return { x, y, value: nodeValues[getIndex(numX, numY)] }; 
            
        }, 

        applyInfluence: (pointX, pointY, r, f) => { 
            if (f === undefined) {
                const rr = r*r;
                
                f = (dd) => {
                    if (rr >= dd) { return (rr - dd) / rr; } 
                    return 0;
                }
            }
            
            let minX = Math.floor((pointX - r)/cellSide); 
            let minY = Math.floor((pointY - r)/cellSide);
            let maxX = Math.ceil((pointX + r)/cellSide);
            let maxY = Math.ceil((pointY + r)/cellSide);

            if (minX < 0) {minX = 0;}
            if (minY < 0) {minY = 0;}

            if (maxX >= nrows) {maxX = ncols - 1;}
            if (maxY >= ncols) {maxY = nrows - 1;}

            for (let numX = minX; numX <= maxX; numX++) {
                for (let numY = minY; numY <= maxY; numY++) {
                    const x = numX*cellSide;
                    const y = numY*cellSide;
                    const dx = pointX - x;
                    const dy = pointY - y;
                    const dd = dx*dx + dy*dy;

                    nodeValues[getIndex(numX, numY)] += f(dd); 
                }
            }
            return nodeValues
        },

        clearGrid: () => {
            for (let i = 0; i < nodeValues.length; i++) {
                nodeValues[i] = 0;
            }
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        },
    };
}

/*
0 --0-- 1
|       |
3       1
|       |
3 --2-- 2
*/


const SEGMENT_TABLE = [
[],    
[ [0, 3], ],    
[ [0, 1], ],    
[ [1, 3], ],
[ [1, 2], ],    
[ [0, 3], [1, 2], ],    
[ [0, 2], ],    
[ [3, 2], ],    
[ [2, 3], ],    
[ [2, 0], ],    
[ [0, 1], [2, 3], ],    
[ [2, 1], ],    
[ [3, 1], ],    
[ [1, 0], ],
[ [3, 0], ],    
[],    
];


const SEGMENT_TO_VERTICES = [ [0, 1], [1, 2], [2, 3], [3, 0] ];

function getSegments(points, threshold) {
    let index = 0;
    if (points[0].value > threshold) { index |= 1; }
    if (points[1].value > threshold) { index |= 2; }
    if (points[2].value > threshold) { index |= 4; }
    if (points[3].value > threshold) { index |= 8; }

    const getMidpoint = (i, j, valuei, valuej) => {
        if (i < j){
            return i + Math.abs((threshold - valuei)/(valuej - valuei) * (i - j))
        };
        return i - Math.abs((threshold - valuei)/(valuej - valuei) * (i - j));
    };

    const answer = [];
    
    for (const segment of SEGMENT_TABLE[index]) {
        const [side1, side2] = segment;
        const [i11, i12] = SEGMENT_TO_VERTICES[side1];
        const [i21, i22] = SEGMENT_TO_VERTICES[side2];
        const m1 = getMidpoint(i11, i12);
        const m2 = getMidpoint(i21, i22);

        const v11 = points[i11];
        const v12 = points[i12];
        const v21 = points[i21];
        const v22 = points[i22];

        answer.push([
            { 
                x: getMidpoint(v11.x, v12.x, v11.value, v12.value),
                y: getMidpoint(v11.y, v12.y, v11.value, v12.value)
            },
            {
                x: getMidpoint(v21.x, v22.x, v21.value, v22.value),
                y: getMidpoint(v21.y, v22.y, v21.value, v22.value)
            },
        ]);
    }

    return answer;
}
