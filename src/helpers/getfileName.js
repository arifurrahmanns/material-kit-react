const getFilename = (url, w) => {

    if (url === null || url === "null" || !url) {


    } else {
        var basename = url.substring(url.lastIndexOf('/') + 1);
        let domain = new URL(url);

        const protocol = domain.protocol;
        domain = domain.hostname;
        if (domain === "localhost") {
            domain = "localhost:8000"
        }

        const img = protocol + "//" + domain + "/image?img=" + basename + "&w=" + w
        return (img);
    }
}

export default getFilename