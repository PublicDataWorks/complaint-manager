import React from "react";
import ReactQuill from "react-quill";
import { connect } from "react-redux";

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.initialValue,
      formInitializedToQuillFormat: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  initializeFormToQuillFormat(
    initializeForm,
    value,
    formInitializedToQuillGeneratedValue
  ) {
    if (!formInitializedToQuillGeneratedValue) {
      initializeForm(this.props.dispatch, value);
      this.setState({ formInitializedToQuillFormat: true });
    }
  }

  handleChange(value, formInitializedToQuillFormat) {
    if (this.props.initializeForm) {
      this.initializeFormToQuillFormat(
        this.props.initializeForm,
        value,
        formInitializedToQuillFormat
      );
    }

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
        onChange={value =>
          this.handleChange(value, this.state.formInitializedToQuillFormat)
        }
        onBlur={this.props.handleBlur}
        modules={modules}
        formats={formats}
        readOnly={this.props.disabled}
        style={this.props.style}
        placeholder={this.props.placeholder}
        data-testid={"editLetterQuill"}
      />
    );
  }
}

export default connect()(RichTextEditor);
