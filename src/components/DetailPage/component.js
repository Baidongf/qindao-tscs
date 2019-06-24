import React from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Row, Col, Input, Button } from 'antd'
import './component.scss'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const SimpleDownloadExcel = Loadable({
  loader: () => import('components/SimpleDownloadExcel'),
  loading: RouteLoading
})

const FormItem = Form.Item
const { TextArea } = Input
const labelProps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}


class DetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.options = props.options ? props.options : {
      title: '',
      fields: [],
      valueObj: {}
    }

  }


  render() {
    return (
      <div className='detailPage-component'>
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>

              <div className='form-title'>
                <span className='text'>{this.options.title}</span>
              </div>

              <div className='form-body'>
                {
                  this.options.fields.map((group, index) => {
                    let colArr = []
                    for (let i = 0, l = group.length - 1; i <= l; i = i + 2) {
                      colArr.push(
                        <Row key={`${index}-${i}`}>
                          <Col span={12}>
                            <FormItem label={group[i].name} {...labelProps}>
                              {
                                this.options.title === '标签详情' &&
                                  group[i].name === '标签描述' ?
                                  <TextArea
                                    disabled
                                    placeholder='无'
                                    value={this.options.valueObj[group[i].key]}
                                    autosize={{ minRows: 3 }}
                                  /> : (
                                    this.options.title === '标签详情' &&
                                      group[i].name === '覆盖企业' ?
                                      <Input
                                        disabled
                                        placeholder='无'
                                        className='no-right-border'
                                        value={this.options.valueObj[group[i].key]}
                                        addonAfter={
                                          <SimpleDownloadExcel
                                            downloadUrl={`/crm-fd/api/tag/export/${this.props.id}`}
                                            wording='客户名单'
                                          />
                                        }
                                      /> :
                                      <Input
                                        disabled
                                        placeholder='无'
                                        value={this.options.valueObj[group[i].key]}
                                      />
                                  )
                              }
                            </FormItem>
                          </Col>
                          {
                            (i + 1 <= l) && (
                              <Col span={12}>
                                <FormItem label={group[i + 1].name} {...labelProps}>
                                  <Input disabled placeholder='无'
                                    value={this.options.valueObj[group[i + 1].key]}
                                  />
                                </FormItem>
                              </Col>
                            )
                          }
                        </Row>
                      )
                    }

                    if (index !== this.options.fields.length - 1) {
                      colArr.push(
                        <div className='row-line-gap' key={`${index}-line`}></div>
                      )
                    }

                    return colArr
                  })
                }
              </div>

            </div>
          </Form>
          <div className='btns-area clearfix'>
            <Button className='btn-return' onClick={() => {
              this.props.history.goBack()
            }}>返回</Button>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(DetailPage)
