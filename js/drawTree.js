const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const sliders = document.getElementsByClassName('Slider');
const multiSliders = document.getElementsByClassName('MultiSlider');
const headerHeight = document.getElementById('header').clientHeight;
const drawBtn = document.getElementById('button1');
const downloadBtn = document.getElementById('button2');
const randBtn = document.getElementById('button3');
const stopBtn = document.getElementById('button4');
let allowDrawing = true;
let canvasSave;

for (let i = 0; i < sliders.length; ++i) {
    sliders[i].oninput = function () {
        updateLabelData(this);
    }
}

for (let i = 0; i < multiSliders.length; i++) {
    multiSliders[i].oninput = function () {
        updateLabelData(this);
    }
}

/**
 * apply special function to slider displaying the selected color.
 */
document.getElementById('slider3').oninput = function () {
    updateLabelData(this);
    setPreviewColor(this);
}

document.body.onresize = function () {
    resize();
}

drawBtn.onclick = function () {
    drawTree();
}

/**
 * User may download the image on the canvas
 */
downloadBtn.onclick = function () {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'tree.png';
    link.click();
}

/**
 * loop over all sliders and set random values to each of them
 * to create a randomized tree
 */

randBtn.onclick = function () {
    for (let i = 0; i < sliders.length; i++) {
        sliders[i].value = Math.random()*(sliders[i].max-Number(sliders[i].min))+Number(sliders[i].min);
        sliders[i].labels[0].innerHTML = sliders[i].value;
    }
    for (let i = 0; i < multiSliders.length; i++) {
        multiSliders[i].value = Math.random()*(multiSliders[i].max-Number(multiSliders[i].min))+Number(multiSliders[i].min);
        multiSliders[i].labels[0].innerHTML = multiSliders[i].value;
    }
    setPreviewColor(sliders[2]);
}

stopBtn.onclick = function () {
    allowDrawing = false;
}

/**
 * temporarily save the current canvas
 */
window.addEventListener('mousemove', (mouse) => {
    if (mouse.clientY <= headerHeight.clientHeight+10 || mouse.clientY >= window.innerHeight-10 ||
        mouse.clientX >= window.innerWidth-10 || mouse.clientX <= 10) {
        canvasSave = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
})

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * changes the display of the label
 * to the selected slider value
 * @param data value to set the label display to
 */
function updateLabelData(data) {
    let label = data.labels[0];
    label.innerHTML = data.value;
}

/**
 * changes the display color for the preview
 * color representing the start color
 * @param data value to set the preview color to
 */
function setPreviewColor(data) {
    const lbl = document.getElementById('colorPreview');
    lbl.style.backgroundColor = 'hsl('+data.value+',100%,50%)';
}

/**
 * disables the current drawing flag
 * to stop potential drawing via recursion.
 * following a short timeout, a new tree is being drawn
 * with the initial conditions set to the slider values
 */
function drawTree() {
    allowDrawing = false;
    setTimeout(  function () {
        allowDrawing = true;
        resize();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createTree(canvas.width / 2, canvas.height, Math.PI, sliders[0].value, sliders[1].value, sliders[2].value, sliders[3].value);
    },50);
}

/**
 * creates random values for each parameter determined
 * by the range of each multi slider
 * @returns {*[]} random values for each customisable
 * property of the tree.
 */
function getRandomValues() {
    let randomValues = [];
    for (let i = 0; i < multiSliders.length-1; i+=2) {
        const val1 = multiSliders[i].value;
        const val2 = multiSliders[i+1].value;
        randomValues.push(Math.random() * (Math.max(val1,val2)-Math.min(val1,val2))+Math.min(val1,val2));
    }
    return randomValues;
}

/**
 * recursive part of the createTree function to draw smaller
 * lines at the end of the previous line.
 * @param steps sets the recursion depth, thus the tree depth
 * @param posX x coordinate for the start point of the new line
 * @param posY y coordinate for the start point of the new line
 * @param angle sets the angle for the new line
 * @param length sets the length for the new line
 * @param thickness sets the thickness of the new line
 * @param color sets the color for the new line
 * @returns {(function(): void)|*} as drawSubtree is used in a callback from
 * requestAnimationFrame, it has to return a function()
 */
function drawSubTree(steps, posX, posY, angle, length, thickness, color) {
    let randomValues = getRandomValues();
    let direction = 2*randomValues[3];
    return function () {
        if (steps-- > 0 && allowDrawing) {
            for (let i = 0; i < Math.round(randomValues[4]); i++) {
                direction *= 1 / (i * ((3 * randomValues[3] + 0.5) * i - (7 * randomValues[3] + 0.5)) + 2 * randomValues[3]);
                createTree(posX, posY, angle + direction * (Math.PI / randomValues[3]),
                    length / randomValues[0], thickness / randomValues[1], Number(color) + randomValues[2], steps);
                randomValues = getRandomValues();
                direction = 2 * randomValues[3];
            }
        }
    };
}

/**
 * tells the canvas api to draw a line with the specified parameters
 * @param thickness sets the thickness of the line
 * @param color set the color of the line
 * @param posX x coordinate of the start point
 * @param posY y coordinate of the start point
 * @param posX2 x coordinate of the end point
 * @param posY2 y coordinate of the end point
 */
function setCTXSettings(thickness, color, posX, posY, posX2, posY2) {
    ctx.lineWidth = thickness;
    ctx.strokeStyle = 'hsl(' + color + ',100%,50%)';
    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX2, posY2);
    ctx.stroke();
    ctx.closePath();
}

/**
 * draws a line with a certain thickness, length, angle, and color.
 * The starting point is specified by posX and posY.
 * The function calculates the end point through adding length*sin(angle)
 * to posX and length*cos(angle) to posY to get a line with the correct length
 * and desired angle.
 * @param posX x coordinate of the start point
 * @param posY y coordinate of the start point
 * @param angle sets the angle for the line
 * @param length sets the length of the line
 * @param thickness sets the thickness of the line
 * @param color sets the color for the line
 * @param steps determines the recursion depth
 */
function createTree(posX,posY,angle,length,thickness,color,steps) {
    const posX2 = posX + length *Math.sin(angle);
    const posY2 = posY + length *Math.cos(angle);
    setCTXSettings(thickness, color, posX, posY, posX2, posY2);
    requestAnimationFrame(drawSubTree(steps, posX2, posY2, angle, length, thickness, color));
}