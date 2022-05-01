import { writable } from 'svelte/store';

const storedLoggedIn = localStorage.getItem("loggedIn");
const loggedIn = storedLoggedIn === "true" ? true : false;

export const isLoggedIn = writable(loggedIn);

isLoggedIn.subscribe(value => {
  localStorage.setItem("loggedIn", value);
});

const storedUserId = localStorage.getItem("userId");
const setUserId = storedUserId === null ? null : Number(storedUserId);

export const userId = writable(setUserId);

userId.subscribe(value => {
    localStorage.setItem("userId", value);
});

export const responseData = writable(null);
