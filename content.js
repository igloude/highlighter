// Default classes and prefixes
const defaultClasses = ["highlight-me"]; // Exact class names
const defaultPrefixes = ["prefix-"]; // Prefixes

// Function to highlight elements with matching classes or prefixes
function highlightElements(classesToMatch, prefixesToMatch) {
  // Gather all elements on the page
  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    const classes = element.classList;
    if (!classes) return;

    let shouldHighlight = false;

    // Check for matching exact classes
    classesToMatch.forEach((className) => {
      if (classes.contains(className.trim())) {
        shouldHighlight = true;
      }
    });

    // Check for matching prefixes
    prefixesToMatch.forEach((prefix) => {
      for (const className of classes) {
        if (className.startsWith(prefix.trim())) {
          shouldHighlight = true;
          break;
        }
      }
    });

    // Apply highlight style if criteria are met
    if (shouldHighlight) {
      element.style.outline = "2px solid red";
      element.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
    }
  });
}

// Load classes and prefixes from storage, or use defaults if none are found
chrome.storage.sync.get(["classes", "prefixes"], ({ classes, prefixes }) => {
  const classesToMatch =
    classes && classes.length > 0 ? classes : defaultClasses;
  const prefixesToMatch =
    prefixes && prefixes.length > 0 ? prefixes : defaultPrefixes;

  // Run the highlight function with loaded or default values
  highlightElements(classesToMatch, prefixesToMatch);
});
