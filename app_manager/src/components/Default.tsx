const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
export const DEFAULTS = {
  Input: () => ({
    id: uid(),
    type: "Input",
    props: {
      label: "Label",
      name: "field" + Math.floor(Math.random() * 99),
      placeholder: "Type here…",
      inputType: "text", // text | email | password | number
      required: false,
      minLength: 0,
      maxLength: "",
      
pattern: "",
      helpText: "",
      width: "full", // full | auto
    },
    children: [],
  }),
  Button: () => ({
    id: uid(),
    type: "Button",
    props: {
      text: "Submit",
      variant: "primary", // primary | secondary | ghost
      action: { type: "submit" }, // submit | navigate | emitEvent | none
    },
    children: [],
  }),
 
 Text: () => ({
    id: uid(),
    type: "Text",
    props: {
      text: "Sample text",
      fontSize: 16,
      bold: false,
      italic: false,
      align: "left", // left | center | right
    },
    children: [],
  }),
  // --- NEW: Card Default ---
  Card: () => ({
    id: uid(),
    type: "Card",
    props: {},
    children: [],
  }),
  // --- NEW: Grid Default ---
  Grid: () => ({
    id: uid(),
    type: "Grid",
    props: {
      // Default (mobile)
      columns: "1fr",
      rows: "auto",
      gap: 16,
      // Responsive overrides
      responsive: {
        tablet: {
          columns: "1fr 1fr",
          rows: "auto",
          gap: 16,
        },
        web: {
          columns: "repeat(4, 1fr)",
          rows: "auto",
          gap: 24,
        },
      },
    },
    children: [],
  }),
  AuthScreen: () => ({
    id: uid(),
    type: "AuthScreen",
    props: {
      title: "Sign in",
      description: "Welcome back!",
      layout: "stack", // stack for now
      showCard: true,
    },
    children: [
      DEFAULTS.Input(),
      (() => {
        const p = DEFAULTS.Input();
p.props.label = "Password";
        p.props.placeholder = "••••••••";
        p.props.inputType = "password";
        p.props.required = true;
        p.props.minLength = 6;
        return p;
})(),
      (() => {
        const b = DEFAULTS.Button();
        b.props.text = "Sign in";
        b.props.action = { type: "submit" };
        return b;
      })(),
    ],
  }),
};