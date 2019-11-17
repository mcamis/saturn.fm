import React from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

import autobind from 'utilities/autobind';
import { randomSize, randomPosition, sceneWidth } from 'utilities/helpers';

class StarField extends React.Component {
  constructor(props) {
    super(props);
    this.timeOut = null;
    // this.Zspeed = Math.random() * (0.025 - 0.10) + 0.10;
    autobind(this);

    const bufferGeometry = new THREE.BufferGeometry();
    const bufferVerticies = new Float32Array([
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,

      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
    ]);

    bufferGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(bufferVerticies, 3)
    );
    this.blueMaterial = new THREE.MeshBasicMaterial({ color: 0x759cff });
    this.redMaterial = new THREE.MeshBasicMaterial({ color: 0xff757a });
    this.yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xede13b });
    this.whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.starGeometry = bufferGeometry;

    const width = sceneWidth();
    const height = window.innerHeight;
    this.width = width * 1.75;
    this.height = height * 1.75;

    window.addEventListener('resize', () => {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(this.onResize, 250);
    });

    window.addEventListener("orientationchange", () => {
      this.onResize()
    });
  }

  componentDidMount() {
    this.setupScene();
    // this.clock = new THREE.Clock();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.hidden !== nextProps.hidden) {
      return true;
    }
    return false;
  }


  onResize() {
    const width = sceneWidth();
    const height = window.innerHeight;
    this.width = width * 1.75;
    this.height = height * 1.75;
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupScene() {
    const width = sceneWidth();
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000);

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
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1;

    const pixRatio = window.devicePixelRatio;
    renderer.setPixelRatio(
      pixRatio === 1 || isSafari ? pixRatio * 0.65 : pixRatio * 0.25
    );
    renderer.setSize(width, height);
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

    loader.load('./models/saturn_v1.gltf', gltf => {
      const { scene: shipModel } = gltf;
      shipModel.position.set(2.5, -3.5, 520);
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
        this.spaceShip.rotateZ(0.01);
        this.spaceShip.position.z -= 0.075;
        if (this.spaceShip.position.z < 300) {
          this.spaceShip.position.z = 520;
        }
      } else {
        this.spaceShip.visible = false;
      }
    }
  }

  addStars() {
    // TODO: # of stars based on screen size
    // TODO: Slight rounding?
    for (let z = -500; z < 500; z += 15) {
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

      star.scale.set(randomSize(), randomSize(), 1);

      this.scene.add(star);
      this.stars.push(star);
    }
  }

  animateStars() {
    this.stars.forEach(star => {
      const animatedStar = star;

      animatedStar.position.z += Math.random() * (12 - 8) + 8;

      // if the particle is too close move it to the back
      if (animatedStar.position.z > 550) {
        animatedStar.position.z -= 800;
        animatedStar.position.x = randomPosition(this.width);
        animatedStar.position.y = randomPosition(this.height);
      }
    });
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

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

export default StarField;
