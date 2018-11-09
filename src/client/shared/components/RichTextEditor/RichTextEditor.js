import React from "react";
import ReactQuill from "react-quill";

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: props.initialValue };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
    this.props.onChange(value);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ text: nextProps.initialValue });
    this.props.onChange(nextProps.initialValue);
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
      <ReactQuill
        theme={"snow"}
        value={this.state.text}
        onChange={this.handleChange}
        modules={modules}
        formats={formats}
        style={this.props.style}
        data-test={"editLetterQuill"}
      />
    );
  }
}

export default RichTextEditor;
