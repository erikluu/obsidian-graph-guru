import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import { spawn, exec, ChildProcess } from 'child_process';

import GraphGuruPlugin from "./main";

export interface GraphGuruSettings {
    openaiAPIKey: string;
    openaiAPIKeyShadow: string;
    pythonInterpreter: string;
    dependenciesInstalled: boolean;
}

export const DefaultGuruSettings: GraphGuruSettings= {
    openaiAPIKey: '',
    openaiAPIKeyShadow: '',
    pythonInterpreter: 'python',
    dependenciesInstalled: false,
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
           .setName('OpenAI API key')
           .setDesc('This key will be used for OpenAI API calls. We cannot see your key. You can get a key from https://beta.openai.com/account/api-keys.')   
           .addButton(button => {
               button.setButtonText('Hide API key');
               button.setCta();
               button.onClick(evt => {
                   let input = containerEl.querySelector('input');
                   if (input) {
                       if (input.type === 'password') {
                           input.type = 'text';
                           button.setButtonText('Hide API key');
                       } else {
                           input.type = 'password';
                           button.setButtonText('Show API key');
                       }
                   }
               });
           })
           .addText(text => text
               .setPlaceholder("API key")
               .setValue(this.plugin.settings.openaiAPIKey)
               .onChange(async (value) => {
                    this.plugin.settings.openaiAPIKey = value;
                    await this.plugin.saveSettings();

                    let input = containerEl.querySelector('input');
                    if (input) {
                        input.type = 'password';
                    }
               }));

        new Setting(containerEl)
			.setName('Python interpreter')
			.setDesc('Path to your python interpreter, e.g. `/usr/bin/python`. If you are using a virtual environment, you can find the path to your python interpreter by running `which python` in your virtual environment. Requires Python 3.9 or higher.')
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
                button.setCta();
                button.onClick(evt => {
                    let interpreter = this.plugin.settings.pythonInterpreter;
                    let command = `${interpreter} -u -m pip install --upgrade openai numpy obsidiantools scikit-learn tenacity markdown pymdown-extensions html2text pandas numpy networkx`;
                    new Notice('Installing dependencies; this may take some time...');
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`failed to install dependencies: ${error}`);
                            new Notice('Failed to install dependencies, view developer console for details.');
                        } else {
                            new Notice('Installed dependencies, view developer console for details.');
                            this.plugin.settings.dependenciesInstalled = true;
                        }
                        console.log(`install stdout: ${stdout}`);
                        console.log(`install stderr: ${stderr}`);
                    });
                });
            });
    }
}



