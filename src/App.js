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

const Summary = ({ prop, value, onChange }) => (
  <input value={value} onChange={onChange} />
);

function App() {
  const [rules, setRules] = useState(cleanRules(initRules).map(parseRule));
  const [activeRule, setActiveRule] = useState(rules[0].UID);

  const key2Component = (prop, value) => {
    switch (prop) {
      case "UID":
        return createElement("input", { value, disabled: true });
      case "SUMMARY":
        return createElement(Summary, {
          prop,
          value,
          onChange: handleSummaryChange,
        });
      default:
        return <></>;
    }
  };
  const handleRuleSelect = (event) => {
    console.log(event.target[event.target.selectedIndex].id);
    setActiveRule(event.target[event.target.selectedIndex].id);
  };

  const handleSummaryChange = (event) => {
    setRules(
      rules.map((rule) =>
        rule.UID === activeRule
          ? { ...rule, SUMMARY: event.target.value }
          : rule
      )
    );
  };

  return (
    <div className="App">
      <textarea
        value={formatRules(rules)}
        onChange={(event) => console.log(event)}
        style={{ width: 300 }}
      ></textarea>
      <form>
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
      <pre>{JSON.stringify(rules, null, 2)}</pre>
    </div>
  );
}

export default App;
