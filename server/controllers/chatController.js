import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      userId: req.user._id,
      title: 'New Chat'
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const messages = await Message.find({ chatId: chat._id }).sort({ timestamp: 1 });
    res.json({ chat, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    await Message.deleteMany({ chatId: chat._id });
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renameChat = async (req, res) => {
  try {
    const { title } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title },
      { new: true }
    );
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
    } else {
      // Create new if strictly starting from message (optional fallback)
      chat = await Chat.create({ userId: req.user._id, title: message.substring(0, 30) });
    }

    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    // 1. Save User Message
    const userMsg = await Message.create({
      chatId: chat._id,
      sender: 'user',
      content: message
    });

    // 2. Call Groq AI (Preserved Logic + Context)
    // Fetch last 5 messages for context
    const history = await Message.find({ chatId: chat._id }).sort({ timestamp: 1 }).limit(10);
    const messagesForAI = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messagesForAI
    });

    const reply = completion.choices[0].message.content;

    // 3. Save AI Message
    const aiMsg = await Message.create({
      chatId: chat._id,
      sender: 'assistant',
      content: reply
    });

    // Update chat timestamp
    await Chat.findByIdAndUpdate(chat._id, { updatedAt: Date.now() });

    res.json({ userMsg, aiMsg });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "Groq request failed" });
  }
};
