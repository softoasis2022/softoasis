function parseUrlData(url) {
    try {
        const parsed = new URL(url);

        const protocol = parsed.protocol.replace(":", "");
        const hostname = parsed.hostname;
        const domainName = hostname.replace("www.", "");

        return {
            success: true,
            data: {
                security: protocol,
                dns: hostname,
                domain: domainName,
                root: {
                    path: parsed.pathname,
                    query: parsed.search,
                    full: url
                }
            }
        };

    } catch (err) {
        return {
            success: false,
            message: "URL 파싱 실패"
        };
    }
}

module.exports = {
    parseUrlData
};