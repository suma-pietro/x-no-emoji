let filterMode = 'hide'; // default

chrome.storage.sync.get({filterMode: 'hide'}, (result) => {
    filterMode = result.filterMode;
    setTimeout(hideTweetsWithEmojiNames, 1500);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateFilterMode') {
        filterMode = request.mode;
        reprocessAllTweets();
    }
});

function reprocessAllTweets() {
    document.querySelectorAll('article[data-testid="tweet"][data-emoji-filter-processed]').forEach(tweet => {
        tweet.removeAttribute('data-emoji-filter-processed');
        tweet.style.display = '';
        tweet.style.filter = '';
        tweet.style.cursor = '';
        tweet.onclick = null;
    });
    hideTweetsWithEmojiNames();
}

function applyFilter(tweet, reason) {
    if (filterMode === 'hide') {
        tweet.style.display = 'none';
    } else {
        tweet.style.filter = 'blur(8px)';
        tweet.style.opacity = '0.5';
        tweet.style.cursor = 'pointer';
        tweet.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
        
        tweet.onclick = function(e) {
            // Impedisce di "aprire" il tweet se si clicca su un link al suo interno
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            this.style.filter = 'none';
            this.style.opacity = '1';
            this.style.cursor = 'default';
            this.onclick = null;
            e.preventDefault();
        };
    }
}

function hideTweetsWithEmojiNames() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]:not([data-emoji-filter-processed])');

    tweets.forEach(tweet => {
        tweet.setAttribute('data-emoji-filter-processed', 'true');

        // Trova TUTTI i contenitori del nome utente all'interno del tweet.
        // Un tweet normale/retweet ne ha 1 (l'autore originale).
        // Un quote tweet ne ha 2 (chi quota e chi è quotato).
        const userNameContainers = tweet.querySelectorAll('div[data-testid="User-Name"]');

        // Itera su ogni nome utente trovato (principale, retwittato o citato).
        for (const userNameContainer of userNameContainers) {
            const hasEmoji = userNameContainer.querySelector('img[src*="/emoji/"]');
            
            if (hasEmoji) {
                // Se ANCHE SOLO UNO degli utenti (chi scrive, chi è retwittato o chi è citato)
                // ha un'emoji nel nome, applica il filtro all'intero blocco del tweet
                // e interrompi subito il controllo per questo tweet.
                applyFilter(tweet, 'emoji in relevant user name');
                return; // Esce dalla funzione forEach per il tweet corrente.
            }
        }
    });
}


const observer = new MutationObserver((mutations) => {
    // Aggiungiamo un piccolo ritardo per assicurarci che il DOM sia stabile
    // quando vengono aggiunti nuovi tweet.
    setTimeout(hideTweetsWithEmojiNames, 300);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});