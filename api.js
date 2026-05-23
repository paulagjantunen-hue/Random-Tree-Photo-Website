const UNSPLASH_KEY = "p-_3k80TEl4RIJbrBiaBweKOdo-5l7nSIY3g35qptDo";

async function fetchTreeBatch(page = 1) {
    const url =
`https://api.unsplash.com/search/photos` +
        `?query=forest%20tree%20nature` +
        `&page=${page}` +
        `&per_page=10` +
        `&orientation=landscape` +
        `&client_id=${UNSPLASH_KEY}`;

    const res = await fetch(url);

    if (!res.ok) {
        console.error("Unsplash API error:", res.status);
        return [];
    }

    const data = await res.json();

    return data.results.map(img => ({
        img: img.urls.regular,
        photographer: img.user?.name || "Unknown"
    }));
}