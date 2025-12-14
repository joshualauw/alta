module.exports = {
    apps: [
        {
            name: "main-app",
            script: "npm run start",
            watch: false
        },
        {
            name: "source-worker",
            script: "npm run source-worker:start",
            watch: false
        }
    ]
};
