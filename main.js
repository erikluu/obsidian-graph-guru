/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  ExampleModal: () => ExampleModal,
  GraphView: () => GraphView,
  VIEW_TYPE_GRAPH: () => VIEW_TYPE_GRAPH,
  default: () => GuruPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_child_process = require("child_process");
var GuruPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    const files = await this.getAllVaultFiles();
    console.log(files);
    const preprocessedFiles = await this.sendToPythonScript(files);
    console.log(preprocessedFiles);
    this.registerView(
      VIEW_TYPE_GRAPH,
      (leaf) => new GraphView(leaf, files.length)
    );
    this.addRibbonIcon("citrus", "Activate Graph View", () => {
      console.log("lmao");
    });
    await this.loadSettings();
    this.addSettingTab(new GuruSettingTab(this.app, this));
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText(`Graph Guru focused on ${files.length} files`);
  }
  onunload() {
    console.log("unloading plugin");
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_GRAPH);
  }
  async activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_GRAPH);
    await this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE_GRAPH,
      active: true
    });
    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(VIEW_TYPE_GRAPH)[0]
    );
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  // PREPROCESSING ------------------------------------------------
  async getAllVaultFiles() {
    const files = this.app.vault.getFiles();
    const fileObjects = files.map(async (f) => {
      const text = await this.app.vault.read(f);
      const metadata = this.app.metadataCache.getFileCache(f);
      let tags = null;
      if (metadata != null) {
        tags = (0, import_obsidian.getAllTags)(metadata);
      }
      return {
        text,
        metadata,
        tags
      };
    });
    return await Promise.all(fileObjects);
  }
  async sendToPythonScript(files) {
    return new Promise((resolve, reject) => {
      const pythonProcess = (0, import_child_process.spawn)("python", ["./src/preprocessing.py"]);
      const results = [];
      pythonProcess.stdout.on("data", (data) => {
        results.push(JSON.parse(data.toString()));
      });
      pythonProcess.stderr.on("data", (data) => {
        reject(data.toString());
      });
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve(results);
        } else {
          reject(`Python process exited with code ${code}`);
        }
      });
      for (const file of files) {
        pythonProcess.stdin.write(JSON.stringify(file) + "\n");
      }
      pythonProcess.stdin.end();
    });
  }
};
var VIEW_TYPE_GRAPH = "graph-view";
var GraphView = class extends import_obsidian.ItemView {
  constructor(leaf, numFiles) {
    super(leaf);
    this.numFiles = numFiles;
  }
  getViewType() {
    return VIEW_TYPE_GRAPH;
  }
  getDisplayText() {
    return "Graph View";
  }
  async onOpen() {
    const containerEl = this.containerEl.children[1];
    containerEl.empty();
    containerEl.createEl("h4", { text: `Number of Files Found: ${this.numFiles}` });
  }
  async onClose() {
  }
};
var ExampleModal = class extends import_obsidian.Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h1", { text: "What's your name?" });
    new import_obsidian.Setting(contentEl).setName("Name").addText((text) => text.onChange((value) => {
      this.result = value;
    }));
    new import_obsidian.Setting(contentEl).addButton((btn) => btn.setButtonText("Submit").setCta().onClick(() => {
      this.close();
      this.onSubmit(this.result);
    }));
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};
var DEFAULT_SETTINGS = {
  focus_directory: "./",
  favorite_color: "Purple"
};
var GuruSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Graph Guru Settings" });
    new import_obsidian.Setting(containerEl).setName("Focus Directory").setDesc("Enter the directory you wish for The Guru to focus on.").addText((text) => text.setPlaceholder("Enter your directory").setValue(this.plugin.settings.focus_directory).onChange(async (value) => {
      console.log("Directory: " + value);
      this.plugin.settings.focus_directory = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Favorite Color").setDesc("Let us know your favorite color.").addText((text) => text.setPlaceholder("Enter color").setValue(this.plugin.settings.favorite_color).onChange(async (value) => {
      console.log("Color: " + value);
      this.plugin.settings.favorite_color = value;
      await this.plugin.saveSettings();
    }));
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEFwcCwgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYsIE1vZGFsLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIFRGaWxlLCBDYWNoZWRNZXRhZGF0YSwgZ2V0QWxsVGFncyB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbi8vICUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSVcbi8vIFBsdWdpbiBNYWluXG4vLyAlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEd1cnVQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAgIHNldHRpbmdzOiBHdXJ1U2V0dGluZ3M7XG5cbiAgICBhc3luYyBvbmxvYWQoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG5cbiAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB0aGlzLmdldEFsbFZhdWx0RmlsZXMoKTtcbiAgICAgICAgY29uc29sZS5sb2coZmlsZXMpXG4gICAgICAgIGNvbnN0IHByZXByb2Nlc3NlZEZpbGVzID0gYXdhaXQgdGhpcy5zZW5kVG9QeXRob25TY3JpcHQoZmlsZXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhwcmVwcm9jZXNzZWRGaWxlcyk7XG5cbiAgICAgICAgLy8gcmVnaXN0ZXIgdmlld1xuICAgICAgICB0aGlzLnJlZ2lzdGVyVmlldyhcbiAgICAgICAgICAgIFZJRVdfVFlQRV9HUkFQSCxcbiAgICAgICAgICAgIChsZWFmKSA9PiBuZXcgR3JhcGhWaWV3KGxlYWYsIGZpbGVzLmxlbmd0aClcbiAgICAgICAgKTtcblxuICAgICAgICAvLyByaWJib24gYnV0dG9uXG4gICAgICAgIHRoaXMuYWRkUmliYm9uSWNvbihcImNpdHJ1c1wiLCBcIkFjdGl2YXRlIEdyYXBoIFZpZXdcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsbWFvXCIpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gbG9hZCBzZXR0aW5nc1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IEd1cnVTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSlcblxuICAgICAgICAvLyBUaGlzIGFkZHMgYSBzdGF0dXMgYmFyIGl0ZW0gdG8gdGhlIGJvdHRvbSBvZiB0aGUgYXBwLiBEb2VzIG5vdCB3b3JrIG9uIG1vYmlsZSBhcHBzLlxuICAgICAgICBjb25zdCBzdGF0dXNCYXJJdGVtRWwgPSB0aGlzLmFkZFN0YXR1c0Jhckl0ZW0oKTtcbiAgICAgICAgc3RhdHVzQmFySXRlbUVsLnNldFRleHQoYEdyYXBoIEd1cnUgZm9jdXNlZCBvbiAke2ZpbGVzLmxlbmd0aH0gZmlsZXNgKTtcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VubG9hZGluZyBwbHVnaW4nKTtcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZShWSUVXX1RZUEVfR1JBUEgpO1xuICAgIH1cblxuICAgIGFzeW5jIGFjdGl2YXRlVmlldygpIHtcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZShWSUVXX1RZUEVfR1JBUEgpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpLnNldFZpZXdTdGF0ZSh7XG4gICAgICAgICAgICB0eXBlOiBWSUVXX1RZUEVfR1JBUEgsXG4gICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKFxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEVfR1JBUEgpWzBdXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgICB9XG5cbiAgICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgLy8gUFJFUFJPQ0VTU0lORyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhc3luYyBnZXRBbGxWYXVsdEZpbGVzKCkge1xuICAgICAgICBjb25zdCBmaWxlczogVEZpbGVbXSA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVzKCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBmaWxlT2JqZWN0cyA9IGZpbGVzLm1hcChhc3luYyAoZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGV4dDogc3RyaW5nID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmKTtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhOiBDYWNoZWRNZXRhZGF0YSB8IG51bGwgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmKTtcbiAgICAgICAgICAgIGxldCB0YWdzOiBzdHJpbmdbXSB8IG51bGwgPSBudWxsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChtZXRhZGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGFncyA9IGdldEFsbFRhZ3MobWV0YWRhdGEpOyAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgICAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YSxcbiAgICAgICAgICAgICAgICB0YWdzOiB0YWdzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChmaWxlT2JqZWN0cyk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2VuZFRvUHl0aG9uU2NyaXB0KGZpbGVzOiBURmlsZVtdKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHl0aG9uUHJvY2VzcyA9IHNwYXduKCdweXRob24nLCBbJy4vc3JjL3ByZXByb2Nlc3NpbmcucHknXSk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICBweXRob25Qcm9jZXNzLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKEpTT04ucGFyc2UoZGF0YS50b1N0cmluZygpKSk7IC8vIG1heWJlIG5vdCB0b1N0cmluZ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHB5dGhvblByb2Nlc3Muc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBweXRob25Qcm9jZXNzLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoYFB5dGhvbiBwcm9jZXNzIGV4aXRlZCB3aXRoIGNvZGUgJHtjb2RlfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICAgICAgICBweXRob25Qcm9jZXNzLnN0ZGluLndyaXRlKEpTT04uc3RyaW5naWZ5KGZpbGUpICsgJ1xcbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBweXRob25Qcm9jZXNzLnN0ZGluLmVuZCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8vICUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSVcbi8vIFZpZXdcbi8vICUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSVcblxuZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9HUkFQSCA9IFwiZ3JhcGgtdmlld1wiO1xuXG5leHBvcnQgY2xhc3MgR3JhcGhWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICAgIG51bUZpbGVzOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBudW1GaWxlczogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGxlYWYpO1xuICAgICAgICB0aGlzLm51bUZpbGVzID0gbnVtRmlsZXM7XG4gICAgfVxuXG4gICAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFZJRVdfVFlQRV9HUkFQSDtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJHcmFwaCBWaWV3XCJcbiAgICB9XG5cbiAgICBhc3luYyBvbk9wZW4oKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lckVsID0gdGhpcy5jb250YWluZXJFbC5jaGlsZHJlblsxXTtcbiAgICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoNFwiLCB7IHRleHQ6IGBOdW1iZXIgb2YgRmlsZXMgRm91bmQ6ICR7dGhpcy5udW1GaWxlc31gfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgb25DbG9zZSgpIHtcblxuICAgIH1cbn1cblxuLy8gJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJVxuLy8gTW9kYWxcbi8vICUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSVcblxuZXhwb3J0IGNsYXNzIEV4YW1wbGVNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgICByZXN1bHQ6IHN0cmluZztcbiAgICBvblN1Ym1pdDogKHJlc3VsdDogc3RyaW5nKSA9PiB2b2lkO1xuICBcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgb25TdWJtaXQ6IChyZXN1bHQ6IHN0cmluZykgPT4gdm9pZCkge1xuICAgICAgc3VwZXIoYXBwKTtcbiAgICAgIHRoaXMub25TdWJtaXQgPSBvblN1Ym1pdDtcbiAgICB9XG4gIFxuICAgIG9uT3BlbigpIHtcbiAgICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICBcbiAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcImgxXCIsIHsgdGV4dDogXCJXaGF0J3MgeW91ciBuYW1lP1wiIH0pO1xuICBcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRlbnRFbClcbiAgICAgICAgLnNldE5hbWUoXCJOYW1lXCIpXG4gICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgIHRleHQub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdCA9IHZhbHVlXG4gICAgICAgICAgfSkpO1xuICBcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRlbnRFbClcbiAgICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PlxuICAgICAgICAgIGJ0blxuICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoXCJTdWJtaXRcIilcbiAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgIHRoaXMub25TdWJtaXQodGhpcy5yZXN1bHQpO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cbiAgXG4gICAgb25DbG9zZSgpIHtcbiAgICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgICAgY29udGVudEVsLmVtcHR5KCk7XG4gICAgfVxuICB9XG5cbi8vICUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSVcbi8vIFNldHRpbmdzXG4vLyAlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlXG5cbmludGVyZmFjZSBHdXJ1U2V0dGluZ3Mge1xuICAgIGZvY3VzX2RpcmVjdG9yeTogc3RyaW5nO1xuICAgIGZhdm9yaXRlX2NvbG9yOiBzdHJpbmc7XG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEd1cnVTZXR0aW5ncyA9IHtcbiAgICBmb2N1c19kaXJlY3Rvcnk6ICcuLycsXG4gICAgZmF2b3JpdGVfY29sb3I6ICdQdXJwbGUnXG59IFxuXG5jbGFzcyBHdXJ1U2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIHBsdWdpbjogR3VydVBsdWdpbjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IEd1cnVQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICBjb25zdCB7Y29udGFpbmVyRWx9ID0gdGhpcztcblxuICAgICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiAnR3JhcGggR3VydSBTZXR0aW5ncyd9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdGb2N1cyBEaXJlY3RvcnknKVxuICAgICAgICAgICAgLnNldERlc2MoJ0VudGVyIHRoZSBkaXJlY3RvcnkgeW91IHdpc2ggZm9yIFRoZSBHdXJ1IHRvIGZvY3VzIG9uLicpXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ0VudGVyIHlvdXIgZGlyZWN0b3J5JylcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9jdXNfZGlyZWN0b3J5KVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RpcmVjdG9yeTogJyArIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9jdXNfZGlyZWN0b3J5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0Zhdm9yaXRlIENvbG9yJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdMZXQgdXMga25vdyB5b3VyIGZhdm9yaXRlIGNvbG9yLicpXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ0VudGVyIGNvbG9yJylcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZmF2b3JpdGVfY29sb3IpXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29sb3I6ICcgKyB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZhdm9yaXRlX2NvbG9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgXG4gICAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUEwSDtBQUMxSCwyQkFBc0I7QUFNdEIsSUFBcUIsYUFBckIsY0FBd0MsdUJBQU87QUFBQSxFQUczQyxNQUFNLFNBQVM7QUFDWCxVQUFNLEtBQUssYUFBYTtBQUV4QixVQUFNLFFBQVEsTUFBTSxLQUFLLGlCQUFpQjtBQUMxQyxZQUFRLElBQUksS0FBSztBQUNqQixVQUFNLG9CQUFvQixNQUFNLEtBQUssbUJBQW1CLEtBQUs7QUFDN0QsWUFBUSxJQUFJLGlCQUFpQjtBQUc3QixTQUFLO0FBQUEsTUFDRDtBQUFBLE1BQ0EsQ0FBQyxTQUFTLElBQUksVUFBVSxNQUFNLE1BQU0sTUFBTTtBQUFBLElBQzlDO0FBR0EsU0FBSyxjQUFjLFVBQVUsdUJBQXVCLE1BQU07QUFDdEQsY0FBUSxJQUFJLE1BQU07QUFBQSxJQUN0QixDQUFDO0FBR0QsVUFBTSxLQUFLLGFBQWE7QUFDeEIsU0FBSyxjQUFjLElBQUksZUFBZSxLQUFLLEtBQUssSUFB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