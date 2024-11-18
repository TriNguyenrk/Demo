var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const mongodb = "mongodb+srv://hung:hung01032005@cluster0.nfmzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongodb)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.error('Connection error:', err));

module.exports = mongoose;

// Mô hình Car
const carSchema = new mongoose.Schema({
    MaXe: {type: String, required: true, unique: true},
    Name: {type: String, required: true},
    Price: {type: Number, required: true},
    Year: {type: Number, required: true},
    Brand: {type: String, required: true}
});

const Car = mongoose.model('Car', carSchema);

// Routes
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.render('index', {cars, errors: [], car: {}});
    } catch (error) {
        res.render('index', {cars: [], errors: [error.message], car: {}});
    }
});

router.post('/add-car', async (req, res) => {
    const {MaXe, Name, Price, Year, Brand} = req.body;

    // Xác thực phía server
    const errors = [];
    if (!MaXe) errors.push('MaXe là bắt buộc');
    if (!Name || !/^[a-zA-Z\s]+$/.test(Name)) errors.push('Name phải chỉ chứa chữ cái và khoảng trắng');
    if (!Price || isNaN(Price)) errors.push('Price phải là số');
    if (!Year || isNaN(Year) || Year < 1980 || Year > 2024) errors.push('Year phải từ 1980 đến 2024');
    if (!Brand) errors.push('Brand là bắt buộc');

    if (errors.length > 0) {
        const cars = await Car.find();
        return res.render('index', {errors, car: req.body, cars});
    }

    try {
        const newCar = new Car({MaXe, Name, Price, Year, Brand});
        await newCar.save();
        res.redirect('/');
    } catch (error) {
        const cars = await Car.find();
        res.render('index', {errors: [error.message], car: req.body, cars});
    }
});

// Route lấy danh sách ô tô dưới dạng JSON
router.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars); // Trả về dữ liệu JSON cho danh sách ô tô
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
