// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchAllUsers, deleteUser } from "../../service/productService";
// import ReactPaginate from "react-paginate";
// import { toast } from "react-toastify";
// // import ModalDelete from "./ModalDetele";
// import ModalUser from "./ModalUser";
// const Users = (props) => {
//   const [listUsers, setListUsers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentLimit, setCurrentLimit] = useState(3);
//   const [totalPages, setTotalPages] = useState(0);
//   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
//   const [isShowModalUser, setIsShowModalUser] = useState(false);

//   const [dataModal, setDataModal] = useState({});
//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage]);

//   const fetchUsers = async () => {
//     let response = await fetchAllUsers(currentPage, currentLimit);
//     if (response && response.data.EC === 0) {
//       setTotalPages(response.data.DT.totalPage);

//       setListUsers(response.data.DT.users);
//     }
//   };
//   const handlePageClick = async (event) => {
//     setCurrentPage(+event.selected + 1);
//   };
//   const handleClickDelete = async (user) => {
//     setDataModal(user);
//     setIsShowModalDelete(true);
//   };

//   const handleClose = () => {
//     setIsShowModalDelete(false);
//     setDataModal({});
//   };

//   const onHideModalClose = async () => {
//     setIsShowModalUser(false);
//     await fetchUsers(); // Load lại danh sách người dùng sau khi thêm mới
//   };

//   const handleConfirm = async () => {
//     let response = await deleteUser(dataModal);
//     if (response && +response.data.EC === 0) {
//       toast.success(response.data.EM);
//       await fetchUsers();
//       setIsShowModalDelete(false);
//     } else {
//       toast.error(response.data.EM);
//     }
//     await fetchUsers();
//     setIsShowModalDelete(false);
//   };

//   return (
//     <>
//       <div className="container">
//         <div className="manage-user-container">
//           <div className="user-header">
//             <div className="title">
//               <h3>Table users</h3>
//             </div>
//             <div className="action">
//               <button className="btn btn-success">Refresh</button>
//               <button
//                 className="btn btn-primary"
//                 onClick={() => {
//                   setIsShowModalUser(true);
//                 }}
//               >
//                 Add new user
//               </button>
//             </div>
//           </div>
//           <div className="user-body">
//             <table className="table table-hover table-bordered">
//               <thead>
//                 <tr>
//                   <th scope="col">No</th>
//                   <th scope="col">Id</th>
//                   <th scope="col">Email</th>
//                   <th scope="col">Username</th>
//                   <th scope="col">Group</th>
//                   <th scope="col">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {listUsers && listUsers.length > 0 ? (
//                   <>
//                     {listUsers.map((item, index) => {
//                       return (
//                         <tr key={`row-${index}`}>
//                           <td>{index + 1}</td>
//                           <td>{item.id}</td>
//                           <td>{item.email}</td>
//                           <td>{item.username}</td>
//                           <td>{item.Group ? item.Group.name : ""}</td>
//                           <td>
//                             <button className="btn btn-warning mx-3">
//                               Edit
//                             </button>
//                             <button
//                               className="btn btn-danger"
//                               onClick={() => handleClickDelete(item)}
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </>
//                 ) : (
//                   <>
//                     <tr>
//                       <td>Not found users</td>
//                     </tr>
//                   </>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalPages > 0 && (
//             <div className="user-footer">
//               <ReactPaginate
//                 nextLabel="next >"
//                 onPageChange={handlePageClick}
//                 pageRangeDisplayed={3}
//                 marginPagesDisplayed={2}
//                 pageCount={totalPages}
//                 previousLabel="< previous"
//                 pageClassName="page-item"
//                 pageLinkClassName="page-link"
//                 previousClassName="page-item"
//                 previousLinkClassName="page-link"
//                 nextClassName="page-item"
//                 nextLinkClassName="page-link"
//                 breakLabel="..."
//                 breakClassName="page-item"
//                 breakLinkClassName="page-link"
//                 containerClassName="pagination"
//                 activeClassName="active"
//                 renderOnZeroPageCount={null}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//       {/* <ModalDelete
//         show={isShowModalDelete}
//         handleClose={handleClose}
//         handleConfirm={handleConfirm}
//         dataModal={dataModal}
//       /> */}
//       <ModalUser
//         title="Create new user"
//         show={isShowModalUser}
//         onHide={onHideModalClose}
//       />
//     </>
//   );
// };

// export default Users;
