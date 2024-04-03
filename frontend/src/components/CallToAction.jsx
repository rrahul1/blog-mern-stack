import React from "react";
import { Button } from "flowbite-react";

const CallToAction = () => {
   return (
      <div
         className="flex flex-col sm:flex-row p-3 border border-teal-500 
      justify-center items-center rounded-tl-3xl rounded-br-3xl text-center"
      >
         <div className="flex-1 justify-center flex flex-col">
            <h2 className="text-2xl">Want to learn more about MERN</h2>
            <p className="text-gray-500 my-2">
               Checkout my github profile for more projects
            </p>
            <Button
               gradientDuoTone="purpleToPink"
               className="rounded-tl-xl rounded-bl-none"
            >
               <a
                  href="https://www.github.com/rrahul1"
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  Follow me on Github
               </a>
            </Button>
         </div>
         <div className="flex-1 p-7">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiagnRkQGJbz2j2lANDBvNP7vLpXP89XYglSdwU_PEiw&s" />
         </div>
      </div>
   );
};

export default CallToAction;
