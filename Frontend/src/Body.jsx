import React, { useState } from 'react';

const Body = () => {
  const [code, setCode] = useState("");

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <div className='text-black h-screen flex flex-col'>
      <nav className='h-12 bg-black text-2xl flex items-center justify-center text-white'>
        GasWise
      </nav>
      <div className='flex-grow flex'>
        <div className='w-1/2 flex flex-col'>
          <div className="bg-gray-200 text-black px-4 py-2 border-b border-gray-800">
            Enter your Contract here:
            <button className='p-2 rounded-[10px] bg-blue-500 relative left-[500px] px-4'>Run</button>
          </div>
          <textarea
            className="flex-grow px-4 py-2 text-sm text-white rounded-none border border-gray-800 focus:outline-none bg-gray-800"
            value={code}
            onChange={handleChange}
            placeholder="Enter your code here..."
          />
        </div>
        <div className='w-1/2 bg-gray-300 flex items-center justify-center'>
          <div>Output div</div>
        </div>
      </div>
    </div>
  );
}

export default Body;
