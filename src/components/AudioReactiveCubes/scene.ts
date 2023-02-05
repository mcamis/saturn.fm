
import * as TWEEN from "es6-tween";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
  Color,
  Mesh,
} from "three";

import { sceneWidth } from "../../utilities/helpers";
import { activeRotation, idleRotation, updateScaleAndColor } from "./utils";
import { audioManagerSingleton, AudioStatus } from "../../audioManager";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();
const cubeColor = new Color("hsl(143, 100%, 48%)");

class AudioReactiveCubesScene {
  private camera: PerspectiveCamera;
  private debouncedResize: number;
  private height: number;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private width: number;
  private leftCube: Mesh;
  private rightCube: Mesh;
  private animateDownL: boolean;
  private animateUpL: boolean;
  private animateDownR: boolean;
  private animateUpR: boolean;
  public domElement;

  constructor() {
    this.setDimensions();
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ alpha: true, antialias: false });
    this.domElement = this.renderer.domElement;
    this.renderer.setPixelRatio(0.35); // TODO: Make this responsive to actual pixel ratio
    this.renderer.setSize(this.width, this.height);

    this.debouncedResize = null;

    window.addEventListener("resize", () => {
      clearTimeout(this.debouncedResize);
      this.debouncedResize = window.setTimeout(this.onResize.bind(this), 250);
    });

    window.addEventListener("orientationchange", () => {
      this.onResize();
    });

    this.setupScene();
  }

  setDimensions() {
    const width = sceneWidth();
    const height = width * 0.75;

    this.width = width;
    this.height = height;

    return [width, height];
  }

  onResize() {
    const [width, height] = this.setDimensions();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupScene() {
    const scene = new Scene();
    const camera = new PerspectiveCamera(20, this.width / this.height, 1, 1200);
    camera.position.z = 45;
    camera.position.y = -27;

    const ambient = new AmbientLight(0xffffff, 0.35);
    const directional = new DirectionalLight(0xffffff, 0.7);
    directional.position.set(0, 500, 900);
    scene.add(ambient, directional);

    this.setupCube("leftCube", [-6.75, -29.3, 0]);
    this.setupCube("rightCube", [6.75, -29.7, 0]);
    this.camera = camera;
    this.scene = scene;
  }

  start() {
    window.requestAnimationFrame(this.animate.bind(this));
  }

  animate() {
        TWEEN.update();
    // Only animated the cubes when audio is playing
    if (audioManagerSingleton.state.audioStatus === AudioStatus.Playing) {
      const [leftChannel, rightChannel] = audioManagerSingleton.analyserFFT;

      // Reset to middle after idle
      this.leftCube.position.y = -29;
      this.rightCube.position.y = -29;

      updateScaleAndColor(this.leftCube, leftChannel);
      updateScaleAndColor(this.rightCube, rightChannel);
      activeRotation(this.leftCube);
      activeRotation(this.rightCube, -1);
    } else {
      const { y: leftY } = this.leftCube.position;
      if (leftY >= -28.25 && !this.animateDownL) {
        this.animateDownL = true;
        this.animateUpL = false;
      }
      if (leftY <= -30.25 && !this.animateUpL) {
        this.animateUpL = true;
        this.animateDownL = false;
      }
      const { y: rightY } = this.rightCube.position;
      if (rightY >= -28.25 && !this.animateDownR) {
        this.animateDownR = true;
        this.animateUpR = false;
      }
      if (rightY <= -30.25 && !this.animateUpR) {
        this.animateUpR = true;
        this.animateDownR = false;
      }

      // TODO: Idle color
      idleRotation(this.leftCube, 0.35, this.animateDownL, this.animateUpL);
      idleRotation(this.rightCube, 0.35, this.animateDownR, this.animateUpR);
    }

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.animate.bind(this));
  }

  setupCube(slot: "leftCube" | "rightCube", [x, y, z]: number[]) {
    loader.load(
      "./models/cubeBigger.gltf",
      ({
        scene: {
          children: [, , cubeModel],
        },
      }) => {
        // eslint-disable no-param-reassign
        (cubeModel as any).material.color = cubeColor; // TODO what three.js type do I need here?
        (cubeModel as any).material.dithering = true;
        (cubeModel as any).material.flatShading = false;
        cubeModel.position.set(x, y, z);
        cubeModel.rotateX(0.075);
        if (slot === "rightCube") {
          cubeModel.rotateY(0.075);
        } else {
          cubeModel.rotateY(-0.1);
        }

        this[slot] = cubeModel as Mesh;
        this.scene.add(cubeModel);

        if (slot === "rightCube") this.start();
      }
    );
  }
}

export default AudioReactiveCubesScene;
