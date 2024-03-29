//detoured websites
const socials = ["twitter.com", "instagram.com", "reddit.com", "facebook.com", "vsco.co", "tiktok.com", "www.youtube.com"];

//track current tab to only alert once on entering social media website
let currentTab = browser.tabs.query({active: true});
currentTab.then(gotTab, failTab)

function gotTab(tabs) {
    console.log("Current tab:" + tabs[0].url);
    currentTab = tabs[0];
    lastTime = currentTab.lastAccessed;
} 

function failTab(error) {
    console.log("Error fetching tab" + error);
}

let currentSocial = "";
let lastTime = 0;

browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {

    //detour when the new url contains detoured websites
    if (socials.some((social) => changeInfo.url.includes(social)) 

    //only detour when the social media changes per session or if it's been 20 min
    && (!currentTab.url.includes(currentSocial) || Date.now() - lastTime >= 1200000)) {

        //reset currents
        currentTab = tabInfo;
        currentSocial = socials.find((social) => changeInfo.url.includes(social));
        lastTime = currentTab.lastAccessed

        browser.tabs.create({
            active: true,
            url: "redirect/redirect.html"
        });

    }
}, {"properties": ["url"]});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    var data = browser.storage.local.get("data");
    data.then(onSuccess, onError);

    //add new questionaire data to locally stored string
    function onSuccess(response) {
        if (Object.keys(response).length == 0) {
            browser.storage.local.set({"data": message});
        } else {
            browser.storage.local.set({"data":response.data+message});
        }
    }

    function onError(error) {
        console.log("Form data request failed " + error);
    }
});
