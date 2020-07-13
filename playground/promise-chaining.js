require('../src/db/mongoose.js')
const User = require('../src/models/user.js')

// ObjectId("5f0243317a7b71240c1185d9")
// User.findByIdAndUpdate('5f0243317a7b71240c1185d9', { age: 1 }).then((user) => {
//     console.log(user)
//     // Promise chaining
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const updateAgeAndCount = async(id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('5f0243317a7b71240c1185d9', 2).then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})