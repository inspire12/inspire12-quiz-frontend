import React from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import QuizSolvePage from "./pages/QuizSolvePage.jsx";
import QuizSelectPage from "./pages/QuizSelectPage.jsx";
import QuizCreatePage from "./pages/QuizCreatePage.jsx";
import SigninPage from "./pages/SigninPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import AuthHandler from "./components/AuthHandler.jsx";
import WrongNoteList from "./components/WrongNoteList.jsx";
import {CSSTransition, TransitionGroup} from 'react-transition-group'


function App() {

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.pathname}
                classNames="fade"
                timeout={{enter: 300, exit: 200}}
            >
                <BrowserRouter>
                    <AuthHandler/> {/* 세션 확인 후 자동 리디렉션 */}
                    <div style={{display: 'flex'}}>
                        <Sidebar/>
                        <div style={{marginLeft: '200px', width: '100%'}}> {/* Sidebar 너비 고려 */}

                            <Routes>
                                <Route path="/" element={<QuizSelectPage/>}/>
                                <Route path="/login" element={<SigninPage/>}/>
                                <Route path="/signup" element={<SignupPage/>}/>
                                <Route path="/quiz/:quizId" element={<QuizSolvePage/>}/>
                                <Route path="/create" element={<QuizCreatePage/>}/>
                                <Route path="/wrong-notes" element={<WrongNoteList/>}/>
                            </Routes>
                        </div>
                    </div>
                </BrowserRouter>
            </CSSTransition>
        </TransitionGroup>
    )
}

export default App