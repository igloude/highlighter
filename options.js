document.getElementById("save").addEventListener("click", () => {
  const classes = document.getElementById("classes").value.split(",");
  const prefixes = document.getElementById("prefixes").value.split(",");

  chrome.storage.sync.set({ classes, prefixes }, () => {
    alert("Options saved!");
  });
});
