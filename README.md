# M-Golf

M-Golf Rapier &amp; Three.js

**Prequisite Software**
You want at least nodejs version `20.19.2`

**Install & Run**

This is a Vite project, below are the commands to run after cloning this repo.

```
npm install
```

```
npm run dev
```

**Resources**

Physics:

- [Rapier Rigid Bodies](https://rapier.rs/docs/user_guides/javascript/rigid_bodies)
- [Rapier Colliders](https://rapier.rs/docs/user_guides/javascript/colliders)
- [Rapier Trimesh Collider](https://rapier.rs/docs/user_guides/javascript/colliders/#triangle-mesh)
- [Advanced Collision Detection](https://rapier.rs/docs/user_guides/javascript/advanced_collision_detection_js)

Blender:

- [Hole Creation](https://youtu.be/-0wyTP_Doxw?si=Gdw05NWRlOW6wagB)
  - "Blender Secrets, Youtube Channel. Video "Easy Holes with Beveled Vertices | Blender Secrets"

The Golf Level Design done in blender uses Planes, Nurbs Path and some modifiers. The only modifiers used for now are: Array, Curve, Solidify and, That's it!

**Disclaimer**
Please do not apply modifiers when modeling levels.

**Contributing**
Create an Issue then create a PR based off that issue with the same name.
before committing make sure to run prettier on the code base before committing (TODO add pre-commit in the future.)
