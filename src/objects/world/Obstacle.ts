import * as THREE from 'three';

export class Obstacle {
    public readonly box = new THREE.Box3();

    constructor(
        public readonly object: THREE.Object3D,
    ) {
        this.box.setFromObject(object);
    }
}