const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectXmlFile: () => ipcRenderer.invoke('select-xml-file'),
  selectOutputDirectory: () => ipcRenderer.invoke('select-output-directory'),
  processXmlFile: (xmlFilePath, outputDir) => ipcRenderer.invoke('process-xml-file', xmlFilePath, outputDir),
  openOutputFolder: () => ipcRenderer.invoke('open-output-folder'),
  closeApp: () => ipcRenderer.invoke('close-app'),
  resetOutputFolder: () => ipcRenderer.invoke('reset-output-folder')
});

ipcRenderer.on('asynchronous-message', (event, message) => {
  const progressDiv = document.getElementById('progress');
  const logElement = document.createElement('p');

  if (message.type === 'success') {
    progressDiv.innerHTML += `<p class="success">Selected Output Directory: ${message.data}</p>`;
  } else if (message.type === 'error') {
    logElement.className = 'error';
    logElement.textContent = message.data;
    progressDiv.appendChild(logElement);
  } else if (message.type === 'log') {
    console.log(message.data);
    return;
  } else {
    console.warn('Received message with unknown type:', message);
    return;
  }

  progressDiv.scrollTop = progressDiv.scrollHeight;
});
