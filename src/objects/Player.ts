import * as THREE from 'three';
import { foxUrl, type GLTFLoaderManager } from '../core/GLTFLoaderManager';

export class Player {
    public group = new THREE.Group();
    private mixer!: THREE.AnimationMixer;
    public actions: FoxActions = {
        [FoxAnimations.Survey]: null,
        [FoxAnimations.Walk]: null,
        [FoxAnimations.Run]: null,
    };

    public readonly walkSpeed = 4;
    public readonly runSpeed = 8;

    constructor(
        public loaderManager: GLTFLoaderManager,
    ) {
        
    }

    async load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.loaderManager.loader.load(
                foxUrl,
                (gltf) => {
                    this.group.add(gltf.scene);
                    this.group.scale.setScalar(0.025);

                    this.mixer = new THREE.AnimationMixer(gltf.scene);
                    gltf.animations.forEach((animation) => {
                        this.actions[animation.name as FoxAnimations] = this.mixer.clipAction(animation);
                    });

                    this.actions.Survey?.play();
                    
                    resolve();
                },
                undefined,
                reject
            );
        });
    }

    public update(dt: number) {
        this.mixer?.update(dt);
    }

    public movePlayer(dir: THREE.Vector3, dt: number, speed: number) {
        if (!this.group) return;

        if (dir.lengthSq() > 0) {
            const movementDirection = new THREE.Vector3(-dir.x, dir.y, dir.z);
            this.group.position.addScaledVector(movementDirection, speed * dt);

            const targetAngle = Math.atan2(movementDirection.x, movementDirection.z);
            // const rotationSpeed = 2;
            this.group.rotation.y = THREE.MathUtils.damp(this.group.rotation.y, targetAngle, speed, dt)
        }
    }
}

enum FoxAnimations {
    Survey = 'Survey',
    Walk = 'Walk',
    Run = 'Run'
}

type FoxActions = { [key in FoxAnimations]: THREE.AnimationAction | null };