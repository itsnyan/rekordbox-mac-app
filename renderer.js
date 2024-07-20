const outputDiv = document.getElementById('output');
const progressDiv = document.getElementById('progress');
const resultDiv = document.getElementById('result');
const actionsDiv = document.getElementById('actions');

const selectXmlFileBtn = document.getElementById('select-xml-btn');
const selectOutputBtn = document.getElementById('select-output-btn');
const startBtn = document.getElementById('start-btn');

// Selecting buttons
const openFolderBtn = document.getElementById('open-folder-btn');
const closeBtn = document.getElementById('close-btn');
const resetBtn = document.getElementById('reset-btn');

let xmlFilePath = '';
let outputDir = '';

selectXmlFileBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectXmlFile();
  
  if (result) {
    xmlFilePath = result;
    selectXmlFileBtn.style.display = 'none';
    selectOutputBtn.style.display = 'block';

    outputDiv.innerHTML = `<p>Selected XML File: ${xmlFilePath}</p>`;
  } else {
    outputDiv.innerHTML = `<p>No file selected, please select your Rekordbox collection XML!</p>`;
  }
});

selectOutputBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectOutputDirectory();
  if (result) {
    outputDir = result;
    selectOutputBtn.style.display = 'none';
    startBtn.style.display = 'block';

    outputDiv.innerHTML += `<p>Selected Output Directory: ${outputDir}</p>`;
  } else {
    outputDiv.innerHTML += `<p>No directory selected.</p>`;
  }
});

startBtn.addEventListener('click', async () => {
  if (xmlFilePath && outputDir) {
    progressDiv.style.display = 'block';
    const result = await window.electronAPI.processXmlFile(xmlFilePath, outputDir);
    if (result.success) {
      const successElement = document.createElement('p');
      successElement.textContent = 'Backup completed successfully!';
      successElement.classList.add('success');
      resultDiv.appendChild(successElement);
      resetBtn.style.display = 'block';
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


// todo utils

// function hideElement(element) {
//   element.style.display = 'none';
// }

// function showElement(element) {
//   element.style.display = 'block';
// }