// MV3 service worker to manage dynamic redirect rules based on user setting
const DYNAMIC_RULE_ID = 1001;
const STATIC_RULESET_ID = "ruleset_1";

async function getDestinationDomain() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ destinationDomain: "deer.social" }, (items) => {
      resolve(items.destinationDomain || "deer.social");
    });
  });
}

function buildDynamicRule(destinationDomain) {
  return {
    id: DYNAMIC_RULE_ID,
    priority: 1000,
    action: {
      type: "redirect",
      redirect: {
        regexSubstitution: `https://${destinationDomain}/\\1`,
      },
    },
    condition: {
      regexFilter: "^https://bsky\\.app/(.*)$",
      resourceTypes: ["main_frame", "sub_frame"],
    },
  };
}

async function applyDynamicRule() {
  const destinationDomain = await getDestinationDomain();
  const rule = buildDynamicRule(destinationDomain);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [DYNAMIC_RULE_ID],
    addRules: [rule],
  });
}

// Initialize on install/update and on startup
chrome.runtime.onInstalled.addListener(async () => {
  // Ensure a default is set
  chrome.storage.sync.get(
    { destinationDomain: "deer.social" },
    async (items) => {
      if (!items.destinationDomain) {
        chrome.storage.sync.set({ destinationDomain: "deer.social" });
      }
      // Disable static ruleset if present in session
      try {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          disableRulesetIds: [STATIC_RULESET_ID],
        });
      } catch (e) {
        // ignore if not supported or not present
      }
      await applyDynamicRule();
    }
  );
});

chrome.runtime.onStartup &&
  chrome.runtime.onStartup.addListener(() => {
    // Also try to disable static ruleset on startup in case of stale state
    chrome.declarativeNetRequest
      .updateEnabledRulesets({
        disableRulesetIds: [STATIC_RULESET_ID],
      })
      .catch(() => {});
    applyDynamicRule();
  });

// Update rule when the setting changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.destinationDomain) {
    applyDynamicRule();
  }
});
