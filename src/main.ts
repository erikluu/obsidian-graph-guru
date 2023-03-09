import { FileSystemAdapter, Notice, Plugin, TFile, CachedMetadata, getAllTags } from 'obsidian';
import { PythonShell } from 'python-shell';
const { spawn } = require('child_process');
import { GraphGuruSettings, GraphGuruSettingTab, DefaultGuruSettings } from './settings';

export default class GraphGuruPlugin extends Plugin {
    initBool: boolean = false;
    baseVaultPath: string;
    pythonScriptsPath: string;
    settings: GraphGuruSettings;
    statusBar: HTMLElement;

    async onload() {
        if (this.app.vault.adapter instanceof FileSystemAdapter) {
			this.baseVaultPath = this.app.vault.adapter.getBasePath();
            this.pythonScriptsPath = this.baseVaultPath + '/.obsidian/plugins/obsidian-graph-guru/src/python_scripts/script.py';
		}

        this.settings = Object.assign({}, DefaultGuruSettings, await this.loadData());
        await this.saveSettings();
        this.addSettingTab(new GraphGuruSettingTab(this.app, this));
        this.statusBar = this.addStatusBarItem();

        this.addCommand({
            id: 'init-graph-guru',
            name: 'Initialize',
            callback: async () => {
                new Notice("Initializing GraphGuru");
                const result = await this.runPython();
                if (result != null) {
                    this.initBool = true;
                    new Notice("GraphGuru is initialized");
                    this.statusBar.setText(`GraphGuru Initialized ✅`);
                    // await this.writeToCSV(this.guruCoordinates);
                } else {
                    this.initBool = false;
                    new Notice("GraphGuru is not initialized. Check developed console for errors.");
                    this.statusBar.setText(`GraphGuru Not Initialized 😡`);
                }
            }
        });
    
        // https://lucide.dev
        // globe-2, map-pin, anchor, map
        this.addRibbonIcon("map-pin", "Open GraphGuru", async () => {
            if (this.initBool) {
                new Notice("GraphGuru is initialized");
            } else {
                new Notice("GraphGuru is not initialized");
            }
        });
    }

    async runPython() {
        try {
            const options = {
                pythonPath: this.settings.pythonInterpreter,
                args: [this.baseVaultPath, this.settings.openaiAPIKey]
            }
            
            console.log(options);
            this.statusBar.setText(`GraphGuru Processing ⏳`);
            const result = await PythonShell.run(this.pythonScriptsPath, options);
            console.log(`Python results: ${result}`);

            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {
        console.log('unloading plugin');
        // uninstall python dependencies? meh
    }
}