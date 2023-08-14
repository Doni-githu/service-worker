const main = document.getElementsByTagName('main')
window.addEventListener('load', async () => {

    if (navigator?.serviceWorker) {

        try {
            const reg =  await navigator.serviceWorker.register('./sw.js')
            console.log('Service worker register success', reg);
        } catch (error) {
            console.log(error);
        }
    }

})

async function loadPosts() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12')
    const data = await res.json()
    main[0].innerHTML = data.map(toCard).join('\n')
}

function toCard(post) {
    return `
        <div class="post">
            <h1>${post.title}</h1>
            <p>${post.body}</p>
        </div>
    `
}