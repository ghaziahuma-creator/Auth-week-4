const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

supabase.auth.getSession()
    .then(({ data, error }) => {
        if (error) {
            console.log('Supabase error:', error.message);
        } else {
            console.log('Supabase Auth client responded successfully');
        }
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} and connected to supabase`);
});