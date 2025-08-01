var browser = require("webextension-polyfill");

const newRule = {
    id: 1,
    priority: 1,
    condition: {
        urlFilter: "youtube.com",
        resourceTypes: ["main_frame"]
    },
    action: {
        type: "block"
    }
}

browser.declarativeNetRequest.getDynamicRules().then(rules => {
    let ruleIds = rules.map(rule => rule.id);
    browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds,
        addRules: [newRule]
    });
});

browser.declarativeNetRequest.getDynamicRules().then(rules => {
    console.log(rules.map(rule => rule.id));
});
