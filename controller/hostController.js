const Shop = require("../model/shop");

exports.getHostShop = (req, res, next) => {
    Shop.find().then(productDetails => {
        res.render('host/host-shop', { productDetails: productDetails, pageTitle: 'Host-Shop', currentPage: 'host-shop', isLoggedIn: req.isLoggedIn, user: req.session.user });
    })
};

exports.getEditShop = (req, res, next) => {
    const shopId = req.params.shopId;
    const editing = req.query.editing === 'true';

    Shop.findById(shopId).then(shop => {
        if (!shop) {
            console.log("shop not found for editing")
            return res.render('/host/host-shop')
        }
        console.log(shopId, editing, shop)
        res.render('host/edit-shop', { shop: shop, pageTitle: 'Edit', editing: editing, currentPage: 'host-shop', isLoggedIn: req.isLoggedIn, user: req.session.user })
    })
}

exports.getAddShop = (req, res, next) => {
    res.render('host/edit-shop', { pageTitle: 'Add-Shop', editing: false, currentPage: 'add-shop', isLoggedIn: req.isLoggedIn, user: req.session.user });
};

exports.postAddShop = (req, res, next) => {
    const { productName, gender, price, productPhoto, description } = req.body;
    const shop = new Shop({ productName, gender, price, productPhoto, description })
    shop.save().then(() => {
        console.log('shop saved successfully')
    })
    res.redirect('/host/host-shop')
};

exports.postEditShop = (req, res, next) => {
    const { id, productName, gender, price, productPhoto, description } = req.body;
    Shop.findById(id).then((shop) => {
        if (!shop) {
            console.log("Shop not found for editing");
            res.redirect('/host/host-shop')
        }
        shop.productName = productName;
        shop.gender = gender;
        shop.price = price;
        shop.productPhoto = productPhoto;
        shop.description = description;
        shop.save().then(result => {
            console.log('Shop updated', result)
        }).catch(error => {
            console.log('Error while updating:', error)
        })
        res.redirect('/host/host-shop')
    }).catch(err => {
        console.log('Error while finding shop', err)
    })
}

exports.postDeleteShop = (req, res, next) => {
    const shopId = req.params.shopId;
    console.log('came to delete', shopId);
    Shop.findByIdAndDelete(shopId).then(() => {
        res.redirect('/host/host-shop');
    }).catch(error => {
        console.log("Error while deleting", error)
    })
}