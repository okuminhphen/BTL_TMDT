import { Button, Form, Modal, Row, Col } from "react-bootstrap";

import { useEffect, useState } from "react";
import {
  fetchSizes,
  fetchCategory,
  uploadImages,
} from "../../service/productService";
import _ from "lodash";
import { toast } from "react-toastify";
const ModalEdit = (props) => {
  const defaultProductValue = {
    id: "",
    name: "",
    description: "",
    price: "",
    categoryId: "",
    sizes: [],
  };

  const [product, setProduct] = useState(defaultProductValue);
  const [sizes, setSizes] = useState([]); // id , name , stock
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  useEffect(() => {
    if (props.product) {
      setProduct({
        id: props.product.id || "",
        name: props.product.name || "",
        description: props.product.description || "",
        price: props.product.price || 0,
        categoryId: props.product.Category ? props.product.Category.id : "",
        sizes: props.product.sizes || [],
      });

      setSelectedCategory(
        props.product.Category ? props.product.Category.id : ""
      );

      fetchAllSizes(props.product.sizes || []);
      checkJSONParseImage();
    }
  }, [props.product]);
  useEffect(() => {
    fetchAllSizes();
    fetchAllCategory();
  }, []);

  const checkJSONParseImage = () => {
    let existingImages = [];

    // 🛠 Kiểm tra trước khi parse JSON
    if (
      props.product.images &&
      typeof props.product.images === "string" &&
      props.product.images.trim() !== ""
    ) {
      try {
        existingImages = JSON.parse(props.product.images);

        // Nếu sau khi parse vẫn là chuỗi, thử parse lần nữa
        if (
          typeof existingImages === "string" &&
          existingImages.trim() !== ""
        ) {
          existingImages = JSON.parse(existingImages);
        }
      } catch (error) {
        console.error("Lỗi khi parse images:", error);
        existingImages = [];
      }
    }

    // ✅ Đảm bảo existingImages luôn là mảng
    setExistingImages(Array.isArray(existingImages) ? existingImages : []);
  };
  const fetchAllSizes = async (existingSizes = []) => {
    try {
      const response = await fetchSizes();
      if (response && response.data.EC === 0) {
        const sizesData = response.data.DT.map((size) => {
          const existingSize = existingSizes.find((s) => s.id === size.id);
          return {
            ...size,
            ProductSize: existingSize?.ProductSize || { stock: 0 }, // ✅ Giữ nguyên ProductSize
          };
        });

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
      size.id === sizeId
        ? {
            ...size,
            ProductSize: {
              ...size.ProductSize,
              stock: Number(value), // ✅ Cập nhật stock trong ProductSize
            },
          }
        : size
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
    const selectedSizes = _.filter(
      sizes,
      (size) => size.ProductSize?.stock > 0
    );
    console.log("Selected Sizes:", selectedSizes);
    // ✅ Upload ảnh mới nếu có
    let newImageUrls = await handleUploadImages();

    // ✅ Tạo danh sách ảnh cần gửi
    let productData = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      categoryId: selectedCategory,
      description: product.description,
      sizes: selectedSizes,
      images: [...existingImages, ...newImageUrls], // Ảnh cũ + ảnh mới
    };
    console.log("check id productdata:", productData.id);
    try {
      let response = await props.handleEdit(productData);
      if (response && response.data.EC === 0) {
        console.log(response.data.DT);
      }
      setProduct({});
      setSelectedCategory("");
      setImages([]);
      setPreviews([]);
      setExistingImages([]);
      setSizes(_.map(sizes, (size) => ({ ...size, stock: 0 })));
      props.handleClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Không thể update sản phẩm.");
    }
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa Sản Phẩm</Modal.Title>
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
                    value={product.name || ""}
                    onChange={(e) => {
                      setProduct({ ...product, name: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    type="text"
                    value={product.description || ""}
                    onChange={(e) => {
                      setProduct({ ...product, description: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    value={product.price || ""}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Chọn danh mục</Form.Label>
                  <Form.Select
                    value={selectedCategory || ""}
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
                        value={size.ProductSize?.stock || ""} // ✅ Lấy stock từ ProductSize
                        placeholder="Số lượng"
                        onChange={(e) =>
                          handleStockChange(size.id, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh sản phẩm</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />

                  {/* Hiển thị ảnh cũ */}
                  <div className="d-flex mt-2">
                    {existingImages.map((src, index) => (
                      <div key={index} className="position-relative me-2">
                        <img
                          src={`http://localhost:8080${src}`}
                          alt="Ảnh cũ"
                          width="80"
                          className="rounded"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => handleRemoveExistingImage(index)}
                        >
                          ✖
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Hiển thị ảnh mới */}
                  <div className="d-flex mt-2">
                    {previews.map((src, index) => (
                      <div key={index} className="position-relative me-2">
                        <img
                          src={src}
                          alt="Ảnh mới"
                          width="80"
                          className="rounded"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => handleRemoveNewImage(index)}
                        >
                          ✖
                        </Button>
                      </div>
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

export default ModalEdit;
