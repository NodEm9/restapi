const getUsers = 'SELECT * FROM userdbi';
const getUser = 'SELECT FROM userdbi WHERE id = $1';
const checkUserExist = 'SELECT s FROM userdbi s WHERE s.username = $1';
const addUser = 'INSERT INTO userdbi(username, pwd, matchPwd) VALUES ($1, $2, $3) RETURNING *';
const updateUser = 'UPDATE userdbi SET username = $1, pwd = $2, matchPwd = $3';
const deleteUser = 'DELETE FROM userdbi WHERE id = $1'

 
module.exports = {   
    getUsers,
    getUser,
    checkUserExist,
    addUser,
    updateUser,
    deleteUser
}