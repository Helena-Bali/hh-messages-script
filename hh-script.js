(async function collectHHChats() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const scrollContainer = document.querySelector('.pISa3zq___chats');

    if (!scrollContainer) {
        alert('Не удалось найти список чатов. Убедитесь, что вы на странице https://hh.ru/messages');
        return;
    }

    let previousHeight = 0;
    let sameHeightCount = 0;


    while (sameHeightCount < 3) {
        scrollContainer.scrollTo(0, scrollContainer.scrollHeight);
        await sleep(1000);
        const newHeight = scrollContainer.scrollHeight;

        if (newHeight === previousHeight) {
            sameHeightCount++;
        } else {
            sameHeightCount = 0;
            previousHeight = newHeight;
        }
    }


    const chatItems = scrollContainer.querySelectorAll('a[data-qa^="chatik-open-chat-"]');
    const result = [];

    chatItems.forEach(item => {
        const company = item.querySelector('.PUOzfsc___subtitle')?.innerText.trim() || '';
        const vacancy = item.querySelector('.jaEO2q2___title')?.innerText.trim() || '';
        const time = item.querySelector('[data-qa="chat-cell-creation-time"]')?.innerText.trim() || '';
        const lastMessage = item.querySelector('.znqoEhX___last-message')?.innerText.trim() || '';
        const link = 'https://hh.ru' + item.getAttribute('href');


        result.push({
            company,
            vacancy,
            time,
            lastMessage,
            link
        });
    });


    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const linkEl = document.createElement('a');
    linkEl.href = URL.createObjectURL(blob);
    linkEl.download = 'hh_chat_export_all.json';
    linkEl.click();
})();
