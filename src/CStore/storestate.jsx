import React, { createContext, useState } from 'react'

export const usercontext = createContext()

function storestate({ children }) {




    const [data, setData] = useState({
        email: "",
        password: "",
        type: "user" // Defaulting to "user"
      });
    
    
    
    
      const Data = {
        data, setData
      }
    
    
  return (
    <>
      <usercontext.Provider value={Data} >

{children}

</usercontext.Provider>
    
    </>
  )
}

export default storestate
