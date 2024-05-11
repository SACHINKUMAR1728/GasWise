import React, { useState } from 'react';
import axios from 'axios';

const Body = () => {
  const [code, setCode] = useState("");
  const [response, setresponse] = useState("");
  const [gas,setgas] = useState(null);

  const handleChange = (event) => {
    setCode(event.target.value);
    setgas(2000);
  };
  const handleSubmit = async()=>{
    try {
      console.log("called the promt");
      const response = await axios.post('http://localhost:3000/prompt', { 
        code });
        console.log(response.data.text);
        
      setresponse(response.data.text);
    } catch (error) {
      console.error('Error:', error);
    }
   

  }

  return (
    <div className='text-black h-screen flex flex-col'>
      <nav className='h-12 bg-gray-800 text-3xl flex items-center text-white font-bold'>
        GasWise
      </nav>
      <div className='flex-grow flex'>
        <div className='w-1/2 flex flex-col bg-gray-800'>
          <div className="bg-gray-200 text-black px-4 py-2 border-gray-800">
           Try your Smart Contract here: 
           
            <button className='p-2 rounded-[10px] bg-violet-600 relative left-[470px] px-4 hover:bg-violet-500' onClick={
              handleSubmit}>Run</button>
          </div>
          <textarea
            className="flex-grow px-4 py-2 text-sm text-yellow-200 rounded-none border border-gray-800 focus:outline-none bg-gray-800"
            value={code}
            onChange={handleChange}
            placeholder="SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0...."
          />
          {gas && (
  <div className='rounded-md bg-gray-800 text-white p-4 shadow-md'>
    <p className='text-3xl font-bold mb-0'>Estimated Gas cost: {gas}</p>
  </div>
)}

          
        </div>
        <div className='w-1/2 flex flex-col border border-r-emerald-200 z-10 bg-gray-800'>
  <div className="bg-gray-200 text-black px-4 py-2 border-b border-gray-800 h-[60px]">
    <p className='mt-2'>Output: </p>
  </div>
  <div className='text-white bg-gray-800 h-full'>{response}</div>
  {gas &&
          <p className='bg-gray-800 text-white text-3xl font-bold relative bottom-3'>Estimated Gas cost: {gas}</p>}
</div>

      </div>
    </div>
  );
}

export default Body;
