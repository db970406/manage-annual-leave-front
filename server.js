import express from "express";

const app = express();
const PORT = 20012;

app.use("/static", express.static("assets"));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/index.html");
})
app.listen(PORT, () => console.log(`Web Server on ${PORT}`));