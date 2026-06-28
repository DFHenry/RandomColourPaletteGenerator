import express from "express";
import path from "path";
import "dotenv/config";

import appFunctions from "./components/api.js";

const __dirname = import.meta.dirname;

//express app
const app = express();
const port = process.env.port;

//define folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

//page routes
app.get("/", async (req, res) =>
{
    let colorList = await appFunctions.getColours();
    let copyText = ":root {";

    let colorArray = [];

    for(let i = 0; i < colorList.length; i++)
    {
        colorArray.push(colorList[i]);
        copyText += "--color-" + i.toString() + ": " + colorArray[i].map(x => x.hex) + ";\n";
    }

    copyText += "}";

    res.render("index", {colors: colorList, cssText: copyText});
});

app.get("/copy", async (req, res) =>
{
    //let copyText = await copyToClipboard(req.query.);
});

//setup server listening
app.listen(port, () => 
{
    console.log(`listening on http://localhost:${port}`);
});