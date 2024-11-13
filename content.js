function highlightElements(classesToMatch, prefixesToMatch) {
  const allElements = document.querySelectorAll("*");
  let classNameMatches = 0;
  let classPrefixMatches = 0;

  allElements.forEach((element) => {
    const classes = element.classList;
    if (!classes) return;

    let shouldHighlight = false;

    if (classesToMatch?.length) {
      classesToMatch.forEach((className) => {
        if (classes.contains(className.trim())) {
          classNameMatches++;
          shouldHighlight = true;
        }
      });
    }

    if (prefixesToMatch?.length) {
      prefixesToMatch.forEach((prefix) => {
        for (const className of classes) {
          if (className.startsWith(prefix.trim())) {
            classPrefixMatches++;
            shouldHighlight = true;
            break;
          }
        }
      });
    }

    // Apply highlight style if a match is found
    if (shouldHighlight) {
      element.style.outline = "2px solid red";
      element.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
    } else {
      // Remove any existing highlights
      element.style.outline = "";
      element.style.backgroundColor = "";
    }
  });

  console.log(
    "Matched ",
    classNameMatches,
    " full class names, and ",
    classPrefixMatches,
    " prefixes"
  );
}

function applyHighlighting() {
  chrome.storage.sync.get(["classes", "prefixes"], ({ classes, prefixes }) => {
    highlightElements(classes, prefixes);
  });
}

applyHighlighting();

// Listen for changes in storage and reapply highlighting
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && (changes.classes || changes.prefixes)) {
    applyHighlighting();
  }
});

// Listen for messages to reapply highlighting
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "reapplyHighlighting") {
    applyHighlighting();
  }
});
