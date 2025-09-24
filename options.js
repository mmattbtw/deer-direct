function load() {
  chrome.storage.sync.get({ destinationDomain: "deer.social" }, (items) => {
    document.getElementById("destination").value =
      items.destinationDomain || "deer.social";
  });
}

function isValidDomain(value) {
  // Basic domain validation: letters, numbers, hyphens, dots; no protocol or path
  if (!value) return false;
  if (value.startsWith("http://") || value.startsWith("https://")) return false;
  if (value.includes("/") || value.includes(" ")) return false;
  const domainRegex = /^(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
  return domainRegex.test(value);
}

function save() {
  const input = document.getElementById("destination");
  const status = document.getElementById("status");
  const value = (input.value || "").trim();
  if (!isValidDomain(value)) {
    status.textContent =
      ' Enter a valid domain like "deer.social" (no protocol).';
    status.className = "hint error";
    return;
  }
  chrome.storage.sync.set({ destinationDomain: value }, () => {
    status.textContent =
      " Saved. Redirects will now go to https://" + value + "/…";
    status.className = "hint ok";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  load();
  document.getElementById("save").addEventListener("click", save);
});
