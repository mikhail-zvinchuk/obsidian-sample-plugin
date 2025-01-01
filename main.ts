import { App, Plugin, PluginSettingTab, Setting, TFolder } from 'obsidian';
import * as fs from 'fs';

interface ScreenshotGrabberSettings {
    screenshotFolder: string;
}

const DEFAULT_SETTINGS: ScreenshotGrabberSettings = {
    screenshotFolder: ''
}

export default class ScreenshotGrabber extends Plugin {
    settings: ScreenshotGrabberSettings;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new ScreenshotGrabberSettingTab(this.app, this));

        this.addCommand({
            id: 'list-screenshots',
            name: 'List Screenshots',
            callback: () => this.listScreenshots(),
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async listScreenshots() {
		
        const folderPath = this.settings.screenshotFolder;
        if (!folderPath) {
            console.log('Screenshot folder not set in settings');
            return;
        }

        try {
			const files: string[] = fs.readdirSync(folderPath);
			console.log('Files in the directory:');
			files.forEach((file: string) => {
			  console.log(file);
			});
		  } catch (err) {
			console.error('Error reading directory:', err);
		  }
    }
}

class ScreenshotGrabberSettingTab extends PluginSettingTab {
    plugin: ScreenshotGrabber;

    constructor(app: App, plugin: ScreenshotGrabber) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Screenshot Folder')
            .setDesc('Enter the path of the folder containing screenshots')
            .addText(text => text
                .setPlaceholder('Enter screenshot folder path')
                .setValue(this.plugin.settings.screenshotFolder)
                .onChange(async (value) => {
                    this.plugin.settings.screenshotFolder = value;
                    await this.plugin.saveSettings();
                }));
    }
}
