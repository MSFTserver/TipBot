module.exports = {
  apps: [
    {
      name: 'TipBot',
      script: './bot/bot.js',
      cwd: 'Location-of-Bot-Dir',
      instance_id_env: '0',
      watch: true,
      ignore_watch : ['node_modules', 'Logs', 'Downloads', '.git'],
      error_file:
        'Location-of-Bot-Dir/Logs/tipbot-err.log',
      out_file: 'Location-of-Bot-Dir/Logs/tipbot-out.log',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
