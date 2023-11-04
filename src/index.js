import express from "express";
import { createPool } from "mysql2/promise";
import cors from 'cors'

// create the connection to database
export const pool = createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
});

const app = express();

const PORT = process.env.PORT || 4001;

const corOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors(corOptions))
app.use(express.json());

app.post("/urlShorter", async (req, res) => {
	try {
		const url = req.body.url;
		const host = req.headers.host;
		console.log(host);

		// Validacion url
		const httpsUrlRegex = /^https:\/\/[^\s/$.?#].[^\s]*$/;

		if (!httpsUrlRegex.test(url)) {
			return res.status(400).json({
				success: true,
				message: "Not valid url",
			});
		}

		const urlShorted = Math.random().toString(36).substring(2, 7);
		const sql = "INSERT INTO url_shortened (url, url_shorted) VALUES (?, ?)";

		const [rows] = await pool.query(sql, [url, urlShorted]);

		return res.status(201).json({
			success: true,
			message: "Valid url",
			data: {
				url: url,
				urlShorted: `${process.env.URL_PROD}/${urlShorted}`,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong, please try again",
		});
	}
});

app.get("/:shortUrl", async (req, res) => {
  try {
		const urlShorted = req.params.shortUrl;

		if(urlShorted.length > 5) {
			return res.redirect(process.env.URL_PROD)
		}

		const sql = "SELECT * FROM `url_shortened` WHERE `url_shorted` = ?"

		const [rows, fields] = await pool.query(
			sql,
			[urlShorted]
		);

		if (rows.length === 0) {
			throw new Error('No ha registros')
		}		

		let usageCounter = rows[0].usage_counter
		usageCounter++
		
		const sql2 = "UPDATE url_shortened SET usage_counter = ? WHERE url_shorted = ?";
		await pool.query(
			sql2,
			[usageCounter, urlShorted]
		);

		return res.redirect(rows[0].url);
	} catch (error) {
		console.log(error);
    return res.redirect(process.env.URL_PROD)
  }
});

app.listen(PORT, console.log(`Server running on port: ${PORT}`));
