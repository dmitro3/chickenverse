import express from "express";
import "./chickenverse-server/index.js";

import * as path from "path";

const resolve = (file) => path.join(process.cwd(), "chickenverse-client", file);

const app = express();

app.use(express.static(resolve("./dist")));

app.get("/*", (req, res) => {
    res.sendFile(resolve("index.html"));
});

app.listen(3000, () => {
    console.log("deployed chickenverse");
});
