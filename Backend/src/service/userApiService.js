// import db from "../models/index";

// const getAllUsers = async () => {
//   try {
//     let data = await db.User.findAll({
//       attributes: ["id", "username", "email", "phone", "sex"],
//       include: { model: db.Group, attributes: ["name", "description"] },
//       nest: true,
//     });
//     if (data) {
//       return {
//         EM: "get data success",
//         EC: 0,
//         DT: data,
//       };
//     } else {
//       return {
//         EM: "get data success",
//         EC: 0,
//         DT: [],
//       };
//     }
//   } catch (e) {
//     console.log(e);
//     return {
//       EM: "something wrongs with service",
//       EC: "1",
//       DT: [],
//     };
//   }
// };
// const getUsersWithPagination = async (page, limit) => {
//   try {
//     let offset = (page - 1) * limit;
//     const { count, rows } = await db.User.findAndCountAll({
//       attributes: ["id", "username", "email", "phone", "sex"],
//       include: { model: db.Group, attributes: ["name", "description"] },
//       offset: offset,
//       limit: limit,
//     });
//     let totalPages = Math.ceil(count / limit);
//     let data = { totalRows: count, totalPage: totalPages, users: rows };

//     if (data) {
//       return {
//         EM: "get data success",
//         EC: 0,
//         DT: data,
//       };
//     } else {
//       return {
//         EM: "get data success",
//         EC: 0,
//         DT: [],
//       };
//     }
//   } catch (e) {
//     console.log(e);
//     return {
//       EM: "something wrongs with service",
//       EC: "1",
//       DT: [],
//     };
//   }
// };

// const createNewUser = async (data) => {
//   try {
//     await db.User.create(data);
//     return {
//       EM: "create new user success",
//       EC: 0,
//       DT: data,
//     };
//   } catch (e) {
//     console.log(e);
//     return {
//       EM: "failed to create user",
//       EC: 1,
//       DT: [],
//     };
//   }
// };
// const updateUser = async (data) => {
//   try {
//     let user = await db.User.findOne({ where: { id: data.id } });
//     if (user) {
//       user.update();
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
// const deleteUser = async (id) => {
//   try {
//     let user = await db.User.findOne({ where: { id: id } });
//     if (user) {
//       await user.destroy();
//       return {
//         EM: "delete user data success",
//         EC: 0,
//         DT: user,
//       };
//     } else {
//       return {
//         EM: "user is not exist",
//         EC: 2,
//         DT: [],
//       };
//     }
//   } catch (e) {
//     console.log(e);
//     return {
//       EM: "something wrongs with service",
//       EC: 1,
//       DT: [],
//     };
//   }
// };

// module.exports = {
//   getAllUsers,
//   getUsersWithPagination,
//   createNewUser,
//   updateUser,
//   deleteUser,
// };
