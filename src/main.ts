import { FileSystemAdapter, Notice, Plugin, TFile, CachedMetadata, getAllTags } from 'obsidian';
import { PythonShell } from 'python-shell';
import { GraphGuruSettings, GraphGuruSettingTab, DefaultGuruSettings } from './settings';

// const test_coordinates = [  {coords: [0.00355128, 0.14330955]},
//                             {coords: [-0.01840003, 0.15422342]},
//                             {coords: [-0.30591294, -0.11079613]},
//                             {coords: [-0.27770398, -0.0548101]},
//                             {coords: [-0.28004129, -0.11006741]},
//                             {coords: [-0.30041763, -0.08313805]},
//                             {coords: [-0.24007989, -0.10953094]},
//                             {coords: [0.28609557, -0.26272716]},
//                             {coords: [0.31823789, -0.20931468]},
//                             {coords: [0.29171426, -0.2530871]},
//                             {coords: [0.32597832, -0.04688666]},
//                             {coords: [0.10558672, 0.34822129]},
//                             {coords: [0.12127385, 0.33224248]},
//                             {coords: [0.07495285, 0.31229199]},
//                             {coords: [-0.03595148, -0.05764129]},
//                             {coords: [-0.06888351, 0.00771078]}
//                         ]

export default class GraphGuruPlugin extends Plugin {
    settings: GraphGuruSettings;
    path: string;
    pythonScriptsPath: string;
    statusBar: HTMLElement;
    guruCoordinates: object[] | unknown[] | null = null;

    async onload() {
        if (this.app.vault.adapter instanceof FileSystemAdapter) {
			this.path = this.app.vault.adapter.getBasePath();
            // this.pythonScriptsPath = this.path + '/.obsidian/plugins/obsidian-graph-guru/src/processing/async_script.py';
            this.pythonScriptsPath = this.path + '/.obsidian/plugins/obsidian-graph-guru/src/processing/script.py';
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
            const pyshell = new PythonShell(this.pythonScriptsPath);
            pyshell.send(this.app.vault.configDir); // actually send script
            pyshell.on('message', (message) => {
                try {
                    const output = JSON.parse(message);
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

    async getVaultAllFiles() {
        const files: TFile[] = this.app.vault.getFiles();
        
        const fileObjects = files.map(async (f) => {
            const text: string = await this.app.vault.read(f);
            const metadata: CachedMetadata | null = this.app.metadataCache.getFileCache(f);
            let tags: string[] | null = null
            
            if (metadata != null) {
                tags = getAllTags(metadata);    
            }

            return {
                // metadata: metadata,
                text: text,
                tags: tags
            }
        });

        return fileObjects;
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {
        console.log('unloading plugin');
    }
}