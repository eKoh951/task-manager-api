require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5efbbd5068fa78ce9c976efd').then((task) => {
//     console.log(task.description + ' deleted')
//     // Promise chaining
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5efbe612bfbaf28be848e875').then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})