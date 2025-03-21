
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tokenInput = document.getElementById('token-input');
  const loginBtn = document.getElementById('login-btn');
  const serverStatusContainer = document.getElementById('server-status-container');
  const portSelect = document.getElementById('port-select');
  const mobilizeBtn = document.getElementById('mobilize-btn');
  const standdownBtn = document.getElementById('standdown-btn');
  const diagnosticsBtn = document.getElementById('diagnostics-btn');
  const diagnosticsContainer = document.getElementById('diagnostics-container');

  // State
  let authToken = localStorage.getItem('imperialToken') || '';
  let serverPorts = [];

  // Initialize
  if (authToken) {
    tokenInput.value = '********';
    enableControls();
    fetchServerStatus();
  }

  // Event Listeners
  loginBtn.addEventListener('click', handleLogin);
  mobilizeBtn.addEventListener('click', () => sendDecree('MOBILIZE'));
  standdownBtn.addEventListener('click', () => sendDecree('STAND_DOWN'));
  diagnosticsBtn.addEventListener('click', fetchDiagnostics);
  portSelect.addEventListener('change', updateButtonStates);

  // Functions
  async function handleLogin() {
    authToken = tokenInput.value;
    if (!authToken) return;
    
    try {
      const response = await fetchServerStatus();
      if (response) {
        localStorage.setItem('imperialToken', authToken);
        tokenInput.value = '********';
        enableControls();
      }
    } catch (error) {
      authToken = '';
      alert('Authentication failed: ' + error.message);
    }
  }

  function enableControls() {
    mobilizeBtn.disabled = false;
    standdownBtn.disabled = false;
    diagnosticsBtn.disabled = false;
  }

  async function fetchServerStatus() {
    try {
      const response = await fetchWithAuth('/v1/admin/status');
      const data = await response.json();
      
      if (data) {
        updateStatusDisplay(data);
        updatePortOptions(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      serverStatusContainer.innerHTML = `<p class="status-failed">Error: ${error.message}</p>`;
    }
  }

  function updateStatusDisplay(data) {
    let html = '<table><tr><th>Port</th><th>Role</th><th>Status</th><th>Last Activation</th></tr>';
    
    Object.entries(data).forEach(([port, info]) => {
      const statusClass = info.status === 'ACTIVE' ? 'status-active' : 'status-dormant';
      const lastActivation = info.lastActivation ? new Date(info.lastActivation).toLocaleString() : 'Never';
      
      html += `
        <tr>
          <td>${port}</td>
          <td>${info.role}</td>
          <td class="${statusClass}">${info.status}</td>
          <td>${lastActivation}</td>
        </tr>
      `;
    });
    
    html += '</table>';
    serverStatusContainer.innerHTML = html;
  }

  function updatePortOptions(data) {
    serverPorts = Object.keys(data);
    
    // Clear existing options except the placeholder
    while (portSelect.options.length > 1) {
      portSelect.remove(1);
    }
    
    // Add new options
    serverPorts.forEach(port => {
      const option = document.createElement('option');
      option.value = port;
      option.textContent = `${port} - ${data[port].role}`;
      portSelect.appendChild(option);
    });
  }

  function updateButtonStates() {
    const selectedPort = portSelect.value;
    if (!selectedPort) {
      mobilizeBtn.disabled = true;
      standdownBtn.disabled = true;
      return;
    }
    
    mobilizeBtn.disabled = false;
    standdownBtn.disabled = false;
  }

  async function sendDecree(command) {
    const port = portSelect.value;
    if (!port) return;
    
    try {
      const response = await fetchWithAuth(`/v1/admin/decree/${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
      });
      
      const data = await response.json();
      alert(`Decree result: ${data.decree}`);
      fetchServerStatus();
    } catch (error) {
      alert('Error sending decree: ' + error.message);
    }
  }

  async function fetchDiagnostics() {
    try {
      const response = await fetchWithAuth('/v1/admin/diagnostics');
      const data = await response.json();
      
      diagnosticsContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      diagnosticsContainer.innerHTML = `<p class="status-failed">Error: ${error.message}</p>`;
    }
  }

  async function fetchWithAuth(url, options = {}) {
    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${authToken}`;
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return response;
  }

  // Auto-refresh status every 30 seconds if authenticated
  setInterval(() => {
    if (authToken) {
      fetchServerStatus();
    }
  }, 30000);
});
