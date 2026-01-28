module.exports = {
  apps: [{
    name: 'restaurant-backend',
    script: './dist/src/index.js', // Path relative to this file
    cwd: '/var/www/restaurant/backend',
    instances: 1, // Or 'max' for cluster mode
    exec_mode: 'fork', 
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production',
    }
  }]
};