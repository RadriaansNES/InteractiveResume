const express = require('express');
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cors = require('cors'); 


const app = express();
const PORT = process.env.PORT || 4567;

app.use(cors());

const VUE_FRONTEND_DIR = path.join(__dirname, '..', 'vue-frontend', 'dist');

app.use(bodyParser.json());

app.use(express.static(VUE_FRONTEND_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(VUE_FRONTEND_DIR, 'index.html'));
});

app.get('/js/*', (req, res) => {
  res.sendFile(path.join(VUE_FRONTEND_DIR, 'js', req.params[0]));
});

app.get('/css/*', (req, res) => {
  res.sendFile(path.join(VUE_FRONTEND_DIR, 'css', req.params[0]));
});

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'resumechatbot-402917-d2d9780c8844.json');

app.post('/dialogflow', async (req, res) => {
  try {
    const { message } = req.body;

    const sessionsClient = new SessionsClient();

    const sessionPath = sessionsClient.projectAgentSessionPath(
      'resumechatbot-402917',
      uuidv4()
    );

    const queryInput = {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    };

    const [responses] = await sessionsClient.detectIntent({
      session: sessionPath,
      queryInput,
    });

    const botResponse = responses.queryResult.fulfillmentText;

    res.json({ message: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
