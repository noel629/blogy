import "./settings.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import { Redirect , Link } from "react-router-dom" 
import axios from "axios";

export default function Settings({userss}) {

  console.log(userss)
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [deleted, setDeleted] = useState(false);
  // const [users, setUser] = useState({});

  // const getUser = () => {
  //   fetch('https://bloggyies.herokuapp.com/api/users/')
  //   .then(res => res.json())
  //   .then(data => setUser(data))
  // }

  // useEffect(() => {
  //   getUser()
  // }, [])
  // console.log(users)

  const { user, dispatch } = useContext(Context);
  const PF = "https://bloggyies.herokuapp.com/images/"

  // const parseData = JSON.parse(localStorage.getItem("user"))._id


  const onSubmitHandler = (e) => {
    // alert('adasd')

    e.preventDefault()
    fetch("https://bloggyies.herokuapp.com/api/users/" + userss._id,{
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      localStorage.removeItem("user")
      setDeleted(true)
      dispatch({type:"LOGOUT"})
    })

  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePic = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}users/` + user._id, updatedUser);
      setSuccess(true);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "UPDATE_FAILURE" });
    }
  };
  // console.log(parseData)
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <button className="settingsDeleteTitle" onClick={onSubmitHandler}> {deleted && <Redirect to="/" />}Delete Account</button>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          {/* <label>Profile Picture</label> */}
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : PF+user.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label> 
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Profile has been updated...
            </span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
}
