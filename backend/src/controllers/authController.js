const User = require('./../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie');




// ================ SEND-OTP For Email Verification ================



exports.signup = async (req, res) => {
    try {
        // extract data 
        const { username, email, password,confirmPassword, 
            role} = req.body;

        // validation
        if (!username || !email || !password || !confirmPassword || !role  ) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required..!'
            });
        }
        // 
//
        // Validate Gmail format
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Only Gmail addresses are allowed for registration'
            });
        }

        // check both pass matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                messgae: 'passowrd & confirm password does not match, Please try again..!'
            });
        }

        // check user have registered already
        const checkUserAlreadyExits = await User.findOne({ email });

        // if yes ,then say to login
        if (checkUserAlreadyExits) {
            return res.status(400).json({
                success: false,
                message: 'User registered already, go to Login Page'
            });
        }

        // find most recent otp stored for user in DB
        
        
        // if otp not found
       

        // hash - secure passoword
        let hashedPassword = await bcrypt.hash(password, 10);

        
        
       

        // create entry in DB
        const userData = await User.create({
            username, email, password: hashedPassword, 
            role: role,
            
        });

        // return success message
        res.status(200).json({
            success: true,
            message: 'User Registered Successfully'
        });
    }
    catch (error) {
        console.log('Error while registering user (signup)');
        console.log(error)
        res.status(401).json({
            success: false,
            error: error.message,
            messgae: 'User cannot be registered , Please try again..!'
        })
    }
}

// ================ LOGIN ================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // check user is registered and saved data in DB
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'You are not registered with us'
            });
        }


        // comapare given password and saved password from DB
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role // This will help to check whether user have access to route, while authorzation
            };

            // Generate token 
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined; // we have remove password from object, not DB


            // cookie
            const cookieOptions = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                httpOnly: true
            }

            res.cookie('token', token, cookieOptions).status(200).json({
                success: true,
                user,
                token,
                message: 'User logged in successfully'
            });
        }
        // password not match
        else {
            return res.status(401).json({
                success: false,
                message: 'Password not matched'
            });
        }
    }

    catch (error) {
        console.log('Error while Login user');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while Login user'
        })
    }
}


// ================ CHANGE PASSWORD ================
exports.changePassword = async (req, res) => {
    try {
        // extract data
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'All fileds are required'
            });
        }

        // get user
        const userDetails = await User.findById(req.user.id);

        // validate old passowrd entered correct or not
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )

        // if old password not match 
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false, message: "Old password is Incorrect"
            });
        }

        // check both passwords are matched
        if (newPassword !== confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'The password and confirm password do not match'
            })
        }


        // hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update in DB
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
            { password: hashedPassword },
            { new: true });


        // send email
        // try {
        //     const emailResponse = await mailSender(
        //         updatedUserDetails.email,
        //         'Password for your account has been updated',
        //         passwordUpdated(
        //             updatedUserDetails.email,
        //             `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        //         )
        //     );
        //     // console.log("Email sent successfully:", emailResponse);
        // }
        // catch (error) {
        //     console.error("Error occurred while sending email:", error);
        //     return res.status(500).json({
        //         success: false,
        //         message: "Error occurred while sending email",
        //         error: error.message,
        //     });
        // }


        // return success response
        res.status(200).json({
            success: true,
            mesage: 'Password changed successfully'
        });
    }

    catch (error) {
        console.log('Error while changing passowrd');
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while changing passowrd'
        })
    }
}

// controllers/user/getAllUsers.js


exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users with their profiles
    const users = await User.find({})
      .select('-password -refreshToken') // Exclude sensitive fields
       // Convert to plain JavaScript object

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found"
      })
    }

    // Format the response data
    const formattedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      
    }))

    return res.status(200).json({
      success: true,
      data: formattedUsers
    })

  } catch (error) {
    console.error("Error fetching users:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    })
  }
}