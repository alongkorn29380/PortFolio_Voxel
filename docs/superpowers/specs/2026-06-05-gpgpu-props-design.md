# GPGPU Props + Position/Scale Design Spec
Date: 2026-06-05

## Goal
Make `Gpgpu.jsx` reusable across multiple GLB models by accepting `modelPath` and `levaFolder` as props, and add `posX/Y/Z` + `scale` Leva controls so each instance can be independently positioned and sized.

## Files Affected

| File | Action |
|------|--------|
| `src/Components/Robot/GPGPU/Gpgpu.jsx` | Modify — add props + position/scale controls |
| `src/Components/Robot/Robot.jsx` | Modify — pass props when rendering `<Gpgpu>` |

---

## `Gpgpu.jsx` Changes

### New Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `modelPath` | string | — (required) | Path to the GLB file, e.g. `'/Models/Robots/model.glb'` |
| `levaFolder` | string | `'GPGPU'` | Leva panel folder name — must be unique per instance to keep controls separate |

Replace hardcoded `useGLTF('/Models/Robots/model.glb')` with `useGLTF(modelPath)`.

### New Leva Controls (added to existing `useControls` call)

| Control | Default | Range |
|---------|---------|-------|
| `posX` | 0 | min -10, max 20, step 0.1 |
| `posY` | 0 | min -10, max 20, step 0.1 |
| `posZ` | 0 | min -10, max 20, step 0.1 |
| `scale` | 1 | min 0.1, max 5, step 0.05 |

The `useControls` first argument changes from the hardcoded string `'GPGPU'` to the `levaFolder` prop.

### JSX Change

Wrap the `<points>` in a `<group position={[posX, posY, posZ]} scale={scale}>`.

### `useGLTF.preload` Removal

Remove `useGLTF.preload('/Models/Robots/model.glb')` from the bottom of the file — each consumer is responsible for preloading at their own call site.

---

## `Robot.jsx` Change

Pass props when rendering:

```jsx
<Gpgpu modelPath="/Models/Robots/model.glb" levaFolder="GPGPU Robot" />
```

Adding a second model in the future requires only:
```jsx
<Gpgpu modelPath="/Models/Robots/other.glb" levaFolder="GPGPU Other" />
```

---

## Out of Scope
- Preloading strategy for multiple models (user handles `useGLTF.preload` at the call site if needed)
- Sharing GPGPU computation between instances (each instance runs its own GPUComputationRenderer independently)
