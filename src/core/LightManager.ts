import * as THREE from 'three';

export class LightManager {
    public directionalLight: THREE.DirectionalLight;
    public ambientLight: THREE.AmbientLight;

    constructor() {
        this.directionalLight = new THREE.DirectionalLight();
        this.directionalLight.position.set(1, 1, 0);

        this.ambientLight = new THREE.AmbientLight();
    }
}