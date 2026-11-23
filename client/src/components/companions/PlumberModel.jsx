
import React from "react";
import { useGraph, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { MathUtils } from "three";

export function Model({ animation = "idle", ...props }) {
    const group = React.useRef();

    const { scene } = useGLTF("/models/companions/plumber.glb");

    const clone = React.useMemo(
        () => SkeletonUtils.clone(scene),
        [scene]
    );

    const { nodes, materials } = useGraph(clone);

    // CivicLens colour palette — softer, matte outfit
    const outfitMaterials = React.useMemo(() => {
        const createStyledMaterial = (material, color) => {
            const styled = material.clone();

            styled.color.set(color);
            styled.roughness = 0.82;
            styled.metalness = 0.02;

            if ("envMapIntensity" in styled) {
                styled.envMapIntensity = 0.5;
            }

            return styled;
        };

        return {
            hat: createStyledMaterial(materials.hat, "#416B80"),
            top: createStyledMaterial(materials.top, "#66828A"),
            bottoms: createStyledMaterial(materials.bottoms, "#365D70"),
            accent: createStyledMaterial(materials.accent, "#81998D"),
            pads: createStyledMaterial(materials.pads, "#929B91")
        };
    }, [materials]);

    // Skeleton bones
    const bones = React.useMemo(() => ({
        spine: nodes.mixamorigSpine,
        spine1: nodes.mixamorigSpine1,
        spine2: nodes.mixamorigSpine2,
        head: nodes.mixamorigHead,

        leftArm: nodes.mixamorigLeftArm,
        leftForeArm: nodes.mixamorigLeftForeArm,
        leftHand: nodes.mixamorigLeftHand,

        rightArm: nodes.mixamorigRightArm,
        rightForeArm: nodes.mixamorigRightForeArm,
        rightHand: nodes.mixamorigRightHand,

        leftUpLeg: nodes.mixamorigLeftUpLeg,
        leftLeg: nodes.mixamorigLeftLeg,

        rightUpLeg: nodes.mixamorigRightUpLeg,
        rightLeg: nodes.mixamorigRightLeg
    }), [nodes]);

    // Save original rotations
    const original = React.useMemo(() => ({
        spine: bones.spine.rotation.clone(),
        spine1: bones.spine1.rotation.clone(),
        spine2: bones.spine2.rotation.clone(),
        head: bones.head.rotation.clone(),

        leftArm: bones.leftArm.rotation.clone(),
        leftForeArm: bones.leftForeArm.rotation.clone(),
        leftHand: bones.leftHand.rotation.clone(),

        rightArm: bones.rightArm.rotation.clone(),
        rightForeArm: bones.rightForeArm.rotation.clone(),
        rightHand: bones.rightHand.rotation.clone(),

        leftUpLeg: bones.leftUpLeg.rotation.clone(),
        leftLeg: bones.leftLeg.rotation.clone(),

        rightUpLeg: bones.rightUpLeg.rotation.clone(),
        rightLeg: bones.rightLeg.rotation.clone()
    }), [bones]);

    // Smooth cursor tracking
    const look = React.useRef({
        x: 0,
        y: 0
    });

    useFrame(({ clock, pointer }, delta) => {
        if (!group.current) return;

        const t = clock.elapsedTime;

        // Cursor tracking
        look.current.x = MathUtils.damp(
            look.current.x,
            pointer.x,
            4,
            delta
        );

        look.current.y = MathUtils.damp(
            look.current.y,
            pointer.y,
            4,
            delta
        );

        const cursorX = look.current.x;
        const cursorY = look.current.y;

        // Gentle breathing
        const breathing = Math.sin(t * 1.5);

        group.current.position.y = breathing * 0.012;

        bones.spine.rotation.x =
            original.spine.x + breathing * 0.012;

        bones.spine1.rotation.x =
            original.spine1.x + breathing * 0.018;

        bones.spine2.rotation.x =
            original.spine2.x + breathing * 0.012;

        // Upper body follows cursor
        bones.spine2.rotation.y =
            original.spine2.y + cursorX * 0.10;

        // Head follows cursor
        bones.head.rotation.y =
            original.head.y + cursorX * 0.25;

        bones.head.rotation.x =
            original.head.x - cursorY * 0.12;

        bones.head.rotation.z =
            original.head.z + Math.sin(t * 0.7) * 0.015;

        // Sitting pose — relaxed upper arms
        bones.leftArm.rotation.copy(original.leftArm);
        bones.leftArm.rotation.z -= 0.85;

        bones.rightArm.rotation.copy(original.rightArm);
        bones.rightArm.rotation.z += 0.85;

        // Bent elbows
        bones.leftForeArm.rotation.copy(original.leftForeArm);
        bones.leftForeArm.rotation.x -= 0.55;
        bones.leftForeArm.rotation.z -= 0.35;

        bones.rightForeArm.rotation.copy(original.rightForeArm);
        bones.rightForeArm.rotation.x -= 0.55;
        bones.rightForeArm.rotation.z += 0.35;

        // Relaxed wrists and hands
        bones.leftHand.rotation.copy(original.leftHand);
        bones.leftHand.rotation.x -= 0.12;

        bones.rightHand.rotation.copy(original.rightHand);
        bones.rightHand.rotation.x -= 0.12;

        // Thighs move forward into sitting position
        bones.leftUpLeg.rotation.copy(original.leftUpLeg);
        bones.leftUpLeg.rotation.x -= Math.PI / 2;

        bones.rightUpLeg.rotation.copy(original.rightUpLeg);
        bones.rightUpLeg.rotation.x -= Math.PI / 2;

        // Knees bend so lower legs hang down
        bones.leftLeg.rotation.copy(original.leftLeg);
        bones.leftLeg.rotation.x += Math.PI / 2;

        bones.rightLeg.rotation.copy(original.rightLeg);
        bones.rightLeg.rotation.x += Math.PI / 2;
    });

    return (
        <group {...props} dispose={null}>
            <group ref={group}>
                <primitive object={nodes.mixamorigHips} />

                <skinnedMesh
                    geometry={nodes.plumberbody.geometry}
                    material={materials.skin}
                    skeleton={nodes.plumberbody.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.plumberhair.geometry}
                    material={materials.hair}
                    skeleton={nodes.plumberhair.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.plumbercap.geometry}
                    material={outfitMaterials.hat}
                    skeleton={nodes.plumbercap.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.plumbertee.geometry}
                    material={outfitMaterials.top}
                    skeleton={nodes.plumbertee.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.plumberkneepads.geometry}
                    material={outfitMaterials.pads}
                    skeleton={nodes.plumberkneepads.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_1.geometry}
                    material={materials.hair}
                    skeleton={nodes.mesh_1.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_1_1.geometry}
                    material={materials.eyes}
                    skeleton={nodes.mesh_1_1.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_1_2.geometry}
                    material={materials.white}
                    skeleton={nodes.mesh_1_2.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_1_3.geometry}
                    material={materials.mouth}
                    skeleton={nodes.mesh_1_3.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_5.geometry}
                    material={outfitMaterials.bottoms}
                    skeleton={nodes.mesh_5.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_5_1.geometry}
                    material={outfitMaterials.accent}
                    skeleton={nodes.mesh_5_1.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_7.geometry}
                    material={materials.shoes}
                    skeleton={nodes.mesh_7.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_7_1.geometry}
                    material={materials.soles}
                    skeleton={nodes.mesh_7_1.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_8.geometry}
                    material={materials.prop}
                    skeleton={nodes.mesh_8.skeleton}
                />

                <skinnedMesh
                    geometry={nodes.mesh_8_1.geometry}
                    material={materials.metal}
                    skeleton={nodes.mesh_8_1.skeleton}
                />
            </group>
        </group>
    );
}

useGLTF.preload("/models/companions/plumber.glb");
