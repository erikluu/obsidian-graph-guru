import { FileSystemAdapter, Notice, Plugin, TFile, CachedMetadata, getAllTags } from 'obsidian';
import { PythonShell } from 'python-shell';
const { spawn } = require('child_process');
import { GraphGuruSettings, GraphGuruSettingTab, DefaultGuruSettings } from './settings';

export default class GraphGuruPlugin extends Plugin {
    settings: GraphGuruSettings;
    scriptsPath: string;
    pythonScriptsPath: string;
    statusBar: HTMLElement;
    guruCoordinates: object[] | unknown[] | null = null;
    envPath: string;

    async onload() {
        if (this.app.vault.adapter instanceof FileSystemAdapter) {
			this.scriptsPath = this.app.vault.adapter.getBasePath();
		}

        this.settings = Object.assign({}, DefaultGuruSettings, await this.loadData());
        await this.saveSettings();
        this.addSettingTab(new GraphGuruSettingTab(this.app, this));
        this.statusBar = this.addStatusBarItem();

        this.addCommand({
            id: 'init-graph-guru',
            name: 'Initialize GraphGuru',
            callback: async () => {
                const guruCoordinates = await this.initialize();
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

    // public async writeToCSV(coordinates : object[]) {    
    //     const headers = "type,lat,long,link\n";

    //     // Create a string with the coordinates in CSV format
    //     let csvData = "";
    //     for (const c of coordinates) {
    //         const lat = c.coords[0];
    //         const lon = c.coords[0];
    //         csvData += `,,${lat},${lon}\n`;
    //     }

    //     const fileContent = headers + csvData;

    //     this.app.vault.adapter.write('coords.csv', fileContent);
    // }

    public async initialize() {
        console.log("Initializing GraphGuru");
        try {
            // const files = await Promise.all(await this.getVaultAllFiles());
            // const result = await this.sendToPython(files);
            const result = await this.sendToPython();
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    async sendToPython() {
        try {
            let options = {
                pythonPath: this.settings.pythonInterpreter,
            }

            const pyshell = new PythonShell(this.pythonScriptsPath, options);
            pyshell.send(this.app.vault.configDir); // actually send script
            pyshell.on('message', (message) => {
                try {
                    const output = message;
                    console.log(output);
                } catch (err) {
                    console.log(err);    
                }
            });

            pyshell.end(function (err, code, signal) {
                if (err) throw err;
                console.log('The exit code was: ' + code);
                console.log('The exit signal was: ' + signal);
                console.log('finished');
            });
  
        } catch (error) {
            console.log(error);
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {
        console.log('unloading plugin');
    }
}