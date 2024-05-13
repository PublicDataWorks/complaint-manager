import React from "react";
import ReactQuill from "react-quill";
import { connect } from "react-redux";
import removeEmptyParagraphs from "../../../utilities/removeEmptyParagraphs";

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: removeEmptyParagraphs(props.initialValue)
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
    this.props.onChange(value);
  }

  delegateChange(value, source) {
    if (this.props.initializeForm && source === "api") {
      this.props.initializeForm(this.props.dispatch, value);
    } else {
      this.handleChange(value);
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ text: nextProps.initialValue });
  //   this.props.onChange(nextProps.initialValue);
  // }
  
// The above code is depracted.  I asked co pilot to update with new syntax
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialValue !== prevState.text) {
      nextProps.onChange(nextProps.initialValue);
      return { text: nextProps.initialValue };
    }
    return null;
  }

  componentDidMount() {
    document.querySelectorAll(".ql-formats").forEach(element => {
      element.addEventListener("mousedown", e => {
        e.preventDefault();
      });
    });
  }

  render() {
    const modules = {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: ["", "center"] }]
      ],
      clipboard: {
        matchVisual: false
      }
    };

    const formats = ["bold", "italic", "underline", "list", "bullet", "align"];

    return (
      <div onBlur={this.props.handleBlur}>
        <ReactQuill
          theme={"snow"}
          value={this.state.text}
          onChange={(value, delta, source) =>
            this.delegateChange(value, source)
          }
          modules={modules}
          formats={formats}
          readOnly={this.props.disabled}
          style={this.props.style}
          placeholder={this.props.placeholder}
          data-testid={"editLetterQuill"}
        />
      </div>
    );
  }
}

const RichTextEditorContainer = connect()(RichTextEditor);

export const RichTextEditorComponent = props => {
  console.log("RichTextEditorComponent: props", props);
  if (!props.input) {
    console.error("RichTextEditorComponent: props.input is undefined");
    return null;
  }
  return (
    <RichTextEditorContainer
      {...props}
      initialValue={props.input.value}
      onChange={newValue => props.input.onChange(newValue)}
      onBlur={props.input.onBlur}
    />
  );
};

export default RichTextEditorContainer;
