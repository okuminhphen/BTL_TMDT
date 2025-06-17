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
import {
  Container,
  Card,
  Button,
  Table,
  Badge,
  InputGroup,
  Form,
  Accordion,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "./Products.scss";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Products = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleCreate = async (productData) => {
    try {
      let response = await createNewProduct(productData);
      if (response.data.EC === 0) {
        toast.success(response.data.EM);
        dispatch(fetchProducts());
      } else {
        toast.error(response.data.EM);
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error("Có lỗi xảy ra khi tạo sản phẩm.");
    }
  };

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

  const filteredProducts =
    products?.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <>
      <Container className="products-container py-5">
        <Card>
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Quản lý sản phẩm</h3>
            <Button variant="light" onClick={() => setIsShowCreateModal(true)}>
              <FaPlus className="me-2" />
              Thêm sản phẩm
            </Button>
          </Card.Header>
          <Card.Body>
            {/* Thanh tìm kiếm */}
            <div className="mb-4">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo tên hoặc danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </InputGroup>
            </div>

            {/* Bảng sản phẩm */}
            <div className="table-responsive">
              <Table hover striped className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Tên sản phẩm</th>
                    <th>Hình ảnh</th>
                    <th>Danh mục</th>
                    <th>Tồn kho</th>
                    <th>Giá</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const images = getProductImages(product.images);
                      const parsedDescription = JSON.parse(product.description); // Parse lại description

                      // Kiểm tra parsedDescription có phải là mảng không
                      if (Array.isArray(parsedDescription)) {
                        return (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                              <div className="product-name">{product.name}</div>
                              <div className="product-details mt-2">
                                <Accordion>
                                  {parsedDescription.map((descItem, index) => (
                                    <Accordion.Item
                                      key={index}
                                      eventKey={index.toString()}
                                    >
                                      <Accordion.Header>
                                        {descItem.title}
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        <div
                                          className="description-content"
                                          style={{
                                            whiteSpace: "pre-wrap",
                                            backgroundColor: "#f8f9fa",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #dee2e6",
                                            minHeight: "100px",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                          }}
                                        >
                                          {descItem.content}
                                        </div>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  ))}
                                </Accordion>
                              </div>
                            </td>
                            <td>
                              <div className="product-images">
                                {images.length > 0 ? (
                                  images.map((image, index) => (
                                    <img
                                      key={index}
                                      src={`http://localhost:8080${image}`}
                                      alt={`Ảnh sản phẩm ${index + 1}`}
                                      className="product-thumbnail"
                                    />
                                  ))
                                ) : (
                                  <span className="text-muted">
                                    Không có ảnh
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <Badge bg="info">
                                {product.Category?.name || "Không có danh mục"}
                              </Badge>
                            </td>
                            <td>
                              <div className="stock-info">
                                {product.sizes.map((size) => (
                                  <div key={size.id} className="stock-item">
                                    <Badge bg="secondary" className="me-2">
                                      {size.name}
                                    </Badge>
                                    <span>{size.ProductSize.stock}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="price">
                                {product.price.toLocaleString()} VND
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleOnClickEdit(product)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleOnClickDelete(product.id)
                                  }
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      } else {
                        // Nếu parsedDescription không phải là mảng, bạn có thể hiển thị thông báo lỗi hoặc làm gì đó phù hợp
                        return (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                              <div className="product-name">{product.name}</div>
                              <div className="product-details mt-2">
                                <span>Không có mô tả hợp lệ</span>
                              </div>
                            </td>
                            <td>
                              <div className="product-images">
                                {images.length > 0 ? (
                                  images.map((image, index) => (
                                    <img
                                      key={index}
                                      src={`http://localhost:8080${image}`}
                                      alt={`Ảnh sản phẩm ${index + 1}`}
                                      className="product-thumbnail"
                                    />
                                  ))
                                ) : (
                                  <span className="text-muted">
                                    Không có ảnh
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <Badge bg="info">
                                {product.Category?.name || "Không có danh mục"}
                              </Badge>
                            </td>
                            <td>
                              <div className="stock-info">
                                {product.sizes.map((size) => (
                                  <div key={size.id} className="stock-item">
                                    <Badge bg="secondary" className="me-2">
                                      {size.name}
                                    </Badge>
                                    <span>{size.ProductSize.stock}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="price">
                                {product.price.toLocaleString()} VND
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleOnClickEdit(product)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleOnClickDelete(product.id)
                                  }
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Không tìm thấy sản phẩm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

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
      </Container>
    </>
  );
};

export default Products;
