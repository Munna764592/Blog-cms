const express = require("express")
const bodyParser = require('body-parser');
const dotenv = require("dotenv")
const adminController = require('../controllers/adminControllers')
const session = require('express-session')

const routes = express();
dotenv.config();

routes.use(bodyParser.json())
routes.use(bodyParser.urlencoded({ extended: false }))
routes.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, cookie: {
        secure: false,
        maxAge: 86400000
    }
}));

routes.use(express.urlencoded({ extended: false }));
routes.use(express.json());
routes.set('view engine', 'ejs')
routes.set('views', './views')

const multer = require('multer');
const path = require('path');
routes.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}))


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))

    },
    filename: function (req, file, cb) {
        const name = Date.now() + '_' + file.originalname
        cb(null, name)
    }
})


const upload = multer({ storage: storage })

const adminLoginAuth = require('../middlewares/adminLoginAuth')

routes.post('/admin', adminController.verifyLogin)
routes.post('/addpage', upload.single('image'), adminController.savepage)
routes.post('/deletepage', adminLoginAuth.isLogin, adminController.deletepage)
routes.post('/updatepage', upload.single('image'), adminController.UpdatePage)

routes.get('/', adminController.pages)
routes.get('/admin', adminLoginAuth.isLogout, adminController.login)
routes.get('/addpage', adminLoginAuth.isLogin, adminController.addpage)
routes.get('/editpage', adminLoginAuth.isLogin, adminController.editpage)
routes.get('/dashboard', adminLoginAuth.isLogin, adminController.dashboard)
routes.get('/logout', adminLoginAuth.isLogin, adminController.logout)

routes.get('/page/:id', adminController.loadPage)
routes.get('/updatepage/:id', adminLoginAuth.isLogin, adminController.loadUpdatePage)
routes.get('*', adminController.errorPage)


module.exports = routes;