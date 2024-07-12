## state-stepper

A simple state stepper component for React, which is manually or timer controled

### Installation

```bash
npm install state-stepper
```

### Manual Usage

```jsx
const {meta, current, next} = useStateStepper({steps: ['a', 'b', 'c']});
```

### Timed Usage

```jsx
const {meta, current, next} = useStateStepper({
    steps: [
        {name: 'a', timer: 1000},
        {name: 'b', timer: 1500}, 
        {name: 'c', timer: 2000}
    ],
    loop: true
});
```