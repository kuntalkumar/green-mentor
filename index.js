const express = require("express");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 

const app = express();
const {  UserModel } = require('./Model/User.js');
const { TodoModel } = require('./Model/Todo.js');

const { connection } = require('./Config/db.js');

const cors = require("cors");
app.use(express.json());

app.use(cors({
    origin : "*"
  }))

app.get('/', async (req, res) => {
    res.send("Hello World");
});

//......................authentication at here......................................

const authentication = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.send("log in first");
    } else {
        jwt.verify(token, "kuntal", function (err, decode) {
            if (err) {
                res.send("login first");
            } else {
                const { userID } = decode;
                req.userID = userID;
                next();
            }
        });
    }
};

//..............................signup at here...................................................

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10); // Use async/await for bcrypt
        const data = await UserModel.create({
            name,
            email,
            password: hash,
          
            
        });
        res.send(data);
    } catch (err) {
        console.log("something wrong", err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

//...................LOGIN............................

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const is_user = await UserModel.findOne({ email });
        if (is_user) {
            const userPassword = is_user.password;
            const result = await bcrypt.compare(password, userPassword);
            if (result) {
                const token = jwt.sign({ userID: is_user._id }, "kuntal", { expiresIn: '1h' });
                res.send({ msg: "login successful", token: token });
            } else {
                res.send("login fail, password miss matched");
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

app.get("/user", async (req, res) => {
    try {
        const data = await UserModel.find();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

// *****************************************Todo here ************************************************

app.get("/todo", authentication,async (req, res) => {
    try {
        const data = await TodoModel.find();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

app.post("/todoadd",authentication, async (req, res) => {
    const { title, description } = req.body;
    try {
        const data = await TodoModel.create({
            title,
            description
        });
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

app.put("/todo/:todoId", authentication, async (req, res) => {
    try {
        const update = await TodoModel.findByIdAndUpdate(
            req.params.todoId,
            req.body,
            { new: true, runValidators: true } // Ensure 'new: true' to return the updated document
        );
        if (update) {
            res.status(200).send("Updated successfully: " + update);
        } else {
            console.log("Failed to update");
            res.status(404).send("Failed to update");
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bad Request" });
    }
});

// DELETE /products/:productID endpoint part
app.delete("/todo/:todoId",authentication, async (req, res) => {
    try {
        const deletemadi = await TodoModel.findByIdAndDelete(
            req.params.todoId
        );
        if (deletemadi) {
            res.status(200).send("Deleted" + deletemadi);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

const port =8080
app.listen(port, async () => {
    try {
        await connection();
        console.log("Connected to the database");
    } catch (err) {
        console.error("Error connecting to the database: ", err);
    }

    console.log("App is running on port :" , port);
});

