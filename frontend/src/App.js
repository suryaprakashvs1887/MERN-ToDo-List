import { useEffect, useState } from "react"
import "./App.css";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);


    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");


    const apiUrl = "http://localhost:8000"

    const handleSubmit = () => {
        setError("")
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }])
                    setTitle("")
                    setDescription("")
                    setMessage("Item Added Succesfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 2000)
                }
                else {
                    setError("Unable to create Todo Item")
                }
            })
        }
    }

    useEffect(() => {
        getIteams()
    }, [])

    const getIteams = () => {
        fetch(apiUrl + "/todos")
            .then((res) => {
                return res.json()

            })
            .then((res) => { setTodos(res) })
    }

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    }

    const handleUpdate = () => {
        setError("")
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    // Update the todo

                    const updatedTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;

                    })
                    setTodos(updatedTodos)
                    setMessage("Item Updated Succesfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 2000)

                    setEditId(-1)
                }
                else {
                    setError("Unable to create Todo Item")
                }
            })
        }
    }

    const handleEditCancel = () => {
        setEditId(-1)
    }

    const handleDelete = (_id) => {
        if (window.confirm("Are You Sure")) {
            fetch(apiUrl + '/todos/' + _id, {
                method: "DELETE"
            })
                .then(() => {
                    const updatedTo = todos.filter((item) => item._id !== _id)
                    setTodos(updatedTo)
                })
            setMessage("Item Deleted Succesfully")
            setTimeout(() => {
                setMessage("")
            }, 2000)

        }
    }

    return <>
        <div className="container pt-3 ">
            <div className="row p-3 bg-primary text-light">
                <h1 className="text-center">To Do List</h1>
            </div>
            <div className="row">
                <h3> ADD Item</h3>
                <div className="form-group d-flex gap-2">
                    <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text"></input>
                    <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text"></input>
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row justify-content-center mt-3 ">
                {message && <p className="text-success fw-bold">{message}</p>}
                <h3 className="text-center">Tasks</h3>
                <div className="col-md-7 ">
                    <ul className="list-group">
                        {
                            todos.map((item) => <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                                <div className="d-flex flex-column me-2 flex-grow-1">
                                    {
                                        editId == -1 || editId !== item._id ? (<>
                                            <span className="fw-bold wrap-text">{item.title}</span>
                                            <span className="wrap-text">{item.description}</span>
                                        </>) : (<>
                                            <div className="form-group d-flex gap-2">
                                                <input placeholder="title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text"></input>
                                                <input placeholder="description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text"></input>
                                            </div>
                                        </>)
                                    }
                                </div>
                                <div className="d-flex gap-2 my-2">
                                    {editId == -1 || editId !== item._id ? <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button> : <button onClick={handleUpdate}>Update</button>}
                                    {editId == -1 || editId !== item._id ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> :
                                        <button className="btn bg-danger" onClick={handleEditCancel}>Cancel</button>}
                                </div>
                            </li>
                            )
                        }


                    </ul>
                </div>

            </div>
        </div>
    </>
}