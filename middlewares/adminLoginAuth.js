const isLogin = async (req, res, next) => {
    try {
        if (req.session.is_admin) {

        } else {
            res.redirect('/admin')
        }

        next()
    } catch (error) {
        console.log(error.message)
    }
}
const isLogout = async (req, res, next) => {
    try {
        if (req.session.is_admin) {

            res.redirect('/dashboard')
        } else {
        }

        next()
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    isLogin, isLogout
}