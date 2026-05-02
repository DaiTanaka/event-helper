@AGENTS.md

## Guidelines

### React refs in render (react-hooks/refs)

**Never read or write `ref.current` during the render phase.** The ESLint rule `react-hooks/refs` will error on both patterns:

```tsx
// ❌ writing a ref during render
const fooRef = useRef(value)
fooRef.current = value  // ← not allowed here

// ❌ reading a ref during render (e.g. in derive-during-render)
if (!dragIdRef.current) { ... }  // ← not allowed here
```

Fix 1 — sync a ref after commit, not during render:
```tsx
const localTasksRef = useRef(localTasks)
useLayoutEffect(() => {
  localTasksRef.current = localTasks  // runs after commit, before paint
})
```

Fix 2 — replace a ref read during render with state:
```tsx
// Instead of checking dragIdRef.current during render, track with state:
const [isDragging, setIsDragging] = useState(false)
// set true in handleDragStart, false in handleDrop/handleDragEnd
// then use isDragging in the derive-during-render condition
```

### Derive-during-render with external gate

When using the derive-during-render pattern to sync state from props, but needing to skip the sync under some condition, track that condition with **state** (not a ref), since refs cannot be read during render:

```tsx
const [localTasks, setLocalTasks] = useState(tasks)
const [prevTasksProp, setPrevTasksProp] = useState(tasks)
const [isDragging, setIsDragging] = useState(false)

if (tasks !== prevTasksProp) {
  setPrevTasksProp(tasks)
  if (!isDragging) {      // ← state is fine during render
    setLocalTasks(tasks)
  }
}
```

### useLayoutEffect for event-handler refs

When an event handler (e.g. `onDrop`) needs access to the latest state but can't use a closure (stale closure risk), keep a ref in sync with `useLayoutEffect`:

```tsx
const latestRef = useRef(localTasks)
useLayoutEffect(() => { latestRef.current = localTasks })
// then read latestRef.current inside event handlers
```

`useLayoutEffect` runs synchronously after the DOM commit and before the browser paints, so `latestRef.current` is always fresh by the time the next browser event fires. This is safe in client components (`'use client'`).

### React Strict Mode double-invocation

In development, React Strict Mode runs `useEffect` twice. Any dispatch or mutation inside an effect must be **idempotent**. Prefer a `LOAD` action that replaces state wholesale over repeated `ADD_ITEM` dispatches that append:

```tsx
// ❌ fires twice → duplicates
parsed.items.forEach(item => dispatch({ type: 'ADD_ITEM', item }))

// ✅ idempotent — same result regardless of how many times it runs
dispatch({ type: 'LOAD', state: parsed })
```

### useEffect dependency arrays

Only list values that are **actually referenced inside the effect body**. If a function (e.g. `onClose`) is passed as a prop but not called inside the effect, omit it from deps — including it is both incorrect and will trigger lint warnings.

### ESLint: ignoring underscore-prefixed params

Server actions that receive a placeholder last argument (`_: FormData`) must be covered by the ESLint rule config, not suppressed inline. Add to `eslint.config.mjs`:

```js
rules: {
  '@typescript-eslint/no-unused-vars': ['warn', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  }],
}
```
