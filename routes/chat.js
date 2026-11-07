import express from "express";
import Conversation from "../models/Conversation.js";
import getOpenRouterResponse from "../utils/openai.js";

const router = express.Router();

// test
// router.post("/test", async (req, res) => {
//     try {
//         const conversation = new Conversation({
//             conversationId: "abc",   
//             title: "Testing New Conversation"
//         });

//         const response = await conversation.save();
//         res.send(response);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Failed to save in DB" });
//     }
// });

//Get all threads
router.get("/conversations", async (req, res) => {
    try {
        const conversations = await Conversation.find({}).sort({ updatedAt: -1 });
        res.json(conversations);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
});

router.get("/conversation/:id", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ conversationId: req.params.id });
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }           
        res.json(conversation);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch conversation" });
    }
});
//delete a thread
router.delete("/conversation/:id", async (req, res) => {
    try {
        const conversation = await Conversation.findOneAndDelete({ conversationId: req.params.id });
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }
        res.json({ message: "Conversation deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete conversation" });
    }
});
router.post("/chat", async (req, res) => {
    const { conversationId, message } = req.body;
    if (!conversationId || !message) {
        return res.status(400).json({ error: "conversationId and message are required" });
    }
    try{
        let conversation = await Conversation.findOne({ conversationId });
        if (!conversation) {
            conversation = new Conversation({ 
                conversationId,
                title:message, 
                messages: [{ role: "user", content: message }] 
            });
        } else {
            conversation.messages.push({ role: "user", content: message });
        }
        const assistantReply = await getOpenRouterResponse(message);
        conversation.messages.push({ role: "assistant", content: assistantReply });
        conversation.updatedAt = new Date();
        await conversation.save();
        res.json({ reply: assistantReply });
    }catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to process chat message" });
    }
});


export default router;