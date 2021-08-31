import React from 'react';
import "./App.scss";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import SignUpIn from './components/SignUpIn/SignUpIn';
import Sidebar from './components/Common/Sidebar/Sidebar';
import Logout from './components/Logout/Logout';
import VideoHome from './components/VideoHome/VideoHome';
import Upload from './components/Upload/Upload';
import MyVideos from './components/MyVideos/MyVideos';
import Profile from './components/Common/Profile/Profile';
const Routing = () => {
    return (
        <main>
            <Switch>
                <Route path="/" exact>
                    <SignUpIn />
                </Route>
                <Route path="/videos" exact>
                    <VideoHome />
                </Route>
                <Route path="/uploadVideo" exact>
                    <Upload />
                </Route>
                <Route path="/profile" exact>
                    <Profile />
                </Route>
                <Route path="/myVideos" exact>
                    <MyVideos />
                </Route>
                <Route path="/logout" exact>
                    <Logout />
                </Route>
                <Redirect to="/" />
            </Switch>
        </main>
    )
}
const App = () => {
    return (
        <Router>
            <Sidebar />
            <div className="main-div">
                <Routing />
            </div>
        </Router>
    )
}

export default App
