import { writable } from "svelte/store";
import type { ColorMode, StoredResults } from "../App";

const storedColorMode : ColorMode = localStorage.getItem("colorMode") as ColorMode ?? "dark"
export const colorMode = writable(storedColorMode);
colorMode.subscribe(value => {
    localStorage.setItem("colorMode", value == "dark" ? "dark" : "light")
})

const storageStoredResults : StoredResults = JSON.parse(localStorage.getItem("storedResults") ?? "[]", 
    (key, value) => {
        if(key == "dateTaken")
        {
            return new Date(value);
        }
        return value;
    }) as StoredResults
export const storedResults = writable(storageStoredResults);
storedResults.subscribe(value => {
    localStorage.setItem("storedResults", JSON.stringify(value))
})