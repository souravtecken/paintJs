const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d', {alpha: false});
const Paint = new PaintJs(ctx, canvas);

canvas.addEventListener("mousemove", (event) => {
    if(event.buttons == 1)
        Paint.drawPath(event.offsetX, event.offsetY);
})

canvas.addEventListener("contextmenu", (event) => {
    const color = ctx.fillStyle;
    Paint.paintBucket(event.offsetX, event.offsetY, hexToRGB(color));
})

canvas.addEventListener("mousedown", (event) => {
    Paint.drawPath(event.offsetX, event.offsetY);
})

canvas.addEventListener("mouseup", () => {
    Paint.startPath();
})

function initToolBox(){
    const toolButtonWidth = $('.toolButtonBox').width();
    $('.toolButtonBox').css({'height':`${toolButtonWidth}px`});

    $('.ui.dropdown')
        .dropdown();
}

$('.colorOption').click((event) => {
    event.stopPropagation(); // To prevent dropdown from closing
    const child = event.target.querySelector('div');
    const colorPicker = event.target.querySelector('input');
    if (colorPicker !== null){
        $(colorPicker).click();
        return;
    }
    let color;
    if(child === null)
        color = window.getComputedStyle(event.target, null).getPropertyValue('background-color');
    else
        color = window.getComputedStyle(event.target.querySelector('div'), null).getPropertyValue('background-color');
    Paint.setStrokeColor(color);
    Paint.setFillColor(color);
    $('#colorPaletteTool button').css('color', color);
});

$('#colorPicker').on('input', ((event) => {
    const color = event.target.value;
    Paint.setStrokeColor(color);
    Paint.setFillColor(color);
    $('#colorPaletteTool button').css('color', color);
}))

$('#strokePicker').on('input', (event) => {
    const width = event.target.value;
    Paint.setStrokeWidth(width);
})

$('#clearTool').click(() => {
    Paint.initCanvas();
})

Paint.initCanvas();
initToolBox();