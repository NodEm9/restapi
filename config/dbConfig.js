const mongoose = require('mongoose');

const main = async () => {
    try {       
        await mongoose.connect(process.env.DATABASE_URI, {
                useUnifiedTopology: true,
                useNewUrlParser: true  
            });
    } catch (error) {   
        
        console.log(error); 
    }
}

main().catch(err => console.log(err));

module.exports = main