// for error catch
import { useRouteError } from "react-router-dom";


const Error = () => {

    const error = useRouteError();
    // Cho thấy thông tin chi tiết về lỗi (như status và statusText

    return (
        <div>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            {/* Hiển thị lỗi tương ứng */}
            <p>
                <i>{error.status} - {error.statusText || error.message}</i>
            </p>
        </div>
    );
}

export default Error;