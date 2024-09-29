import { Menu } from "antd";
import { HomeOutlined } from '@ant-design/icons';
import { PiFarmBold } from "react-icons/pi";
import { IoFish } from "react-icons/io5";
// import { MdPayments } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { RiBillFill } from "react-icons/ri";
import { useNavigate,useLocation  } from "react-router-dom";
import "./MenuList.css"

const MenuList = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Menu theme="dark" 
        mode="inline" 
        className="menu-bar"
        selectedKeys={[currentPath]}>
            <Menu.Item key="/admin" icon={<HomeOutlined />} onClick={() => navigate("/admin")}>
                Home
            </Menu.Item>
            <Menu.SubMenu
                key='bill'
                icon={<RiBillFill />}
                title="Bill">
                <Menu.Item key="/admin/ManagerPendingOrder" onClick={() => navigate("ManagerPendingOrder")}>
                    Pending order
                </Menu.Item>
                <Menu.Item key="/admin/ManagerOrderHistory" onClick={() => navigate("ManagerOrderHistory")}>
                    History
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="/admin/ManagerFarm" icon={<PiFarmBold />} onClick={() => navigate("ManagerFarm")}>
                Farm
            </Menu.Item>
            <Menu.Item key="/admin/ManagerKoi" icon={<IoFish />} onClick={() => navigate("ManagerKoi")}>
                Koi
            </Menu.Item>
            <Menu.Item key="/" icon={<IoMdSettings />} onClick={() => navigate("/admin")}>
                Setting
            </Menu.Item>
        </Menu>
    );
};

export default MenuList