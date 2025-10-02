window.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({filterMode: 'hide'}, (result) => {
        const mode = result.filterMode;
        const radioElement = document.getElementById(mode);
        if (radioElement) {
            radioElement.checked = true;
        }
    });
});

document.querySelectorAll('input[name="filterMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const mode = e.target.value;
        
        chrome.storage.sync.set({ filterMode: mode }, () => {
            const status = document.getElementById('status');
            status.classList.add('show');
            setTimeout(() => {
                status.classList.remove('show');
            }, 2000);
            
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { 
                        action: 'updateFilterMode', 
                        mode: mode 
                    }).catch(err => console.log('Could not send message to tab:', err));
                }
            });
        });
    });
});