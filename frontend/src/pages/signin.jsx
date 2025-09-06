import { ButtonWarning } from "../components/buttonWarning";
import { Button } from "../components/button";
import { Heading } from "../components/heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/subheading";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"


export const Signin = () => {

    const[email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

    return <div> 
  
    <div className="bg-white-500 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={(e)=>{
            setEmail(e.target.value);
        }} placeholder="xyz@gmail.com" label={"Email"} />

        <InputBox onChange={(e)=>{
            setPassword(e.target.value)
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async(e)=>{
                const response=await axios.post("http://localhost:3001/api/v1/user/signin",{
                    email,
                    password
          });
                localStorage.setItem("token",response.data.token);
                navigate("/dashboard")
          }} label={"Sign in"} />
        </div>
        <ButtonWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/"} />
      </div>
    </div>
  </div>
</div> 
}