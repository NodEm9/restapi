const User = require('../model/User');
const jwt = require('jsonwebtoken');    


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();
    
    // detected refresh token resue!
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403) // Forbidden
                console.log('attempted refresh token reuse!')
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
                console.log(result)
            }
        )

        return res.sendStatus(403) // Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluated password
    jwt.verify(        
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                console.log('expired refresh token');           
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result)
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'username': decoded.username,
                        'roles': roles
                    }
                 },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '20m' }
            );

            const newRefreshToken = jwt.sign(
                { 'username': foundUser.username },   
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
            const result = foundUser.save();
            res.cookie({ httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
            
            res.json({ accessToken });
        }
    )
         
};

module.exports = { handleRefreshToken }