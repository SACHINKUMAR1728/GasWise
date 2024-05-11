import React, { useState } from 'react';
import axios from 'axios';

const Body = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [gas, setGas] = useState(null);

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  const handleCompile1 = async () => {
    try {
      console.log("Compiling the contract...");
      const response = await axios.post('http://localhost:3000/compile1', { code });
      console.log(response.data);
    } catch (error) {
      console.error('Error compiling contract:', error);
    }
  };

  const handleCompile2 = async () => {
    try {
      console.log("Compiling the contract...");
      await axios.get('http://localhost:3000/compile2');
      console.log("Contract compiled successfully!");
    } catch (error) {
      console.error('Error compiling contract:', error);
    }
  };

  const handleGetEstimatedGas = async () => {
    try {
      console.log("Estimating gas cost...");
      const response = await axios.get('http://localhost:3000/getestimated');
      console.log("Gas cost estimated:", response.data.estimatedGasCost);
      setGas(response.data.estimatedGasCost);
    } catch (error) {
      console.error('Error estimating gas cost:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Called the prompt");
      const response = await axios.post('http://localhost:3000/prompt', { code });
      console.log("Received response");
      
      setResponse(response.data.text);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='text-black h-screen flex flex-col'>
      <nav className='h-12 bg-gray-800 text-3xl flex items-center text-white font-bold'>
        GasWise
      </nav>
      <div className='flex-grow flex'>
        <div className='w-1/2 flex flex-col bg-gray-800'>
          <div className="bg-gray-200 text-black px-4 py-2 border-gray-800">
            Try your Smart Contract here:
            <button className='p-2 rounded-[10px] bg-violet-600 px-4 hover:bg-violet-500' onClick={handleSubmit}>Optimize</button>
            <button className='p-2 rounded-[10px] bg-emerald-600 ml-2 px-4 hover:bg-emerald-500' onClick={handleCompile1}>compile initial</button>
            <button className='p-2 rounded-[10px] bg-emerald-600 ml-2 px-4 hover:bg-emerald-500' onClick={handleCompile2}>compile final</button>
            <button className='p-2 rounded-[10px] bg-blue-600 ml-2 px-4 hover:bg-blue-500' onClick={handleGetEstimatedGas}>Estimate Gas</button>
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
            <textarea
            className="text-white bg-gray-800 h-full p-4"
            readOnly
            value={response}
            style={{ whiteSpace: 'pre-wrap' }}
          />
          {gas && <p className='bg-gray-800 text-white text-3xl font-bold relative bottom-3'>Estimated Gas cost: {gas}</p>}
        </div>
      </div>
    </div>
  );
}

export default Body;
