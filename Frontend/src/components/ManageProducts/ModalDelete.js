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
            <Modal.Title>Confirm delete This Product ????</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure delete this user</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
            <Button variant="primary" onClick={props.handleDelete}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ModalDelete;
