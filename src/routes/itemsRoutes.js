const express = require('express')
const { v4: uuid } = require('uuid');

module.exports = function(db) {
    const router = express.Router()

    router.get('/items', async (req, res) => {
        try{
            console.log('GET /items')
            const items = await db.getItems()
            console.log(`GET /items: ${JSON.stringify(items)}`)
            res.json(items)
        }
        catch(err){
            res.status(500).json({error: err.message})
        }
    });

    router.get('/items/:id', async (req, res) => {
        try{
            const item = await db.getItem(req.params.id)
            console.log(`GET /items/${req.params.id}: ${item}`)
            res.json(item)
        }
        catch(err){
            res.status(500).json({error: err.message})
        }        
    });

    router.delete('/items/:id', async (req, res) => {
        try{
            await db.deleteItem(req.params.id)
            console.log(`DELETE /items/${req.params.id}`)
            res.sendStatus(200)
        }
        catch(err){
            res.status(500).json({error: err.message})
        }
    });

    router.post('/items', async (req, res) => {
        try{
            let item = {'id': uuid(),
                        'name': req.body.name,
                        'completed': req.body.completed}
            console.log(`POST /items: ${JSON.stringify(item)}`)
            
            await db.createItem(item)
            res.sendStatus(item)
        }
        catch(err){
            res.status(500).json({error: err.message})
        }
    });

    router.put('/items/:id', async (req, res) => {
        try{
            let item = {'id': req.body.id,
                        'name': req.body.name,
                        'completed': req.body.completed}
            console.log(`PUT /items/${req.params.id}: ${JSON.stringify(item)}`)
            await db.updateItem(req.params.id, item)
            res.sendStatus(200)
        }
        catch(err){
            res.status(500).json({error: err.message})
        }
    });

    return router
}