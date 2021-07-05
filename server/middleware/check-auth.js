const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization;
        if(token != null){
            jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err) => {
                if (err){
                    res.redirect("/")
                }else{
                    next();
                }
            })
        }else{
            return res.status(401).json({
                message: 'Autenticação Falhada'
            })
        }
    }catch{
        return res.status(401).json({
            message: 'Autenticação Falhada'
        })
    }
}