import { writable } from "svelte/store";



export const responseData = writable(null);


//This is kept for now, but it is not optimal. The localStorage can be manipulated from the client side.
//However, the backend still uses session to check if the user is logged in, so the site is non-functional without an actual session cookie.
const storedLoggedIn = localStorage.getItem("loggedIn");
const loggedIn = storedLoggedIn === "true" ? true : false;
export const isLoggedIn = writable(loggedIn);
isLoggedIn.subscribe((value) => {
  localStorage.setItem("loggedIn", value);
});

const storedStudentData = localStorage.getItem("studentData");
const setStudentData = storedStudentData === null ? null : JSON.parse(storedStudentData); 
  export const studentData = writable(setStudentData);
   studentData.subscribe((value) => {
    localStorage.setItem("studentData", JSON.stringify(value));
  }); 


export const posts = writable([]);



export const students = writable([]);
