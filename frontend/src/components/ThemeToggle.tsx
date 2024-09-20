'use client'
import '@/assets/css/themetoggle.css'
import { useTheme } from '@/context/themecontext';
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <>
            <div className={`theme-toggle rounded-pill ${theme} me-3 theme-mode`} onClick={toggleTheme}>
                <MdOutlineLightMode className={`theme-icon me-2 rounded-circle ${theme == 'light' ? 'active' : ' '}`} />
                <MdOutlineDarkMode className={`theme-icon rounded-circle ${theme == 'dark' ? 'active' : ' '}`} />
            </div>
        </>
    )
}

export default ThemeToggle;