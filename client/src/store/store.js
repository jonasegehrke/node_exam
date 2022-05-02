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
const setStudentData =
  storedStudentData === null ? null : JSON.parse(storedStudentData);
export const studentData = writable(setStudentData);
studentData.subscribe((value) => {
  localStorage.setItem("studentData", JSON.stringify(value));
});


const storedPosts = localStorage.getItem("posts");
const setPosts = storedPosts === storedPosts ? JSON.parse(storedPosts) : [];
export const posts = writable(setPosts);
posts.subscribe((value) => {
  localStorage.setItem("posts", JSON.stringify(value));
});

const storedStudents = localStorage.getItem("students");
const setStudents = storedStudents === storedStudents ? JSON.parse(storedStudents) : [];
export const students = writable(setStudents);
students.subscribe((value) => {
  localStorage.setItem("students", JSON.stringify(value));
});