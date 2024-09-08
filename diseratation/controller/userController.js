const { User } = require("../models/user");



const register = async(details)=>{
    console.log(details)
    console.log('---------------------------------------------')
    const newUser = new User({
        username: details.username,
        password: details.password, // Remember to hash the password before saving
        email: details.email
      });
      
      newUser.save()
        .then(user => console.log('User created:', user))
        .catch(err => console.error('Error creating user:', err));

        return true;
}

const login = async(body)=>{
    try {
        // Find the user by username and password
        const user = await User.findOne({ username: body.username, password: body.password });
    
        if (!user) {
          return []
        }
    
        // User is found and credentials are correct
        return user;
      } catch (err) {
        throw err;
      }
}

module.exports ={
    register,
    login
}