import cartService from "../service/cartService";
const readFunc = async (req, res) => {
    const { userId } = req.params;

    try {
        // console.log("check req.user: ", req.user);
        // if (req.user.userId != userId) {
        //     return res.status(403).json({
        //         EM: "You do not have permission to view this cart",
        //         EC: -1,
        //         DT: "",
        //     });
        // }

        let data = await cartService.getUserCartById(userId);
        console.log("check data: ", data);
        return res.status(200).json({
            EM: "Get cart successfully",
            EC: 0,
            DT: data,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error read cart", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};

const addFunc = async (req, res) => {
    try {
        let cartItem = req.body;

        let data = await cartService.addProductToCart(cartItem);
        if (data) {
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, //error code
                DT: data.DT, // Date
            });
        } else {
            return res.status(500).json({
                EM: "fail add to cart", // error message
                EC: "2", //error code
                DT: "", // Date
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: "error add to cart", // error message
            EC: "-1", //error code
            DT: "", // Date
        });
    }
};

module.exports = { readFunc, addFunc };
