<template>
  <div class="container">
    <h2>Class Highlighter</h2>

    <div class="form-control">
      <label>Class</label>
      <input
        type="text"
        v-model="classesInput"
        placeholder="Enter classes"
        @keyup.enter="addClassTerm"
      />
    </div>

    <div class="form-control">
      <label>Class Prefix</label>
      <input
        type="text"
        v-model="prefixesInput"
        placeholder="Enter prefixes"
        @keyup.enter="addPrefixTerm"
      />
    </div>

    <div class="tags">
      <span v-for="(term, index) in searchTerms" :key="index" class="tag">
        {{ term.value }}{{ term.type === "class" ? "" : "*" }}
        <button class="remove-tag" @click="removeTerm(index)">×</button>
      </span>
      <button class="clear-btn" @click="clearAll">Clear All</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classesInput: "",
      prefixesInput: "",
      searchTerms: [], // {type: 'class'|'prefix', value: string}
    };
  },
  methods: {
    loadOptions() {
      chrome.storage.sync.get(
        ["classes", "prefixes"],
        ({ classes, prefixes }) => {
          this.searchTerms = [
            ...(classes?.map((c) => ({ type: "class", value: c })) || []),
            ...(prefixes?.map((p) => ({ type: "prefix", value: p })) || []),
          ];
        }
      );
    },
    addClassTerm() {
      if (!this.classesInput) return;
      const newClasses = this.classesInput
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c)
        .map((c) => ({ type: "class", value: c }));
      this.searchTerms.push(...newClasses);
      this.classesInput = "";
      this.saveOptions();
    },
    addPrefixTerm() {
      if (!this.prefixesInput) return;
      const newPrefixes = this.prefixesInput
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p)
        .map((p) => ({ type: "prefix", value: p }));
      this.searchTerms.push(...newPrefixes);
      this.prefixesInput = "";
      this.saveOptions();
    },
    removeTerm(index) {
      this.searchTerms.splice(index, 1);
      this.saveOptions();
    },
    clearAll() {
      this.searchTerms = [];
      this.saveOptions();
    },
    saveOptions() {
      const classes = this.searchTerms
        .filter((t) => t.type === "class")
        .map((t) => t.value);
      const prefixes = this.searchTerms
        .filter((t) => t.type === "prefix")
        .map((t) => t.value);

      chrome.storage.sync.set({ classes, prefixes }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "reapplyHighlighting",
            });
          }
        });
      });
    },
  },
  mounted() {
    this.loadOptions(); // Load existing options without saving immediately
  },
};
</script>

<style scoped>
.container {
  display: grid;
  gap: 12px;
}

h2 {
  margin: 0;
}

.form-control {
  display: block;
}

.form-control label {
  display: block;
  margin-bottom: 2px;
}

.form-control input {
  width: -webkit-fill-available;
  border-radius: 4px;
  border: 1px solid #333;
  padding: 4px 6px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #e0e0e0;
  padding: 4px 8px 4px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
}

.remove-tag {
  width: auto;
  margin: 0 0 0 5px;
  padding: 0 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.remove-tag:hover {
  color: tomato;
}

.clear-btn {
  font-weight: bold;
  background: tomato;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:hover {
  background: #ff0000;
}
</style>
