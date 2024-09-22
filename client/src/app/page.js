"use client"
import EnhancedAIAnimation from "@/components/MainPageAnimation";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative mx-8 ">
      <div className="bg-[#EDFAE4] w-full h-[30rem] border border-gray-800 rounded-md  ">

         <div className=" pt-[5rem] p-11 flex flex-col gap-[5rem] ">
            <div>
                <p className="text-[#16423C] text-[2.7rem] font-bold w-[50%]">
                  Learn DSA but better, 
                </p>
                <p className="text-[#16423C] text-[2.7rem] font-bold w-[50%]">
                  don't let the AI learn for you.
                </p>
            </div>

            <div >
                <p className="text-[#16423C] text-lg font-bold w-[50%]">
                  Take help from AI, but not too much, we can help you to learn DSA.
                </p>
                <p className="text-[#16423C] text-lg font-bold w-[50%]">
                  By giving you AI assistence, but most importantly we push you

                </p>
            </div>

          </div> 

          <div className="absolute top-[2.6rem] right-40" >
             <EnhancedAIAnimation />
          </div>
          
      </div>
    </main>
  );
}
