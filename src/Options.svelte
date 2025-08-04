<script>
  import browser from "webextension-polyfill";

  let filters = $state();
  let newFilterInput = $state();

  browser.declarativeNetRequest.getDynamicRules().then((rules) => {
    filters = rules.map((rule) => rule.condition.urlFilter);
  });

  function addNewRule() {
    browser.declarativeNetRequest.getDynamicRules()
      .then((rules) => {
        return getNextId(rules);
      })
      .then((avaliableId) => {
        return browser.declarativeNetRequest.updateDynamicRules({
          addRules: [
            {
              id: avaliableId,
              priority: 1,
              action: {
                type: "block",
              },
              condition: {
                urlFilter: newFilterInput,
                resourceTypes: ["main_frame"],
              },
            },
          ],
        });
      })
      .then(() => {
        filters.push(newFilterInput.toLowerCase());
        newFilterInput = '';
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getNextId(rules) {
    let maxRules = browser.declarativeNetRequest.MAX_NUMBER_OF_DYNAMIC_RULES;
    let ruleIds = rules.map((rule) => rule.id);

    if (ruleIds.length == 0) {
      return 1;
    }

    let sortedIds = ruleIds.sort((a, b) => a - b);
    let currentLargestId = Math.max(...sortedIds);
    if (currentLargestId + 1 <= maxRules) {
      return currentLargestId + 1;
    }

    throw new Error("No ID avaliable");
  }

</script>

<main>
  <h1>Options Page</h1>

  <div>
    {#each filters as filter}
      <p>{filter}</p>
    {/each}

    <input type="text" placeholder="youtube.com" bind:value={newFilterInput} />
    <button onclick={addNewRule}>Add</button>
  </div>
</main>
