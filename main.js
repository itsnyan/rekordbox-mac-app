
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { xml2json } = require('xml-js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools(); //uncomment for debugging

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('select-xml-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'XML Files', extensions: ['xml'] }]
  });

  return result.filePaths.length > 0 ? result.filePaths[0] : null;
});

ipcMain.handle('select-output-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory']
  });

  return result.filePaths.length > 0 ? result.filePaths[0] : null;
});

ipcMain.handle('process-xml-file', async (event, xmlFilePath, outputDir) => {
  try {
    const { playlists = [] } = await parseXML(xmlFilePath);
    process.chdir(outputDir);
    await backupHandler(playlists);

    return { success: true };
  } catch (error) {
    console.error('Error during processing:', error);
    return { success: false, message: error.message };
  }
});

async function parseXML(filePath) {
  const xmlData = await fs.promises.readFile(filePath, 'utf8');
  const json = JSON.parse(xml2json(xmlData, { compact: true, spaces: 4 }));
  const tracks = extractTracks(json);
  const playlists = extractPlaylists(json);
  const trackMap = new Map();

  tracks.forEach(track => {
    trackMap.set(track._attributes.TrackID, track);
  });

  const mappedPlaylist = mapPlaylistToTracks(trackMap, playlists);

  logMessage({tracks});
  logMessage({playlists})
  logMessage({mappedPlaylist});
  logMessage({trackMap});

  return { playlists: mappedPlaylist, tracks };
}

function extractTracks(json) {
  const tracks = json.DJ_PLAYLISTS.COLLECTION.TRACK;
  return Array.isArray(tracks) ? tracks : [tracks];
}

function extractPlaylists(json) {
  const playlists = json.DJ_PLAYLISTS.PLAYLISTS.NODE.NODE;
  return Array.isArray(playlists) ? playlists : [playlists];
}

function mapPlaylistToTracks(trackMap, playlists) {
  return playlists.map(playlist => {
    const mappedTracks = (playlist.TRACK || []).map(track => trackMap.get(track?._attributes?.Key)).filter(Boolean);

    return {
      name: playlist._attributes.Name,
      tracks: mappedTracks
    };
  });
}

async function backupHandler(playlists) {
  try {
    for (const playlist of playlists) {
      const playlistName = playlist.name;
      const folderPath = path.join('.', playlistName);

      if (!fs.existsSync(folderPath)) {
        await fs.mkdir(folderPath);
        logMessage(`Created folder for playlist '${playlistName}'`, 'success');
      } else {
        logError(`Folder for playlist '${playlistName}' already exists`, 'error');
      }

      for (const track of playlist.tracks) {
        const filePath = track._attributes.Location.replace('file://localhost', '');
        const decodedFilePath = decodeURIComponent(filePath);
        const fileName = path.basename(decodedFilePath);
        const destinationPath = path.join(folderPath, fileName);

        try {
          await fs.copyFile(decodedFilePath, destinationPath);
          logMessage(`Copied file '${fileName}' to folder '${playlistName}'`, 'success');
        } catch (error) {
          logError(`Error copying file '${fileName}' to folder '${playlistName}':`, 'error');
        }
      }
    }
  } catch (error) {
    console.error('Error occurred while creating backup folders:', error);
    throw error;
  }
}

function writeToFile(filename, data) {
  fs.writeFile(filename, data, 'utf8', (err) => {
      if (err) {
          console.log(err);
          return;
      }
      else {
         console.log("Data written to", filename);
          return;
      }
  });
}

// Function to send asynchronous messages to renderer process
function sendAsyncMessage(data, type) {
  if (mainWindow) {
    mainWindow.webContents.send('asynchronous-message', { data, type });
  }
}

// Example usage: send a log message
function logMessage(data, type = 'log') {
  sendAsyncMessage(data, type);
}

// Example usage: send an error messag
function logError(error) {
  sendAsyncMessage(error, 'error');
}

