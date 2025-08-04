const port = 4500;

require('dotenv').config();
const fs = require('fs');
const https = require('https');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Load SSL/TLS certificates
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/cert.pem', 'utf8');
const ca = fs.readFileSync('cert/csr.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ limit: '25mb' }));
app.use(cors());

const UserModel = require('./Models/userRegisterModel');
const ProductModel = require('./Models/productModel');

const verifyToken = require('./verifyToken');
const verifyAdmin = require('./verifyAdmin');

const adminRouter = require('./Routers/adminRouter.js');
const loginRouter = require('./Routers/loginRouter.js');
const registerRouter = require('./Routers/registerRouter.js');
const userRouter = require('./Routers/userRouter.js');
const productRouter = require('./Routers/productRouter.js');
const resetAccountRouter = require('./Routers/resetAccountRouter.js');
const contactUsRouter = require('./Routers/contactUsRouter.js');
const ordersRouter = require('./Routers/ordersRouter.js');

async function main() {
    await mongoose
        .connect(process.env.DATABASE)
        .then(() => {
            console.log("Connected to Mongo");
        })
        .catch(() => {
            console.log("Something went wrong with MongoDB");
        });
}

main();

app.use('/admin', verifyToken, verifyAdmin, adminRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/user', verifyToken, userRouter);
app.use('/products', productRouter);
app.use('/resetAccount', resetAccountRouter);
app.use('/contact', contactUsRouter);
app.use('/orders', verifyToken, ordersRouter);


app.get('/test', (req,res) =>{

    console.log('test');

    res.send('test passed');

})

// Initialize Database with data
app.get('/initialize', async (req, res) => {
    try {
        let myData = JSON.parse(fs.readFileSync("./initializeData.json").toString());

        // Insert users
        myData.users.forEach(async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
            const newUser = new UserModel(user);
            await newUser.save();
        });

        // Insert products
        myData.products.forEach(async (product) => {
            const newProduct = new ProductModel(product);
            await newProduct.save();
        });

        res.status(200).send('Data initialized');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log('Server is running on HTTPS...');
});