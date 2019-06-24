import React from 'react'
import { InputNumber,Form } from 'antd';
const EditableContext = React.createContext();
class EditableCell extends React.Component {
    state = {
      editing: true,
    };
  
    // toggleEdit = () => {
    //   const editing = !this.state.editing;
    //   this.setState({ editing }, () => {
    //     if (editing) {
    //       this.input.focus();
    //     }
    //   });
    // };
  
    save = e => {
      const { record, handleSave } = this.props;
    //   console.log("save",this.props)
      this.props.form.validateFields((error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }
        console.log("values",values)
        handleSave({ ...record, ...values });
      });
    };
  
    renderCell = (form) => {
      const { children, dataIndex, record, title ,initialValue} = this.props;
      const { editing } = this.state;
      return editing ? (
        <Form.Item style={{ margin: 0 }}>
          {this.props.form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `${title}为空`,
              },
            ],
            initialValue: initialValue
          })(
          <InputNumber ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />
          )}
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
        //   onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
    };
  
    render() {      
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        children,
        ...restProps
      } = this.props;
      return (
        <td {...this.props}>
          {editable ? (
            <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
          ) : (
            children
          )}
        </td>
      );
    }
  }

 export default Form.create()(EditableCell);