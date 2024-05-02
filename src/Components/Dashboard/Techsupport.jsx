import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { tableCellClasses } from '@mui/material/TableCell';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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

function Techsupport() {
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState({
    problem: "",
    type: "",
    techsupportid: ""
  });
  const [getticket, setGetticket] = useState([]);
  const [id, setID] = useState(null);

  const location = useLocation();
  const userId = location.state && location.state.userId;

  useEffect(() => {
    onload();
  },[onload]);

  async function onload() {
    try {
      const response = await axios.get(`http://localhost:3000/tickets?techsupportid=${userId}`);
      setGetticket(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTicket({ ...ticket, [e.target.id]: e.target.value });
    console.log('tp', ticket);
  }

  function handleSelectedChange(e) {
    let selectedType = e.target.value;
    setTicket({ ...ticket, type: selectedType });
    console.log('tp', ticket);
  }

  function sendTicket(e) {
    e.preventDefault();
    let senddata = {
        problem: ticket.problem,
        type: ticket.type,
        techsupportid: ticket.techsupportid
    };
    if (id === null) {
        console.log('sending data', senddata);
        axios.post("http://localhost:3000/tickets", senddata)
            .then((response) => {
                console.log('Ticket Submitted:', response.data);
                handleClose();
            })
            .catch((error) => {
                console.error('Error submitting ticket:', error);
            });
    } else {
        axios.put(`http://localhost:3000/tickets/${id}`, senddata)
            .then((res) => {
              onload();
                console.log(res.data);
                handleClose();
            })
            .catch((error) => {
                console.error('Error updating ticket:', error);
            });
    }
  }

  function handleDelete(id) {
    console.log(id);
    axios.delete(`http://localhost:3000/tickets/${id}`)
      .then((resp) => {
        console.log(resp.data);
        onload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleUpdate(id) {
    setID(id);
    handleOpen();
    axios.get(`http://localhost:3000/tickets/${id}`)
      .then((res) => {
        console.log(res.data.problem);
        setTicket({
          problem: res.data.problem,
          type: res.data.type,
          techsupportid: res.data.techsupportid
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <h1>Techsupport Dashboard</h1>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Ticket
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Box component="form" onSubmit={sendTicket}  method='Post' encType='multipart/form-data' noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="problem"
                  label="Problem"
                  type="text"
                  autoFocus
                  value={ticket.problem}
                  onChange={handleSubmit}
                />
                <FormControl fullWidth variant="outlined" >
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    value={ticket.type}
                    onChange={handleSelectedChange}
                    label="Type"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Process">Process</MenuItem>
                    <MenuItem value="Resolve">Resolve</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                 // onClick={sendTicket}
                >
                  Send
                </Button>
              </Box>
            </Typography>
          </Box>
        </Modal>
      </div>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>TicketID</StyledTableCell>
              <StyledTableCell>Problem</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getticket.map((ticket, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{ticket.techsupportid}</StyledTableCell>
                <StyledTableCell>{ticket.problem}</StyledTableCell>
                <StyledTableCell>{ticket.type}</StyledTableCell>
                <StyledTableCell>
                  <EditIcon sx={{ color: 'success.light', cursor: 'pointer' }} onClick={() => handleUpdate(ticket.id)}>
                    Edit
                  </EditIcon>
                  <DeleteIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(ticket.id)}>
                    Del
                  </DeleteIcon>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </>
  );
}

export default Techsupport;
