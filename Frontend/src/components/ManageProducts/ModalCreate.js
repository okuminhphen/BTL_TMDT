import { Button, Form, Modal, Row, Col } from "react-bootstrap";

import { useEffect, useState } from "react";
import {
  fetchSizes,
  fetchCategory,
  uploadImages,
} from "../../service/productService";
import _ from "lodash";
import { toast } from "react-toastify";
const ModalCreate = (props) => {
  const defaultProductValue = {
    name: "",
    images: "",
    categoryId: "",
    sizes: [],
    description: "",
    price: 0,
  };
  const [product, setProduct] = useState(defaultProductValue);
  const [sizes, setSizes] = useState([]); // id , name , stock
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchAllSizes();
    fetchAllCategory();
  }, []);

  const fetchAllSizes = async () => {
    try {
      const response = await fetchSizes();
      if (response && response.data.EC === 0) {
        const sizesData = response.data.DT.map((size) => ({
          ...size,
          stock: 0, // Mặc định
        }));
        setSizes(sizesData);
      }
    } catch (error) {
      console.error("Lỗi khi lấy size:", error);
    }
  };
  const fetchAllCategory = async () => {
    try {
      const response = await fetchCategory();
      if (response && response.data.EC === 0) {
        setCategories(response.data.DT);
      }
    } catch (error) {
      console.error("Lỗi khi lấy category:", error);
    }
  };
  const handleStockChange = (sizeId, value) => {
    const updatedSizes = sizes.map((size) =>
      size.id === sizeId ? { ...size, stock: Number(value) } : size
    );

    setSizes(updatedSizes);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages((prevImages) => [...prevImages, ...files]); // Thêm ảnh mới vào danh sách
    setPreviews((prevPreviews) => [
      ...prevPreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };
  const handleUploadImages = async () => {
    if (_.isEmpty(images)) return []; // Trả về mảng rỗng nếu không có ảnh

    try {
      let formData = new FormData();
      images.forEach((file) => formData.append("images", file));
      let response = await uploadImages(formData);
      console.log("images from res:", response.data.DT);
      return response.data.DT; // Trả về danh sách URL ảnh
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      toast.error("Không thể upload ảnh.");
      return [];
    }
  };

  const handleSubmit = async () => {
    // 1️⃣ Kiểm tra số lượng size hợp lệ
    const selectedSizes = _.filter(sizes, (size) => size.stock > 0);
    if (_.isEmpty(selectedSizes)) {
      toast.error("Vui lòng nhập số lượng cho ít nhất một size!");
      return;
    }
    // 2️⃣ Upload ảnh lên server
    let imageUrls = await handleUploadImages();
    console.log(">>>url: ", imageUrls);
    // 3️⃣ Gửi API tạo sản phẩm
    let productData = {
      name: product.name,
      price: Number(product.price),
      categoryId: selectedCategory,
      description: product.description,
      sizes: selectedSizes,
      images: imageUrls, // Dùng URL ảnh từ API upload
    };

    try {
      let response = await props.handleCreate(productData); // ✅ Gọi hàm từ props
      if (response && response.data.EC === 0) {
        toast.success(response.data.EM);
      }
      setProduct(defaultProductValue);
      setSelectedCategory("");
      setImages([]);
      setPreviews([]);
      setSizes(_.map(sizes, (size) => ({ ...size, stock: 0 })));
      props.handleClose();
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error("Không thể tạo sản phẩm.");
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm Sản Phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              {/* Cột trái */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    value={product.name}
                    onChange={(e) => {
                      setProduct({ ...product, name: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    type="text"
                    value={product.description}
                    onChange={(e) => {
                      setProduct({ ...product, description: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Chọn danh mục</Form.Label>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                    }}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Size & Stock */}
                <Form.Group className="mb-3">
                  <Form.Label>Size & Số lượng</Form.Label>
                  {sizes.map((size) => (
                    <div
                      key={size.id}
                      className="d-flex align-items-center mb-2"
                    >
                      <Form.Label className="me-2">{size.name}</Form.Label>
                      <Form.Control
                        type="number"
                        className="me-2"
                        value={size.stock}
                        placeholder="Số lượng"
                        onChange={(e) => {
                          handleStockChange(size.id, e.target.value);
                        }}
                      />
                    </div>
                  ))}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh sản phẩm</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple // Cho phép chọn nhiều ảnh
                    onChange={handleImageChange}
                  />
                  {/* Hiển thị ảnh preview */}
                  <div className="d-flex mt-2">
                    {previews.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt="Preview"
                        width="80"
                        className="me-2 rounded"
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalCreate;
