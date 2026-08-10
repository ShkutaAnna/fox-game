import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export const foxUrl = `${import.meta.env.BASE_URL}models/Fox/glTF/Fox.gltf`;

export class GLTFLoaderManager {
    public loader: GLTFLoader;

    constructor() {
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath(darcoUrl);

        this.loader = new GLTFLoader();
        //this.loader.setDRACOLoader(dracoLoader);
    }
}