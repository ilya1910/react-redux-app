import { createSlice, createAction } from '@reduxjs/toolkit'
import todosService from '../services/todos.service'
import { setError } from './errors'

const initialState = {
  entities: [],
  isLoading: true,
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    recived(state, action) {
      state.entities = action.payload
      state.isLoading = false
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id,
      )
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      }
    },
    remove(state, action) {
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id,
      )
    },
    loadTasksRequested(state) {
      state.isLoading = true
    },
    taskRequestedFailed(state) {
      state.isLoading = false
    },
    taskAdded(state, action) {
      state.entities.unshift(action.payload)
    },
  },
})

const { actions, reducer: taskReducer } = taskSlice
const {
  update,
  remove,
  recived,
  loadTasksRequested,
  taskRequestedFailed,
  taskAdded,
} = actions

const taskRequested = createAction('task/taskRequested')

export const loadTasks = () => async (dispatch) => {
  dispatch(loadTasksRequested())
  try {
    const data = await todosService.fetch()
    dispatch(recived(data))
  } catch (error) {
    dispatch(taskRequestedFailed())
    dispatch(setError(error.message))
  }
}

export const completeTask = (id) => (dispatch, getState) => {
  dispatch(update({ id, completed: true }))
}

export function titleChanged(id) {
  return update({ id, title: `New title for ${id}` })
}

export function taskDelete(id) {
  return remove({ id })
}

export const createTask = (task) => async (dispatch) => {
  dispatch(taskRequested())
  try {
    const data = await todosService.create(task)
    dispatch(taskAdded(data))
  } catch (error) {
    dispatch(taskRequestedFailed())
    dispatch(setError(error.message))
  }
}

export const getTasks = () => (state) => state.tasks.entities
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading

export default taskReducer
