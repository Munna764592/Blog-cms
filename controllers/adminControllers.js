const Admin = require('../models/adminSchema')
const AddPage = require('../models/addpageModel')
const bcrypt = require('bcrypt')

const errorPage = async(req, res)=>{
    try {
        const pages = await AddPage.find();
        res.render('error.ejs', { pages: pages })

    } catch (error) {
        console.log(error.message)
    }
}

const login = async (req, res) => {
    try {
        const pages = await AddPage.find();
        res.render('adminlogin.ejs', { pages: pages })

    } catch (error) {
        console.log(error.message)
    }

}
const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }

}
const dashboard = async (req, res) => {
    try {
        const admin = await Admin.findOne({ "_id": req.session.is_admin });
        res.render('dashboard.ejs', { admin: admin })

    } catch (error) {
        console.log(error.message)
    }

}
const pages = async (req, res) => {
    try {
        const pages = await AddPage.find();
        const page = await AddPage.findOne({ "pagetitle": "Home" })
        res.render('pages.ejs', { page: page, pages: pages })
    } catch (error) {
        console.log(error.message)
    }
}

const addpage = async (req, res) => {
    try {
        const admin = await Admin.findOne({ "_id": req.session.is_admin });
        res.render('addpage.ejs', { admin: admin })
    } catch (error) {
        console.log(error.message)
    }
}
const savepage = async (req, res) => {
    try {
        let imagePath = '';
        if (req.file !== undefined) {
            imagePath = '/images' + '/' + req.file.filename;
        }

        let image = imagePath;
        // image = req.file ? req.file.path : '';

        const page = new AddPage({
            pagetitle: req.body.pagetitle,
            content: req.body.content,
            image: image
        })
        const admin = await Admin.findOne({ "_id": req.session.is_admin });

        const pageData = await page.save().then(() => res.render('addpage', { message: 'You have successfully created a new page!', admin: admin }))
            .catch(err => console.log(err));
    } catch (error) {
        console.log(error.message)
    }
}

const editpage = async (req, res) => {
    try {
        const admin = await Admin.findOne({ "_id": req.session.is_admin });
        const pages = await AddPage.find();
        res.render('editpage.ejs', { pages: pages, admin: admin })
    } catch (error) {
        console.log(error.message)
    }
}
const loadPage = async (req, res) => {
    try {
        const pages = await AddPage.find();

        const page = await AddPage.findOne({ "pagetitle": req.params.id })
        res.render('pages.ejs', { page: page, pages: pages })
    } catch (error) {
        console.log(error.message)
    }
}
const verifyLogin = async (req, res) => {
    try {
        const pages = await AddPage.find();


        const username = req.body.username;
        const password = req.body.password;

        const userData = await Admin.findOne({ username: username })
        if (userData) {
            if (userData.password === password) {
                req.session.is_admin = userData._id;
                res.redirect('/dashboard')
            } else {
                res.render('adminlogin.ejs', { message: "You are not authorized to login", pages: pages })
            }
        } else {
            res.render('adminlogin.ejs', { message: "You are not authorized to login", pages: pages })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const deletepage = async (req, res) => {
    try {
        const deletepage = await AddPage.deleteOne({ _id: req.body.id })
        const pages = await AddPage.find();

        if (deletepage) {
            try {
                res.status(200).send({ success: true, message: 'You have successfully deleted the page!' })
            } catch (error) {
                console.log('Error rendering template:', error);
            }
        }

    } catch (error) {
        res.status(400).send({ msg: error.message })
    }
}

const loadUpdatePage = async (req, res) => {
    try {
        const admin = await Admin.findOne({ "_id": req.session.is_admin });
        const pageData = await AddPage.findOne({ _id: req.params.id })
        res.render('updatepage.ejs', { page: pageData, admin: admin })
    } catch (error) {
        console.log(error)
    }
}

const UpdatePage = async (req, res) => {
    try {
        let imagePath = '';
        if (req.file !== undefined) {
            imagePath = '/images' + '/' + req.file.filename;
        }

        let image = imagePath;
        await AddPage.findByIdAndUpdate( req.body.id , {
            $set: {
                pagetitle: req.body.pagetitle,
                image: image,
                content: req.body.content
            }
          })
        const admin = await Admin.findOne({ "_id": req.session.is_admin });
        const pages = await AddPage.find();

        res.render('editpage.ejs', { message: 'Page updated successfully!', admin: admin,pages:pages })
    } catch (error) {
        console.log(error.message)
    }
}



module.exports = {
    login, addpage, pages, verifyLogin, dashboard, editpage, logout, savepage, loadPage, deletepage, loadUpdatePage, UpdatePage,errorPage
}