// src/components/EmptyTutorial.jsx
import React from 'react'

export default function EmptyTutorial({onCreate}) {
    return (
        <div className="main-container" style={{textAlign: 'center'}}>
            <h1>퀴즈북이 아직 없습니다</h1>
            <p style={{color: "white"}}>
                1. 퀴즈 생성 <a href="https://chatgpt.com/g/g-68493cdaf5208191867bcc81fa3f017b-kwijeu-meikeo" target="_blank" rel="noreferrer" style={{color: '#2563eb'}}>GPTER
                링크</a> 클릭
            </p>
            <p style={{color: "white"}}>
                2. 가이드에 따라 json 형태로 퀴즈 생성
            </p>
            <p style={{color: "white"}}>
                3. 퀴즈 만들기 클릭 후 json 을 입력
            </p>
            <p style={{color: "white"}}>
                4. 퀴즈 선택에서 퀴즈 확인
            </p>

            <button
                className="start-btn"
                onClick={onCreate}
                style={{marginTop: '1rem'}}
            >
                퀴즈 만들러 가기
            </button>
        </div>)
}
