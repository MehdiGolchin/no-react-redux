const TASK_CREATED = 'TASK_CREATED';
const TASK_REMOVED = 'TASK_REMOVED';

const TaskCreated = (task, store) => ({
    type: TASK_CREATED,
    task,
    store
});

const TaskRemoved = (task, store) => ({
    type: TASK_REMOVED,
    task,
    store
});

// Task Component

const Task = (dispatch) => (task, store) =>
    Div([
        H4([task.title]),
        Button(['Remove'], () => dispatch(TaskRemoved(task, store)))
    ]);
 
// TaskList Component

const TaskList = (dispatch) => (tasks, store) =>
    Div(tasks.map((task) => Task(dispatch)(task, store)));

// NewTask Component

const NewTask = (dispatch) => (store) =>
    Form([
        Input([], { type: 'text', name: 'title' }),
        Button(['Create'])
    ], (task) => dispatch(TaskCreated(task, store)));

// Todo Component

const Todo = (dispatch) => (store) =>
    Div([
        NewTask(dispatch)(store),
        TaskList(dispatch)(store.tasks, store)
    ]);

// Todo Actions Handler

const TodoActions = (dispatch) => ({type, task, store}) => {
    switch (type) {
        case TASK_CREATED:
            dispatch({ ...store, tasks: [...store.tasks, task] });
            break;
        case TASK_REMOVED:
            dispatch({ ...store, tasks: [...store.tasks.filter(e => e !== task)] });
            break;
        default:
            dispatch(store);
    }
};