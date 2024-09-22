import React from 'react';

function TopBar({ problemSelect, teacherSelect, topBarSelected }) {
  return (
    <div className='flex flex-row bg-[#F5F7F8] p-3 rounded-md justify-around gap-2'>
      <button
        className={`w-[50%] rounded-md p-[5px] transition-all duration-300 ease-in-out ${
          topBarSelected ? 'bg-purple-500 text-white' : 'bg-white text-black'
        }`}
        onClick={problemSelect}
      >
        Problem
      </button>
      <button
        className={`w-[50%] rounded-md p-[5px] transition-all duration-300 ease-in-out ${
          topBarSelected ? 'bg-white text-black' : 'bg-purple-500 text-white'
        }`}
        onClick={teacherSelect}
      >
        Teacher
      </button>
      <button
        className={`w-[50%] rounded-md p-[5px] transition-all duration-300 ease-in-out ${
          topBarSelected ? 'bg-white text-black' : 'bg-purple-500 text-white'
        }`}
        onClick={teacherSelect}
      >
        Analysis
      </button>
    </div>
  );
}

export default TopBar;
