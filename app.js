const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  
  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/b1871862c4";
    const options = {
        method: "POST",
        auth: "saurabh:879e1b02ec0891499cb8dfd590e0b44c-us21"
    }
    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
        if (response.statusCode === 200) {
          res.sendFile(__dirname + "/success.html");
        }
        else { 
          res.sendFile(__dirname + "/failure.html");
        }
    }
    )
    request.write(jsonData);
    request.end();
    
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});

// API key: 879e1b02ec0891499cb8dfd590e0b44c-us21
// Audience ID: b1871862c4
