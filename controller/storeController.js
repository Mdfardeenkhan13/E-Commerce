const Shop = require("../model/shop");
const User = require("../model/user");

exports.getHome = (req, res, next) => {
    res.render('store/home', {pageTitle: 'Home', currentPage: 'home', isLoggedIn: req.isLoggedIn, user: req.session.user});
};

exports.getShop = (req, res, next) => {
    Shop.find().then(productDetails => {
        res.render('store/shop', {productDetails: productDetails, pageTitle: 'Shop', currentPage: 'shop', isLoggedIn: req.isLoggedIn, user: req.session.user});
    })
    
};

exports.getAbout = (req, res, next) => {
    res.render('store/about', {pageTitle: 'About', currentPage: 'about', isLoggedIn: req.isLoggedIn, user: req.session.user});
};

exports.getBlog = (req, res, next) => {
    res.render('store/blog', {pageTitle: 'Blog', currentPage: 'blog', isLoggedIn: req.isLoggedIn, user: req.session.user});
};

exports.getContact = (req, res, next) => {
    res.render('store/contact', {pageTitle: 'Contact', currentPage: 'contact', isLoggedIn: req.isLoggedIn, user: req.session.user}); 
};

exports.getCart = async  (req, res, next) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('cart');
    res.render('store/cart-list', {cartItems: user.cart, pageTitle: 'cart', currentPage: 'cart', isLoggedIn: req.isLoggedIn, user: req.session.user});
}   


exports.postAddToCart = async (req, res, next) => {
    const shopId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user.cart.includes(shopId)) {
        user.cart.push(shopId);
        await user.save();
    }
    res.redirect('/cart')
}

exports.postRemoveFromCart = async (req, res, next) => {
    const shopId = req.params.shopId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (user.cart.includes(shopId)) {
        user.cart = user.cart.filter(cart => cart != shopId)
        await user.save();
    }
    res.redirect('/cart')
}