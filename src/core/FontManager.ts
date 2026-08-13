// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';

import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';

export const foxFontUrl = `${import.meta.env.BASE_URL}fonts/Blockblueprint-LV7z5.ttf`;

export class FontManager {
    private loader = new TTFLoader();

    private fonts = new Map<string, Font>();

    async load(name: string, url: string): Promise<Font> {
        const font = await new Promise<Font>((resolve, reject) => {
            this.loader.load(
                url,
                (json) => {
                    const font = new Font(json);
                    resolve(font);
                },
                undefined,
                reject
            );
        });

        this.fonts.set(name, font);

        return font;
    }

    get(name: string): Font {
        const font = this.fonts.get(name);

        if (!font) {
            throw new Error(`Font "${name}" has not been loaded`);
        }

        return font;
    }
}

