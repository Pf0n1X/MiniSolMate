require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { StreamChat } = require('stream-chat');

const STREAM_API_KEY = 'bfk5cdnk2tqy';
const STREAM_APP_SECRET = 'ngtbm98rpwptwg637p2stzmev2pkcbjp2c3pgnh6dsencq9e2hkhdabnxcyzjy2m';
const PORT = 5500;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK

const serverSideClient = new StreamChat(
  STREAM_API_KEY,
  STREAM_APP_SECRET
);

app.post('/join', async (req, res) => {
  const { username } = req.body;
  const token = serverSideClient.createToken(username);
  try {
    await serverSideClient.updateUser(
      {
        id: username,
        name: username,
      },
      token
    );
  } catch (err) {
    console.log(err);
  }

  const admin = { id: 'admin' };
  const channel = serverSideClient.channel('team', 'talkshop', {
    name: 'Talk Shop',
    created_by: admin,
  });

  try {
    await channel.create();
    await channel.addMembers([username, 'admin']);
  } catch (err) {
    console.log(err);
  }

  return res
    .status(200)
    .json({ user: { username }, token, api_key: STREAM_API_KEY });
});

const server = app.listen(PORT, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});