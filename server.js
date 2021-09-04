if (process.env.NODE_ENV !== "prduction") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const initPass = require("./passport-config");
const passport = require("passport");

const users = [];


app.set("view-engine","ejs")
app.use(flash());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: false}))


app.get("/",(req,res)=>{
    res.render("index.ejs", {name: "Hamza"});
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

app.post("/login",passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.post("/register", async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect("/login")
    } catch (error) {
        res.redirect("/register")
    }    
})

initPass(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server is listening on port: ${PORT}...`));