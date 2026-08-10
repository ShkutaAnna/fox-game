import * as THREE from 'three';

export class CameraManager {
    // public camera: THREE.PerspectiveCamera;
    public camera: THREE.OrthographicCamera;

    constructor() {
        // this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        // this.camera.position.y = 23.5;
        // this.camera.position.z = 20.5;
        // this.camera.rotation.y = Math.PI;

        const aspect = window.innerWidth / window.innerHeight
        const viewSize = 10

        this.camera = new THREE.OrthographicCamera(
            -viewSize * aspect / 2,
            viewSize * aspect / 2,
            viewSize / 2,
            -viewSize / 2,
            0.1,
            1000
        )

        // this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 50);
        this.camera.position.y = 20;
        this.camera.position.z = -25;

        this.camera.lookAt(0, 0, 0);
    }
}