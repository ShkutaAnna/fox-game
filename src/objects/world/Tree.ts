import * as THREE from 'three';
import { Obstacle } from "./Obstacle";
import { getRandom, getRandomInt } from '../../utils/numbers';
import type GUI from 'lil-gui';

export class Tree extends Obstacle {
    public static counter = 1;
    public mesh: THREE.Mesh;

    constructor(
        public gui: GUI,
    ) {
        const r = getRandom(1, 3);
        const h = getRandom(5, 10);
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(r, r, h, 32),
            new THREE.MeshBasicMaterial({ color: '#473e20' }),
        );
        super(mesh);

        this.mesh = mesh;

        this.mesh.rotation.y = Math.PI / getRandomInt(2, 8);

        // const folder = this.gui.addFolder(`tree ${Tree.counter}`);
        // Tree.counter++;
        // folder.add(this.mesh.rotation, 'y', -Math.PI, Math.PI, 0.001);
    }

    setRandomPosition(params: { minX: number, maxX: number, minZ: number, maxZ: number }) {
        if (!this.mesh) return;

        // USE utils/spawn TO NOW DRAW ITEMS AT PLAYER SPAWN POINT
        const geo = this.mesh.geometry as THREE.CylinderGeometry;
        const radiusMargin = geo.parameters.radiusTop;
        this.mesh.position.x = getRandom(params.minX + radiusMargin, params.maxX - radiusMargin);
        this.mesh.position.y = geo.parameters.height / 2;
        this.mesh.position.z = getRandom(params.minZ + radiusMargin, params.maxZ - radiusMargin);
    }
}