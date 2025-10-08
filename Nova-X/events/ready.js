module.exports = (client) => {
  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('Nova-X MTA', { type: 3 });
  });
};
