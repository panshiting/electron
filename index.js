const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
let autoUpdater = require('electron-updater').autoUpdater
// 安装/卸载时处理创建/删除Windows上的快捷方式
if (require('electron-squirrel-startup')) {
  app.quit()
}

let win
function init () {
	win = new BrowserWindow({ width: 800, height: 600 })
	// win.setFullScreen(true)

	// 方法一: 可以读取本地网页
	// win.loadFile('index.html')
	// 方法二: 是将本地网址稍做转义
	// win.loadURL(`file://${__dirname}/index.html`);
  // win.loadURL(url.format({
	// 	pathname: path.join(__dirname, './index.html'),
	// 	protocol: 'file:',
	// 	slashes: true
	// }))
	// 方法三: 可以写入线上地址
	win.loadURL('https://genco.junengcloud.com')

	// win.webContents.openDevTools()
	win.on('closed', () => {
		win = null
  })
  // 退出取消全屏
  globalShortcut.register('ESC', () => {
    win.setFullScreen(false)
  })
  updater()
}

// 自动更新检测和事件监听
function updater () {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  }
  // 设置检测更新地址（参数为 软件所在位置）
  autoUpdater.setFeedURL('http://localhost:8000')

  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  })
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  })
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  })
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  })
  autoUpdater.on('download-progress', function (progressObj) {
    win.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', () => {
    // 关闭软件并安装新版本
    ipcMain.on('isUpdateNow', () => {
      autoUpdater.quitAndInstall()
    })
    win.webContents.send('isUpdateNow')
  })
  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates()
  })
}
function sendUpdateMessage (text) {
  win.webContents.send('message', text)
}

const createWindow = () => {
  globalShortcut.register('CommandOrControl+Y', () => {
    win.webContents.openDevTools();
  })
  globalShortcut.register('CommandOrControl+Q', () => {
    win.setFullScreen(true)
  })
  if (process.argv[1] == '--squirrel-firstrun') {
    init()
    return
  }
  init()
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})