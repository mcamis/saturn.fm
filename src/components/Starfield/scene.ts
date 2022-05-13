import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  BufferGeometry,
  BufferAttribute,
  MeshBasicMaterial,
  LinearFilter,
  Mesh,
} from "three";
import {
  randomSize,
  randomPosition,
  sceneWidth,
} from "../../utilities/helpers";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class StarfieldScene {
  private camera: PerspectiveCamera;
  private debouncedResize: number;
  private height: number;
  private rafId: number;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private stars: Mesh[] = [];
  private spaceship: any;
  private width: number;
  private shouldShowSpaceship: boolean;

  public domElement;

  constructor() {
    this.setDimensions();
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ alpha: true, antialias: false });
    this.domElement = this.renderer.domElement;
    this.renderer.setPixelRatio(0.75);
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
    this.start();
  }

  setDimensions() {
    const width = sceneWidth();
    const height = window.innerHeight;

    this.width = width;
    this.height = height;

    return [width, height];
  }

  onResize() {
    this.setDimensions();
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  setupScene() {
    const mainLight = new DirectionalLight(0xffffff, 3);
    const leftLight = new DirectionalLight(0xffffff, 2);
    const rightLight = new DirectionalLight(0xffffff, 2);
    const camera = new PerspectiveCamera(
      70,
      this.width / this.height,
      0.1,
      1000
    );

    mainLight.position.set(-10, 46, 600);
    leftLight.position.set(-200, 46, 500);
    rightLight.position.set(200, 46, 500);

    this.scene.add(mainLight, leftLight, rightLight);

    camera.position.z = 500;

    this.camera = camera;
    this.addStars();
  }

  start() {
    this.rafId = window.requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    window.cancelAnimationFrame(this.rafId);
  }

  animate() {
    this.animateStars();
    this.animateSpaceship();
    this.renderer.render(this.scene, this.camera);
    this.rafId = window.requestAnimationFrame(this.animate.bind(this));
  }

  animateSpaceship() {
    if (!this.spaceship) return;

    this.spaceship.visible = this.shouldShowSpaceship;

    if (this.shouldShowSpaceship) {
      this.spaceship.rotateZ(0.01);
      this.spaceship.position.z -= 0.045;
      if (this.spaceship.position.z < 400) {
        this.spaceship.position.z = 0;
      }
    }
  }

  animateStars() {
    for (let i = 0; i < this.stars.length; i += 1) {
      const currentStar = this.stars[i];
      if (!currentStar) return;
      // rAF seems to run at 120fps even if the scene is only running at 60fps
      // TODO: how the heck can I determine rAF rate indepenent of FPS?
      const isHighRefreshRate = true;
      const baseSpeed = isHighRefreshRate ? 1.25 : 20;

      this.stars[i].position.z += baseSpeed + i * 0.05;

      // if the particle is too close move it to the back
      if (currentStar.position.z > 550) {
        currentStar.position.z = -1000;
        currentStar.position.x = randomPosition(this.width);
        currentStar.position.y = randomPosition(this.height);
      }
    }
  }

  addStars() {
    const blueMaterial = new MeshBasicMaterial({ color: 0x759cff });
    const redMaterial = new MeshBasicMaterial({ color: 0xff757a });
    const yellowMaterial = new MeshBasicMaterial({ color: 0xede13b });
    const whiteMaterial = new MeshBasicMaterial({ color: 0xffffff });

    const bufferGeometry = new BufferGeometry();

    // prettier-ignore
    const bufferVertices = new Float32Array([-1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1,]);
    bufferGeometry.setAttribute(
      "position",
      new BufferAttribute(bufferVertices, 3)
    );

    // Seed starts across the full z range
    for (let z = -500; z < 500; z += 10) {
      let material = whiteMaterial;
      if (z > 0 && z < 100) {
        material = redMaterial;
      } else if (z > 100 && z < 200) {
        material = yellowMaterial;
      } else if (z > 100 && z < 200) {
        material = blueMaterial;
      }

      const star = new Mesh(bufferGeometry, material);

      // TODO: Better positioning so stars don't smack the viewer in the face
      star.position.x = randomPosition(this.width);
      star.position.y = randomPosition(this.height);
      star.position.z = z;

      const baseSize = randomSize();
      const size = baseSize < 0.5 ? 0.5 : baseSize;
      star.scale.set(size, size, size);

      this.scene.add(star);
      this.stars.push(star);
    }
  }

  setupSpaceship = () => {
    const loader = new GLTFLoader();

    loader.load("../models/saturn_v1.gltf", (gltf) => {
      const { scene: shipModel } = gltf;
      const [x, y, z] = [2.5, -3.5, 510];
      shipModel.position.set(x, y, z);
      shipModel.rotateZ(3.5);
      shipModel.rotateY(Math.PI);
      shipModel.visible = false;

      // Disable texture filtering for the authenitc chunky Saturn gfx
      const shipMap = (shipModel.children[1] as any).material?.map;
      shipMap.magFilter = LinearFilter;
      shipMap.minFilter = LinearFilter;
      shipMap.generateMipmaps = false;

      this.spaceship = shipModel;
      this.scene.add(shipModel);
    });
  }

  toggleSpaceShipVisbility = (shouldShowSpaceship: boolean) => {
    this.shouldShowSpaceship = shouldShowSpaceship;
    if (!this.spaceship && shouldShowSpaceship) {
      this.setupSpaceship();
    }
  }
}

export default StarfieldScene;
