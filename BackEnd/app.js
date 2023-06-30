// MODULES 
const express = require('express')
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
require('dotenv').config();


// HTTP CONSTANTES
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// DATABASE CONNECTION 
mongoose.connect('mongodb://localhost:27017/project_crud')
.then(() => console.log('Connected to mongo'))
.catch((err) => console.error('Pas pu se connecter,', err))

// SCHEMAS
const userSchema = new mongoose.Schema({
    id: Number,
    email: String,
    name: String,
    password: String,
    creation: {type: Date, default: Date.now()}
});

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    price: String,
    image: String,
    creation: {type: Date, default: Date.now()}
});

// MODELES CONSTANTES
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// MIDDLEWARE

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// ROUTES
app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Users
app.get('/users', async(req, res) => {
    try {
        const result = await User.find({}).exec();
        res.status(201).json(result);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

app.get('/users/:id', async(req, res) => {
    try {
        const result = await User.findById(req.params.id);
        res.status(201).json(result);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

app.put('/users/:id', async(req, res) => {
    const user_id = req.params.id;
    const payload = req.body;
    
    // validation
    const UserSchema = Joi.object({
        id: Joi.number().required(),
        email: Joi.string().max(255).required().email(),
        name: Joi.string().min(2).max(50).required(),
    });
    const { value, error } = UserSchema.validate(payload);
    
    if (error) {
        res.status(400).send({ error: error.details[0].message });
    }
    
    try {
        await User.findByIdAndUpdate(user_id, payload);
        const newUser = await User.findById(user_id).exec();
        res.status(201).json(newUser);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

app.delete('/users/:id', async(req, res) => {
    try {
        const result = await User.findOneAndDelete(req.params.id);
        res.status(201).json(result);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

// Products
app.get('/products', async(req, res) => {
    try {
        const result = await Product.find({}).exec();
        res.status(201).json(result);
    } catch (exc) {
        return res.status(400).send(exc);
    } 
});

app.get('/products/:id', async(req, res) => {
    try {
        const result = await Product.findById(req.params.id);
        res.status(201).json(result);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

app.post('/products', async (req, res) => {
    const payload = req.body; 
    const allProducts = await Product.find({}).exec();

    payload.id = allProducts.length ? allProducts.length : 0;

    // validation
    const ProductSchema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(2).max(100).required(),
        price: Joi.string().min(1).max(10).required(),
        image: Joi.string().min(2).max(50),
    });
    const { value, error } = ProductSchema.validate(payload);
    
    if (error) {
        res.status(400).send({ error: error.details[0].message });
    }

    const product = new Product(payload);
    
    try {
        await product.save();
        res.status(201).json(payload);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

app.put('/products/:id', async(req, res) => {
    const product_id = req.params.id;
    const payload = req.body;
    
    // validation
    const ProductSchema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().min(2).max(100).required(),
        price: Joi.string().min(1).max(10).required(),
        image: Joi.string().min(2).max(50),
    });
    const { value, error } = ProductSchema.validate(payload);
    
    if (error) {
        res.status(400).send({ error: error.details[0].message });
    }
    
    try {
        await Product.findByIdAndUpdate(product_id, payload);
        const newProduct = await Product.findById(product_id).exec();
        res.status(201).json(newProduct);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

app.delete('/products/:id', async(req, res) => {
    try {
        const result = await Product.findOneAndDelete(req.params.id);
        res.status(201).json(result);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

// Auth
app.post("/signup", async (req, res) => {
    const payload = req.body;
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().max(255).required().email(),
      password: Joi.string().min(3).max(50).required(),
    });
  
    const { value: account, error } = schema.validate(payload);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    } 

    const { id, found } = User.findOne({"email": account.email}).exec();
    if (found) {
        return res.status(400).send("Please signin instead of signup");
    } 

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(account.password, salt);
    account.password = passwordHashed;

    const users = await User.find({}).exec();
    account.id = users.length;

    const user = new User(account);

    try {
        await user.save();
        res.status(201).json(payload);
    } catch (exc) {
        return res.status(400).send(exc);
    }
});

app.post("/login", async (req, res) => {
    const payload = req.body;
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(3).max(50).required(),
    });
  
    const { value: connexion, error } = schema.validate(payload);
  
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
  
    const account = await User.findOne({"email": connexion.email}).exec();
    
    if (!account) {
        return res.status(400).send({ error: "Email Invalide" });
    } 
  
    // Hashing comparaison
    const passwordIsValid = await bcrypt.compare(req.body.password, account.password);
    if (!passwordIsValid) {
        return res.status(400).send({ error: "Mot de Passe Invalide" });
    }
    const token = jwt.sign(account.id, process.env.JWT_PRIVATE_KEY);
    res.header("x-auth-token", token).status(200).json(account);
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})