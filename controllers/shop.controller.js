const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const firebase = require("../services/firebase");
const { PRODUCT_MODEL } = require("../constants/modal");


exports.index =(req, res, next) => {
    res.render("index");
}

exports.login =(req, res, next) => {
    res.render("login");
}

exports.categories = async (req, res, next) => {
    //Biến truyền qua view
    const category = {
        products: 0,
        current: 0,
        pages: 0,
        allCategories: 0,
        allBrands: 0
    };
    
    //Set số sản phẩm trên một trang, và lấy trang hiện tại
    let perPage = 9;
    let page;
    if(Number(req.params.page)){
        page = page <= 0 ? 1: req.params.page;
    } else {
        page = 1;
    }

    const allCategories = await Category.find();
    const allBrands = await Brand.find();
    const allProducts =  await Product.find();

    category.allCategories = allCategories;

    category.allBrands = allBrands;

    category.products = allProducts.slice(perPage * (page - 1), perPage * page);
    category.current = page;
    category.pages = Math.ceil(allProducts.length / perPage)
    
    res.render("categories", category);
}

exports.cart =(req, res, next) => {
    res.render("cart");
}

exports.singleProduct =(req, res, next) => {
    res.render("single-product");
}

exports.checkout =(req, res, next) => {
    res.render("checkout");
}

//render trang chu
exports.getIndex = async(req, res, next) => {
    const bestSellers = await Product.find().sort({ hasSold: -1 }).limit(10).exec();
    const awesomeProducts = await Product.find().sort({ viewCount: -1 }).limit(10).exec();
    res.render("index", {
        awesomeProducts: awesomeProducts,
        bestSellers: bestSellers
    });
};

exports.getCategories = async(req, res, next) => {
    const bestSellers = await Product.find().sort({ hasSold: -1 }).limit(10).exec();
    const awesomeProducts = await Product.find().sort({ viewCount: -1 }).limit(10).exec();
    res.render("categories", {
        awesomeProducts: awesomeProducts,
        bestSellers: bestSellers
    });
};

exports.getProduct = async(req, res, next) => {
    const prodId = req.params.id;
    const product = await Product.findById({ _id: prodId });
    const bestSellers = await Product.find({status: true}).exec();
    return res.render("products", {
        product: product,
        bestSellers: bestSellers,
    });
};
