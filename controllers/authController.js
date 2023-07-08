const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    console.log(`cookie avialable at login: ${JSON.parse(JSON.stringify(cookies))}`);
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });

    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) return res.sendStatus(401) // Unauthorized
    // evaluated password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        //Create JWT
        const accessToken = jwt.sign(
            {
                'UserInfo': {
                    'username': foundUser.username,
                    'roles': roles
                }

            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m' }
        ); 

        const newRefreshToken = jwt.sign(
            { 'username': foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Changed to let keyword
        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            if (!foundToken) {
                console.log('attempted refresh token resue at login')
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }
            res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
        }

        //Saving refresh token with current user     
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);
        console.log(roles)

        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });// secure: true is reomved for testing pupose

        // send authorization roles and access token to user
        res.json({ accessToken });

    } else {
        res.sendStatus(401)
    }
};

module.exports = { handleLogin }

