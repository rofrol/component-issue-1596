import { useState, createElement } from "react";
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

const Summary = ({ prop, value }) => <input value={value} />;

const key2Component = (prop, value) => {
  switch (prop) {
    case "UID":
      return createElement(Summary, { value });
    case "SUMMARY":
      return createElement(Summary, { prop, value });
    default:
      return <></>;
  }
};

function App() {
  const [rules] = useState(cleanRules(initRules).map(parseRule));
  const [activeRule, setActiveRule] = useState(rules[0].UID);

  const handleRuleSelect = (event) => {
    console.log(event.target[event.target.selectedIndex].id);
    setActiveRule(event.target[event.target.selectedIndex].id);
  };
  return (
    <div className="App">
      <pre>{JSON.stringify(rules, null, 2)}</pre>
      <textarea
        value={formatRules(rules)}
        onChange={(event) => console.log(event)}
        style={{ width: 300 }}
      ></textarea>
      <form>
        Rule{" "}
        <select onChange={handleRuleSelect}>
          {rules.map((rule) => (
            <option key={rule.UID} id={rule.UID}>
              {rule.SUMMARY}
            </option>
          ))}
        </select>
        <div className="grid">
          {Object.entries(rules.find(({ UID }) => UID === activeRule)).map(
            ([prop, value]) => (
              <>
                <div className="label">{prop}</div>
                {key2Component(prop, value)}
              </>
            )
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
