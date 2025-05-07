import db from "../models/index.js";

const addReview = async (reviewData) => {
    try {
        const review = await db.Review.create(reviewData);
        return {
            EM: "Add review successfully",
            EC: 200,
            DT: review,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: error.message,
            EC: -1,
            DT: [],
        };
    }
};

const getReviewsByProductId = async (productId) => {
    try {
        const reviews = await db.Review.findAll({ where: { productId } });
        return {
            EM: "Get reviews by product id successfully",
            EC: 200,
            DT: reviews,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: error.message,
            EC: -1,
            DT: [],
        };
    }
};

export default { addReview, getReviewsByProductId };
