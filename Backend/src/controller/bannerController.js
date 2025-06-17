import bannerService from "../service/bannerService.js";
const getActiveBanner = async (req, res) => {
    let data = await bannerService.getAllBanner();

    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    });
};
const getRealActiveBanner = async (req, res) => {
    let data = await bannerService.getAllActiveBanner();
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    });
};

const handleUpdateBanner = async (req, res) => {
    let id = req.params.bannerId;
    let reqData = req.body;
    let data = await bannerService.updateBanner(id, reqData);
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    });
};
const handleCreateBanner = async (req, res) => {
    let reqData = req.body;
    let data = await bannerService.createBanner(reqData);
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    });
};

const handleDeleteBanner = async (req, res) => {
    let id = req.params.bannerId;
    let data = await bannerService.deleteBanner(id);
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
    });
};

export default {
    getActiveBanner,
    handleUpdateBanner,
    handleCreateBanner,
    handleDeleteBanner,
    getRealActiveBanner,
};
