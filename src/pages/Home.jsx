import { useEffect, useState } from "react";
import "../css/Home.module.css";
import axios from "axios";
import styles from "../css/Home.module.css";
import Navbar from "../component/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [Error,setError]=useState("");
  const {user}=useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    scholarStatus: "",
    dob: "",
    registrationTime: "",
    favoriteFood: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      setError("")
      axios
      .get("https://crudappbd.vercel.app/api/studentdetailsRoute/", {
        headers: {
          "Content-Type": "application/json",   // Missing comma added here
          Authorization: `Bearer ${user.token}`, // Ensure user.token is not null/undefined
        },
      })
      .then((response) => setUsers(response.data))
      .catch((err) => console.log(err));
    
    } else {
      setError("You must be logged in to view this content.");
    }
  }, [user]);
  

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      gender: user.gender,
      scholarStatus: user.scholarStatus,
      dob: user.dob.slice(0, 10),
      registrationTime: user.registrationTime,
      favoriteFood: user.favoriteFood,
    });
  };

  const handleUpdate = () => {
    if (editingUser) {
      axios
        .patch(
          "https://crudappbd.vercel.app/api/studentdetailsRoute/" + editingUser._id,
          formData,{
            headers: {
              Authorization: `Bearer ${user.token}`, // Add the token here
            },}
        )
        .then((response) => {
          setUsers(
            users.map((user) =>
              user._id === editingUser._id ? response.data : user
            )
          );
          setEditingUser(null);
          setFormData({
            name: "",
            gender: "",
            scholarStatus: "",
            dob: "",
            registrationTime: "",
            favoriteFood: "",
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = (id) => {
    axios
      .delete("https://crudappbd.vercel.app/api/studentdetailsRoute/" + id,{
        headers: {
          Authorization: `Bearer ${user.token}`, // Add the token here
        },})
      .then(() => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    setEditingUser(null);
    setIsCreating(false);
    setFormData({
      name: "",
      gender: "",
      scholarStatus: "",
      dob: "",
      registrationTime: "",
      favoriteFood: "",
    });
  };

  const handleCreate = () => {
    axios
      .post("https://crudappbd.vercel.app/api/studentdetailsRoute/", formData,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Add the token here
        },})
      .then((response) => {
        setUsers([...users, response.data]);
        setFormData({
          name: "",
          gender: "",
          scholarStatus: "",
          dob: "",
          registrationTime: "",
          favoriteFood: "",
        });

        setIsCreating(false);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <><Navbar/>
    <div className={styles.container}>
    {Error&&<p>{Error}</p>}
      {!editingUser && !isCreating && (
        <>
          <button className={styles.create_btn} onClick={() => setIsCreating(true)}>Create New User</button>
          <table>
            <thead>
              <tr>
                <th>S.no</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Scholar Status</th>
                <th>DOB</th>
                <th>Registration Time</th>
                <th>Favorite Food</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                <td>{index+1}</td>
                  <td>{user.name}</td>
                  <td>{user.gender}</td>
                  <td>{user.scholarStatus}</td>
                  <td>{new Date(user.dob).toLocaleDateString()}</td>
                  <td>{user.registrationTime}</td>
                  <td>{user.favoriteFood}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {(editingUser || isCreating) && (
        <div className={styles.form_container}>
          <h3>{editingUser ? "Edit User" : "Create User"}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if(!user){
                setError("you must be logged in");
                return;
              }
              editingUser ? handleUpdate() : handleCreate();
            }}
          >
            <div>
              <label>Name:</label>
              <input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label>Gender:</label>
              <input name="gender" value={formData.gender} onChange={handleChange} />
            </div>
            <div>
              <label>Scholar Status:</label>
              <label>
                <input
                  type="radio"
                  name="scholarStatus"
                  value="dayscholar"
                  checked={formData.scholarStatus === "dayscholar"}
                  onChange={handleChange}
                />{" "}
                Day Scholar
              </label>
              <label>
                <input
                  type="radio"
                  name="scholarStatus"
                  value="hostel"
                  checked={formData.scholarStatus === "hostel"}
                  onChange={handleChange}
                />{" "}
                Hostel
              </label>
            </div>
            <div>
              <label>Date of Birth:</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div>
              <label>Registration Time:</label>
              <input
                type="time"
                name="registrationTime"
                value={formData.registrationTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Favorite Food:</label>
              <select
                name="favoriteFood"
                value={formData.favoriteFood}
                onChange={handleChange}
              >
                <option value="">Select Food Type</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
            <button type="submit">{editingUser ? "Update" : "Create"}</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default Home;
