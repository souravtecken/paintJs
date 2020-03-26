const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d', {alpha: false});

canvas.addEventListener("mousemove", (event) => {
    if(event.buttons == 1)
        drawPoint(ctx, event.offsetX, event.offsetY, 1);
})

canvas.addEventListener("click", (event) => {
    drawPoint(ctx, event.offsetX, event.offsetY, 1);
})

canvas.addEventListener("contextmenu", (event) => {
    const color = ctx.fillStyle;
    paintBucket(ctx, event.offsetX, event.offsetY, hexToRGB(color));
})

canvas.addEventListener("mousedown", (event) => {
    ctx.moveTo(event.offsetX, event.offsetY);
})

function initToolBox(){
    const toolButtonWidth = $('.toolButtonBox').width();
    $('.toolButtonBox').css({'height':`${toolButtonWidth}px`});

    $('.ui.dropdown')
        .dropdown();
}

initCanvas(ctx);
initToolBox();