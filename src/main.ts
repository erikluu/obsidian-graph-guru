import { FileSystemAdapter, Notice, Plugin, TFile, CachedMetadata, getAllTags, TAbstractFile } from 'obsidian';
import { GraphGuruSettings, GraphGuruSettingTab, DefaultGuruSettings } from './settings';
import { PythonShell } from 'python-shell';
const { spawn } = require('child_process');
const fs = require('fs');

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
                // const result = await this.runPython();
                const result = true;
                if (result != null) {
                    this.initBool = true;
                    new Notice("GraphGuru is initialized");
                    this.statusBar.setText(`GraphGuru Initialized ✅`);
                    this.writeToMD();
                    this.statusBar.setText(`graph-guru.md created`);

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
            
            this.statusBar.setText(`GraphGuru Processing ⏳`);
            const result = await PythonShell.run(this.pythonScriptsPath, options);
            console.log(`Python results: ${result}`);

            return result;
        } catch (error) {
            console.log(error);
        }
    }
    
    // write coordinates to file
    async writeToMD() {
        // read coordinates.json
        const coordinates = JSON.parse(fs.readFileSync(this.baseVaultPath + '/.obsidian/plugins/obsidian-graph-guru/results/coordinates.json', 'utf8'));

        // add all coords to a string with the format marker: default, x, y, [filename]
        // coordinates is a JSON object with the keys as filenames and the value is an array wiih the x and y coordinates
        let leafletString = '';
        leafletString += "```leaflet\nid: graph-guru-map\nimage: [[istockphoto-1146986079-170667a.jpg]]\nheight: 500px\nlat: 50\nlong: 50\nminZoom: 1\nmaxZoom: 50\ndefaultZoom: 5\nunit: meters\nscale: 1\n"
        for (const [key, value] of Object.entries(coordinates).slice(0, 199)) {
            leafletString += `marker: default, ${parseFloat(value[0]) * 50}, ${parseFloat(value[1]) * 50}, [[${key}]]\n`;
        }
        leafletString += "darkMode: True\n```\n";

        this.app.vault.delete(this.app.vault.getAbstractFileByPath("graph-guru.md"));
        this.app.vault.create('graph-guru.md', leafletString);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {
        console.log('unloading plugin');

    }
}