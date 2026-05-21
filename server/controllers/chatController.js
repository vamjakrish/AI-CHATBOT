const Groq = require('groq-sdk');
const Chat = require('../models/Chat');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ chats });
  } catch (err) {
    next(err);
  }
};

const getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found.',
      });
    }

    res.json({ chat });
  } catch (err) {
    next(err);
  }
};

const createChat = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      userId: req.user._id,
      messages: [],
      title: 'New Chat',
    });

    res.status(201).json({ chat });
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: 'Message cannot be empty.',
      });
    }

    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found.',
      });
    }

    const userMessage = {
      role: 'user',
      content: message.trim(),
    };

    chat.messages.push(userMessage);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant.',
        },
        {
          role: 'user',
          content: message.trim(),
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const aiText =
      completion.choices?.[0]?.message?.content ||
      'No response generated.';

    const aiMessage = {
      role: 'model',
      content: aiText,
    };

    chat.messages.push(aiMessage);

    if (chat.messages.length === 2) {
      chat.title = message.trim().slice(0, 30);
    }

    await chat.save();

    return res.json({
      userMessage,
      aiMessage,
      title: chat.title,
    });

  } catch (err) {
    console.error('Groq Error:', err);

    return res.status(500).json({
      error: err.message || 'Failed to generate AI response.',
    });
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found.',
      });
    }

    res.json({
      message: 'Chat deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

const clearMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found.',
      });
    }

    chat.messages = [];
    chat.title = 'New Chat';

    await chat.save();

    res.json({
      message: 'Chat cleared successfully.',
      chat,
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChats,
  getChatById,
  createChat,
  sendMessage,
  deleteChat,
  clearMessages,
};