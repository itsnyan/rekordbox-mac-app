const selectionInfoDiv = document.getElementById('selection-info');
const selectionsDiv = document.getElementById('selections');
const progressDiv = document.getElementById('progress');
const resultDiv = document.getElementById('result');
const actionsDiv = document.getElementById('actions');

const selectXmlFileBtn = document.getElementById('select-xml-btn');
const selectOutputBtn = document.getElementById('select-output-btn');
const startBtn = document.getElementById('start-btn');
const closeBtn = document.getElementById('close-btn');
const resetBtn = document.getElementById('reset-btn');

const selectedXmlElement = document.querySelector('#selected-xml');
const selectedOutputElement = document.querySelector('#selected-output');

let xmlFilePath = null;
let outputDir = null;

selectXmlFileBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectXmlFile();
  
  if (result) {
    xmlFilePath = result;
    selectXmlFileBtn.style.display = 'none';

    if (outputDir) {
      startBtn.style.display = 'block';
    } else {
      selectOutputBtn.style.display = 'block'; 
    }

    selectedXmlElement.innerHTML = `<p>Collection XML → ${xmlFilePath}</p>`;

    const removeXmlBtn = document.createElement('p');
    removeXmlBtn.classList.add('remove-btn');
    selectedXmlElement.appendChild(removeXmlBtn);

    removeXmlBtn.addEventListener('click', () => {
      xmlFilePath = null;
      selectedXmlElement.innerHTML = '<p>Select your Rekordbox collection XML</p>';
      selectXmlFileBtn.style.display = 'block';
      startBtn.style.display = 'none';

      if (!outputDir) {
        resetUI();
      } 
    });    
  } else {
    selectedXmlElement.innerHTML = `<p>No file selected, please select your Rekordbox collection XML!</p>`;
  }
});

selectOutputBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.selectOutputDirectory();
  
  if (result) {
    outputDir = result;

    selectOutputBtn.style.display = 'none';
    startBtn.style.display = 'block';
    selectedOutputElement.innerHTML = `<p>Folder → ${outputDir}</p>`;

    const removeOutputBtn = document.createElement('p');
    removeOutputBtn.classList.add('remove-btn'); 
    selectedOutputElement.appendChild(removeOutputBtn);

    removeOutputBtn.addEventListener('click', () => {
      outputDir = null;

      if (!xmlFilePath) {
        resetUI();
      } else {
        selectedOutputElement.innerHTML = '<p>Choose where to save your backup 📂</p>';
        selectOutputBtn.style.display = 'block';
        startBtn.style.display = 'none';
      }
    });

  } else {
    selectedOutputElement.innerHTML = `<p>No directory selected, please select a folder to backup your playlist collection and tracks!</p>`;
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
      startBtn.style.display = 'none';
      resultDiv.style.display = 'block';
      closeBtn.style.display = 'block';

      document.querySelectorAll('.remove-btn').forEach((btn) => {
        btn.style.display = 'none';
      });

    } else {
      const warningElement = document.createElement('p');
      warningElement.textContent = result.message;
      warningElement.classList.add('warning');
      resultDiv.appendChild(warningElement);
    }
  } else {
    const errorElement = document.createElement('p');
    errorElement.textContent = 'Please select both XML file and output directory.';
    selectionsDiv.appendChild(errorElement);
  }
});

closeBtn.addEventListener('click', async () => {
  await window.electronAPI.closeApp();
});

function resetUI() {
  selectedOutputElement.innerHTML = '';
  selectOutputBtn.style.display = 'none';

  selectXmlFileBtn.style.display = 'block';
  selectedXmlElement.innerHTML = '<p>Select your Rekordbox collection XML</p>';
}

resetUI();
