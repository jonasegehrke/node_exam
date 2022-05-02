import { writable } from "svelte/store";



export const responseData = writable(null);

const storedLoggedIn = localStorage.getItem("loggedIn");
const loggedIn = storedLoggedIn === "true" ? true : false;
export const isLoggedIn = writable(loggedIn);
isLoggedIn.subscribe((value) => {
  localStorage.setItem("loggedIn", value);
});

const storedUserId = localStorage.getItem("userId");
const setUserId = storedUserId === null ? null : Number(storedUserId);
export const userId = writable(setUserId);
userId.subscribe((value) => {
  localStorage.setItem("userId", value);
});



const storedStudentData = localStorage.getItem("studentData");
const setStudentData = storedStudentData === null ? null : JSON.parse(storedStudentData); 
  export const studentData = writable(setStudentData);
   studentData.subscribe((value) => {
    localStorage.setItem("studentData", JSON.stringify(value));
  }); 


export const posts = writable([]);



export const students = writable([]);
