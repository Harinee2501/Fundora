import React from "react";
import AES from "../../assets/images/aes.jpg";
import { LuTrendingUpDown } from "react-icons/lu";

// StatsInfoCard component
// const StatsInfoCard = ({ icon, label, value, color }) => {
//   return (
//     <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
//       <div
//         className={`w-12 h-12 flex items-center justify-center text-[26px] text-white rounded-full drop-shadow-xl ${color}`}
//       >
//         {icon}
//       </div>
//       <div>
//         <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
//         <span className="text-[20px]">${value}</span>
//       </div>
//     </div>
//   );
// };

// Main Layout
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Left Content */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-3xl font-medium text-black">
          Fundora - Your expense tracker
        </h2>
        {children}
      </div>

      {/* Right Side */}
      <div className="hidden md:block w-[40vw] h-screen bg-[#F4E9DC] bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
      <div className="w-48 h-48 rounded-[40px] bg-[#A97B55] absolute -top-7 -left-5" />
      <div className="w-48 h-56 rounded-[40px] border-[20px] border-[#CBB7A1] absolute top-[30%] -right-5" />
      <div className="w-48 h-48 rounded-[40px] bg-[#5E3F2F] absolute -bottom-7 -left-5" />
{/* 
        <div className="grid grid-cols-1 z-20 relative">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income and Expenses"
            value="430,000"
            color="bg-purple-600"
          />
        </div> */}

        <img
          src={AES}
          alt="AES Illustration"
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15 z-10"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
