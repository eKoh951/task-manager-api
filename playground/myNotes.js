// MongoClient help us to connect to the database
const MongoClient = mongodb.MongoClient
// ObjectID we can access to generate our unique IDs
const ObjectID = mongodb.ObjectID


    log(id.id.length)            // Get the length of the binary data (12)
    log(id.getTimestamp())       // We can get the time the object id generated
    log(id.toHexString().length) // The actual length of the id as string is 24 bytes long

    // [ Insert documents ]
    db.collection('users').insertOne({
        name: 'Andrew',
        age: 27
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert user')
        }

        console.log(result.ops)
    })

    db.collection('users').insertMany([
        {
            name: 'Jen',
            age: 28
        }, {
            name: 'Gunther',
            age: 27
        }
    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert documents!')
        }

        console.log(result.ops)
    })

    db.collection('tasks').insertMany([
        {
            description: 'Clean the house',
            completed: true
        },{
            description: 'Renew inspection',
            completed: false
        },{
            description: 'Pot plants',
            completed: false
        }
    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert tasks!')
        }

        console.log(result.ops)
    })

    // [ Read documents ]
    db.collection('users').findOne({ _id: new ObjectID("5efae317fb6e9fdaa0e568fa") }, (error, user) => {
        if (error) return log('Unable to fetch')

        log(user)
    })
    
    db.collection('users').find({ age: 27 }).toArray((error, users) => {
        log(users)
    })

    db.collection('users').find({ age: 27 }).count((error, count) => {
        log(count)
    })

    db.collection('tasks').findOne( { _id: new ObjectID("5efae45d176464c784f5f42a") }, (error, task) => {
        if(error) return log('Unable to find task')
        log(task)
    })

    db.collection('tasks').find({ completed: true }).toArray((error, tasks) => {
        if(error) return log('Cannot find tasks')
        log(tasks)
    })

    // [ Update Documents ]
    db.collection('users').updateOne({
        _id: new ObjectID("5efadfc9ffb0e2d0ac3bc8f3")
    },
    {
        // Use update operator $set to update data
        $inc: {
            age: 1
        }
    }).then((result) => {
        log(result)
    }).catch((error) => {
        log(error)
    })

    db.collection('tasks').updateMany({ completed: false },
        {
            $set: {
                completed: true
            }
        }).then((result) => {
            log(result.modifiedCount)
        }).catch((error) => {
            log(error)
        })

        
    // [ Delete documents ]
    db.collection('users').deleteMany( {
        age: 27
    }).then((result) => {
        log(result)
    }).catch((errorr) => {
        log(error)
    })

    db.collection('tasks').deleteOne(
    {
        description: 'Take a bath'
    }
    ).then((result) => {
        log(result.deletedCount)
    }).catch((error) => {
        log(error)
    })


    // Hash passwords
    const bcrypt = require('bcrypt')
    
    const myFunction = async() => {
        const password = 'red12345'
        const hashedPassword = await bcrypt.hash(password, 8)
        console.log(password)
        console.log(hashedPassword)
    
        const isMatch = await bcrypt.compare('Red12345', hashedPassword)
        console.log(isMatch)
    }
