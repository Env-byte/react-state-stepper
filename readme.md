## state-stepper

A simple state stepper component for React, which is manually or timer controlled

### Installation

```bash
npm install react-state-stepper
```

### Manual Usage

```jsx
const {meta, current, next} = useStateStepper({steps: ['a', 'b', 'c']});
```

### Timed Usage

```jsx
const {meta, current, next} = useStateStepper({
    steps: [
        {name: 'a', timer: 1000}, // in milliseconds
        {name: 'b', timer: 1500}, // in milliseconds
        {name: 'c', timer: 2000}  // in milliseconds
    ],
    loop: true
});
```
