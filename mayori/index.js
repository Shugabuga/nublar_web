// Yes, a global variable. How ugly!
let bookmarks = new Map();
let textColor = "rgba(124, 129, 140, 255)";

window.onload = () => {
    setTime();
    addBookmarks();
    window.setInterval(setTime, 1000);
    getWeather();
    setTagline();
}

// todo: zoom integration
function setTagline() {
    const now = new Date(Date.now());
    const hour = now.getHours();
    let name = localStorage.getItem("name");
    if (!name) {
        localStorage.setItem("name", "user");
        name = "user";
    }
    let msg = `hello ${name}.`;

    if (hour >= 5 && hour < 12)
        msg = `good morning ${name}.`;
    else if (hour >= 12 && hour < 6)
        msg =  `good afternoon ${name}.`;
    else if (hour >= 6 || hour < 5)
        msg =  `good evening ${name}.`;

    document.querySelector(".tagline").innerText = msg;
}

function setTime() {
    // Time
    const now = new Date(Date.now());
    let time = now.toLocaleTimeString().toLowerCase();
    if (Math.floor(Date.now()/1000) % 2 == 0)
        time = time.replaceAll(":", " ");
    document.getElementById("time").innerText = time;

    // Date
    let date = now.toISOString().substring(0,10);
    document.getElementById("date").innerText = date;
}

function getWeather() {
    const el = document.querySelector(".header > h1");
    // Uses a SenkoAPI location string.
    let loc = localStorage.getItem("location");
    if (!loc) {
        el.innerText = "nublar";
        return;
    }
        
    let url = "https://api.awoo.dev/weather/?location=" + loc;
    el.innerText = "loading..."

    fetch(url).then((resp) => {
        return resp.json();
    }).then((json) => {
       el.innerText = `${Math.round(json["currently"]["temperature"])}° ${json["currently"]["summary"].toLowerCase()}`;
    });
}

// The code to run whenever the search bar is updated.
document.getElementById("search").addEventListener("keyup", (evt) => {
    const el = document.getElementById("search");
    const query = el.value;

    autocomplete(query);

    if (evt.keyCode === 13 && query.length != 0) {
        search(query);
    } else if (evt.keyCode == 38) {
        // goto UP
        search(document.querySelector(".ac > div:nth-child(1)").innerText);
    } else if (evt.keyCode == 40) {
        // goto DOWN
        search(document.querySelector(".ac > div:nth-child(2)").innerText);
    }

    // Text highlighting features
    const queryCI = query.toLowerCase();
    let activity = bookmarks.get(queryCI);

    // Un-grey the bookmarks.
    const theOtherBookmarks = document.querySelectorAll(`#bookmarkList > a`);
    for (let i = 0; i < theOtherBookmarks.length; i++) {
        theOtherBookmarks[i].style.opacity = "1";
        tooltip();
    }

    if (activity || queryCI === "zoom" || queryCI.indexOf("!") === 0) {
        el.style.color = "var(--bookmarkTxt)";

        // Also grey out the bookmark selector.
        const tag = document.querySelector(`.tag-${queryCI}`);
        if (tag)
            tag.style.opacity = "0.5";
        if (activity)
            tooltip(activity.name.toLowerCase());
    } else if (
        queryCI.indexOf("http") === 0 ||
        queryCI.indexOf("://") !== -1 ||
        queryCI.indexOf("doi:") === 0 ||
        queryCI.indexOf("oclc:") === 0 ||
        (queryCI.indexOf(".") !== -1 && queryCI.indexOf(" ") === -1)) {
        el.style.color = "var(--protocolTxt)";
    } else {
        el.style.color = "var(--cardTxt)";
    }
});

// The code to run whenever we click "enter"
function search(query) {
    const queryCI = query.toLowerCase();
    let activity = bookmarks.get(queryCI);

    // Normal URL.
    if (queryCI.indexOf("http") === 0 || queryCI.indexOf("://") !== -1) 
        window.location = query;

    // DOI
    else if (queryCI.indexOf("doi:") === 0)
        window.location = `https://dx.doi.org/${encodeURI(query.substring(4))}`;

    // OCLC
    else if (queryCI.indexOf("oclc:") === 0)
        window.location = `https://www.worldcat.org/oclc/${encodeURI(query.substring(5))}`;

    // Protocol not provided.
    else if (queryCI.indexOf(".") !== -1 && queryCI.indexOf(" ") === -1)
        window.location = `https://${query}`;

    // Special Zoom shortcut.
    else if (queryCI === "zoom")
        window.location = localStorage.getItem("zoom_url");

    // Here is where we would search our bookmarks.
    else if (activity)
        window.location = activity.url;

    else
        window.location = `https://duckduckgo.com/?q=${encodeURI(query)}`;
}

function autocomplete(query) {
    const acList = document.querySelectorAll(".ac > div");
    
    fetch(`https://api.awoo.dev/ac/?q=${encodeURI(query)}`).then((resp) => {
        return resp.json();
    }).then((json) => {
        // If there is AC data.
        for (let i = 0; i < acList.length; i++) {
            acList[i].innerText = json[i].phrase;
            acList[i].style.cursor = "pointer";
        }
        document.querySelector(".tagline").style.opacity = 0;
        window.setTimeout(()=>{
            document.querySelector(".tagline").style.display = "none";
            document.querySelector(".ac").style.display = "grid";
            document.querySelector(".ac").style.opacity = 1;
        }, 300);
    }).catch((err) => {
        // If there is no AC data.
        for (let i = 0; i < acList.length; i++) {
            acList[i].style.cursor = "default";
        }
        document.querySelector(".ac").style.opacity = 0;
        window.setTimeout(()=>{
            document.querySelector(".ac").style.display = "none";
            document.querySelector(".tagline").style.display = "block";
            document.querySelector(".tagline").style.opacity = 1;
        }, 300);
    });
}

