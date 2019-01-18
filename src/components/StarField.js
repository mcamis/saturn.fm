import React, { PureComponent } from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

import autobind from 'utilities/autobind';
import { randomSize, randomPosition, sceneWidth } from 'utilities/helpers';

class StarField extends PureComponent {
  constructor(props) {
    super(props);
    this.timeOut = null;
    // this.Zspeed = Math.random() * (0.025 - 0.10) + 0.10;
    autobind(this);
  }

  componentDidMount() {
    this.setupScene();
    this.clock = new THREE.Clock();
  }

  onResize() {
    const width = sceneWidth();
    const height = window.innerHeight;
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupScene() {
    const width = sceneWidth();
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    const directional = new THREE.DirectionalLight(0xffffff, 5);
    ambient.position.set(0, -5, 600);
    directional.position.set(0, -5, 600);
    scene.add(ambient, directional);
    // scene.add(directional, );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    camera.position.z = 500;

    const pixRatio = window.devicePixelRatio;
    renderer.setPixelRatio(pixRatio === 1 ? pixRatio * 0.65 : pixRatio * 0.25);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // the default

    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.stars = this.stars || [];
    this.mount.appendChild(this.renderer.domElement);
    this.setupSpaceShip();
    this.addStars();

    requestAnimationFrame(this.animate);

    window.addEventListener('resize', () => {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(this.onResize, 250);
    });
  }

  setupSpaceShip() {
    const loader = new GLTFLoader();

    loader.load('/public/models/saturn_v1.gltf', gltf => {
      const { scene: shipModel } = gltf;
      shipModel.position.set(2, -2, 495);
      // shipModel.rotateY(9.5);
      shipModel.rotateY(Math.PI);
      // shipModel.visible = false;

      // Disable texture filtering for the authenitc chunky Saturn gfx
      const shipMap = shipModel.children[1].material.map;
      shipMap.magFilter = THREE.LinearFilter;
      shipMap.minFilter = THREE.LinearFilter;
      shipMap.generateMipmaps = false;

      this.spaceShip = shipModel;
      this.scene.add(shipModel);

      this.mixer = new THREE.AnimationMixer(shipModel);
      this.mixer.clipAction(gltf.animations[0]).play();
    });
  }

  animate() {
    this.animateStars();
    this.renderScene();
    if (this.spaceShip) {
      if (this.props.hidden) {
        this.spaceShip.visible = true;
        this.animateSpaceshipZ();
      } else {
        this.spaceShip.visible = false;
      }
    }

    requestAnimationFrame(this.animate);
  }

  animateSpaceshipZ() {
    const delta = this.clock.getDelta();
    this.mixer.update(delta);
  }

  addStars() {
    const geometry = new THREE.BoxGeometry(0.75, 0.75, 0);

    for (let z = -1000; z < 1000; z += 15) {
      let material;
      // TODO: More colors
      if (z > 0 && z < 100) {
        material = new THREE.MeshBasicMaterial({ color: 0xff757a });
      } else {
        material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      }

      const star = new THREE.Mesh(geometry, material);

      // TODO: Better positioning so stars don't smack the viewer in the face
      star.position.x = randomPosition();
      star.position.y = randomPosition();
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
      if (animatedStar.position.z > 1000) {
        animatedStar.position.z -= 1100;
        animatedStar.position.x = randomPosition();
        animatedStar.position.y = randomPosition();
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
