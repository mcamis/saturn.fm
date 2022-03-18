import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  BufferGeometry,
  BufferAttribute,
  MeshBasicMaterial,
  Mesh,
} from "three";
import {
  randomSize,
  randomPosition,
  sceneWidth,
} from "../../utilities/helpers";

class StarfieldScene {
  private camera: PerspectiveCamera;
  private debouncedResize: number;
  private height: number;
  private rafId: number;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private stars: Mesh[] = [];
  private width: number;

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
    this.renderer.render(this.scene, this.camera);
    this.rafId = window.requestAnimationFrame(this.animate.bind(this));
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
    const bufferVertices = new Float32Array([-1,-1,1,1,-1,1,1,1,1,1,1,1,-1,1,1,-1,-1,1,]);
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
}

export default StarfieldScene;
