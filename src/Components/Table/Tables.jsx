import { Table } from 'antd';
function Tables() {

    const colums = [
        {
            title: 'Name', // Tiêu đề của cột
            dataIndex: 'name', // Khóa của dữ liệu tương ứng
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'act',
        },
    ];

    // Dữ liệu của bảng
    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            action: [
                <a key="delete">Delete &nbsp;</a>,
                <a key="update">Update &nbsp;</a>,
            ],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            action: [
                <a key="delete">Delete &nbsp;</a>,
                <a key="update">Update &nbsp;</a>,
            ],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            action: [
                <a key="delete">Delete &nbsp;</a>,
                <a key="update">Update &nbsp;</a>,
            ],
        },
        {
            key: '4',
            name: 'Alan Walker',
            age: 23,
            address: 'John Cena',
            action: [
                <a key="delete">Delete &nbsp;</a>,
                <a key="update">Update &nbsp;</a>,
            ],
        },
    ];

    return (
        <Table
            columns={colums}
            dataSource={data}
            pagination={{
                position: ['bottomCenter'],
                showSizeChanger: true, // Cho phép thay đổi số dòng trên mỗi trang
                pageSizeOptions: ['1', '2', '3'], // Các tùy chọn về số dòng
                showQuickJumper: true, // Cho phép nhảy tới trang cụ thể
            }}
            bordered // Thêm đường viền cho bảng
        />
    )
}

export default Tables;
