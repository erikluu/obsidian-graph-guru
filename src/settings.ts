import {App, PluginSettingTab, Setting} from "obsidian";

import GraphGuruPlugin from "./main";

export interface GraphGuruSettings {
    focus_directory: string;
}

export const DefaultGuruSettings: GraphGuruSettings= {
    focus_directory: './',
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
            .setName('Focus Directory')
            .setDesc('Enter the directory you wish for GraphGuru to focus on.')
            .addText(text => text
                .setPlaceholder('Enter your directory')
                .setValue(this.plugin.settings.focus_directory)
                .onChange(async (value) => {
                    this.plugin.settings.focus_directory = value;
                    await this.plugin.saveSettings();
                }));
    }
}



