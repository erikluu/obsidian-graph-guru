import { FileSystemAdapter, Notice, Plugin, TFile, CachedMetadata, getAllTags } from 'obsidian';
import { PythonShell } from 'python-shell';
import { GraphGuruSettings, GraphGuruSettingTab, DefaultGuruSettings } from './settings';

export default class GraphGuruPlugin extends Plugin {
    settings: GraphGuruSettings;
    path: string;
    pythonScriptsPath: string;
    statusBar: HTMLElement;
    guruCoordinates: object[] | unknown[] | null = null;

    async onload() {
    
        if (this.app.vault.adapter instanceof FileSystemAdapter) {
			this.path = this.app.vault.adapter.getBasePath();
            this.pythonScriptsPath = this.path + '/.obsidian/plugins/obsidian-graph-guru/src/processing/test.py';
		}

        this.settings = Object.assign({}, DefaultGuruSettings, await this.loadData());
        await this.saveSettings();
        this.addSettingTab(new GraphGuruSettingTab(this.app, this));
        this.statusBar = this.addStatusBarItem();
		this.statusBar.setText(`Focused Directory is ${this.settings.focus_directory}`);

        this.addCommand({
            id: 'init-graph-guru',
            name: 'Initialize GraphGuru',
            callback: async () => {
                const guruCoordinates = await this.initialize();
                if (guruCoordinates != null) {
                    this.guruCoordinates = guruCoordinates;
                    new Notice("GraphGuru is initialized");
                } else {
                    new Notice("GraphGuru is not initialized");
                }
            }
        });
    
        this.addRibbonIcon("palmtree", "Open GraphGuru", async () => { // or map or anchor for icon 
            if (this.guruCoordinates != null) {
                new Notice("GraphGuru is initialized");
                // console.log(this.guruCoordinates);
            } else {
                new Notice("GraphGuru is not initialized");
            }
        });
    }

    public async initialize() {
        console.log("Initializing GraphGuru");
        try {
            const files = Promise.all(await this.getVaultAllFiles());
            const result = await this.sendToPython(await files);
            console.log(result);
            return result;
        } catch(error) {
            console.log(error);
        }
    }

    async sendToPython(files: object[]) {
        try {
            const operations = files.map(input =>
                new Promise((resolve, reject) => {
                const pyshell = new PythonShell(this.pythonScriptsPath);
            
                pyshell.send(JSON.stringify(input));
            
                pyshell.on('message', (message) => {
                try {
                    const output = JSON.parse(message);
                    resolve(output);
                } catch (err) {
                    reject(err);
                    }
                });
        
                pyshell.end(function (err, code, signal) {
                    if (err) throw err;
                    console.log('The exit code was: ' + code);
                    console.log('The exit signal was: ' + signal);
                    console.log('finished');
                });
                })
            );
            
            const results = await Promise.all(operations);
            return results;
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
                text: text,
                // metadata: metadata,
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