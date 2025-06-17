import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
    description: [],
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
    fetchAProduct();
  }, [props.product]);
  useEffect(() => {
    fetchAllSizes();
    fetchAllCategory();
  }, []);
  const fetchAProduct = () => {
    if (props.product) {
      let parsedDescription = [];
      try {
        if (props.product.description) {
          // Parse description từ string JSON thành mảng
          const parsed = JSON.parse(props.product.description);
          parsedDescription = Array.isArray(parsed) ? parsed : [];
        }
      } catch (error) {
        console.error("Error parsing description:", error);
        parsedDescription = [];
      }

      setProduct({
        id: props.product.id || "",
        name: props.product.name || "",
        description: parsedDescription,
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
  };
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

  const handleAddDescription = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: Array.isArray(prevProduct.description)
        ? [...prevProduct.description, { title: "", content: "" }]
        : [{ title: "", content: "" }],
    }));
  };

  const handleDescriptionChange = (index, field, value) => {
    setProduct((prevProduct) => {
      const currentDescription = Array.isArray(prevProduct.description)
        ? prevProduct.description
        : [];

      const updatedDescription = [...currentDescription];
      updatedDescription[index] = {
        ...updatedDescription[index],
        [field]: value,
      };

      return {
        ...prevProduct,
        description: updatedDescription,
      };
    });
  };

  const handleRemoveDescription = (index) => {
    setProduct((prevProduct) => {
      const currentDescription = Array.isArray(prevProduct.description)
        ? prevProduct.description
        : [];

      return {
        ...prevProduct,
        description: currentDescription.filter((_, i) => i !== index),
      };
    });
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
      description: JSON.stringify(product.description), // Chuyển mảng thành JSON string
      sizes: selectedSizes,
      images: [...existingImages, ...newImageUrls], // Ảnh cũ + ảnh mới
    };
    console.log("Product data to update:", productData);
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
      {console.log(product)}
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label>Mô tả</Form.Label>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddDescription}
                    >
                      <i className="fas fa-plus"></i> Thêm mô tả
                    </Button>
                  </div>
                  {console.log(product.description)}
                  {(Array.isArray(product.description)
                    ? product.description
                    : []
                  ).map((desc, index) => (
                    <div key={index} className="mb-3 p-2 border rounded">
                      <div className="d-flex justify-content-between mb-2">
                        <Form.Label className="mb-1">
                          Mô tả {index + 1}
                        </Form.Label>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveDescription(index)}
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                      <Form.Control
                        type="text"
                        placeholder="Tiêu đề mô tả"
                        value={desc.title}
                        onChange={(e) =>
                          handleDescriptionChange(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        className="mb-2"
                      />
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Nội dung mô tả"
                        value={desc.content}
                        onChange={(e) =>
                          handleDescriptionChange(
                            index,
                            "content",
                            e.target.value
                          )
                        }
                        style={{
                          resize: "none",
                          whiteSpace: "pre-wrap",
                          backgroundColor: "#f8f9fa",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #dee2e6",
                          minHeight: "100px",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      />
                    </div>
                  ))}
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
