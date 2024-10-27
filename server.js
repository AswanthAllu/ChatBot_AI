// server.js
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
    res.render("chatbot");
});

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini", //min Use the appropriate model
            messages: [{ role: "user", content: userMessage }],
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const botMessage = response.data.choices[0].message.content;
        res.json({ message: botMessage });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
