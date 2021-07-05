const jwt = require('jsonwebtoken');
const formidable = require("formidable");

module.exports = (req, res, next) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async (err, fields) => {
            const token = req.headers.authorization;
            if (token) {
                jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
                    if (err) {
                        res.redirect("/")
                    } else {
                            if (decoded.id != fields.user_id) {
                                return res.status(401).json({message: 'Cross requests não funcionam!'})
                            } else {
                                next();
                            }
                    }
                })
            } else {
                return res.status(401).json({message: 'Autenticação Falhada2'})
            }
        }) 
    } catch {
        return res.status(401).json(
            {message: 'Autenticação Falhada1'}
        )
    }}
