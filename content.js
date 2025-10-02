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
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            this.style.filter = 'none';
            this.style.opacity = '1';
            this.style.cursor = 'default';
            this.onclick = null;
        };
    }
}

function hideTweetsWithEmojiNames() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]:not([data-emoji-filter-processed])');

    tweets.forEach(tweet => {
        tweet.setAttribute('data-emoji-filter-processed', 'true');

        const userNameContainer = tweet.querySelector('div[data-testid="User-Name"]');
        
        if (userNameContainer) {
            const hasEmoji = userNameContainer.querySelector('img');

            if (hasEmoji) {
                applyFilter(tweet, 'emoji in name');
                return;
            }
        }

        const retweetIndicator = tweet.querySelector('[data-testid="socialContext"]');
        
        if (retweetIndicator) {
            const retweetText = retweetIndicator.textContent;
            
            if (retweetText.includes('ha ritwittato') || 
                retweetText.includes('retweeted') || 
                retweetText.includes('reposted') ||
                retweetText.includes('ha repostato')) {
                applyFilter(tweet, 'retweet');
                return;
            }
        }

        const quoteLabel = tweet.querySelector('[aria-labelledby]');
        
        if (quoteLabel) {
            const labelText = quoteLabel.textContent;
            
            if (labelText.includes('Citazione') || labelText.includes('Quote')) {
                applyFilter(tweet, 'quote tweet');
                return;
            }
        }

        const quoteLink = tweet.querySelector('a[role="link"][href*="/status/"]');
        if (quoteLink) {
            const quoteContainer = quoteLink.closest('div[class*="css-175oi2r"]');
            if (quoteContainer && quoteContainer.querySelector('[data-testid="User-Name"]')) {
                applyFilter(tweet, 'quote tweet (alt)');
            }
        }
    });
}

const observer = new MutationObserver((mutations) => {
    hideTweetsWithEmojiNames();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});