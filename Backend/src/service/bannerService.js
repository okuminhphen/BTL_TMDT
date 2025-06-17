import db from "../models/index.js";

const getAllBanner = async () => {
    try {
        let data = await db.Banner.findAll();

        if (!data || data.length === 0) {
            return {
                EM: "No active banners found",
                EC: 2,
                DT: [],
            };
        }

        return {
            EM: "Get active banners successfully",
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.error("Error while fetching active banners:", error);
        return {
            EM: "Something went wrong while fetching banners",
            EC: 1,
            DT: [],
        };
    }
};
const getAllActiveBanner = async () => {
    try {
        let data = await db.Banner.findAll({ where: { status: "active" } });

        if (!data || data.length === 0) {
            return {
                EM: "No active banners found",
                EC: 2,
                DT: [],
            };
        }

        return {
            EM: "Get active banners successfully",
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.error("Error while fetching active banners:", error);
        return {
            EM: "Something went wrong while fetching banners",
            EC: 1,
            DT: [],
        };
    }
};
const createBanner = async (bannerData) => {
    try {
        let data = await db.Banner.create(bannerData);

        if (!data) {
            return {
                EM: "create banner fail",
                EC: 2,
                DT: [],
            };
        }
        return {
            EM: "create banner successful",
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.error("Lỗi khi tạo banner:", error);
        return {
            EM: "Lỗi khi tạo banner",
            EC: 1,
            DT: [],
        };
    }
};
const updateBanner = async (id, bannerData) => {
    try {
        let banner = await db.Banner.findByPk(id);

        if (!banner) {
            return {
                EM: "Banner không tồn tại",
                EC: 2,
                DT: [],
            };
        }

        await banner.update(bannerData);

        return {
            EM: "Cập nhật banner thành công",
            EC: 0,
            DT: banner,
        };
    } catch (error) {
        console.error("Lỗi khi cập nhật banner:", error);
        return {
            EM: "Lỗi khi cập nhật banner",
            EC: 1,
            DT: [],
        };
    }
};
const deleteBanner = async (id) => {
    try {
        console.log(id);
        let banner = await db.Banner.findByPk(id);

        if (!banner) {
            return {
                EM: "Banner không tồn tại",
                EC: 2,
                DT: [],
            };
        }

        await banner.destroy();

        return {
            EM: "Xóa banner thành công",
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.error("Lỗi khi xóa banner:", error);
        return {
            EM: "Lỗi khi xóa banner",
            EC: 1,
            DT: [],
        };
    }
};
export default {
    getAllBanner,
    createBanner,
    updateBanner,
    deleteBanner,
    getAllActiveBanner,
};
