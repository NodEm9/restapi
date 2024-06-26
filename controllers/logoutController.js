const User = require('../model/User');


const handleLogout = async (req, res) => {
    // On client also delete access token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
   
    // This check if refreshToken is in the db
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    } 

    // Delete refresh token from DB
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save();
    console.log(result)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true  });
    res.sendStatus(204);
};

module.exports = { handleLogout }