import React, { useEffect, useState } from 'react'
 import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Box,Button, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import TextField from '@mui/material/TextField';
import { TextField } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation } from 'react-router-dom';

//modal style
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



//table style
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.light,
    color:theme.palette.primary.contrastText,
    fontSize:17,
    
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 400,
 overflowX:'auto',
  overflowY: 'auto', // Add scrollbar for vertical overflow
});

function User() {
    //modald  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
//object
let[ticket,setTicket]=useState({
    problem:"",
    type:"",
    userid:"",
    techsupportid:0
})
const location = useLocation();
const userId = location.state && location.state.userId;

// Use userId as needed
console.log('User ID:', userId)
//let[userid,setUserid]=useState('null')
let[getTicket,setGetTicket]=useState([])
//setting id
let [id,setID]=useState();


function handleSubmit(e){
    setTicket({...ticket,[e.target.id]:e.target.value})
    console.log('tp',ticket);


}

function handleSelectedChange(e) {
    let selectedType = e.target.value;
    setTicket({...ticket, type: selectedType});
  
    console.log('tp',ticket);
   
}


//send ticket
function sendTicket(e){
    e.preventDefault();
    let senddata={
      problem:ticket.problem,
      type:ticket.type,
      userid:userId,
      techsupportid:ticket.techsupportid
  }
    if(userId!==null ){
   
    console.log('sending data',senddata);
    console.log('id',userId);
    
    axios.post("http://localhost:3000/tickets", senddata)
    .then((response) => {
      onload()
      console.log('Ticket Submitted:', response.data);
      console.log('Sending ticket with userid:', userId);
      handleClose();
    
    })
    .catch((error) => {
      console.error('Error submitting ticket:', error);
    });
  }

  else{
    axios.put("http://localhost:3000/tickets/"+id,senddata)
    .then((res)=>{
      console.log(res.data);
      onload();
      handleClose();
      
    });}
}


function onload(){


  axios.get("http://localhost:3000/tickets")
  
      .then((resp)=>{
        console.log(resp.data);
      
        setGetTicket(resp.data);

      })
      .catch((error)=>{
        console.log(error);

      })
    }

    useEffect(()=>{
      onload()
    },[ticket])

    // useEffect(() => {
    //   if (location.state && location.state.userid) {
    //     setUserid(location.state.userid);
    //     console.log(userid);
    //   }
    // }, [location]);
//deleted
function handledelete(e, id) {
  console.log(id);
  e.preventDefault();
  axios.delete("http://localhost:3000/tickets/" + id) 
    .then((resp) => {
      console.log(resp.data);
      onload();
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleUpdate(e,id){

  e.preventDefault();
  setID(id);
  handleOpen();
  axios.get("http://localhost:3000/tickets/"+id)
  .then((res)=>{
    console.log(res.data.problem);

    setTicket({
      problem: res.data.problem,
      type: res.data.type,
       })
  }).catch((error)=>{
    console.log(error);
  })
    
}



  return (
    <>
    <h1>User Dashboard</h1>
    <div>
      <Button sx={{ bgcolor: 'warning.light',color:'black',mb:2 }} onClick={handleOpen}>Open  to Add</Button>
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
{/* form modal */}
<Box component="form" onSubmit={handleSubmit}  method='Post' encType='multipart/form-data'noValidate sx={{ mt: 1 }}>



            <TextField
              margin="normal"
              required
              
              fullWidth
              id="problem"
              label="Problem"
              type="text"
              autoFocus
              onChange={handleSubmit}
            />

<FormControl fullWidth variant="outlined" >  
<InputLabel id="type-label">Type</InputLabel>
<Select
    labelId="type-label"
    id="type"
    value={ticket.type} // Set the value prop to ticket.type
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
               onClick={sendTicket}


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
        <StyledTableCell>Srno </StyledTableCell>
        <StyledTableCell>Problem </StyledTableCell>
        <StyledTableCell>Type </StyledTableCell>
       
        <StyledTableCell>Action </StyledTableCell>

      </TableRow>
    </TableHead>
    <TableBody>
      {getTicket.map((tik,index)=>(

        <StyledTableRow key={index} >
          <StyledTableCell component={"th"} scope='row'>
{index+1}
          </StyledTableCell>
          
          {/* <TableCell>{i._id}</TableCell> */}
          <StyledTableCell>{tik.problem}</StyledTableCell>
          <StyledTableCell>{tik.type}</StyledTableCell>
         
  
          <StyledTableCell><EditIcon sx={{ color: 'success.light' }} onClick={((e)=>handleUpdate(e,tik.id))}>edit</EditIcon> 
          <DeleteIcon sx={{ color: 'red' }} onClick={((e)=>handledelete(e,tik.id))}>Del</DeleteIcon ></StyledTableCell>
          
        </StyledTableRow>
      
      ))}
    </TableBody>
  </Table>



</StyledTableContainer>
    
    
    </>
  )
}

export default User