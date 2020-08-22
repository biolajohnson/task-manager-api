const Tasks = require('../models/tasks')
const express = require('express')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth,  async (req, res) => {
    const task = new Tasks({
        ...req.body,
        owner: req.user._id})

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send()
    }
})

router.get('/tasks', auth, async (req, res) => {
    const sort = {}
    const match = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'false'
    }
    if(req.query.sortBy){
        const part = req.query.sortBy.split('_')
        sort[part[0]] = part[1] === "desc" ? -1 : 1
        console.log(sort)
    }
    try{
     await req.user.populate({
         path: 'tasks',
         match, 
         options: {
             limit: parseInt(req.query.limit),
             skip: parseInt(req.query.skip)
         }

     }).execPopulate()
     res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
  
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        const task = await Tasks.findOne({ _id, owner: req.user._id})
            if(!task){
                return res.status(404).send()
            }
            res.send(task)
    }catch(e){
        res.status(500).send()
    }
  
})

router.patch('/tasks/:id', auth,  async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperator){
        return res.status(404).send({error: 'Invalid update'})
    }

    try{
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id })
        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
})
router.delete('/tasks/:id', auth, async (req, res) => {
    
    try{
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id }) 
        if(!task){
            return res.status(404).send()
        }
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router