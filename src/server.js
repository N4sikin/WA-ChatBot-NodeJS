require('dotenv').config();
const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const port = process.env.PORT || 4000;
const app = express();

const midlewareLogs = require('./midleware/log');

app.use(midlewareLogs);

// Bot WhatsApp
const client = new Client();

client.on('qr', (qrCode) => {
  console.log('Scan the QR code to log in:');
  qrcode.generate(qrCode, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', (message) => {
  const orderMessage = message.body.toLowerCase();
  if (orderMessage.includes('pesan kue')) {
    const response = 'Terima kasih atas pesanan Anda! Kue akan segera diproses.';
    client.sendMessage(message.from, response);
  }
});

client.on('authenticated', (session) => {
  console.log('Client is authenticated');
});

client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
});

// Check login status every 5 seconds
const checkLoginStatus = () => {
    if (!client.session) {
      console.log('Client is not logged in. Waiting for authentication...');
    } else {
      console.log('Client is already logged in.');
    }
  };
  
  setInterval(checkLoginStatus, 60000);

// Initialize client
client.initialize();

// Express server
app.use('/', (req, res) => {
  res.send('Hello guest!');
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
