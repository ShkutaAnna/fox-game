import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { SceneManager } from "./core/SceneManager";
import { CameraManager } from "./core/CameraManager";
import { RendererManager } from "./core/RendererManager";

import { Player } from "./objects/Player";

// import { AnimationManager } from "../animations/AnimationManager";
import { ResizeManager } from "./core/ResizeManager";
// import { InputManager } from "./core/InputManager";
import { UIManager } from "./ui/UIManager";
import { LightManager } from './core/LightManager';
import { GLTFLoaderManager } from './core/GLTFLoaderManager';
import GUI from 'lil-gui';
import { Ground } from './objects/world/Ground';
import { Joystick } from './ui/Joystick';
import { FontManager } from './core/FontManager';
import { getBlockedCells, getAreaCellsIndexes } from './utils/spawn';

export class Game {
    private sceneManager = new SceneManager();
    private cameraManager = new CameraManager();
    private lightManager = new LightManager();
    private rendererManager = new RendererManager();
    // private inputManager = new InputManager();
    private uiManager: UIManager;
    private fontManager = new FontManager();

    private joystick = new Joystick(this.rendererManager.renderer.domElement);

    private gui = new GUI();

    private loaderManager = new GLTFLoaderManager();

    private player!: Player;
    private ground = new Ground(this.gui, this.sceneManager.scene);

    private orbitControls: OrbitControls;

    private clock = new THREE.Clock();

    constructor() {
        this.gui.hide();

        this.uiManager = new UIManager(() => {
            if (!this.player?.canLookAround()) {
                return;
            }

            this.uiManager.setActionButtonState(true);

            this.player?.lookAround();
        });
        new ResizeManager(this.cameraManager.camera, this.rendererManager.renderer);

        this.sceneManager.scene.add(this.lightManager.directionalLight, this.lightManager.ambientLight);

        this.sceneManager.scene.add(this.ground.group);

        // FLY CAMERA
        this.orbitControls = new OrbitControls(this.cameraManager.camera, this.rendererManager.renderer.domElement);
        this.orbitControls.enabled = false;

        const cameraGui = this.gui.addFolder('camera');
        cameraGui.add(this.cameraManager.camera.position, "x", -40, 40, 0.5);
        cameraGui.add(this.cameraManager.camera.position, "y", -40, 40, 0.5);
        cameraGui.add(this.cameraManager.camera.position, "z", -40, 40, 0.5);

        cameraGui.add(this.cameraManager.camera.rotation, 'x', -Math.PI, Math.PI, 0.0001);
        cameraGui.add(this.cameraManager.camera.rotation, 'y', -Math.PI, Math.PI, 0.0001);
        cameraGui.add(this.cameraManager.camera.rotation, 'z', -Math.PI, Math.PI, 0.0001);


        // const axesHelper = new THREE.AxesHelper(5);
        // this.sceneManager.scene.add(axesHelper);
        // axesHelper.setColors('#ffffff', '#000000', '#ff0000');

        this.initPlayer();

        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // FLY CAMERA
        if (this.orbitControls.enabled)
            this.orbitControls.update();

        const dt = this.clock.getDelta();

        if (this.player) {
            if (this.joystick.active) {
                this.player.startMovingAnimation();
                this.player.movePlayer(new THREE.Vector3(this.joystick.direction.x, 0, this.joystick.direction.y), dt, this.player.walkSpeed);
            } else {
                this.player.stopMovingAnimation();
            }

            this.player.update(dt);
            this.cameraManager.update(this.player.group.position);
        }

        this.rendererManager.renderer.render(
            this.sceneManager.scene,
            this.cameraManager.camera,
        )
    }

    private async initPlayer() {
        this.player = new Player(this.loaderManager, this.fontManager, this.cameraManager.camera);
        await this.player.load();

        this.player.onLookAroundFinished(() => {
            this.uiManager.setActionButtonState(false);
        });

        this.sceneManager.scene.add(this.player.group);

        // TEST

        const box = new THREE.Box3().setFromObject(this.player.group);

        const params = {
            cellSize: 5,
            maxX: 20,
            maxZ: 20,
            minX: -20,
            minZ: -20,
        }

        const cells = getAreaCellsIndexes(params);
        getBlockedCells([box], params);

        cells.forEach((cell) => {
            const testMesh = new THREE.Mesh(
                new THREE.BoxGeometry(4.5, 4.5, 4.5),
                new THREE.MeshBasicMaterial({ transparent: true, wireframe: true }),
            )

            testMesh.position.set(cell.centerX, 0.5, cell.centerZ);
            this.sceneManager.scene.add(testMesh);
        })

        // END OF TEST

        // this.cameraManager.camera.lookAt(this.player.group.position);

        const playerGui = this.gui.addFolder('player');
        playerGui.add(this.player.group.position, "x", -40, 40, 0.5);
        playerGui.add(this.player.group.position, "y", -40, 40, 0.5);
        playerGui.add(this.player.group.position, "z", -40, 40, 0.5);

        playerGui.add(this.player.group.rotation, 'y', -Math.PI, Math.PI, 0.0001);
    }
}