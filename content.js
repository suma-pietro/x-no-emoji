function hideTweetsWithEmojiNames() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]:not([data-emoji-filter-processed])');

    tweets.forEach(tweet => {
        tweet.setAttribute('data-emoji-filter-processed', 'true');

        const userNameContainer = tweet.querySelector('div[data-testid="User-Name"]');

        if (userNameContainer) {

            const hasEmoji = userNameContainer.querySelector('img');

            if (hasEmoji) {
                console.log('Hiding tweet with emoji in name:', userNameContainer.textContent);
                tweet.style.display = 'none';
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

setTimeout(hideTweetsWithEmojiNames, 1500);
