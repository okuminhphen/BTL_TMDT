import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalCreate from "./ModalCreate";
import ModalDelete from "./ModalDelete";
import ModalEdit from "./ModalEdit";
import { toast } from "react-toastify";
import {
  createNewProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../service/productService";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
const Products = () => {
  //read product
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.product);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);
  //modal create
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  //modal delete
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState("");
  //modal edit
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [selectedProductToEdit, setSelectedProductEdit] = useState({});
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (productData) => {
    try {
      let response = await createNewProduct(productData);
      if (response.data.EC === 0) {
        toast.success(response.data.EM);
        dispatch(fetchProducts()); // Cập nhật danh sách sản phẩm
      } else {
        toast.error(response.data.EM);
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error("Có lỗi xảy ra khi tạo sản phẩm.");
    }
  };

  // handle delete
  const handleOnClickDelete = (productId) => {
    setIsShowDeleteModal(true);
    setSelectedProductToDelete(productId);
  };
  const handleDelete = async () => {
    if (!selectedProductToDelete) {
      return;
    }
    try {
      let response = await deleteProduct(selectedProductToDelete);
      if (response && response.data.EC === 0) {
        toast.success(response.data.EM);
      } else {
        toast.error(response.data.EM);
      }
      setSelectedProductToDelete("");
      dispatch(fetchProducts());
      setIsShowDeleteModal(false);
    } catch (e) {
      console.log(e);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  // handle edit
  const handleEdit = async (productData) => {
    try {
      if (productData) {
        let response = await updateProduct(productData);
        if (response && response.data.EC === 0) {
          toast.success(response.data.EM);
          setIsShowEditModal(false);
          setSelectedProductEdit({});
          dispatch(fetchProducts());
        } else {
          toast.error(response.data.EM);
        }
      }
    } catch (e) {}
  };
  const handleOnClickEdit = (product) => {
    console.log(product);
    setIsShowEditModal(true);
    setSelectedProductEdit(product);
  };

  const getProductImages = (images) => {
    if (!images) return [];
    let parsedImages = [];

    try {
      parsedImages = JSON.parse(images);
      if (typeof parsedImages === "string") {
        parsedImages = JSON.parse(parsedImages);
      }
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
      return [];
    }

    return Array.isArray(parsedImages) ? parsedImages : [];
  };
  return (
    <>
      <div className="container mt-5">
        <h2 className="mb-4">Danh sách sản phẩm</h2>

        {/* Nút tạo sản phẩm */}
        <button
          className="btn btn-primary mb-3"
          onClick={() => setIsShowCreateModal(true)}
        >
          Tạo sản phẩm
        </button>

        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>name</th>
              <th>picture</th>
              <th>category</th>
              <th>stock</th>
              <th>description</th>
              <th>price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const images = getProductImages(product.images);

              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    {images.length > 0 ? (
                      images.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:8080${image}`}
                          alt={`Ảnh sản phẩm ${index + 1}`}
                          width="100"
                          className="me-2"
                        />
                      ))
                    ) : (
                      <span>Không có ảnh</span>
                    )}
                  </td>
                  <td>{product.Category?.name || "Không có danh mục"}</td>
                  <td>
                    {product.sizes.map((size) => (
                      <div key={size.id}>
                        {size.name} : {size.ProductSize.stock}
                      </div>
                    ))}
                  </td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        handleOnClickEdit(product);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleOnClickDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ModalCreate
        show={isShowCreateModal}
        handleClose={() => {
          setIsShowCreateModal(false);
          fetchProducts();
        }}
        handleCreate={handleCreate}
      />
      <ModalEdit
        show={isShowEditModal}
        handleClose={() => {
          setIsShowEditModal(false);
          fetchProducts();
        }}
        handleEdit={handleEdit}
        product={selectedProductToEdit}
      />
      <ModalDelete
        show={isShowDeleteModal}
        onHide={() => {
          setIsShowDeleteModal(false);
          fetchProducts();
        }}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default Products;
