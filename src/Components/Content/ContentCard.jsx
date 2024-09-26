import { Divider } from "antd";
import Cards from "../Cards/Cards";

function ContentCard(props) {

    const title = props.title;

    const dataList = props.dataList || {};

    return (
        <>
            <Divider orientation="left" style={{ margin: '20px 0', fontSize: '25px' }}>{title}</Divider>
            <Cards dataListCards={dataList} />
        </>
    );
}

export default ContentCard;