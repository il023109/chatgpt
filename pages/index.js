import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [numChildren, setNumChildren] = useState(0)
  const children = []

  for (let i = 0; i < numChildren; i++) {
    children.push(<ChildComponent key={i} number={i} />)
  }

  const addComponent = () => {
    setNumChildren((count) => count + 1)
  }


  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      //ParentComponent()
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Ask me anything</title>
       
      </Head>

      <main className={styles.main}>
        <div className={styles.result}>{result}</div>
        <div className="Home">
                 <ParentComponent addComponent={addComponent}>{children}</ParentComponent>
        </div>
        <h3>Ask me</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a question here"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Submit"/>
        </form>
        
      </main>
    </div>
  );
}

const ParentComponent = ({ children, addComponent }) => {
  return (
    <>
      
      <div>{children}</div>
    </>
  )
}

const ChildComponent = ({text}) => {
  return <h4>{text}</h4>
}