function tooltip(inp) {
    const el = document.querySelector("#bookmarks > p");
    el.innerHTML = "";
    if (inp)
        el.innerText = inp;
    else
        el.innerText = "bookmarks";
}

// You see, Chromium's NTP doesn't let us read the contents of your recently visited sites.
// We actually are just given an iframe.
// So we use this function to suppliment tooltip() for NTP-populated bookmarks.
function tooltipFrame(rid) {
    const el = document.querySelector("#bookmarks > p");
    el.innerText = "";
    const newEl = document.createElement("iframe");
    newEl.src = `chrome-search://most-visited/title.html?rid=${rid}&c=${rgbaToHex(textColor)}&fs=15&f=arial%2Csans-serif&ta=center`;
    el.appendChild(newEl);
}

function arrayToRgba(arr) {
    return `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]})`;
}

function rgbaToHex(str) {
    let arr = str.replace("rgba(","").replace(")","").split(",");
    let outStr = "";
    for (let i = 0; i < 3; i++) {
        outStr += parseInt(arr[i], 10).toString(16).padStart(2, "0");
    }
    return outStr;
}

function addBookmarks() {
    // Get data from localStorage. Hopefully it's in there.
    const storage = localStorage.getItem("fav");
    let bookmark;
    if (storage) {
        // Get stored.
        bookmark = JSON.parse(storage);
    } else {
        // Set default.
        bookmark = [];
        localStorage.setItem("fav", JSON.stringify(bookmark));
    }
    // Add to page
    let newNode;
    for (let i = 0; i < bookmark.length; i++) {
        for (j in bookmark[i].shortcut)
            bookmarks.set(bookmark[i].shortcut[j], {name: bookmark[i].name, url: bookmark[i].url});

        if (bookmark[i].is_visible) {
            newNode = document.createElement("a");
            newNode.href = bookmark[i].url;
            newNode.title = bookmark[i].name;
            newNode.addEventListener("mouseover", (evt) => {
                tooltip(bookmark[i].name.toLowerCase());
                evt.target.style.opacity = "0.7";
            });
            newNode.addEventListener("mouseout", (evt) => {
                tooltip();
                evt.target.style.opacity = "1";
            });
            if (bookmark[i].is_fa)
                newNode.className = bookmark[i].icon;
            else
                newNode.innerText = bookmark[i].icon;
            for (j in bookmark[i].shortcut)
                newNode.classList.add(`tag-${bookmark[i].shortcut[j]}`);
            document.getElementById("bookmarkList").append(newNode);
        }
    }

    // Import from Chrome NTP
    if (typeof chrome !== "undefined" && typeof chrome.embeddedSearch !== "undefined" && typeof chrome.embeddedSearch.newTabPage !== "undefined") {
        // Set theme to match Chromium if accessed through NTP
        // Should work on most Chromium forks, sans Brave.
        if (chrome.embeddedSearch.newTabPage.themeBackgroundInfo) {
            const themeObj = chrome.embeddedSearch.newTabPage.themeBackgroundInfo;

            // (first variable is a global)
            textColor = arrayToRgba(themeObj.textColorLightRgba);
            let textCardColor = arrayToRgba(themeObj.textColorRgba);
            let backgroundColor = arrayToRgba(themeObj.backgroundColorRgba);

            // Darken
            let darkerColor = []
            for (let i = 0; i < themeObj.backgroundColorRgba.length; i++) {
                darkerColor[i] = themeObj.backgroundColorRgba[i] - 20;
                if (darkerColor[i] < 0)
                    darkerColor[i] = 0;
            }
            let cardColor = arrayToRgba(darkerColor);

            if (typeof chrome.embeddedSearch.newTabPage.themeBackgroundInfo.imageUrl !== "undefined")
                backgroundColor = chrome.embeddedSearch.newTabPage.themeBackgroundInfo.imageUrl;

            document.styleSheets[0].insertRule(`* {
                --mainBkgd: ${backgroundColor}!important;
                --cardBkgd: ${cardColor}!important;
                --mainTxt: ${textColor}!important;
                --cardTxt: ${textCardColor}!important;
            }`);
        }

        // Display recent sites if accessed through Chromium NTP.
        // This is pretty much done through iframes + chrome-search.
        // Does NOT work in Brave, Edge; they roll their own NTP logic.
        if (chrome.embeddedSearch.newTabPage.mostVisitedAvailable) {
            const mostVisited = chrome.embeddedSearch.newTabPage.mostVisited;
            for (let link = 0; link < mostVisited.length; link++) {
                let favUrl = chrome.embeddedSearch.newTabPage.mostVisited[link].faviconUrl;
                let rid = chrome.embeddedSearch.newTabPage.mostVisited[link].rid;
                newNode = document.createElement("a");
                newNode.href = "#";
                newNode.addEventListener("mouseover", (evt) => {
                    tooltipFrame(rid);
                    evt.target.style.opacity = "0.7";
                });
                newNode.addEventListener("mouseout", (evt) => {
                    tooltip();
                    evt.target.style.opacity = "1";
                });
                document.getElementById("bookmarkList").append(newNode);

                // create image
                let img = document.createElement("img")
                img.src = favUrl;
                img.className = "ntpShortcut";
                newNode.appendChild(img);

                // create clicky iframe
                let crLinkHelper = document.createElement("iframe");
                crLinkHelper.src = `chrome-search://most-visited/title.html?rid=${rid}`;
                crLinkHelper.className = "ntpClickyBit";
                newNode.appendChild(crLinkHelper);
            }
        }
    }
}
