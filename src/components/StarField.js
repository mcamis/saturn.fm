import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";

import autobind from "utilities/autobind";
import { randomSize, randomPosition, sceneWidth } from "utilities/helpers";

const spaceshipPositions = {
  plain: [2.5, -3.5, 510],
  spinny: [-2.5, 3.5, 505],
  fast: [0, 3, 510],
};

class StarField extends React.Component {
  constructor(props) {
    super(props);
    this.timeOut = null;
    // this.Zspeed = Math.random() * (0.025 - 0.10) + 0.10;
    autobind(this);

    const width = sceneWidth();
    const height = window.innerHeight;
    this.width = width;
    this.height = height;

    const bufferGeometry = new THREE.BufferGeometry();

    const bufferVertices = new Float32Array([
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,

      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
    ]);

    bufferGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(bufferVertices, 3)
    );
    this.blueMaterial = new THREE.MeshBasicMaterial({ color: 0x759cff });
    this.redMaterial = new THREE.MeshBasicMaterial({ color: 0xff757a });
    this.yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xede13b });
    this.whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.starGeometry = bufferGeometry;

    window.addEventListener("resize", () => {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(this.onResize, 250);
    });

    window.addEventListener("orientationchange", () => {
      this.onResize();
    });
  }

  componentDidMount() {
    this.setupScene();
    // this.clock = new THREE.Clock();
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.hidden !== nextProps.hidden ||
      this.props.animation !== nextProps.animation
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.animation !== prevProps.animation) {
      const [x, y, z] = spaceshipPositions[this.props.animation];
      this.spaceShip.position.set(x, y, z);
    }
  }

  onResize() {
    const width = sceneWidth();
    const height = window.innerHeight;
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      1,
      1000
    );

    const mainLight = new THREE.DirectionalLight(0xffffff, 3);
    const leftLight = new THREE.DirectionalLight(0xffffff, 2);
    const rightLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(-10, 46, 600);
    leftLight.position.set(-200, 46, 500);
    rightLight.position.set(200, 46, 500);

    // scene.add(ambient, directional);
    scene.add(mainLight, leftLight, rightLight);

    // scene.add(directional, );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setClearColor(0xffffff);
    camera.position.z = 500;
    const isSafari =
      navigator.userAgent.indexOf("Safari") !== -1 &&
      navigator.userAgent.indexOf("Chrome") === -1;

    const pixRatio = window.devicePixelRatio;
    renderer.setPixelRatio(
      pixRatio === 1 || isSafari ? pixRatio * 0.65 : pixRatio * 0.25
    );
    renderer.setSize(this.width, this.height);
    renderer.setClearColor(0x000000, 0); // the default

    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.stars = this.stars || [];
    this.mount.appendChild(this.renderer.domElement);
    this.setupSpaceShip();
    this.addStars();

    this.props.setAnimationCallback(this.animate);
  }

  setupSpaceShip() {
    const loader = new GLTFLoader();

    loader.load("./models/saturn_v1.gltf", gltf => {
      const { scene: shipModel } = gltf;
      const [x, y, z] = spaceshipPositions[this.props.animation];
      shipModel.position.set(x, y, z);
      shipModel.rotateZ(3.5);
      shipModel.rotateY(Math.PI);
      shipModel.visible = false;

      // Disable texture filtering for the authenitc chunky Saturn gfx
      const shipMap = shipModel.children[1].material.map;
      shipMap.magFilter = THREE.LinearFilter;
      shipMap.minFilter = THREE.LinearFilter;
      shipMap.generateMipmaps = false;

      this.spaceShip = shipModel;
      window.ship = shipModel;
      this.scene.add(shipModel);

      // this.mixer = new THREE.AnimationMixer(shipModel);
      // this.mixer.clipAction(gltf.animations[0]).play();
    });
  }

  animate() {
    this.animateStars();
    this.renderScene();
    if (this.spaceShip) {
      if (this.props.hidden) {
        this.spaceShip.visible = true;

        if (this.props.animation === "plain") {
          this.plain();
        } else if (this.props.animation === "spinny") {
          this.spinny();
        } else if (this.props.animation === "fast") {
          this.fast();
        }
      } else {
        this.spaceShip.visible = false;
      }
    }
  }

  plain() {
    this.spaceShip.rotateZ(0.01);
    this.spaceShip.position.z -= 0.045;
    if (this.spaceShip.position.z < 400) {
      this.props.setRandomAnimation();
    }
  }

  spinny() {
    this.spaceShip.rotateZ(0.0025);
    this.spaceShip.position.z -= 0.2;
    this.spaceShip.position.x += 0.05;
    this.spaceShip.position.y += 0.025;

    if (this.spaceShip.position.z < 400) {
      this.props.setRandomAnimation();
    }
  }

  fast() {
    this.spaceShip.rotateZ(-0.005);
    this.spaceShip.position.z -= 0.05;
    this.spaceShip.position.x -= 0.0075;
    if (this.spaceShip.position.z < 400) {
      this.props.setRandomAnimation();
    }
  }

  addStars() {
    // Seed starts across the full z range
    for (let z = -500; z < 500; z += 13) {
      let material = this.whiteMaterial;
      if (z > 0 && z < 100) {
        material = this.redMaterial;
      } else if (z > 100 && z < 200) {
        material = this.yellowMaterial;
      } else if (z > 100 && z < 200) {
        material = this.blueMaterial;
      }

      const star = new THREE.Mesh(this.starGeometry, material);

      // TODO: Better positioning so stars don't smack the viewer in the face
      star.position.x = randomPosition(this.width);
      star.position.y = randomPosition(this.height);
      star.position.z = z;

      const ranSize = randomSize();
      const adjustment = this.width < 500 ? 0.75 : 1;
      star.scale.set(ranSize * adjustment, ranSize * adjustment, 1);

      this.scene.add(star);
      this.stars.push(star);
    }
  }

  animateStars() {
    for (let i = 0; i < this.stars.length; i += 1) {
      // This animates super quickly on iOS
      const widthAdjustment = this.width < 500 ? 0.5 : 1;
      this.stars[i].position.z += 3 + i * 0.2 * widthAdjustment;

      // if the particle is too close move it to the back
      if (this.stars[i].position.z > 550) {
        this.stars[i].position.z -= 800;
        this.stars[i].position.x = randomPosition(this.width);
        this.stars[i].position.y = randomPosition(this.height);
      }
    }
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  // TODO: Render x,y according to screen
  render() {
    return (
      <div className="StarField">
        <div
          ref={mount => {
            this.mount = mount;
          }}
        />
      </div>
    );
  }
}

StarField.propTypes = {
  hidden: PropTypes.bool.isRequired,
  animation: PropTypes.string.isRequired,
  setRandomAnimation: PropTypes.func.isRequired,
  setAnimationCallback: PropTypes.func.isRequired,
};

export default StarField;
