const fs = require('fs');
const pool = require("../database/db");
const queries = require('./queries');
const { STATUS_CODES } = require('http');

const getUsers = (req, res) => {
    pool.query(queries.getUsers, (error, results) => {
        if (error) throw error
        res.status(200).json(results.rows)
        console.log(results.rows)
    })
};

const createUser = (req, res) => {   
    const { username, pwd, matchPwd } = req.body;
    //Check if user already exist
    pool.query(queries.checkUserExist, [username], (error, results) => {
        if (results.rows.length) {
            res.end('User already exist');
        } 
            
            pool.query(queries.addUser,
                [username, pwd, matchPwd],
                (error, results) => {
                    console.log(results) 
                    if (error) throw error
                    res.status(201).send(["User added successfully", results.rows])
                });
        
    });   
};   

module.exports = {
    getUsers,
    createUser
}