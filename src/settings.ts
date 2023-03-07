import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import { spawn, exec, ChildProcess } from 'child_process';

import GraphGuruPlugin from "./main";

export interface GraphGuruSettings {
    focus_directory: string;
    pythonInterpreter: string;
	setupScript: string;
}

export const DefaultGuruSettings: GraphGuruSettings= {
    focus_directory: './',
    pythonInterpreter: 'python',
	setupScript: '',
} 

export class GraphGuruSettingTab extends PluginSettingTab {
    plugin: GraphGuruPlugin;

    constructor(app: App, plugin: GraphGuruPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Graph Guru Settings'});

        new Setting(containerEl)
			.setName('Python interpreter')
			.setDesc('Path to your python interpreter, e.g. `/usr/bin/python`.')
			.setClass('wideSettingsElement')
			.addText(text => text
				.setValue(this.plugin.settings.pythonInterpreter)
				.onChange(async (value) => {
					this.plugin.settings.pythonInterpreter = value;
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
            .setName('Install python dependencies')
            .setDesc('This will modify your environment-use at your own risk.')
            .addButton(button => {
                button.setButtonText('Install dependencies');
                button.onClick(evt => {
                    let interpreter = this.plugin.settings.pythonInterpreter;
                    let command = `${interpreter} -u -m pip install --upgrade openai numpy obsidiantools scikit-learn tenacity`;
                    new Notice('Installing dependencies; this may take some time...');
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`failed to install dependencies: ${error}`);
                            new Notice('Failed to install dependencies, view developer console for details.');
                        } else {
                            new Notice('Installed dependencies, view developer console for details.');
                        }
                        console.log(`install stdout: ${stdout}`);
                        console.log(`install stderr: ${stderr}`);
                    });
                });
            });

        // new Setting(containerEl)
        //     .setName('Focus Directory')
        //     .setDesc('Enter the directory you wish for GraphGuru to focus on.')
        //     .addText(text => text
        //         .setPlaceholder('Enter your directory')
        //         .setValue(this.plugin.settings.focus_directory)
        //         .onChange(async (value) => {
        //             this.plugin.settings.focus_directory = value;
        //             await this.plugin.saveSettings();
        //         }));
    }
}



