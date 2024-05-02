import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';


function Assign({ value, onChange }) {
  return (
    <div> Assign

<FormControl fullWidth>
      <InputLabel id="tech-support-label">Tech Support User</InputLabel>
      <Select
        labelId="tech-support-label"
        id="techSupportUserId"
        value={value}
        onChange={onChange}
      >
        {/* Render tech support users as MenuItem options */}
        {/* Example: */}
        <MenuItem value="1">Tech Support User 1</MenuItem>
        <MenuItem value="2">Tech Support User 2</MenuItem>
        {/* You can dynamically populate this list based on your tech support user data */}
      </Select>
    </FormControl>
  

        </div>
  )
}

export default Assign