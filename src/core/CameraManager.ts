import * as THREE from 'three';

export class CameraManager {
    // public camera: THREE.PerspectiveCamera;
    public camera: THREE.OrthographicCamera;

    private readonly initialZ = -25;

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
        this.camera.position.z = this.initialZ;

        this.camera.lookAt(0, 0, 0);
    }

    update(target: THREE.Vector3) {
        const targetPosition = new THREE.Vector3(
            target.x,
            this.camera.position.y,
            target.z + this.initialZ,
        );

        this.camera.position.lerp(targetPosition, 0.1);
    }
}