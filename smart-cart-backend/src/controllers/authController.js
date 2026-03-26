const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "smartcart_jwt_secret_2026";

const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, phone: user.phone },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const register = async (req, res, next) => {
    try {
        const { phone, password, name } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ error: "Phone and password are required" });
        }

        if (phone.length < 10) {
            return res.status(400).json({ error: "Phone number must be at least 10 digits" });
        }

        if (password.length < 4) {
            return res.status(400).json({ error: "Password must be at least 4 characters" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ error: "User with this phone number already exists" });
        }

        const user = new User({ phone, password, name: name || "" });
        await user.save();

        const token = generateToken(user);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ error: "Phone and password are required" });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({ error: "Invalid phone number or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid phone number or password" });
        }

        const token = generateToken(user);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                phone: user.phone,
                name: user.name
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, JWT_SECRET };
