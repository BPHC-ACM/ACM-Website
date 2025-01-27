import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const PORT = process.env.PORT;

const app = express();
const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API Works!");
});

app.get("/blogs", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Blogs")
      .select("id, title, image_url");
    if (error) {
      throw error;
    }
    console.log("getting blogs");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("Blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
