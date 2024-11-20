import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({

    address_line: {
        type: String
    },

    city: {
        type: String
    },

    state: {
        type: String
    },

    pincode: {
        type: String
    },

    country: {
        type: String
    },

    mobile: {
        type: String
    },

    status: {
        type: Boolean,
        default: true
    }

},
    {
        timestamps: true
    }
);

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;