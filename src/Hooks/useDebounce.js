import { useEffect,useState } from "react";

export default function useDebounce(value){
   const[debouncedValue,setDebouncedValue]=useState("")
    useEffect(()=>{
       const timeoutId= setTimeout(() => {
             setDebouncedValue(value)
        }, 500);
        return ()=>clearTimeout(timeoutId)
   },[value])
   return {debouncedValue,setDebouncedValue}
}
