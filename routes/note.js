const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Notes');

//Route1 : Get all notes data using api/note/getallnote : login required
router.get('/getallnote', fetchuser, async (req, res)=> {
    try {
        const notes =  await Notes.find({user: req.user.id});
        res.json({notes: notes});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route2 : add a new notes using POST api/note/addnote : login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 5}),
    body('description', 'Enter a valid title').isLength({ min: 5})
], async (req, res)=> {
    try {
        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        //check bad request
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        //add new notes
        const savedNotes = await note.save();
        res.json({notes: savedNotes});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//Route3 : update an exsiting notes using PUT api/note/updatenote : login required
router.put('/updatenote/:id', fetchuser, async (req, res)=> {
    try {
        const {title, description, tag} = req.body;
        //Create new note object
        const newNotes = {};
        if (title){newNotes.title = title};
        if (description){newNotes.description = description};
        if (tag){newNotes.tag = tag};
           
        //find note to update by id
        let note = await Notes.findById(req.params.id);
        if (!note) {
            req.status(404).send({error:"Note not found"});
        }
        //toString() is used for user id
        if (note.user.toString() !== req.user.id) {
            return req.status(404).send({error:"Not allowed"});
        }
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNotes}, {new:true});
        res.json({notes: note});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route4 : delete an exsiting notes using PUT api/note/deletenote : login required
router.delete('/deletenote/:id', fetchuser, async (req, res)=> {
    try {
        //find note to update by id
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send({error:"Note not found"});
        }
        //toString() is used for user id
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send({error:"Not allowed"});
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({message : "Note has been deleted."});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router;