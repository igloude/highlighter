document.getElementById("save").addEventListener("click", () => {
  const classesValue = document.getElementById("classes").value.trim();
  const prefixesValue = document.getElementById("prefixes").value.trim();

  const classes = classesValue ? classesValue.split(",") : null;
  const prefixes = prefixesValue ? prefixesValue.split(",") : null;

  chrome.storage.sync.set({ classes, prefixes }, () => {
    alert("Options saved!");
  });
});
