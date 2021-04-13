import { useState, createElement, useEffect } from "react";
import "./App.css";

const initRules = [
  `BEGIN:VEVENT
  UID:123123
  SUMMARY:Some summary
  END:VEVENT
  `,
  `BEGIN:VEVENT
  UID:2134
  SUMMARY:Another summary
  END:VEVENT
  `,
];

// https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n/21895354#21895354
const cleanRules = (data) =>
  data.map((item) =>
    item
      .trim()
      .split(/\n/)
      .map((str) => str.trim())
  );

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

const formatRules = (rules) =>
  rules
    .map(
      (rule) =>
        "BEGIN:VEVENT\n" +
        Object.entries(rule)
          .map(([key, value]) => `${key}:${value}`)
          .join("\n") +
        "\nEND:VEVENT"
    )
    .join(",");

const textArea2Rules = (text) => {
  let arr = text.split(/\n/);
  arr.shift();
  arr.pop();
  return arr
    .join("\n")
    .split("END:VEVENT,BEGIN:VEVENT")
    .map((str) => str.split(/\n/).filter((item) => item !== ""))
    .map(parseRule);
};

const Input = ({ value, onChange }) => (
  <input value={value} onChange={onChange} />
);

function App() {
  const [rules, setRules] = useState(cleanRules(initRules).map(parseRule));
  const [textArea, setTextArea] = useState(formatRules(rules));
  const [activeRule, setActiveRule] = useState(rules[0].UID);

  const key2Component = (prop, value) => {
    switch (prop) {
      case "UID":
        return createElement("input", { value, disabled: true });
      case "SUMMARY":
        return createElement(Input, {
          prop,
          value,
          onChange: handlePropChange(prop),
        });
      default:
        return <></>;
    }
  };
  const handleRuleSelect = (event) => {
    setActiveRule(event.target[event.target.selectedIndex].id);
  };

  const handlePropChange = (prop) => (event) => {
    setRules(
      rules.map((rule) =>
        rule.UID === activeRule ? { ...rule, [prop]: event.target.value } : rule
      )
    );
  };

  useEffect(() => {
    setRules(textArea2Rules(textArea));
  }, [textArea]);

  return (
    <div className="App">
      <textarea
        value={textArea}
        onChange={(event) => setTextArea(event.target.value)}
        style={{ width: 300 }}
      ></textarea>
      <form className="form">
        <div className="grid">
          <div className="label">Rule</div>
          <select onChange={handleRuleSelect}>
            {rules.map((rule) => (
              <option key={rule.UID} id={rule.UID}>
                {rule.SUMMARY}
              </option>
            ))}
          </select>
        </div>
        <table className="rows">
          {Object.entries(rules.find(({ UID }) => UID === activeRule)).map(
            ([prop, value]) => (
              <tr key={prop} className="item">
                <td className="label">{prop}</td>
                <td>{key2Component(prop, value)}</td>
              </tr>
            )
          )}
        </table>
      </form>
      <pre>{JSON.stringify(rules, null, 2)}</pre>
    </div>
  );
}

export default App;
