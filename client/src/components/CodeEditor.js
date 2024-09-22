import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Lightbulb } from 'lucide-react';

const renderOutput = (output) => {
  if (!output || output.length === 0) return 'No output';
  
  return output.map((item, index) => (
    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
      {item.error ? (
        <p className="text-red-500">{item.error}</p>
      ) : (
        <>
          <p><strong>Test Case {index + 1}:</strong></p>
          <p>Input: {JSON.stringify(item.input)}</p>
          <p>Expected: {JSON.stringify(item.expected)}</p>
          <p>Output: {JSON.stringify(item.output)}</p>
          <p className={item.passed ? "text-green-500" : "text-red-500"}>
            {item.passed ? "Passed" : "Failed"}
          </p>
        </>
      )}
    </div>
  ));
};

const CodeEditor = ({ setCode, setOutput, output, code, id, answers, setAnswersFunc }) => {
  const [editorMounted, setEditorMounted] = useState(false);
  
  const handleEditorChange = (value) => {
    setCode(value);
  };

  const executeCode = async () => {
    try {
      const response = await fetch(`http://localhost:8080/submit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setOutput(result);


      const failedTests = result.filter(test => !test.passed);
      console.log("failed tests", failedTests)

      if (failedTests.length > 0) {
        await getLLMfeedback(code, failedTests);
      }

      if(failedTests.length == 0){
        await CorrectAnswerLLM(code)
      }

    } catch (error) {
      setOutput([{ error: 'Error executing code: ' + error.message }]);
    }
  };

  const helpLlm = async () => {
    const sessionId = 3;
    const question = `${code}\n\nThe above is my code. I am stuck here. Can you help me?`;
    try {
      const response = await fetch("http://localhost:8080/ask-llm", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, question })
      });

      if (!response.ok) {
        throw new Error("LLM request failed");
      }
      const data = await response.json();
      setAnswersFunc(data.response);

      
    } catch (error) {
      console.error("Error while getting LLM help:", error);
    }
  };

  const getLLMfeedback = async (code, failedTests) => {
    const sessionId = 3;
    const question = `
      Here's my code:
      ${code}

      The following test cases failed:
      ${failedTests.map((test, index) => `
        Test Case ${index + 1}:
        Input: ${JSON.stringify(test.input)}
        Expected: ${JSON.stringify(test.expected)}
        Output: ${JSON.stringify(test.output)}
      `).join('\n')}

      Can you explain why the code is not correct and suggest how to fix it?
    `;

    try{
      const response = await fetch("http://localhost:8080/ask-llm", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, question })
      })
      if (!response.ok) {
        throw new Error("LLM request failed");
      }
      const data = await response.json();
      setAnswersFunc(data.response);
    }catch(error){
      console.error("Error while getting LLM feedback:", error);
    }
  }


  const CorrectAnswerLLM = async (code) => {
    const sessionId = 3
    const question = `code +  
      ${code}
        the above code is the correct solution for problem. 
        Explain how the ways the user can improve the code. 
        Give me review of the Code too. How the code can be optimsied in terms of space and time complexity. 
        If everything is perfect, congratulate on solving the problem 
    `
    try{
      const response = await fetch("http://localhost:8080/ask-llm", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, question })
      })

      if(!response.ok){
        throw new Error("LLM request failed")
      }
      const data = await response.json()
      setAnswersFunc(data.response)
    }catch(error){
      console.error("Error while getting LLM feedback:", error);
    }
  }

  const GetLlmHint = async() => {
    const sessionId = 3
    const question = `code +  
    ${code}
      the above code is the code that the user is writing and he is probably stuck.
      the user has asked for hint, give it to him. Make it breif
    `
    try{
      const response = await fetch("http://localhost:8080/ask-llm", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, question })

      })
      if(!response.ok){
        throw new Error("LLM request failed")
      }
      const data = await response.json()
      setAnswersFunc(data.response)
    }catch(error){
      console.error("Error while getting LLM feedback:", error);
    }
  }
  

  const onClear = () => {
    setCode("");
    setOutput([]);
  };

  return (
    <div className="p-4 h-full bg-[#F5F7F8] border border-gray-900 rounded-md w-[600px]">
      <div className=' pr-2 flex justify-end items-end  '>
        <button className='p-1 rounded-2xl hover:bg-yellow-500 cursor-pointer'
          onClick={GetLlmHint}
        >
          
           <Lightbulb  color="black" fill='yellow'/>
        </button>
      </div>
      <div className="mb-4 mt-4 border border-gray-300 rounded-md overflow-hidden">
        <Editor
          height="450px"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          onMount={() => setEditorMounted(true)}
          options={{
            theme: 'vs-light',
            backgroundColor: '#9CFF83'
          }}
        />
      </div>
      <div className="flex flex-row justify-between space-x-2 mb-4">
        <div className="flex flex-row gap-4">
          <button
            onClick={onClear}
            className="px-8 py-1 bg-[#D2D2D2] text-black rounded-xl border border-gray-900 hover:bg-[#a1a1a1] transition-colors"
          >
            Clear
          </button>
          <button
            onClick={executeCode}
            className="px-8 py-1 bg-[#9CFF83] text-black rounded-xl border border-gray-900 hover:bg-[#71f550] transition-colors"
          >
            Run
          </button>
        </div>
        <div>
          <button
            className="px-8 py-1 bg-[#D2D2D2] text-black rounded-xl border border-gray-900 hover:bg-[#a1a1a1] transition-colors"
            onClick={helpLlm}
          >
            Help
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Output:</h3>
        <div className="bg-[#EDFAE4] p-4 rounded-md border border-gray-300 min-h-[200px]">
          {renderOutput(output)}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;