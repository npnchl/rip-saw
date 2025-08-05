<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";

  let dynamicRules = $state([]);
  let filterInput = $state("");

  onMount(() => {
    browser.declarativeNetRequest.getDynamicRules().then((rules) => {
      dynamicRules = rules;
    });
  });

  function addRule() {
    let ruleIds = dynamicRules.map((rule) => rule.id);
    let largestId = ruleIds.length ? Math.max(...ruleIds) : 0;

    let newRule = {
      id: largestId + 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: filterInput,
        resourceTypes: ["main_frame"],
      },
    };

    browser.declarativeNetRequest
      .updateDynamicRules({
        addRules: [newRule],
      })
      .then(() => {
        dynamicRules.push(newRule);
        filterInput = "";
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeRule() {
    const ruleIndex = dynamicRules.findIndex(
      (rule) => rule.condition.urlFilter == filterInput,
    );

    if (ruleIndex == -1) {
      console.log("Couldn't find the rule");
      return;
    };

    const ruleId = dynamicRules[ruleIndex].id;
    
    browser.declarativeNetRequest
      .updateDynamicRules({
        removeRuleIds: [ruleId],
      })
      .then(() => {
        dynamicRules.splice(ruleIndex, 1);
        filterInput = "";
      })
      .catch((error) => {
        console.log(error);
      });
  }
</script>

<main>
  <h1>Options Page</h1>

  {#each dynamicRules as rule}
    <p>{rule.condition.urlFilter}</p>
  {:else}
    <p>No rules set</p>
  {/each}

  <div>
    <input placeholder="youtube.com" bind:value={filterInput} />
    <button onclick={addRule}>Add</button>
    <button onclick={removeRule}>Remove</button>
  </div>
</main>
