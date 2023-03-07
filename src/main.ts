import { FileSystemAdapter, Notice, Plugin, TFile, CachedMetadata, getAllTags } from 'obsidian';
import { PythonShell } from 'python-shell';
const { spawn } = require('child_process');
import { GraphGuruSettings, GraphGuruSettingTab, DefaultGuruSettings } from './settings';

export default class GraphGuruPlugin extends Plugin {
    guruCoordinates: object[] | unknown[] | null = null;
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
            name: 'Initialize GraphGuru',
            callback: async () => {
                const guruCoordinates = await this.runPython();
                if (guruCoordinates != null) {
                    this.guruCoordinates = guruCoordinates;
                    // this.guruCoordinates = test_coordinates;
                    new Notice("GraphGuru is initialized");
                    this.statusBar.setText(`GraphGuru Initialized ✅`);
                    console.log(this.guruCoordinates);
                    // await this.writeToCSV(this.guruCoordinates);
                } else {
                    new Notice("GraphGuru is not initialized");
                    this.statusBar.setText(`GraphGuru Not Initialized 😡`);
                }
            }
        });
    
        this.addRibbonIcon("palmtree", "Open GraphGuru", async () => { // or map or anchor for icon 
            if (this.guruCoordinates != null) {
                new Notice("GraphGuru is initialized");
            } else {
                new Notice("GraphGuru is not initialized");
            }
        });
    }

    async runPython() {
        try {
            let options = {
                pythonPath: this.settings.pythonInterpreter,
                args: [this.baseVaultPath]
            }

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