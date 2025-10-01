// Content script for X Emoji-Free Name Filter

function hideTweetsWithEmojiNames() {
    // Find all tweet articles that haven't been processed yet
    const tweets = document.querySelectorAll('article[data-testid="tweet"]:not([data-emoji-filter-processed])');

    tweets.forEach(tweet => {
        // Mark the tweet as processed to avoid re-checking
        tweet.setAttribute('data-emoji-filter-processed', 'true');

        // Find the user name container within the tweet
        const userNameContainer = tweet.querySelector('div[data-testid="User-Name"]');

        if (userNameContainer) {
            // Check if there is an <img> tag inside the user name container.
            // Twitter renders emojis as <img> tags.
            const hasEmoji = userNameContainer.querySelector('img');

            if (hasEmoji) {
                console.log('Hiding tweet with emoji in name:', userNameContainer.textContent);
                // Hide the entire tweet article
                tweet.style.display = 'none';
            }
        }
    });
}

// Use a MutationObserver to detect when new tweets are added to the DOM
const observer = new MutationObserver((mutations) => {
    hideTweetsWithEmojiNames();
});

// Start observing the body for changes in the node tree
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Run the function once on load to catch any tweets already on the page
setTimeout(hideTweetsWithEmojiNames, 1500);