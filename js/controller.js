const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;
const minimize = document.getElementById('minimize');
const maximize = document.getElementById('maximize');
const exitOnClose = document.getElementById('exitOnClose');

minimize.onclick = function () {
    ipc.send('minWindow');
};

maximize.onclick = function () {
    canvasSave = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ipc.send('maxWindow');
};

exitOnClose.onclick = function () {
    ipc.send('closeWindow');
};

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
