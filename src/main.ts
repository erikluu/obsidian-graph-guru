import { App, ItemView, WorkspaceLeaf, Modal, Plugin, PluginSettingTab, Setting, TFile, CachedMetadata, getAllTags } from 'obsidian';
import { spawn } from 'child_process';

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Plugin Main
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export default class GuruPlugin extends Plugin {
    settings: GuruSettings;

    async onload() {
        await this.loadSettings();

        const files = await this.getAllVaultFiles();
        console.log(files)
        const preprocessedFiles = await this.sendToPythonScript(files);
        console.log(preprocessedFiles);

        // register view
        this.registerView(
            VIEW_TYPE_GRAPH,
            (leaf) => new GraphView(leaf, files.length)
        );

        // ribbon button
        this.addRibbonIcon("citrus", "Activate Graph View", () => {
            console.log("lmao")
        })

        // load settings
        await this.loadSettings();
        this.addSettingTab(new GuruSettingTab(this.app, this))

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
        const statusBarItemEl = this.addStatusBarItem();
        statusBarItemEl.setText(`Graph Guru focused on ${files.length} files`);
    }

    onunload() {
        console.log('unloading plugin');
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_GRAPH);
    }

    async activateView() {
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_GRAPH);

        await this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE_GRAPH,
            active: true,
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
        const files: TFile[] = this.app.vault.getFiles();
        
        const fileObjects = files.map(async (f) => {
            const text: string = await this.app.vault.read(f);
            const metadata: CachedMetadata | null = this.app.metadataCache.getFileCache(f);
            let tags: string[] | null = null
            
            if (metadata != null) {
                tags = getAllTags(metadata);    
            }

            return {
                text: text,
                metadata: metadata,
                tags: tags
            }
        });

        return await Promise.all(fileObjects);
    }

    async sendToPythonScript(files: TFile[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', ['./src/preprocessing.py']);
            const results: string[] = [];

            pythonProcess.stdout.on('data', (data) => {
                results.push(JSON.parse(data.toString())); // maybe not toString
            });

            pythonProcess.stderr.on('data', (data) => {
                reject(data.toString());
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(results);
                } else {
                    reject(`Python process exited with code ${code}`);
                }
            });

            for (const file of files) {
                pythonProcess.stdin.write(JSON.stringify(file) + '\n');
            }

            pythonProcess.stdin.end();
        });
    }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// View
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export const VIEW_TYPE_GRAPH = "graph-view";

export class GraphView extends ItemView {
    numFiles: number;

    constructor(leaf: WorkspaceLeaf, numFiles: number) {
        super(leaf);
        this.numFiles = numFiles;
    }

    getViewType(): string {
        return VIEW_TYPE_GRAPH;
    }

    getDisplayText(): string {
        return "Graph View"
    }

    async onOpen() {
        const containerEl = this.containerEl.children[1];
        containerEl.empty();
        containerEl.createEl("h4", { text: `Number of Files Found: ${this.numFiles}`});
    }

    async onClose() {

    }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Modal
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export class ExampleModal extends Modal {
    result: string;
    onSubmit: (result: string) => void;
  
    constructor(app: App, onSubmit: (result: string) => void) {
      super(app);
      this.onSubmit = onSubmit;
    }
  
    onOpen() {
      const { contentEl } = this;
  
      contentEl.createEl("h1", { text: "What's your name?" });
  
      new Setting(contentEl)
        .setName("Name")
        .addText((text) =>
          text.onChange((value) => {
            this.result = value
          }));
  
      new Setting(contentEl)
        .addButton((btn) =>
          btn
            .setButtonText("Submit")
            .setCta()
            .onClick(() => {
              this.close();
              this.onSubmit(this.result);
            }));
    }
  
    onClose() {
      const { contentEl } = this;
      contentEl.empty();
    }
  }

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Settings
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

interface GuruSettings {
    focus_directory: string;
    favorite_color: string;
}

const DEFAULT_SETTINGS: GuruSettings = {
    focus_directory: './',
    favorite_color: 'Purple'
} 

class GuruSettingTab extends PluginSettingTab {
    plugin: GuruPlugin;

    constructor(app: App, plugin: GuruPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Graph Guru Settings'});

        new Setting(containerEl)
            .setName('Focus Directory')
            .setDesc('Enter the directory you wish for The Guru to focus on.')
            .addText(text => text
                .setPlaceholder('Enter your directory')
                .setValue(this.plugin.settings.focus_directory)
                .onChange(async (value) => {
                    console.log('Directory: ' + value);
                    this.plugin.settings.focus_directory = value;
                    await this.plugin.saveSettings();
                }));
        
        new Setting(containerEl)
            .setName('Favorite Color')
            .setDesc('Let us know your favorite color.')
            .addText(text => text
                .setPlaceholder('Enter color')
                .setValue(this.plugin.settings.favorite_color)
                .onChange(async (value) => {
                    console.log('Color: ' + value);
                    this.plugin.settings.favorite_color = value;
                    await this.plugin.saveSettings();
                }));
        
    }
}
