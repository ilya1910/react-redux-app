import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import configureStore from './store/store'
import { taskCompleted, titleChanged, taskDelete } from './store/task'
// import { compose, pipe } from 'lodash/fp'

const store = configureStore()

const App = () => {
  const [state, setState] = useState(store.getState())

  useEffect(() => {
    store.subscribe(() => {
      setState(store.getState())
    })
  }, [])

  const completeTask = (taskId) => {
    store.dispatch(taskCompleted(taskId))
  }

  const changeTitle = (taskId) => {
    store.dispatch(titleChanged(taskId))
  }

  const deleteTask = (taskId) => {
    store.dispatch(taskDelete(taskId))
  }

  return (
    <>
      <h1>APP</h1>

      <ul>
        {state.map((el) => (
          <li key={el.id}>
            <p>{el.title}</p>
            <p>{`Completed: ${el.completed}`}</p>
            <button onClick={() => completeTask(el.id)}>Complete</button>
            <button onClick={() => changeTitle(el.id)}>Change title</button>
            <button onClick={() => deleteTask(el.id)}>Delete task</button>
            <hr />
          </li>
        ))}
      </ul>
    </>
  )

  // compose - обратный порядок
  // pipe - обычный порядок
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
