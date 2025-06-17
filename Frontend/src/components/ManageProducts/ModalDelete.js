import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
const ModalDelete = (props) => {
  return (
    <>
      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
      >
        <Modal show={props.show} onHide={props.onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa sản phẩm</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
              Hủy
            </Button>
            <Button variant="danger" onClick={props.handleDelete}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ModalDelete;
