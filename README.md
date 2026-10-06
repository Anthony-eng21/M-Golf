# M-Golf

M-Golf is a fun browser based golf game made with Rapier Physics Three.js and modeling done in Blender. This project was inspired by [gwyf](https://gwyf.golf/) and other classic golf games.
<a href="https://m-golf.pages.dev/"><img width="1401" height="753" alt="Screenshot 2026-10-05 at 6 28 14 PM" src="/public/assets/imgs/m-golf-level.png" /></a>
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

- [Loop-de-Loop](https://www.youtube.com/watch?v=oYDJ-lChOX8)
  - "Not So Greedy Games, Youtube Channel. Blender - How To make a Loop in 10 minutes!" 
  1. Gabriel who runs the channel has some really other cool videos, I say he's worth subscribing to.

The Golf Level Design done in blender uses these Types: Planes, Cylinders, Nurbs Path (don't export nurbs path/curve!) Modifiers being used are: Array, Curve, Solidify and, That's it!

**Contributing**:
- Good to create issue first before your PR.
- Make sure to run prettier on the code base before opening a PR.
