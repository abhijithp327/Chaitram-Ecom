import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        default: ""
    },

    mobile: {
        type: Number,
        default: null
    },


    refresh_token: {
        type: String,
        default: ""
    },

    verify_email: {
        type: Boolean,
        default: false
    },

    last_login_date: {
        type: Date,
        default: ""
    },

    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },

    address_details: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "address"
    }],

    shopping_cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart"
    }],

    order_history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "order"
    }],

    // forgot_password_otp: {
    //     type: String,
    //     default: null
    // },

    // forgot_password_expiry: {
    //     type: Date,
    //     default: ""
    // },

    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },

    reset_password_token: {
        type: String,
        default: null
    },

    reset_password_token_expires_at: {
        type: Date,
        default: null
    },

},
    {
        timestamps: true
    }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;