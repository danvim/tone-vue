import {LineBasicMaterial, Material, MeshPhongMaterial, Color} from 'vue-gl/node_modules/three';

const Dirt = new MeshPhongMaterial({
    color: new Color(0xDF6B4E),
    shininess: 20,
    flatShading: true,
});

const Tone = new MeshPhongMaterial({
    transparent: true,
    opacity: 0.8,
    color: new Color(0x217ace),
    emissive: new Color(0x1f2525),
    specular: new Color(0x2dffbe),
    shininess: 60,
    flatShading: true,
});

const Glass = new MeshPhongMaterial({
    transparent: true,
    opacity: 0.8,
    color: new Color(0xffffff),
    specular: new Color(0x2dffbe),
    shininess: 60,
    flatShading: true,
});

const Wall1 = new MeshPhongMaterial({
    color: new Color(0x8B8B75),
    shininess: 50,
    flatShading: true,
});

const AmberLamp = new MeshPhongMaterial({
    color: new Color(0xffa200),
    emissive: new Color(0xffa200),
    specular: new Color(0x333333),
    shininess: 60,
    flatShading: true,
});

const CyanLamp = new MeshPhongMaterial({
    color: new Color(0x2face1),
    emissive: new Color(0x2face1),
    specular: new Color(0x333333),
    shininess: 60,
    flatShading: true,
});

const lineMaterial = new LineBasicMaterial({
    color: new Color(0xffffff),
    transparent: true,
    opacity: 0.5,
});

const Materials: {[k in string]: Material} = {
    Dirt,
    Tone,
    Wall1,
    AmberLamp,
    CyanLamp,
    Glass,
};

export default Materials;
