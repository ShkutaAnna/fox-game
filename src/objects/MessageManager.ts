import * as THREE from 'three';
import { TypewriterText } from './TypewriterText';
import type { Font } from 'three/examples/jsm/Addons.js';

export class MessageManager {
    private messages: string[] = [];
    private messagePosition = {
        x: 0,
        y: 0,
        z: 0,
    };

    private typewriterText: TypewriterText;

    private readonly removeMessageDelay = 1.5; // seconds
    private currentWait = 0;

    constructor(
        public font: Font,
        public parent: THREE.Group,
        public camera: THREE.Camera,
    ) {
        const parentBox = new THREE.Box3().setFromObject(parent);
        const parentHeight = parentBox.max.y - parentBox.min.y;
        this.messagePosition.y = parentHeight + parentHeight / 4;

        this.typewriterText = new TypewriterText(
            font,
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
            }),
        );

        const text = this.typewriterText.object;
        text.position.set(this.messagePosition.x, this.messagePosition.y, this.messagePosition.z);
        parent.add(text);
    }

    update(dt: number) {
        if (!this.messages.length) return;

        this.typewriterText.object.lookAt(this.camera.position);

        if (this.typewriterText.currentText.localeCompare(this.messages[0]) === 0) {
            const finished = this.typewriterText.update(dt);

            if (finished) {
                this.currentWait += dt;
                if (this.currentWait < this.removeMessageDelay) return;

                this.messages.shift();
                this.currentWait = 0;

                if (!this.messages.length) {
                    this.typewriterText.setText('');
                    return;
                }

                this.typewriterText.setText(this.messages[0]);
            }
        } else {
            this.typewriterText.setText(this.messages[0]);
        }
    }

    public addMessage(message: string) {
        this.messages.push(message);
    }
}