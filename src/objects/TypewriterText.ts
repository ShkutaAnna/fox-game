import * as THREE from 'three';
import { TextGeometry, type Font } from 'three/examples/jsm/Addons.js';

export class TypewriterText {
    private mesh: THREE.Mesh;
    private fullText = '';
    private currentIndex = 0;

    private elapsed = 0;
    private readonly speed = 40; // ms per character

    constructor(
        private readonly font: Font,
        material: THREE.Material,
    ) {
        this.mesh = new THREE.Mesh(
            new THREE.BufferGeometry(),
            material
        );
        this.mesh.name = 'typewriterText'
    }

    setText(text: string) {
        this.fullText = text;
        this.currentIndex = 0;
        this.elapsed = 0;

        this.updateGeometry();
    }

    update(delta: number) {
        if (this.currentIndex >= this.fullText.length) {
            return true;
        }

        this.elapsed += delta * 1000;

        if (this.elapsed >= this.speed) {
            const chars = Math.floor(this.elapsed / this.speed);

            this.currentIndex = Math.min(
                this.currentIndex + chars,
                this.fullText.length
            );

            this.elapsed %= this.speed;

            this.updateGeometry();
        }

        return this.currentIndex >= this.fullText.length;
    }

    private updateGeometry() {
        const text = this.fullText.slice(0, this.currentIndex);

        const geometry = new TextGeometry(text, {
            font: this.font,
            size: 0.1,
            depth: 0.01,
            curveSegments: 4,
            bevelEnabled: false,
        });

        this.mesh.geometry.dispose();
        this.mesh.geometry = geometry;


        // FIX THIS, centers of this and parent should align
        geometry.computeBoundingBox();

        if (geometry.boundingBox) {
            const width =
                geometry.boundingBox.max.x -
                geometry.boundingBox.min.x;

            this.mesh.position.x = -width / 2;
        }
    }

    get object() {
        return this.mesh;
    }

    get currentText() {
        return this.fullText;
    }
}