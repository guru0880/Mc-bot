const mineflayer = require('mineflayer');

const HOST = process.env.MC_HOST || 'lotius.aternos.me';
const PORT = parseInt(process.env.MC_PORT || '38464');
const USERNAME = process.env.MC_USERNAME || 'AFKSuper';
const AUTH = process.env.MC_AUTH || 'offline';

function createBot() {
  console.log(`[Bot] Connecting to ${HOST}:${PORT} as ${USERNAME}...`);

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    auth: AUTH,
  });

  bot.on('spawn', () => {
    console.log('[Bot] Joined the server!');

    // Jump every 30 seconds to prevent AFK kick
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 500);
      console.log('[Bot] Jumped');
    }, 30000);

    // Swing arm every 10 seconds
    setInterval(() => {
      bot.swingArm('right');
      console.log('[Bot] Swung arm');
    }, 10000);

    // Send a chat message every 5 minutes to stay active
    setInterval(() => {
      bot.chat('.');
      console.log('[Bot] Sent keep-alive chat');
    }, 300000);
  });

  bot.on('end', (reason) => {
    console.log(`[Bot] Disconnected: ${reason}. Reconnecting in 5 seconds...`);
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.error('[Bot] Error:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('[Bot] Kicked:', reason);
  });
}

createBot();
