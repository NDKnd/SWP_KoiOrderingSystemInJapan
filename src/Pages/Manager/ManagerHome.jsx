
import { Layout } from "antd";
import "./Manager.css"

const ManagerHome = () => {

    const token = localStorage.getItem("token");

    return (
        <>
                <div>

                    <h1>{token}</h1>

                </div>
        </>
    )
}

export default ManagerHome;