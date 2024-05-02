import React, {  useEffect, useState } from 'react';
import { Box, Button, Container, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Login() {

  

  let [data, setData] = useState({
    email: "",
    password: "",
    role: "user" // Set default type
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
    console.log("Updated data:", data); // Log updated data
  };

  const handleSelectedChange = (e) => {
    const selectedType = e.target.value;
    console.log('sel',selectedType);
    setData({ ...data, role: selectedType }); // Assign selected type to data
    console.log("Selected type:", selectedType); // Log selected type
  };

  useEffect(() => {
    console.log("Updated data:", data); // Log updated data inside useEffect
  }, [data]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let response = await axios.get('http://localhost:3000/users');
      console.log("Response data:", response.data); // Log response data
      console.log("User input:", data); // Log user input

      if (response.data) {
        let userData = response.data.find(user =>
          user.email === data.email &&
          user.password === data.password &&
          user.role === data.role
        );
        console.log("User data:", userData); // Log user data

        if (userData) {
          switch (userData.role) {
            case "admin":
              navigate('/layout/admin', { state: { userId: userData.id } });
              break;
            case "techsupport":
              navigate('/layout/techsupport', { state: { userId: userData.id } });
              break;
            case "user":
              navigate('/layout/user', { state: { userId: userData.id } });
              break;
            default:
              console.error("Unknown user type:", userData.role);
              setError('Unknown user type.');
              break;
          }
        } else {
          console.log("User not found or incorrect credentials");
          // Handle incorrect credentials
        }
      } else {
        console.log("No data received from the server");
        setError('No data received from the server');
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError('Error logging in. Please try again later.');
    }
  };
  
  
  

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={data.role}
                onChange={handleSelectedChange}
                label="Type"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="techsupport">Tech</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <Link to="/registration">Registration</Link>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
