import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Box, Button, Modal, Typography, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import UserList from '../UserList';
import TicketsList from '../Tickets/TicketsList';

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Table style
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.contrastText,
    fontSize: 17,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 400,
  overflowX: 'auto',
  overflowY: 'auto',
});

function Admin() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [showTicketList, setShowTicketList] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    // Fetch users with role 'techsupport'
    axios.get("http://localhost:3000/users?role=techsupport")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    // Fetch tickets
    axios.get("http://localhost:3000/tickets")
      .then(response => {
        setTickets(response.data);
      })
      .catch(error => {
        console.error('Error fetching tickets:', error);
      });
  }, []);

  const handleAssign = () => {
    if (!selectedUser) {
      console.error('No user selected');
      return;
    }
  
    // Check if any ticket is selected
    if (selectedTickets.length === 0) {
      console.error('No ticket selected');
      return;
    }
  
    // Update the selected tickets with the techsupportid
    const updatedTickets = selectedTickets.map(ticket => ({
      ...ticket,
      techsupportid: selectedUser
    }));
  
    // Construct an array of promises for each ticket update request
    const updateRequests = updatedTickets.map(ticket =>
      axios.put(`http://localhost:3000/tickets/${ticket.id}`, ticket)
    );
  
    // Send all update requests concurrently
    Promise.all(updateRequests)
      .then(responses => {
        console.log('Tickets assigned successfully:', responses);
        // Update the local state with the updated tickets if needed
        setTickets(prevTickets =>
          prevTickets.map(prevTicket =>
            updatedTickets.find(updatedTicket => updatedTicket.id === prevTicket.id) || prevTicket
          )
        );
        handleClose(); // Close the modal after successful assignment
      })
      .catch(error => {
        console.error('Error assigning tickets:', error);
      });
  };

  const handleTicketSelection = (selectedTicketIds) => {
    setSelectedTickets(tickets.filter(ticket => selectedTicketIds.includes(ticket.id)));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };





  const handleEditUser = (user) => {
    setEditedUser(user);
    setEditOpen(true);
  };

  const handleEditUserSubmit = () => {
    axios.put(`http://localhost:3000/users/${editedUser.id}`, editedUser)
      .then(response => {
        console.log('User updated successfully:', response.data);
        const updatedUsers = users.map(user => (user.id === editedUser.id ? editedUser : user));
        setUsers(updatedUsers);
        setEditOpen(false);
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`http://localhost:3000/users/${userId}`)
      .then(response => {
        console.log('User deleted successfully:', userId);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // Remove the user from the user list
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };



  const [addUserOpen, setAddUserOpen] = useState(false);

// Function to handle opening and closing of the add user modal
const handleAddUserOpen = () => setAddUserOpen(true);
const handleAddUserClose = () => setAddUserOpen(false);

// Function to handle adding a new techsupport user
const handleAddTechSupportUser = () => {
  const techSupportUser = { ...newUser, role: 'techsupport' };

  // Send a request to add the new techsupport user
  axios.post('http://localhost:3000/users', techSupportUser)
    .then(response => {
      console.log('Techsupport user added successfully:', response.data);
      setUsers(prevUsers => [...prevUsers, response.data]); // Update the user list
      setNewUser({ name: '', email: '', password: '' }); // Clear the form fields
      handleAddUserClose(); // Close the modal
    })
    .catch(error => {
      console.error('Error adding techsupport user:', error);
    });
};

  return (
    <>
      <h1>Admin Dashboard</h1>
      

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Button onClick={handleOpen}>Assign Ticket</Button>
        <Button onClick={() => setShowTicketList(!showTicketList)}>
          {showTicketList ? 'Hide Ticket List' : 'Show Ticket List'}
        </Button>
        <Button onClick={() => setShowUserList(!showUserList)}>
          {showUserList ? 'Hide UserList' : 'Show UserList'}
        </Button>
        <Button onClick={() => setShowTable(!showTable)}>
        <p>TechsupportTableShow</p>
          {showTable ? 'Hide Table' : 'Show Table'}
        </Button>
        

      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Assign Ticket
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="user-select-label">Select User</InputLabel>
              <Select
                labelId="user-select-label"
                id="user-select"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="ticket-select-label">Select Tickets</InputLabel>
              <Select
                labelId="ticket-select-label"
                id="ticket-select"
                multiple
                value={selectedTickets.map(ticket => ticket.id)}
                onChange={e => handleTicketSelection(e.target.value)}
              >
                {tickets.map(ticket => (
                  <MenuItem key={ticket.id} value={ticket.id}>{ticket.problem} - {ticket.status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleAssign}>Assign</Button>
          </Typography>
        </Box>
      </Modal>

      {showTicketList && <TicketsList />}
      {showUserList && <UserList />}
      <Button onClick={handleAddUserOpen}>Add Techsupport User</Button>
      {showTable && (
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Id</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Password</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{user.name}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>
                  <StyledTableCell>{user.password}</StyledTableCell>
                  <StyledTableCell>
                    <EditIcon
                      sx={{ color: 'success.light', cursor: 'pointer' }}
                      onClick={() => handleEditUser(user)}
                    />
                    <DeleteIcon
                      sx={{ color: 'red', cursor: 'pointer', ml: 2 }}
                      onClick={() => handleDeleteUser(user.id)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
 
      <Modal
       open={addUserOpen}
       onClose={handleAddUserClose}
       aria-labelledby="add-user-modal-title"
       aria-describedby="add-user-modal-description"
      >
        <Box sx={modalStyle}>
        <Typography id="add-user-modal-title" variant="h6" component="h2">
          Add Techsupport User
          </Typography>
          <Typography id="add-user-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleAddTechSupportUser}>Add Techsupport User</Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default Admin;
