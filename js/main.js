const { app, BrowserWindow, screen, ipcMain } = require('electron');
let window;
/**
 * initialize the app
 */
app.whenReady().then(() => {
    const display = screen.getPrimaryDisplay().workAreaSize;
    window = new BrowserWindow({
        maxWidth: display.width,
        maxHeight: display.height,
        minWidth: 1440,
        minHeight: 810,
        width: 1440,
        height: 810,
        frame: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }});
    window.loadFile('./html/fractaltree.html');
    window.webContents.openDevTools();
    window.on('resize',() => window.webContents.send('resize'));
})

ipcMain.on('closeWindow', () => {
    window.close();
})

ipcMain.on('minWindow',  () => {
    window.minimize();
})

ipcMain.on('maxWindow',() => {
    if (window.isMaximized())
        window.unmaximize();
    else
        window.maximize(!window.isMaximized());
})

app.on('window-all-closed',() => {
    if (process.platform !== 'darwin')
        app.quit()
})
