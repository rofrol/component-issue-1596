import { useState } from "react";
import "./App.css";

const initRules = [
  `BEGIN:VEVENT
  UID:123123
  SUMMARY:Some summary
  END:VEVENT
  `,
];

// https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n/21895354#21895354
const cleanData = (data) =>
  data.map((item) => item.split(/\n/).map((str) => str.trim()));

const parseRule = (data) => {
  return data.reduce((acc, str) => {
    // https://stackoverflow.com/questions/4607745/split-string-only-on-first-instance-of-specified-character/59457829#59457829
    const index = str.indexOf(":");
    var [key, value] = [str.slice(0, index), str.slice(index + 1)];
    if (!(value === "VEVENT" && (key === "BEGIN" || key === "END")))
      acc[key] = value;
    return acc;
  }, {});
};

function App() {
  const [rules, setRules] = useState(cleanData(initRules));
  return (
    <div className="App">
      <pre>{JSON.stringify(rules, null, 2)}</pre>
      <pre>{JSON.stringify(parseRule(rules[0]), null, 2)}</pre>
      <textarea value={rules.map((item) => item.join("\n"))}></textarea>
    </div>
  );
}

export default App;
