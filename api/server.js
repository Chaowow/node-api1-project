const express = require('express')
const User = require('./users/model')

const server = express()
server.use(express.json())

server.post('/api/users', async (req, res) => {
    const user = req.body
    
    if (!user.name || !user.bio) {
    res.status(400).json({ message: "Please provide name and bio for the user" })
  } else {
    try {
      const newlyCreatedUser = await User.insert(user)
      res.status(201).json(newlyCreatedUser)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
})

server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: "The users information could not be retrieved",
            err: err.message
        })
    })
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params

    User.findById(id)
    .then(users => {
        users
        ? res.status(200).json(users)
        : res.status(404).json({ message: "The user with the specified ID does not exist" })
    })
    .catch(err => {
        res.status(500).json({
            message: "Error getting user",
            err: err.message
        })
    })
})

server.delete('/api/users/:id', async (req, res) => {
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
        const deletedUser = await User.remove(req.params.id)
        res.status(200).json(deletedUser)
    }
  })

  server.put('/api/users/:id', async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            if(!req.body.name || !req.body.bio) {
                res.status(400).json({
                    message: "Please provide name and bio for the user"
                })
            } else {
                const updatedUser = await User.update(req.params.id, req.body)
                res.status(200).json(updatedUser)
            }
        }
    } catch {
        res.status(500).json({
            message: "The user information could not be modified"
        })
    }
  }) 

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    })
})

module.exports = server; 
