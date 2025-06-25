import React from 'react'
import {PhoneCall,MapPinned,Mail,Youtube,Github,Linkedin,Facebook} from 'lucide-react'

function Contact() {
  return (
    <>
    <div className="grid grid-cols-2 w-full max-w-7xl">
      <div className="bg-red-600 rounde-lg p-10">
        <div> 
        <h1 className="text-white text-5xl mb-10">Contact us</h1>
        <p className="text-white"> Feel free to use the form or Drop us an email . old-fashioned phone calls work too</p>
        </div>
    <div className="mt-15">
      <ul className="flex flex-col text-white text-right">
        <li className="flex m-10 items-center  text-right sm:m-5 sm:text-right"><PhoneCall color="white" className=" mr-10 "/><span className="text-right">call us on +111111111 </span> </li>
        <li className="flex items-center m-10 sm:m-5 sm:text-right" ><Mail  color="white"className=" mr-10 "/> <span> write mail on no-reply@cube.com</span></li>

        <li className="flex items-center m-10 sm:m-5 sm:text-right"><MapPinned color="white" size="50" className=" mr-10 "/> <span> Locate us on Harishankar road, jjhar, birmingham city,canada, 124560</span></li>

        <li className="grid grid-cols-4 pl-17 pt-45 items-center justify-center"><Github/> <Youtube/><Facebook/><Linkedin/></li>
      </ul>
    </div>
    </div>
    <form className="flex flex-col  rounde-lg p-10"  >
      <label htmlFor="email" className="text-left pl-5 p-3 font-sans text-gray-700 font-semibold outline-none">Email</label>
      <input type="text" name='e-mail' id="email" placeholder='E-mail' className="border-2 border-red-700 rounded-lg  placeholder-red-400 placeholder:pl-5 placeholder:letter-spacing-1 outline-none"/>
      <label htmlFor="name" className="text-left pl-5 p-3 font-sans text-gray-700 font-semibold outline-none">Name</label>
      <input type="text" name='your_name' id="name"placeholder='Name' className="border-2 border-red-700 rounded-lg  placeholder-red-400 placeholder:pl-5 placeholder:letter-spacing-1 outline-none"/>
      <label htmlFor="telephone" className="text-left pl-5 p-3 font-sans text-gray-700 font-semibold outline-none">Phone</label>
      <input type="tel" name='Number'id="telephone" placeholder='Number' className="border-2 border-red-700 rounded-lg  placeholder-red-400 placeholder:pl-5 placeholder:letter-spacing-1 outline-none"/>
      <label htmlFor='Gender'className="text-left pl-5 p-3 font-sans text-gray-700 font-semibold outline-none">Gender</label>

      <div id="Gender" className=" flex ml-5 outline-none">
      <label htmlFor="male" className="mr-1 font-semibold text-gray-700 outline-none">Male</label>
      <input type="radio" name="gender" id="male" className=" ml-1 mr-5 outline-none "/>
      <label htmlFor="female" className=" mr-2 ml-30 text-gray-700 font-semibold outline-none">Female</label>
      <input type="radio" name="gender" id="female" className=" ml-1 outline-none"/>
      </div>

      <label htmlFor='message' className="text-left pl-5 p-2 font-sans text-gray-700 font-semibold outline-none">Message</label>
      <input type='textarea' name="text-box" placeholder='Type you message here' id='message' className="border-2 border-red-700 rounded-lg  placeholder-red-400 placeholder:pl-5 placeholder:letter-spacing-1 pb-50 outline-none"/>
      <button type="submit" className="w-full bg-red-600 text-white rounded-lg mt-5 p-2 outline-none">Submit</button>
      
    </form>
    </div>
    </>
)
}

export default Contact