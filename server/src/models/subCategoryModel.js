import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({

    name: {
        type: String
    },

    image: {
        type: String
    },

    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'category'
    },

},
    {
        timestamps: true
    }
);

const SubCategoryModel = mongoose.model("subcategory", subCategorySchema);

export default SubCategoryModel;