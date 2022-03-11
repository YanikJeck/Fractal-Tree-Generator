const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

function closeWindow() {
    ipc.send('closeWindow');
}

function maximizeWindow() {
    canvasSave = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ipc.send('maxWindow');
}

function minimizeWindow() {
    ipc.send('minWindow');
}

/**
 * preserve the image on canvas in case of window resize
 */
ipc.on('resize',() => {
    setTimeout(() => {
        let newX =  canvas.width/2 - canvasSave.width/2;
        let newY = canvas.height - canvasSave.height;
        ctx.putImageData(canvasSave, newX, newY)
    },100);
})


/**
 * User may download the image on the canvas
 */
function download() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'tree.png';
    link.click();
}

/**
 * loop over all sliders and set random values to each of them
 * to create a randomized tree
 */
function randomizeValues() {
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

