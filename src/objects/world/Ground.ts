import * as THREE from 'three';
import { Tree } from './Tree';
import type GUI from 'lil-gui';

export class Ground {
    public group = new THREE.Group();

    public ground: THREE.Mesh;
    private trees: Tree[] = [];

    private readonly size = 40;

    constructor(
        public gui: GUI,
        public scene: THREE.Scene,
    ) {
        this.ground = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.size),
            new THREE.MeshBasicMaterial({ color: '#014104' }),
        );
        this.ground.rotation.x = -Math.PI / 2;

        this.group.add(this.ground);

        this.createTrees();

        const ax = new THREE.AxesHelper();
        ax.setColors('#ffffff', '#000000', '#ff0000');
        this.group.add(ax);
    }

    public update() {
        
    }

    public createTrees() {
        const box = new THREE.Box3().setFromObject(this.ground);
        if (!box) return;

        // USE utils/spawn TO NOW DRAW ITEMS AT PLAYER SPAWN POINT

        for (let index = 0; index < 5; index++) {
            const tree = new Tree(this.gui);
            tree.setRandomPosition({
                minX: box.min.x,
                maxX: box.max.x,
                minZ: box.min.y,
                maxZ: box.max.y,
            });
            this.trees.push(tree);

            this.group.add(tree.mesh);
        }
    }
}

export type AreaMinMax = {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
}