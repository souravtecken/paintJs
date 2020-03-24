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
    const originPixelColor = ctx.getImageData(x, y, 1, 1).data;
    const pixelQueue = new Array([x, y]); // Initialise queue with initial coords
    const canvasHeight = ctx.canvas.clientHeight;
    const canvasWidth = ctx.canvas.clientWidth;
    const imageData = ctx.getImageData(0, 0, canvasHeight, canvasWidth);
    console.log(imageData);
    if(x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight){        
        while(pixelQueue.length != 0){        
            const coord = pixelQueue.pop();
            x = coord[0];
            y = coord[1];
            if(x-1 >= 0 && compareColors(ctx.getImageData(x-1, y, 1, 1).data, originPixelColor))
                pixelQueue.push([x-1, y]);
            if(x+1 < canvasWidth && compareColors(ctx.getImageData(x + 1, y, 1, 1).data, originPixelColor))
                pixelQueue.push([x+1, y]);
            if(y-1 >= 0 && compareColors(ctx.getImageData(x, y-1, 1, 1).data, originPixelColor))
                pixelQueue.push([x, y-1]);
            if(y+1 < canvasHeight && compareColors(ctx.getImageData(x, y+1, 1, 1).data, originPixelColor))
                pixelQueue.push([x, y+1]);
            ctx.fillRect(x, y, 1, 1);
        }
    }   
    console.log(imageData); 
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