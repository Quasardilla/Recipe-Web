module.exports = {
  apps : [
      {
        name: "KitchenBackend",
        script: "./index.js",
        watch: ["backend"],
        watch_delay: 1000,
        instance_var: 'INSTANCE_ID',
      },
      {
        name: "KitchenFrontend",
        script: "npm run svelte",
        watch: ["frontend"],
        ignore_watch : ["./"],
        watch_delay: 500,
        autorestart: false
      }
  ]
}