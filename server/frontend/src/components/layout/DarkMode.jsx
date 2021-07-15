import React, { useState, useEffect } from 'react'
import './DarkMode.css'
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness2Icon from '@material-ui/icons/Brightness2';

export default function DarkMode() {
    
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')));

    const trigger = () => {
        setDarkMode(!darkMode);
        
    };

    useEffect(() => {    
       updateTheme(darkMode);
    }, [darkMode]);

    const updateTheme = (darkMode) => {
        const styles = getComputedStyle(document.body);
        const black = styles.getPropertyValue("--black");
        const white = styles.getPropertyValue("--white");
        const feed = styles.getPropertyValue("--feed");
        const darkFeed = styles.getPropertyValue("--darkFeed")
        const docEl = document.documentElement;
      
        if (darkMode == false) {
            console.log("3")
            docEl.style.setProperty("--background", black);
          docEl.style.setProperty("--foreground", white);
          docEl.style.setProperty("--backgroundfeed", feed);
          document.querySelector("html").classList.remove("darkmode");
        } else if(darkMode == true){
            console.log("2")
            docEl.style.setProperty("--background", white);
          docEl.style.setProperty("--foreground", black);
          docEl.style.setProperty("--backgroundfeed", darkFeed);
          document.querySelector("html").classList.remove("darkmode");
        }else{
            console.log("1")
            docEl.style.setProperty("--background", black);
            docEl.style.setProperty("--foreground", white);
            docEl.style.setProperty("--backgroundfeed", feed);
            document.querySelector("html").classList.remove("darkmode");
        }
        localStorage.setItem('darkMode', darkMode);
      };

    return (
        <div className="darkmode1">
        <label className="toggle-wrapper" htmlFor="toggle">
            <div className={`toggle ${darkMode == false ? "disabled" : "enabled"}`}>
                <div className="iconsToggle">
                    <WbSunnyIcon />
                    <Brightness2Icon />
                </div>
                <input
                    id="toggle"
                    name="toggle"
                    type="checkbox"
                    checked={darkMode}
                    onClick={trigger}
                />
            </div>
        </label>
        </div>
    );
}
