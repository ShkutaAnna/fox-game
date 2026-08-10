import * as THREE from 'three';

export class ResizeManager {
    constructor(
        public camera: THREE.OrthographicCamera,
        public renderer: THREE.WebGLRenderer,
    ) {
        window.addEventListener('resize', this.onResize)
    }

    private onResize = () => {
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        // this.camera.updateProjectionMatrix();

        const aspect = window.innerWidth / window.innerHeight
        const viewSize = 10

        this.camera.left = -viewSize * aspect / 2
        this.camera.right = viewSize * aspect / 2
        this.camera.top = viewSize / 2
        this.camera.bottom = -viewSize / 2

        this.camera.updateProjectionMatrix()

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}