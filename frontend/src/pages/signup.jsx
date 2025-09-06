import { useState } from "react"
import {useNavigate } from "react-router-dom";
import axios from "axios"
import { InputBox } from "../components/InputBox";
import { Heading } from "../components/heading";
import { SubHeading } from "../components/subheading";
import { Button } from "../components/button";
import { ButtonWarning } from "../components/buttonWarning";

export const Signup=()=>{

    const[firstName,setFirstname]=useState("");
    const[lastName,setLastname]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const navigate=useNavigate();

    return <div>
     
    <div className="bg-white-500 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-100 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />

        <SubHeading label={"Enter your infromation to create an account"} />

        <InputBox onChange={e => {
          setFirstname(e.target.value);
        }} placeholder="John" label={"First Name"} />


        <InputBox onChange={(e) => {
          setLastname(e.target.value);
        }} placeholder="Doe" label={"Last Name"} />



        <InputBox onChange={e => {
          setEmail(e.target.value);
        }} placeholder="example@gmail.com" label={"Email"} />


        <InputBox onChange={(e) => {
          setPassword(e.target.value)
        }} placeholder="123456" label={"Password"} />


        <div className="pt-4">
          <Button onClick={async () => {
            const response = await axios.post("http://localhost:3001/api/v1/user/signup", {
              firstName,
              lastName,
              email,
              password
            });
            localStorage.setItem("token", response.data.token)
            alert("succesfull");
          }} label={"Sign up"} />
        </div>


        <ButtonWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />


      </div>
    </div>
  </div>
  </div>
}