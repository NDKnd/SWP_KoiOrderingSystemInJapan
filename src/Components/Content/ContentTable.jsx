// import React from "react";
// import { useState } from "react";
import { Divider } from "antd";
import MyTables from "../Table/Tables";

function ContentTable(props) {
  const title = props.title;

  const dataList = props.dataList || {};

  return (
    <>
      <Divider
        orientation="left"
        style={{ margin: "20px 0", fontSize: "25px" }}
      >
        {title}
      </Divider>
      <MyTables dataListTable={dataList} />
    </>
  );
}

ContentTable.defaultProps = {
  title: "Default",
  dataList: [{}],
};

ContentTable.propTypes = {
  title: "string",
  dataList: "array",
};

export default ContentTable;
