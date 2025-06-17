import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Card,
  Row,
  Col,
  InputGroup,
  Form,
  Badge,
  Modal,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import _ from "lodash";
import "./ManageBanners.scss";
import {
  getActiveBannerService,
  createBannerService,
  updateBannerService,
  uploadImages,
  deleteBanner,
} from "../../service/bannerService";

const ManageBanners = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    url: "",
    status: "active",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    setPreviews((prevPreviews) => [
      ...prevPreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleUploadImages = async () => {
    if (_.isEmpty(images)) return [];

    try {
      let formData = new FormData();
      images.forEach((file) => formData.append("images", file));
      let response = await uploadImages(formData);
      return response.data.DT;
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      toast.error("Không thể upload ảnh.");
      return [];
    }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getActiveBannerService();
      setBanners(response.data.DT);
    } catch (error) {
      console.error("Lỗi khi lấy banner:", error);
      toast.error("Không thể lấy danh sách banner.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBanners = banners.filter((banner) =>
    banner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddEdit = (banner = null) => {
    if (banner) {
      setFormData({
        name: banner.name,
        image: null,
        url: banner.url,
        status: banner.status,
      });
      setPreviews([`http://localhost:8080${banner.image}`]);
    } else {
      setFormData({
        name: "",
        image: null,
        url: "",
        status: "active",
      });
      setPreviews([]);
    }
    setImages([]);
    setSelectedBanner(banner);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const uploadedImages = await handleUploadImages();

      const submitData = {
        ...formData,
        image:
          uploadedImages[0] || (selectedBanner ? selectedBanner.image : null),
      };

      if (selectedBanner) {
        await updateBannerService(selectedBanner.id, submitData);
        toast.success("Cập nhật banner thành công!");
      } else {
        await createBannerService(submitData);
        toast.success("Thêm banner mới thành công!");
      }

      await fetchBanners();
      setShowModal(false);
      setImages([]);
      setPreviews([]);
    } catch (error) {
      console.error("Lỗi khi lưu banner:", error);
      toast.error("Không thể lưu banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // TODO: Implement delete banner service

      let response = await deleteBanner(selectedBanner.id);
      if (!response && !response.data) {
        toast.error("Fail to delete");
        return;
      }
      await fetchBanners();
      toast.success("Xóa banner thành công!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Lỗi khi xóa banner:", error);
      toast.error("Không thể xóa banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="manage-banners-container py-5">
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Quản lý Banner</h3>
          <Button variant="light" onClick={() => handleAddEdit()}>
            <FaPlus className="me-2" />
            Thêm Banner
          </Button>
        </Card.Header>
        <Card.Body>
          {/* Thanh tìm kiếm */}
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Tìm kiếm theo tên banner..."
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
            </Col>
          </Row>

          {/* Bảng danh sách banner */}
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên Banner</th>
                    <th>Ảnh</th>
                    <th>URL</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanners.length > 0 ? (
                    filteredBanners.map((banner, index) => {
                      return (
                        <tr key={banner.id}>
                          <td>{index + 1}</td>
                          <td>{banner.name}</td>
                          <td>
                            {banner.image ? (
                              <img
                                src={`http://localhost:8080${banner.image}`}
                                alt={banner.name}
                                style={{
                                  width: "100px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span>Không có ảnh</span>
                            )}
                          </td>
                          <td>{banner.url}</td>
                          <td>
                            <Badge
                              bg={
                                banner.status === "active"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {banner.status === "active"
                                ? "Đang hiển thị"
                                : "Ẩn"}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleAddEdit(banner)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteClick(banner)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Không tìm thấy banner nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal thêm/sửa banner */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedBanner ? "Sửa Banner" : "Thêm Banner Mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên Banner</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Nhập tên banner"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ảnh Banner</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previews.length > 0 && (
                <div className="mt-2">
                  <small>Ảnh đã chọn:</small>
                  <div className="d-flex gap-2 mt-2">
                    {previews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                name="url"
                placeholder="Nhập URL"
                value={formData.url}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Đang hiển thị</option>
                <option value="inactive">Ẩn</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Đang xử lý...
              </>
            ) : selectedBanner ? (
              "Cập nhật"
            ) : (
              "Thêm mới"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa banner "{selectedBanner?.name}"?</p>
          {selectedBanner?.image && (
            <div className="mt-3">
              <small>Ảnh banner sẽ bị xóa:</small>
              <div className="mt-2">
                <img
                  src={`http://localhost:8080${selectedBanner.image}`}
                  alt={selectedBanner.name}
                  style={{
                    width: "200px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(selectedBanner?.id)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Đang xử lý...
              </>
            ) : (
              "Xóa"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageBanners;
