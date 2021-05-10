const express = require("express");
const app = express();
const posts = require("./posts.json");

// Enable the ability to save the update dated posts.json
const fs = require("fs");

// Enable the ability to send raw json data to the API and expect it to be in the request body
    // Need to be for post method
app.use(express.json()); 

// Enable the ability to send URL encooded bodies to the API
    // Need to be for post method
app.use(express.urlencoded({extended: true }));
app.get("/", function(req,res) {
    return res.send("Hello World")
})


// Route 1: Create a new post using POST/posts
    //create a new post from client's request
        // use POSTMAN to send data structured like posts.json
    //save updated data to posts.json 
    //save the updated data by stringifying json data
    //rewrite the files posts.json
    //send response to client
app.post('/posts', (req, res) => {
    console.log(req.body.newPost)   // Confirm that the new post was sent
    posts.push(req.body.newPost);   // Save updated data 
    // console.log({ posts })  confirm that posts array was updated properly
    let stringedData = JSON.stringify(posts, null, 2);
    //fs.writefile() takes in 3 params with the last one being the callback
    fs.writeFile("posts.json", stringedData, function(err) {
        if (err) {
            return res.status(500).json({ message: err })
        }
    })
    return res.status(200).json({ message : "new post created" })  // response to client
})


// Fetch all posts using GET/posts 
    //returns and array of all posts
app.get("/posts", (req, res) => {
    return res.json({posts})
})

// Fetch a single post by using POST/:id
    //fetch req params.id
    //match user with that id
    // return user object as response
    //return a 404 error if user does not exist
app.get("/posts/:id", (req, res) => {
    let id = req.params.id
    let foundPost = posts.find(post => {
        return String(post.id) === id
    })
    if(foundPost) {
        return res.status(200).json({ post : foundPost })
    } else {
        return res.status(404).json({ message: "post not found" })
    }
});

app.put("/posts/:id", (req, res) => {
    let id = req.params.id;
    
    
    let foundPost = posts.find(post => 
        String(post.id) === id)
    
    if (foundPost) {
        foundPost.body = req.body.body;

        let stringData = JSON.stringify(posts, null, 2);
        fs.writeFile("posts.json", stringData, function(err) {
            if (err) {
                return res.status(500).json({ message: err })
            }
        });

        return res.status(200).json({ message: "change made" })
    } else {
        return res.status(404).json({ message: "post not updated" })
    }   
})
// app.put('/posts/:id', (req, res) => {  
//     res.json({   
//       title: req.body.title,   
//       body: req.body.body,  
//     });
//   });
// 
app.listen(3000, function(){
    console.log("Yeah! The Server is finally working!")
})
