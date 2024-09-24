import Header from "../../Components/Header/Header";
import MyTables from "../../Components/Table/Tables";
import Footers from "../../Components/Footer/Footers";
import Carousels from "../../Components/Carousel/Carousel";


function Home() {

    return (
        <>
            <Header />
            <div className="content">
                <MyTables />
                <Carousels/>
            </div>
            <Footers />
        </>
    );
}

export default Home;