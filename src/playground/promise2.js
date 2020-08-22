require('../db/mongoose.js')
const Tasks = require('../models/tasks.js')

// Tasks.findByIdAndDelete('5f37109eba3f4c1509fc2a97').then((task) => {
//     console.log(task)
//     return Tasks.countDocuments({description: 'Wash dishes'})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    const deleteTask = await Tasks.findByIdAndDelete(id)
    const count = await Tasks.countDocuments({id: '5f380bc95ace501baa903976'})
    return count
}
deleteTaskAndCount('5f380bc95ace501baa903976').then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})