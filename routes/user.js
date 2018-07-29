const express=require('express');
const mongoose = require('mongoose');
const router =express.Router();


require('../models/user');

const user=mongoose.model('user');

