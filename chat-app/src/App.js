import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import SidePanel from "./components/SidePanel/SidePanel";
import ChatPanel from "./components/ChatPanel/ChatPanel";

const App = () => {
  const currentChannel = useSelector((state) => state.channels.currentChannel);

  return (
    <Grid columns="2" style={{ background: "#eee", height: "110vh" }}>
      <Grid.Column width="3">
        {/* Sidebar Alanı */}
        <SidePanel />
      </Grid.Column>

      <Grid.Column width="13" style={{ background: "#fff" }}>
        {/* Chat Panel Alanı */}
        {currentChannel && <ChatPanel currentChannel={currentChannel} />}

      </Grid.Column>
    </Grid>
  );
};

export default App;
