const express = require('express')
const cors = require('cors');
const path = require("path");
const fs = require("fs");
var cookie = require('cookie');
const rateLimit = require('express-rate-limit')

const app = express()
const port = 5102

const apiLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 200, // Limit each IP to 100 requests per `window` (here, per 1 minute)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
  
app.set('trust proxy', 3 /* number of proxies between user and server */)

app.use('/api', apiLimiter)

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = require("./backend/config/main.js");

db.conn.sync()
	.then(() => {
		console.log("Synced db.");
	})
	.catch((err) => {
		console.log("Failed to sync db: " + err.message);
	});

function onRequest(req, res) {
	if (req.body) {
		// Set a new cookie with the name
		res.setHeader('Set-Cookie', cookie.serialize('name', String(query.name), {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7 // 1 week
		}));
	
		// Redirect back after setting cookie
		res.statusCode = 302;
		res.setHeader('Location', req.headers.referer || '/');
		res.end();
		return;
	}
}

// home page routing
app.get("/", (req, res) => {
	res.sendFile("./dist" + path + "index.html");
});

// load backend routes
let routesDir = path.join(__dirname + "/backend", "routes");
fs.readdirSync(routesDir).forEach(function(file) {
	require(routesDir + "/" + file)(app);
});

// api routing
app.get('/api/', (req, res) => {
	res.redirect("/api/" + req.params[0]);
});

app.listen(port, () => {
  console.log(`Backend is listening on port ${port}!`)
})