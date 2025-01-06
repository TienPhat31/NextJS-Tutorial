import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

const CreateModal = () => {
	const [show, setShow] = useState(false);

	const handleClose = () => {
		setShow(false);
		setTitle("");
		setAuthor("");
		setContent("");
	};
	const handleShow = () => setShow(true);

	const [title, setTitle] = useState<string>("");
	const [author, setAuthor] = useState<string>("");
	const [content, setContent] = useState<string>("");

	// Ham khi nhan nut "Create"
	const handleSubmitForm = () => {
		fetch("https://fake-json-api.mock.beeceptor.com/users", {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({ name: title, company: author, email: content }),
		})
			.then(function (res) {
				console.log(res.json());
			})
			.catch(function (res) {
				console.log(res);
			});
		toast.success("Creat user successfully");
		setShow(false);
	};

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Add new user
			</Button>

			<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Modal add new user</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Title</Form.Label>
							<Form.Control
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								type="text"
								placeholder=""
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Author</Form.Label>
							<Form.Control
								value={author}
								onChange={(e) => setAuthor(e.target.value)}
								type="text"
								placeholder=""
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Contenta</Form.Label>
							<Form.Control
								value={content}
								onChange={(e) => setContent(e.target.value)}
								as="textarea"
								rows={3}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={() => handleSubmitForm()}>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default CreateModal;
