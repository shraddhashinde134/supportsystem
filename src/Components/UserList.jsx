import React, { useEffect, useState } from 'react'
import axios from 'axios';
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
import { Box, Button,  Modal, TextField, Typography} from '@mui/material';



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

function UserList() {

        //modald  
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);

    //get ticket list
  let [getuser, setGetuser] = useState([]);
  let [user,setUser]=useState({})
  let [userid, setUserid] = useState(null); 
let [id,setID]=useState();


function handleChange(e){
  setUser({...user,[e.target.id]:e.target.value})
  console.log('changevalue',user);
}

//sending data
function handleSubmit(e){
  e.preventDefault();
  let senddata={
    name:user.name,
    email:user.email,
    password:user.password,
    role:"techsupport"
  }
  if(id===undefined){
  axios.post("http://localhost:3000/users",senddata).then((res)=>{
    console.log(res.data);
    handleClose()
  }).catch((error)=>{
    console.log(error);
  })
}
else{
  axios.put("http://localhost:3000/users/"+id,senddata)
  .then((res)=>{
    console.log(res.data);
    onload();
    handleClose();
    
  });}
}

  function onload(){
    axios.get("http://localhost:3000/users").then((res)=>{
      console.log('getuser',res.data);
      setGetuser(res.data)
    })

  }
  useEffect(()=>{
    onload();
  })

  function handledelete(id){
    console.log(id);
    axios.delete("http://localhost:3000/users/" + id) 
      .then((resp) => {
        console.log(resp.data);
        onload();
      })
      .catch((error) => {
        console.log(error);
      });

  }
  function handleUpdate(id){
    setID(id);
    handleOpen();
    axios.get("http://localhost:3000/users/"+id)
    .then((res)=>{
      console.log(res.data.problem);
  
      setUser({
        problem: res.data.problem,
        type: res.data.type,
         })
    }).catch((error)=>{
      console.log(error);
    })

  }
  return (
    <><h1>UserList</h1>
     {/*  start modal */}
     <div>
      {/* <Button sx={{ bgcolor: 'warning.light',color:'black',mb:2 }} onClick={handleOpen}>Open  to Add</Button> */}
      <Modal

    
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit user
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
{/* form modal */}
<Box component="form" onSubmit={handleSubmit} method='Post' encType='multipart/form-data'noValidate sx={{ mt: 1 }}>



            <TextField
              margin="normal"
              required
              fullWidth
//value={ticket.problem}
              id="name"
              label="name"
              type="text"
              onChange={handleChange}
            
            />
                   <TextField
              margin="normal"
              required
              fullWidth
//value={ticket.problem}
              id="email"
              label="email"
              type="text"
              onChange={handleChange}
            />
                 <TextField
              margin="normal"
              required
              fullWidth
//value={ticket.problem}
              id="password"
              label="password"
              type="text"
              onChange={handleChange}
            />


   

  
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
               //onClick={handleAssignTechSupport}


            >
              Send
            </Button>
        
          </Box>
         
          </Typography>
         
        </Box>
      </Modal>
    </div>
    {/* end modal */}
    
    <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Srno</StyledTableCell>
              
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Password</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getuser.map((user, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{index+1}</StyledTableCell>
                
                <StyledTableCell>{user.name}</StyledTableCell>
                <StyledTableCell>{user.email}</StyledTableCell>
                <StyledTableCell>{user.password}</StyledTableCell>

                <StyledTableCell><EditIcon sx={{ color: 'success.light' }} onClick={(()=>handleUpdate(user.id))}>edit</EditIcon> 
          <DeleteIcon sx={{ color: 'red' }} onClick={(()=>handledelete(user.id))}>Del</DeleteIcon ></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    
    </>
  )
}

export default UserList