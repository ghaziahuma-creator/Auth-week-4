const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(express.json());

supabase.auth.getSession()
    .then(({ data, error }) => {
        if (error) {
            console.log('Supabase error:', error.message);
        } else {
            console.log('Supabase Auth client responded successfully');
        }
    });


app.post('/auth/signup' , (req, res)=>{
     const {email, password} = req.body;
 if(!email || !password){
    res.status(400).json({
        message: "Please provide credentials"
    })
}
 supabase.auth.signUp( {email, password})
 .then(({ data, error }) => {
        if (error) {
           res.status(400).json({
            error
           })
        } else{
            res.status(201).json({
               user: data.user,
            })
        }
    });
})

app.post('/auth/login', (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
    res.status(400).json({
        message: "Please provide credentials"
    })
    return;
}
supabase.auth.signInWithPassword({email, password})
.then(({data, error})=>{
   if (error) {
           res.status(401).json({
            error: "Invalid login credentials" ,
           })
        } else{
            res.status(200).json({
               token: data.session?.access_token,
            })
        }
})
})

app.get('/public/info', (req, res)=>{
    res.status(200).json({
        message: "Welcome stranger! This info is public."
    })
})

app.get('/protected/profile', (req, res)=>{
    const token = req.header('Authorization');
    
 if(!token){
    res.status(401).json({
        "error" : "Access token required",
    })
 }
 res.status(200).json({
    message: "Access token received successfully",
    token: token,
 })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} and connected to supabase`);
});