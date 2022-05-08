import { writable } from "svelte/store";

export const responseData = writable(null);

export const isLoggedIn = writable(false);
export const isAdmin = writable(false);

const storedUserData = localStorage.getItem("userData");
const setUserData = storedUserData === null ? null : JSON.parse(storedUserData);
export const userData = writable(setUserData);
userData.subscribe((value) => {
  localStorage.setItem("userData", JSON.stringify(value));
});

const storedClasses = localStorage.getItem("classes");
const setClasses = storedClasses  ? JSON.parse(storedClasses) : [];
export const classes = writable(setClasses);
classes.subscribe((value) => {
  localStorage.setItem("classes", JSON.stringify(value));
});

const storedCurrentClass = localStorage.getItem("currentClass");
const setCurrentClass = storedCurrentClass === null ? null : JSON.parse(storedCurrentClass);
export const currentClass = writable(setCurrentClass);
currentClass.subscribe((value) => {
  localStorage.setItem("currentClass", JSON.stringify(value));
});

export const posts = writable([]);

export const students = writable([]);

export const storedSocket = writable(null);
