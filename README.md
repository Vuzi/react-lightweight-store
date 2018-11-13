# React Lightweight Store

Statically typed lightweight store for React, built on top of the React's Context API.


## Installation

```
npm install react-lightweight-store --save
```

## Basic Usage

The first step is to create a new store, with a typed state:

```typescript
import { createStore, createAction, createPureAction } from 'react-lightweight-store'

// Type of our state
type State = {
  counter: number
  value?: string
}

// We need to define an initial state
const initialState: State = {
  counter: 0
}

// We need to build our store using our initial state
export const {
  Store,     // The dispatcher
  withStore, // High order component to inject the store
  connect    // Allow to define a mapping with the store
} = createStore(initialState)

// Export some actions on our state
export const actions = {
  updateValue: createAction<string, State>((newValue, setState) => {
    setState({ value: newValue })
  }),
  incrementCounter: createPureAction<State>((setState) => {
    setState(state => ({ counter: state.counter + 1 }))
  })
}

```

Then, we can use this store with a React component:

```typescript
import { Store, withStore, connect, actions } from './mystore.ts'

// Props of our component
type Props = {
  title: string,
  counter: number,
  value?: string,
  onUpdateValue: (newValue: string) => void
  onIncrementCounter: () => void
}

// Define some react component, as usual
class Test extends React.Component<Props, {}> {

  render() {
    const { title, counter, value, onUpdateValue, onIncrementCounter } = this.props

    return (
      <div>
        <h1>{ title }</h1>
        <pre>{ value }</pre>
        <input type="button" onClick={() => onUpdateValue("foo")} value="Add foo" />
        <pre>{ counter }</pre>
        <input type="button" onClick={() => onIncrementCounter()} value="Increment counter" />
      </div>
    )

  }

}

// We define a mapping from our store to a subtype of the element's props
const mappedProps =
  connect((state, dispatch) => ({
    counter: state.counter,
    value: state.value,
    onUpdateValue: (newValue: string) => dispatch(actions.updateValue(newValue)), // Dispatch is provided to dispatch actions to the store
    onIncrementCounter: () => dispatch(actions.incrementCounter())
  }))

const TestWithStore = withStore(Test, mappedProps)

// Everything is typed, as expected :)
const App = () => (
  <Store>
    <TestWithStore title="Hello there" />
  </Store>
)

```
