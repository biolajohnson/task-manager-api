require('../db/mongoose.js')
const User = require('../models/users')

// User.findByIdAndUpdate('5f380be9bd5b471bb02b8114', {name: 'John'}).then((user) => {
//     console.log(user)
//     return User.countDocuments({name: 'John'})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAndCount = async (id, email) => {
    const user = await User.findByIdAndUpdate(id, {email})
    const count = await User.countDocuments(email)
    return count
}
updateAndCount('5f380be9bd5b471bb02b8114', 'youremail@mail.com').then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})