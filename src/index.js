import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import configureStore from './store/store'
import {
  titleChanged,
  taskDelete,
  completeTask,
  getTasks,
  loadTasks,
  getTasksLoadingStatus,
  createTask,
} from './store/task'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { getError } from './store/errors'

const store = configureStore()

const App = () => {
  const state = useSelector(getTasks())
  const isLoading = useSelector(getTasksLoadingStatus())
  const error = useSelector(getError())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadTasks())
  }, [])

  const changeTitle = (taskId) => {
    dispatch(titleChanged(taskId))
  }

  const deleteTask = (taskId) => {
    dispatch(taskDelete(taskId))
  }

  const addNewTask = () => {
    dispatch(
      createTask({
        userId: 1,
        title: 'New Task',
        completed: false,
      }),
    )
  }

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <>
      <h1>APP</h1>

      <ul>
        <button onClick={addNewTask}>Add task</button>
        {state.map((el) => (
          <li key={el.id}>
            <p>{el.title}</p>
            <p>{`Completed: ${el.completed}`}</p>
            <button onClick={() => dispatch(completeTask(el.id))}>
              Complete
            </button>
            <button onClick={() => changeTitle(el.id)}>Change title</button>
            <button onClick={() => deleteTask(el.id)}>Delete task</button>
            <hr />
          </li>
        ))}
      </ul>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
