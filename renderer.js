const outputDiv = document.getElementById('output');
const progressDiv = document.getElementById('progress');
const resultDiv = document.getElementById('result');
const actionsDiv = document.getElementById('actions');

const selectXmlFileButton = document.getElementById('select-xml-file');
const selectOutputDirectoryButton = document.getElementById('select-output-directory');
const startProcessingButton = document.getElementById('start-processing');

const openOutputFolderButton = document.getElementById('openOutputFolderButton');
const closeAppButton = document.getElementById('closeAppButton');
const resetOutputFolderButton = document.getElementById('resetOutputFolderButton');

let xmlFilePath = '';
let outputDir = '';

// Event listeners for selecting XML file and output directory
selectXmlFileButton.addEventListener('click', async () => {
  const result = await window.electronAPI.selectXmlFile();
  if (result) {
    xmlFilePath = result;
    outputDiv.innerHTML = `<p>Selected XML File: ${xmlFilePath}</p>`;
  } else {
    outputDiv.innerHTML = `<p>No file selected.</p>`;
  }
});

selectOutputDirectoryButton.addEventListener('click', async () => {
  const result = await window.electronAPI.selectOutputDirectory();
  if (result) {
    outputDir = result;
    outputDiv.innerHTML += `<p>Selected Output Directory: ${outputDir}</p>`;
  } else {
    outputDiv.innerHTML += `<p>No directory selected.</p>`;
  }
});

// Event listener for starting the processing
startProcessingButton.addEventListener('click', async () => {
  if (xmlFilePath && outputDir) {
    const result = await window.electronAPI.processXmlFile(xmlFilePath, outputDir);
    if (result.success) {
      const successElement = document.createElement('p');
      successElement.textContent = 'Processing complete!';
      successElement.classList.add('success');
      resultDiv.appendChild(successElement);
      actionsDiv.style.display = 'block';
      startProcessingButton.disabled = true;
    } else {
      const warningElement = document.createElement('p');
      warningElement.textContent = result.message;
      warningElement.classList.add('warning');
      resultDiv.appendChild(warningElement);
    }
  } else {
    const errorElement = document.createElement('p');
    errorElement.textContent = 'Please select both XML file and output directory.';
    outputDiv.appendChild(errorElement);
  }
});

// Event listener for opening the output folder
openOutputFolderButton.addEventListener('click', () => {
  window.electronAPI.openOutputFolder();
});

// Event listener for closing the application
closeAppButton.addEventListener('click', () => {
  window.electronAPI.closeApp();
});

// Event listener for resetting output folder (backup to another folder)
resetOutputFolderButton.addEventListener('click', () => {
  window.electronAPI.resetOutputFolder();
});

// IPC event listener for enabling/disabling buttons based on folder selection
window.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.onFolderSelected((folderSelected) => {
    openOutputFolderButton.disabled = !folderSelected;
    resetOutputFolderButton.disabled = !folderSelected;
  });
});

// IPC event listener for displaying progress messages
window.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.onProgressMessage((message) => {
    const logElement = document.createElement('p');
    
    if (message.type === 'success') {
      logElement.classList.add('success');
    } else if (message.type === 'error') {
      logElement.classList.add('error');
    } else {
      console.warn('Received message with unknown type:', message);
      return;
    }
    
    logElement.textContent = message.data;
    progressDiv.appendChild(logElement);
    progressDiv.scrollTop = progressDiv.scrollHeight;
  });
});
