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

    private isSurveying = false;
    private surveyFinishedCallback?: () => void

    private isWalking = false;

    public readonly walkSpeed = 3;
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
                    this.group.scale.setScalar(0.015); // 0.025

                    this.mixer = new THREE.AnimationMixer(gltf.scene);
                    this.mixer.addEventListener('finished', (event) => this.handleAnimationFinished(event));
                    gltf.animations.forEach((animation) => {
                        if (!animation) return;
 
                        this.actions[animation.name as FoxAnimations] = this.mixer.clipAction(animation);
                    });
                    
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
            const currentAngle = this.group.rotation.y;
            const delta = THREE.MathUtils.euclideanModulo(
                targetAngle - currentAngle + Math.PI,
                Math.PI * 2
            ) - Math.PI;
            this.group.rotation.y = THREE.MathUtils.damp(currentAngle, currentAngle + delta, speed, dt);
        }
    }

    public canLookAround() {
        return !this.isSurveying;
    }

    public onLookAroundFinished(callback: () => void): void {
        this.surveyFinishedCallback = callback;
    }

    public lookAround() {
        const surveyAction = this.actions[FoxAnimations.Survey];
        if (surveyAction === null) return;

        this.isSurveying = true;
        surveyAction.reset();
        surveyAction.setLoop(THREE.LoopOnce, 1);
        surveyAction.clampWhenFinished = true;
        surveyAction.play();
    }

    public startMovingAnimation() {
        if (this.isWalking) return;

        const walkAction = this.actions[FoxAnimations.Walk];
        if (walkAction === null) return;

        this.isWalking = true;
        walkAction.reset();
        // walkAction.setLoop(THREE.LoopOnce, 1);
        walkAction.clampWhenFinished = true;
        walkAction.play();
    }

    public stopMovingAnimation(): void {
        if (!this.isWalking) return;

        const walkAction = this.actions[FoxAnimations.Walk];
        if (walkAction === null) return;

        walkAction.stop();
        this.isWalking = false;
    }

    private handleAnimationFinished(
        event: {
            action: THREE.AnimationAction;
            direction: number;
        } & THREE.Event<"finished", THREE.AnimationMixer<THREE.AnimationMixerEventMap>>,
    ) {
        if (event.action === this.actions[FoxAnimations.Survey]) {
            this.actions[FoxAnimations.Survey]?.fadeOut(0.4);

            setTimeout(() => {
                this.actions[FoxAnimations.Survey]?.stop();
                this.isSurveying = false;
                this.surveyFinishedCallback?.();
            }, 400);
        }

        // if (event.action === this.actions[FoxAnimations.Walk]) {
        //     this.actions[FoxAnimations.Walk]?.fadeOut(0.3);

        //     setTimeout(() => {
        //         this.actions[FoxAnimations.Walk]?.stop();
        //         this.isSurveying = false;
        //         this.surveyFinishedCallback?.();
        //     }, 300);
        // }
    }
}

enum FoxAnimations {
    Survey = 'Survey',
    Walk = 'Walk',
    Run = 'Run'
}

type FoxActions = { [key in FoxAnimations]: THREE.AnimationAction | null };