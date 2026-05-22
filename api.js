const UNSPLASH_KEY = "p-_3k80TEl4RIJbrBiaBweKOdo-5l7nSIY3g35qptDo";

let page = 1;

async function fetchTreeBatch() {
    const url =
        `https://api.unsplash.com/search/photos?page=${page}` +
        `&query=tree%20forest&per_page=20&orientation=landscape&client_id=${UNSPLASH_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    page += 1;

    return data.results.map(img => ({
        img: img.urls.regular,
        photographer: img.user.name,
        location: img.user.location || "Unknown forest"
    }));
}