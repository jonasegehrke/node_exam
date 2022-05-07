import { writable } from "svelte/store";



export const responseData = writable(null);


export const isLoggedIn = writable(false);
export const isAdmin = writable(false);


const storedStudentData = localStorage.getItem("studentData");
const setStudentData = storedStudentData === null ? null : JSON.parse(storedStudentData); 
  export const studentData = writable(setStudentData);
   studentData.subscribe((value) => {
    localStorage.setItem("studentData", JSON.stringify(value));
  }); 


export const posts = writable([]);

export const students = writable([]);


export const storedSocket = writable(null);
