import {LineBasicMaterial, Material, MeshPhongMaterial} from 'three';

const Dirt = new MeshPhongMaterial({
    color: 0xDF6B4E,
    shininess: 60,
    flatShading: true,
});

const Tone = new MeshPhongMaterial({
    transparent: true,
    opacity: 0.8,
    color: 0x217ace,
    emissive: 0x1f2525,
    specular: 0x2dffbe,
    shininess: 60,
    flatShading: true,
});

const Wall1 = new MeshPhongMaterial({
    color: 0x8B8B75,
    shininess: 50,
    flatShading: true,
});

const AmberLamp = new MeshPhongMaterial({
    color: 0xffa200,
    emissive: 0xffa200,
    specular: 0x333333,
    shininess: 60,
    flatShading: true,
});

const CyanLamp = new MeshPhongMaterial({
    color: 0x2face1,
    emissive: 0x2face1,
    specular: 0x333333,
    shininess: 60,
    flatShading: true,
});

const lineMaterial = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
});

const Materials: {[k in string]: Material} = {
    Dirt,
    Tone,
    Wall1,
    AmberLamp,
    CyanLamp,
};

export default Materials;
