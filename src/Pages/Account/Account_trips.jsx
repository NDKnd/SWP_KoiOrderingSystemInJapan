import { Divider, ConfigProvider, Tabs } from "antd";

const tabPanels = [{ id: 1, label: "All", content: <trips /> }];

function trips() {
  return (
    <>
      <Divider orientation="right">
        <h3>Trips</h3>
      </Divider>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              colorPrimary: "var(--purple1)",
              itemHoverColor: "var(--purple2)",
              itemActiveColor: "var(--purple5)",
            },
          },
        }}
      >
        <Tabs>
          {tabPanels.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.id}>
              {item.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </ConfigProvider>
    </>
  );
}

export default trips;
