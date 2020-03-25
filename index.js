const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');

function compareColors(color1, color2){
    // compares 2 getImageData().data objects;
    return (
        color1[0] === color2[0] && color1[1] === color2[1] &&
        color1[2] === color2[2] && color1[3] === color2[3]
    )
}

function initCanvas(ctx){
    const canvas = document.getElementById("myCanvas");
    // ctx.fillStyle = '#FF0000';
    // ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);    
}

function drawRectangle(ctx, x, y, width, height){
    ctx.strokeRect(x, y, width, height);
}

function paintBucket(ctx, x, y){
    // TODO: Don't paint if origin color's same as brush color
    // TODO: Take in color from canvas fill color
    const canvasHeight = ctx.canvas.clientHeight;
    const canvasWidth = ctx.canvas.clientWidth;
    const pixelColorGrid = ctx.getImageData(0, 0, canvasHeight, canvasWidth);
    const color = [0, 0, 0, 255];
    const originPixelColor = [0, 0, 0, 0];

    const compareColors = (index) => {        
        return (
            pixelColorGrid.data[index] === originPixelColor[0] &&
            pixelColorGrid.data[index + 1] === originPixelColor[1] &&
            pixelColorGrid.data[index + 2] === originPixelColor[2] &&
            pixelColorGrid.data[index + 3] === originPixelColor[3] 
        );
    }

    const fillColor = (index) => {
        pixelColorGrid.data[index] = color[0];
        pixelColorGrid.data[index + 1] = color[1];
        pixelColorGrid.data[index + 2] = color[2];
        pixelColorGrid.data[index + 3] = color[3];
    }

    const pixelStack = new Array([x, y]);
    while(pixelStack.length) {
        let coord = pixelStack.pop();
        x = coord[0];
        y = coord[1];

        let index = (y * canvasWidth + x) * 4;
        if(x-1 >= 0 && compareColors(index))
            pixelStack.push([x-1, y]);
        if(x+1 < canvasWidth && compareColors(index))
            pixelStack.push([x+1, y]);
        if(y-1 >= 0 && compareColors(x, y))
            pixelStack.push([x, y-1]);
        if(y+1 < canvasHeight && compareColors(index))
            pixelStack.push([x, y+1]);
        fillColor(index);
    }

    ctx.putImageData(pixelColorGrid, 0, 0);
}

const drawPoint = (ctx, x, y) => {
    ctx.lineTo(x, y);
    ctx.stroke();
}

canvas.addEventListener("mousemove", (event) => {    
    if(event.buttons == 1)
        drawPoint(ctx, event.clientX, event.clientY, 1);
})

canvas.addEventListener("click", (event) => {
    drawPoint(ctx, event.clientX, event.clientY, 1);
})

canvas.addEventListener("contextmenu", (event) => {
    paintBucket(ctx, event.clientX, event.clientY);
})

canvas.addEventListener("mousedown", (event) => {
    ctx.moveTo(event.clientX, event.clientY);
})


initCanvas(ctx);