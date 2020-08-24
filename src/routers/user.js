const User = require('../models/users')
const express = require('express')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account')

const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        const token = await user.getWebToken()
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })
    }catch(e){
        res.status(500).send()
    }

})
router.post('/users/login', async(req, res) => {
    try{
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.getWebToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
    
})
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)

    }catch(e){
        res.status(404).send()
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
   try{
         req.user.tokens = []
         await req.user.save()
         res.send(req.user)
         
   } catch(e){
       res.status(404).send()
   }
})

router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth,  async(req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperator = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperator){
       return res.status(404).send({error: 'Invalid update!'})
    }
    try{
    updates.forEach((update) => req.user[update] = req.body[update])
 
        
       if(!req.user){
           return res.status(404).send()
       }
       await req.user.save()
       res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try{
       await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e){
        res.status(500).send()
    }
})
const avatar = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload valid format'))
        }
            cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300}).png().toBuffer()
req.user.avatar = buffer
await req.user.save()
res.send()
}, (error, req, res, next) => {
    res.status(500).send({
        error: error.message
    })
})
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            res.status(404).send()
        }
        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(500).send()
    }
})
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

module.exports = router