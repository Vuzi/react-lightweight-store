import React, { Fragment } from 'react'
import { createStore, createAction, createPureAction } from '../src/store'

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
const { Store, withStore, connect } = createStore(initialState)

// Define some actions on our state
const updateValue      = createAction<string, State>((newValue, setState) => setState({ value: newValue }))
const incrementCounter = createPureAction<State>((setState) => setState(state => ({ counter: state.counter + 1 })))

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
    onUpdateValue: (newValue: string) => dispatch(updateValue(newValue)), // Dispatch is provided to dispatch actions to the store
    onIncrementCounter: () => dispatch(incrementCounter())
  }))

const TestWithStore = withStore(Test, mappedProps)

// Everything is typed, as expected :)
const App = () => (
  <Store>
    <TestWithStore title="Hello there" />
  </Store>
)
