function highlightElements(classesToMatch, prefixesToMatch) {
  if (!classesToMatch?.length && !prefixesToMatch?.length) return;

  const allElements = document.querySelectorAll("*");

  let classNameMatches = 0;
  let classPrefixeMatches = 0;

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
            classPrefixeMatches++;
            shouldHighlight = true;
          }
        }
      });
    }

    if (shouldHighlight) {
      element.style.outline = "2px solid red";
      element.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
    }
  });

  console.log(
    "Matched ",
    classNameMatches,
    " full class names, and ",
    classPrefixeMatches,
    " prefixes"
  );
}

chrome.storage.sync.get(["classes", "prefixes"], ({ classes, prefixes }) => {
  highlightElements(classes, prefixes);
});
