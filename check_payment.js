import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/bakong/check_payment", async (req, res) => {
  try {
    const { md5 } = req.query;
    if (!md5) {
      return res.status(400).json({ error: "Missing md5 parameter" });
    }

    const bakongUrl = `${process.env.BAKONG_BASE_URL}/check_payment/?md5=${encodeURIComponent(md5)}`;

    const headers = {};
    if (process.env.BAKONG_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.BAKONG_API_KEY}`;
    }

    const response = await axios.get(bakongUrl, { headers, timeout: 5000 });
    res.status(response.status).json(response.data);

  } catch (err) {
    console.error("Bakong API error:", err.message);

    if (err.response) {
      res.status(err.response.status).json({
        error: "Bakong responded with error",
        details: err.response.data
      });
    } else {
      res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
