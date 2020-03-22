function getHostName(url) {
    let hostName;
    if (url.indexOf("://") > -1) {
        hostName = url.split("/")[2]; // ["https:", "", "www.hellow.com", "hello"]
    } else {
        hostName = url.split("/")[0];
    }
    if (hostName.slice(0, 4) === "www.") {
        hostName = hostName.slice(4);
    }
    return hostName;
}

let url1 = "https://www.hello.com"
let url2 = "http://www.hello.com"
let url3 = "www.hello.com"

getHostName(url3)
