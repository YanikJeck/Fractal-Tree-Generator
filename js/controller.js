const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

function closeWindow() {
    ipc.send('closeWindow');
}

function maximizeWindow() {
    ipc.send('maxWindow');
}

function minimizeWindow() {
    ipc.send('minWindow');
}

function download() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'tree.png';
    link.click();
}

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

function updateLabelData(data) {
    let label = data.labels[0];
    label.innerHTML = data.value;
}

function setPreviewColor(data) {
    const lbl = document.getElementById('colorPreview');
    lbl.style.backgroundColor = 'hsl('+data.value+',100%,50%)';
}

