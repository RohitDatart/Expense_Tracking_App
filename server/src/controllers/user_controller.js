const User = require("../models/user_model");
const Transaction = require("../models/trancation_model")

const create_user = async (req, res) => {
    try {
        const data = req.body;
        if(!data){
            return res.send({status:false, message: "please enter required data"})
        }

        const new_user = await User.create(data);

        if(!new_user){
           return res.send({status:false, message: "failed to create new user"})
        }
        return res.status(200).send({status:true, message: "User Profile Created Successfully"})

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const getUser = async (req, res) => {
  try {
    const userId = req.params.userId; // extract value

    if (!userId) {
      return res.status(400).json({ success: false, message: "UserId is required" });
    }

    // Find user and exclude password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Logged-in user
    console.log(userId);
    
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ status: false, message: "Please provide data to update" });
    }

    // Prevent updating password here; handle separately
    delete data.password;

    const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({ status: true, message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Optional: Delete all transactions associated with this user
    await Transaction.deleteMany({ user: userId });

    // Delete user
    await user.deleteOne();

    return res.status(200).json({ status: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { user_name, password } = req.body; // declare here

    if (!user_name)
      return res
        .status(400)
        .send({ status: false, message: "Username is required" });
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });

    const user = await User.findOne({
      user_name,
      password,
    }).select("-password -transactions");

    if (!user) {
      return res.status(404).send({
        status: false,
        message: "Username or password is incorrect for deliveryboy",
      });
    }

    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {create_user, getUser, updateUser, deleteUser, userLogin}