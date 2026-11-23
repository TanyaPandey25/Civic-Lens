
import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
    ContactShadows,
    Environment,
    useGLTF
} from "@react-three/drei";

import { Model } from "./PlumberModel";

function SkeletonDebug() {
    const { scene } = useGLTF("/models/companions/plumber.glb");

    useEffect(() => {
        const bones = [];

        scene.traverse((object) => {
            if (object.isBone) {
                bones.push({
                    name: object.name,
                    parent: object.parent?.name
                });
            }
        });

        console.log(
            "SKELETON BONES:\n" +
            bones.map((bone) => `${bone.name} (parent: ${bone.parent})`).join("\n")
        );

        console.log("Total bones:", bones.length);
    }, [scene]);

    return null;
}

function Scene() {
    return (
        <>
            <SkeletonDebug />

            <ambientLight intensity={1.5} />
            <directionalLight
                position={[3, 5, 4]}
                intensity={2}
            />

            <Model
                position={[0, -0.85, 0]}
                scale={1}
                animation="working"

            />

            <ContactShadows
                position={[0, -0.85, 0]}
                opacity={0.3}
                scale={3}
                blur={2}
            />

            <Environment preset="city" />

            
        </>
    );
}

export default function PlumberPreview() {
    return (
        <div style={{ width: "100%", height: "500px" }}>
            <Canvas camera={{ position: [0, 1, 4], fov: 40 }}>
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
