function compareColors(color1, color2){
    // compares 2 getImageData().data objects;
    return (
        color1[0] === color2[0] && color1[1] === color2[1] &&
        color1[2] === color2[2] && color1[3] === color2[3]
    )
}

function hexToRGB(hex){
    hex = hex.charAt(0) == "#" ? hex.substring(1,7) : hex;
    let R = parseInt(hex.substring(0,2), 16);
    let G = parseInt(hex.substring(2,4), 16);
    let B = parseInt(hex.substring(4,6), 16);
    return [R, G, B, 255];    
}

function initCanvas(ctx){
    const prevFillStyle = ctx.fillStyle;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    ctx.fillStyle = prevFillStyle;
}

function resizeCanvas(canvas, ctx, width, height){
    canvas.width = width;
    canvas.height = height;
    initCanvas(ctx);
}

function setStrokeColor(ctx, color){
    ctx.strokeStyle = color;
}

function setFillColor(ctx, color){
    ctx.fillStyle = color;
}

function paintBucket(ctx, x, y, color){
    const canvasHeight = ctx.canvas.clientHeight;
    const canvasWidth = ctx.canvas.clientWidth;
    const pixelColorGrid = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    let index = (y * canvasWidth + x) * 4;
    const originPixelColor = [pixelColorGrid.data[index], pixelColorGrid.data[index + 1],
                              pixelColorGrid.data[index + 2], pixelColorGrid.data[index + 3]];

    if(compareColors(color, originPixelColor))
        return;

    const compareColorWithOrigin = (index) => {
        return (
            pixelColorGrid.data[index] === originPixelColor[0] &&
            pixelColorGrid.data[index + 1] === originPixelColor[1] &&
            pixelColorGrid.data[index + 2] === originPixelColor[2] &&
            pixelColorGrid.data[index + 3] === originPixelColor[3]
        );
    }
            
    const pixelStack = new Array([x, y]);
    while(pixelStack.length) {
        let coord = pixelStack.pop();
        x = coord[0];
        y = coord[1];

        index = (y * canvasWidth + x) * 4;
        if(x-1 >= 0 && compareColorWithOrigin(index - 4))
            pixelStack.push([x-1, y]);
        if(x+1 < canvasWidth && compareColorWithOrigin(index + 4))
            pixelStack.push([x+1, y]);
        if(y-1 >= 0 && compareColorWithOrigin(index - canvasWidth * 4))
            pixelStack.push([x, y-1]);
        if(y+1 < canvasHeight && compareColorWithOrigin(index + canvasWidth * 4))
            pixelStack.push([x, y+1]);
        // Fill color
        pixelColorGrid.data[index] = color[0];
        pixelColorGrid.data[index + 1] = color[1];
        pixelColorGrid.data[index + 2] = color[2];
        pixelColorGrid.data[index + 3] = color[3];    
    }
    ctx.putImageData(pixelColorGrid, 0, 0);
}

function drawPath(ctx, x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
}