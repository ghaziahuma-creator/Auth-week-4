const express = require("express");
const app = express();
const PORT = 3000;
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

app.use(express.json());

const swaggerDocument = YAML.parse(
  fs.readFileSync(path.join(__dirname, "openapi.yaml"), "utf8")
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.log("Supabase error:", error.message);
  } else {
    console.log("Supabase Auth client responded successfully");
  }
});

app.post("/auth/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: "Please provide credentials",
    });
    return;
  }
  supabase.auth.signUp({ email, password }).then(({ data, error }) => {
    if (error) {
      res.status(400).json({
        error,
      });
    } else {
      res.status(201).json({
        user: data.user,
      });
    }
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: "Please provide credentials",
    });
    return;
  }
  supabase.auth
    .signInWithPassword({ email, password })
    .then(({ data, error }) => {
      if (error) {
        res.status(401).json({
          error: "Invalid login credentials",
        });
      } else {
        res.status(200).json({
          token: data.session?.access_token,
        });
      }
    });
});

app.get("/public/info", (req, res) => {
  res.status(200).json({
    message: "Welcome stranger! This info is public.",
  });
});

// app.get('/protected/profile', (req, res)=>{
//     const token = req.header('Authorization');

//  if(!token){
//     res.status(401).json({
//         "error" : "Access token required",
//     })
//  }
//  res.status(200).json({
//     message: "Access token received successfully",
//     token: token,
//  })
// })

app.get("/protected/profile", verifyToken, (req, res) => {
   const { id, email, created_at } = req.user;
   if(!id || !email || !created_at){
    res.status(401).json({
        error: "User data is required",
    })
    return;
   }
      res.status(200).json({
         user: {
          id,
          email,
          created_at,
        }
      })     
});

app.post('/auth/logout', verifyToken,async(req, res)=>{ 
    const token = req.token;
    if(!token){
        res.status(400).json({
            error: "Token required!"
        })
        return;
    }
  await supabase.auth
    .signOut({ scope :'local'})
    .then(({ data, error }) => {
      if (error) {
        res.status(500).json({
          error: error.message,
        });
      } else {
        res.sendStatus(204);
      }
    });
})



app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT} and connected to supabase`,
  );
});


async function verifyToken (req, res, next){
     const authHeader = req.header("Authorization");
      const [scheme, token] = authHeader?.trim().split(/\s+/) ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = data.user;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: "Authentication check failed" });
  }
}
  
