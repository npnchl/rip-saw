import browser from "webextension-polyfill";

// initalise storage
browser.storage.local.clear();
browser.storage.local.set({
    denyByDefaultRules: [
        {
            id: 1,
            priority: 1,
            action: {
                type: "block"
            },
            condition: {
                urlFilter: "reddit.com",
                resourceTypes: ["main_frame"]
            }
        },
        {
            id: 2,
            priority: 1,
            action: {
                type: "block"
            },
            condition: {
                urlFilter: "youtube.com",
                resourceTypes: ["main_frame"]
            }
        }
    ]
});

// initialise dynamic ruleset 
browser.declarativeNetRequest.getDynamicRules().then(rules => {
    let ruleIds = rules.map(rule => rule.id);
    browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds,
    });
});

browser.storage.local.get("denyByDefaultRules").then(dataObj => {
    browser.declarativeNetRequest.updateDynamicRules({
        addRules: dataObj.denyByDefaultRules
    });
});

