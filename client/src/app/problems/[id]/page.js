"use client"
import React, { useState , useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import ProblemDescription from '@/components/ProblemDescription';
import ChatBox from '@/components/ChatBox';
import CodeEditor from '@/components/CodeEditor';
import { Router, useParams, useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';

const page = () => {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState('');
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState([])
  const [topBarSelected, setTopBarSelected] = useState(true)

  const problemSelect = () => {
    setTopBarSelected(true)
  }

  const teacherSelect = () => {
    setTopBarSelected(false)
  }


  const setAnswersFunc = (data) => {
    setAnswers(prev => [...prev, data]);
  }


 
  const params =  useParams()
  const id = params.id;

  const initiateLlm = async (problemData) => {
    const sessionId = 3
    const question = `question:${problemData.description}${problemData.examples}${problemData.starterCode.javascript}this is the problem i am going to solve`;

    try {
      const res = await fetch("http://localhost:8080/ask-llm", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, question })
      })

      if (!res.ok) {
        throw new Error("Failed to initiate llm")
      }
      const data = await res.json()
      setAnswersFunc(data.response)
    } catch (error) {
      console.log("error happened while creating experience ", error)
    }
  }


  useEffect(() => {
    const fetchingProblem = async () => {
        try{
        const response = await fetch(`http://localhost:8080/internal/problems/${id}`, {
            method: "GET"
        })
        if (!response.ok){
            throw new Error('Network response was not ok');
        }
        const res = await response.json()
        setProblem(res)
        setCode(res.starterCode.javascript);
        await initiateLlm(res)

     }catch(error){
        console.error("Error fetching problem:", error);
     }finally{
        setLoading(false)
     }
    }

  
    fetchingProblem()
  }, []);

  // useEffect(() => {
  //   console.log(answers)
  // }, [answers])




  if (loading) {
    return <div>Loading...</div>;
  } 


  return (


    <div className="flex flex-row gap-6 mx-8 mb-5">

          <div className="flex flex-col gap-3 ">
            <TopBar problemSelect={problemSelect} teacherSelect={teacherSelect} topBarSelected={topBarSelected} />
            {topBarSelected &&
              <ProblemDescription 
                title={problem.title}
                description={problem.description}
                constraints={problem.constraints}
                examples={problem.examples}
              />
            }
            
            {!topBarSelected &&  <ChatBox answers={answers}  />
 }
          </div>


      <div >
           <CodeEditor 
           setCode={setCode} 
           setOutput={setOutput} 
           output={output} 
           code={code} 
           id={id}
           answers={answers}
           setAnswersFunc={setAnswersFunc}
          
          />

      </div>

    </div>


  
  );
};

export default page;
