class PaintJs {
    constructor(ctx, canvas){
        this.ctx = ctx;
        this.canvas = canvas;
        this.strokeWidth = 1;
    }
    initCanvas(){
        const prevFillStyle = ctx.fillStyle;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        this.ctx.fillStyle = prevFillStyle;
    }

    resizeCanvas(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.initCanvas();
    }

    setStrokeColor(color){
        this.ctx.strokeStyle = color;
    }

    setFillColor(color){
        this.ctx.fillStyle = color;
    }

    setStrokeWidth(width){
        this.strokeWidth = width;
        this.ctx.lineWidth = width;
    }

    startPath(){
        this.ctx.beginPath();
    }

    endPath(){
        this.ctx.closePath();
    }

    movePoint(x, y){
        this.x = x;
        this.y = y;
    }

    paintBucket(x, y, color){
        const canvasHeight = this.canvas.clientHeight;
        const canvasWidth = this.canvas.clientWidth;
        const pixelColorGrid = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    
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
        this.ctx.putImageData(pixelColorGrid, 0, 0);
    }

    drawPoint(x, y) {
        this.ctx.lineWidth = 1;
        this.ctx.arc(x, y, parseInt(this.strokeWidth/2), 0, 2 * Math.PI * parseInt(this.strokeWidth/2));
        this.ctx.lineWidth = this.strokeWidth;
        this.ctx.fill();
    }
    
    drawLineNoAliasing(sx, sy, tx, ty) {
        const dist = DBP(sx,sy,tx,ty);
        const ang = getAngle(tx-sx,ty-sy);
        for(let i=0;i < dist; ++i) {
            this.ctx.fillRect(Math.round(sx + Math.cos(ang)*i - this.ctx.lineWidth/2),
                         Math.round(sy + Math.sin(ang)*i - this.ctx.lineWidth/2),
                         this.ctx.lineWidth,this.ctx.lineWidth);
        }
    }

    drawPath(x, y) {
        this.drawLineNoAliasing(this.x, this.y, x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.drawPoint(x, y);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.movePoint(x, y);
    }
}

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

function DBP(x1,y1,x2,y2) {
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}
// finds the angle of (x,y) on a plane from the origin
function getAngle(x, y) { 
    return Math.atan(y/(x==0?0.01:x))+(x<0?Math.PI:0); 
}