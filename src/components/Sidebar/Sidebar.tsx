import { ReactNode } from "react";
import './sidebar.css'

function SideBar({ sideBarComponent }: { sideBarComponent: ReactNode }) {
        return (
                <div className="side-bar-container">
                        {sideBarComponent}
                </div>
        );
}

export default SideBar;