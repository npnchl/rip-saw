<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";

  let dynamicRules = $state([]);
  let newFilterInput = $state("");

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
        urlFilter: newFilterInput,
        resourceTypes: ["main_frame"],
      },
    };

    browser.declarativeNetRequest
      .updateDynamicRules({
        addRules: [newRule],
      })
      .then(() => {
        dynamicRules.push(newRule);
        newFilterInput = "";
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
    <input placeholder="youtube.com" bind:value={newFilterInput} />
    <button onclick={addRule}>Add</button>
  </div>
</main>
