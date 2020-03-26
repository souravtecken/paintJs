const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d', {alpha: false});

canvas.addEventListener("mousemove", (event) => {
    if(event.buttons == 1)
        drawPath(ctx, event.offsetX, event.offsetY);
})

canvas.addEventListener("click", (event) => {
    drawPath(ctx, event.offsetX, event.offsetY);
})

canvas.addEventListener("contextmenu", (event) => {
    const color = ctx.fillStyle;
    paintBucket(ctx, event.offsetX, event.offsetY, hexToRGB(color));
})

canvas.addEventListener("mousedown", (event) => {
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
})

function initToolBox(){
    const toolButtonWidth = $('.toolButtonBox').width();
    $('.toolButtonBox').css({'height':`${toolButtonWidth}px`});

    $('.ui.dropdown')
        .dropdown();
}

$(".colorOption").click((event) => {
    const child = event.target.querySelector('div');
    let color;
    if(child === null)
        color = window.getComputedStyle(event.target, null).getPropertyValue("background-color");
    else
        color = window.getComputedStyle(event.target.querySelector('div'), null).getPropertyValue("background-color");
    setStrokeColor(ctx, color);
    setFillColor(ctx, color);
});

initCanvas(ctx);
initToolBox();