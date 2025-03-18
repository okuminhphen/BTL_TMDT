import userApiService from "../service/userApiService";

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      console.log(`page= ${page} and limit= ${limit}`);
      let data = await userApiService.getUsersWithPagination(+page, +limit);
      return res.status(200).json({
        EM: data.EM, // error message
        EC: data.EC, //error code
        DT: data.DT, // Date
      });
    } else {
      let data = await userApiService.getAllUsers();
      return res.status(200).json({
        EM: data.EM, // error message
        EC: data.EC, //error code
        DT: data.DT, // Data
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error", // error message
      EC: "-1", //error code
      DT: "", // Date
    });
  }
};
const createFunc = async (req, res) => {
  try {
    let data = userApiService.createNewUser(req.body);

    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, // Data
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error", // error message
      EC: "-1", //error code
      DT: "", // Data
    });
  }
};
const updateFunc = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error", // error message
      EC: "-1", //error code
      DT: "", // Date
    });
  }
};
const deleteFunc = async (req, res) => {
  try {
    let data = await userApiService.deleteUser(req.body.id);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, // Data
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error", // error message
      EC: "-1", //error code
      DT: "", // Date
    });
  }
};

module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
};
