const express = require('express');
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cors = require('cors'); // Import the cors middleware


const app = express();
const PORT = process.env.PORT || 4567;

app.use(cors());

const VUE_FRONTEND_DIR = path.join(__dirname, '..', 'vue-frontend', 'dist');

// Middleware
app.use(bodyParser.json());

// Serve static files
app.use(express.static(VUE_FRONTEND_DIR));

// Define a route for serving HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(VUE_FRONTEND_DIR, 'index.html'));
});

// Define routes for serving static assets
app.get('/js/*', (req, res) => {
  res.sendFile(path.join(VUE_FRONTEND_DIR, 'js', req.params[0]));
});

app.get('/css/*', (req, res) => {
  res.sendFile(path.join(VUE_FRONTEND_DIR, 'css', req.params[0]));
});

// Set the Google Cloud credentials environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'resumechatbot-402917-d2d9780c8844.json');

// Define a route for handling Dialogflow requests
app.post('/dialogflow', async (req, res) => {
  try {
    const { message } = req.body;

    // Initialize a Dialogflow client
    const sessionsClient = new SessionsClient();

    // Generate a unique session ID for each conversation
    const sessionPath = sessionsClient.projectAgentSessionPath(
      'resumechatbot-402917',
      uuidv4()
    );

    // Create a query input with the user's message
    const queryInput = {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    };

    // Send the user's message to Dialogflow
    const [responses] = await sessionsClient.detectIntent({
      session: sessionPath,
      queryInput,
    });

    // Extract the bot's response from Dialogflow's response
    const botResponse = responses.queryResult.fulfillmentText;

    // Return the bot's response to the frontend
    res.json({ message: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
