import * as THREE from 'three';

export class Ground {
    public mesh: THREE.Mesh;

    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(40, 40),
            new THREE.MeshBasicMaterial({ color: '#014104' }),
        );

        this.mesh.rotation.x = -Math.PI / 2;

        this.mesh.receiveShadow = true;
    }

    public update() {
        
    }
}