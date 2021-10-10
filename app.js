const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const cors = require('cors');
app.use(cors());
require("dotenv").config();
var path = require('path');
let ejs = require('ejs');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const Women = require("./models/women.js").women;
const Maid = require("./models/maids.js").maid;

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, './views/templates'));
app.use(express.static(path.join(__dirname, './HomePAge')));
app.use(express.static(path.join(__dirname, './loginPortal')));
app.use(express.static(path.join(__dirname, './womenLogin')));
app.use(express.static(path.join(__dirname, './maid_register')));
app.use(express.static(path.join(__dirname, './Reading Section')));
app.use(express.static(path.join(__dirname, './Ngo')));
app.use(express.static(path.join(__dirname, './Edit Profile')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {MONGO_URI,TOKEN_KEY,ADMIN_PASS } = process.env;
const port = process.env.PORT || 8000;
const auth = require("./config/auth");

mongoose.connect("mongodb+srv://nitigya:nitigya%402001@cluster0.wdxmp.mongodb.net/WaysLady?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  retryWrites: true,
  w: "majority",
    })
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => {
      console.log("error connecting db", error);
      process.exit(1);
    });

app.get("/", (req, res) => {
      res.sendFile(__dirname + "/HomePAge/Home.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/loginPortal/new-register.html");
});

app.get("/women/login", async (req, res) => {
  try {
    res.sendFile(__dirname + "/womenLogin/womanlogin.html");
  } catch (err) {
    console.log(err);
  }
});

app.post("/women/login", async (req, res) => {
  try {
    const data = req.body;

    const user = {
      name : data.customFieldInputValues.Name,
      mobile : data.identifier,
      medicalReport : {}
    }

    const already = await Women.findOne({ mobile : data.identifier });

    if(already) {
      console.log("ehehheheh success");
      res.redirect("/women/" + already._id);
    } else {
      console.log("ehehheheh success");
      const newUser = await Women.create(user);
      res.redirect("/women/" + newUser._id)
    }

  } catch (err) {
    console.log(err);
  }
});

app.get("/women/:id", async(req, res) => {
    try {
      const idd = req.params.id;
      const user = await Women.findById(idd);
      res.render("pwomen", user);

    } catch (error) {
      console.log(error);
    }
})

app.get("/women/:id/edit", async(req, res) => {
  try {
    const idd = req.params.id;
    const user = await Women.findById(idd);
    res.render("editWomen", user);

  } catch (error) {
    console.log(error);
  }
})

app.post("/women/:id/edit", async(req, res) => {
  try {
    const idd = req.params.id;

    console.log(req.body.stage)
    
    if(req.body.stage === 'Pre') {
      res.redirect(`/women/${idd}/edit/pre`);
    } else {
      res.redirect(`/women/${idd}/edit/post`)
    }

  } catch (error) {
    console.log(error);
  }
})

app.get("/women/:id/edit/pre", async(req, res) => {
  try {
    const idd = req.params.id;
    const user = await Women.findById(idd);
    res.render("editWomenPre", user);

  } catch (error) {
    console.log(error);
  }
})

app.get("/women/:id/edit/post", async(req, res) => {
  try {
    const idd = req.params.id;
    const user = await Women.findById(idd);
    res.render("editWomenPost", user);

  } catch (error) {
    console.log(error);
  }
})

app.get("/NGO", async(req, res) => {
  try {
    res.sendFile(__dirname + "/Ngo/NGO.html")
  } catch (error) {
    console.log(error);
  }
})

app.get("/Reading", async(req, res) => {
  try {
    res.sendFile(__dirname + "/Reading Section/booksHome.html")
  } catch (error) {
    console.log(error);
  }
})

app.get("/books", async(req, res) => {
  try {
    res.sendFile(__dirname + "/Reading Section/books.html")
  } catch (error) {
    console.log(error);
  }
})

app.get("/magazine", async(req, res) => {
  try {
    res.sendFile(__dirname + "/Reading Section/magazine.html")
  } catch (error) {
    console.log(error);
  }
})

app.get("/maids_babysitters", async(req,res) => {
  try {
    const maids = await Maid.find({work : 'Maid'});
    const babysitters = await Maid.find({work : 'Babysitter'});

    console.log(maids)

    res.render('maids_babysitters', {
      maids : maids,
      babysitters : babysitters
    })
  } catch (err) {
    console.log(err);
  }
})

app.get("/maids/login", async (req, res) => {
  try {
    res.sendFile(__dirname + "/maid_register/maid_registration.html");
  } catch (err) {
    console.log(err);
  }
});

app.post("/maids/login", async (req, res) => {
  try {
    const {fname,lname,dob,mobile,address,city,state,work} = req.body;

    const working = false;

    const newUser = await Maid.create({fname,lname,dob,mobile,address,city,state,work,working});

    res.redirect("/maids/" + newUser._id);

  } catch (err) {
    console.log(err);
  }
});

app.get("/maids/:id", async(req, res) => {
  res.render("pmaid")
})


app.post("/admin/login", async(req,res) => {
  try {
    const { password } = req.body;

    if(password===ADMIN_PASS) {
      res.send("Admin Page");
    } else {
      res.send("Invalid Password");
    }
    
  } catch (err) {
    console.log(err);
  }
})

app.get("/admin/profile", async(req, res) => {
  
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});