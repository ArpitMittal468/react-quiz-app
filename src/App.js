import apiDetails from './apiDetails.js';
import { useState } from 'react';

function Header() {
  return (
    <header className="Header">
      <h1>Quiz App</h1>
    </header>
  );
}

var decodeHTML = function (html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};


function QuestionCard(props, currentNum) {
  // console.log(props);
  let ans = [];

  function checkAndSet(liId) {
    const clickedElement = liId.target.id;
    const userAnswer = document.getElementById(clickedElement).innerHTML;
    if (userAnswer === props['correct_answer'])
      document.getElementById(clickedElement).setAttribute('class', 'correct');
    else document.getElementById(clickedElement).setAttribute('class', 'wrong');
  }

  let idGiver = 1;
  props['incorrect_answers'].push(props['correct_answer']);
  for (const a of props['incorrect_answers']) {
    ans.push(<li id={"li-" + idGiver} onClick={(e) => checkAndSet(e)} className="defualtLi">{decodeHTML(a)}</li>);
    idGiver++;
  }

  // ans.push(<li id = {"li-"+idGiver} onClick={checkAndSet}>{props['correct_answer']}</li>);
  ans.sort(() => Math.random() - 0.5);

  return (<>
    <section className="Card">
      <section className="question">
        <p><u>Question:</u> {currentNum}/{questionData.results.length}</p>
        <p>{decodeHTML(props.question)}</p>
      </section>
      <section className="answer">

        {ans}

      </section>
    </section>
    <button className="nextButton" onClick={setNewQuestion}>Next Question</button>
  </>
  );
}

let questionData = {};

let questionCount = 0;

async function setNewQuestion() {
  // console.log(questionData);
  if (questionCount < questionData['results'].length) {
    await setMenu(QuestionCard(questionData['results'][questionCount], questionCount + 1));
    // console.log('--------------');
    for (let i = 1; i <= questionData['results'][questionCount]['incorrect_answers'].length; i++) {
      let ele = document.getElementById('li-' + i);
      // console.log(ele);
      ele.setAttribute('class', 'defualtLi');
    }
    questionCount++;
  }
  else {
    questionCount = 0;
    setMenu(Entrys());
  }
}

function Loading(){
  return (
    <>
    <section className="EntryCard">
      <section className="entry">
      <h1 style={{textAlign:'center'}}>Loading Quiz Data ...</h1>
      </section>
    </section>
    </>
  );
}

function loadData() {
  // console.log("here");
  let api = "https://opentdb.com/api.php?";
  for (const key in apiDetails) {
    let val = document.getElementById(key + '-id').value;
    // console.log(val);
    api = api + key + "=" + val + "&";
  }
  // console.log(api);
  const data = fetch(api);
  setMenu(Loading());
  data.then(res => res.json()).then(
    res => {
      questionData = res;
      console.log(res);
      setNewQuestion();
    }
  );
}

function Entrys() {

  let components = [];

  for (const key in apiDetails) {
    components.push(<p>{key.toUpperCase()}</p>);
    let innerElements = [];
    for (const innerKey in apiDetails[key])
      innerElements.push(<option value={apiDetails[key][innerKey]}>{innerKey}</option>);
    components.push(<select id={key + "-id"} className="selectTag">{innerElements}</select>);

  }
  return (
    <section className="EntryCard">
      <section className="entry">
        <p>Choose Entities: </p>
        {components}
        <br />
        <button className="bttn1" onClick={loadData}>Start Quiz</button>
      </section>
    </section>);
}


// let menu;
let setMenu;


function App() {
  // menu = Entrys();
  // QuestionCard({ 'question': "dfd", "correct_answer": "afasd", "incorrect_answers": ["a", "b"] })
  let [menu, setter] = useState(Entrys());
  setMenu = setter;

  return (
    <>
      <Header />
      {menu}
    </>
  );
}


export default App;
