import React, { useState, useEffect } from 'react';
import './App.css';
import DATA from './data.json'
import { Button, Radio, Cascader, Checkbox, Form, Input, Result, Layout, Row } from 'antd';

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function QuestionCard(props) {
  const { setStep } = props
  const onFinish = values => {
    setStep(2)
    console.log('Received values of form:', values);
  };

  return <Form
    size="large"
    onFinish={onFinish}
    wrapperCol={{
      span: 24,
    }}
    layout="vertical"
  >
    {
      DATA.questions.map((item, index) => {
        console.log('item', item)
        let type = ''
        switch (item.type) {
          case 1:
            type = '(单选题)'
            break;
          case 2:
            type = '(多选题)'
            break;
          case 3:
            type = '(判断题)'
            break;

          default:
            type = '(单选题)'
            break;
        }
        const title = `${index + 1}. ${type}${item.question}`
        return <Form.Item
          name={index + 1}
          key={item.question}
          label={title}
          rules={[{ required: true, message: `请完成${index + 1}的答案。` }]}
        >
          {
            item.type === 2 ? <Checkbox.Group>
              {
                item.options.map(option => <Row key={option} ><Checkbox key={option}
                  value={option.slice(0, 1)}>{option}</Checkbox>
                </Row>
                )
              }
            </Checkbox.Group> : <Radio.Group>
                {
                  item.options.map(option => <Radio key={option}
                    style={radioStyle} value={option.slice(0, 1)}>{option}</Radio>)
                }
              </Radio.Group>
          }

        </Form.Item>
      })

    }
    <Form.Item>
      <Button type="primary" htmlType="submit"  >
        提交答案
      </Button>
    </Form.Item>
  </Form>
}

function BaseInfoCard(props) {
  const { setUserInfo, setStep } = props
  const onFinish = values => {
    setStep(1)
    setUserInfo({ ...values, area: values.area.toString() })
  };
  return <Form
    size="large"
    onFinish={onFinish}
    wrapperCol={{
      span: 24,
    }}
    layout="vertical"
  >
    <div>基本信息</div>
    <Form.Item label="姓名"
      rules={[{ required: true, message: '请输入您的姓名！' }]} name="name">
      <Input />
    </Form.Item>

    <Form.Item label="所在乡镇、社区" rules={[{ required: true, message: '请选择您的单位或地区！' }]} name="area">
      <Cascader options={DATA.organization} />
    </Form.Item>

    <Form.Item label="手机号码:" rules={[{ required: true, message: '请输入您的手机号码！' }]} name="phone">
      <Input />
    </Form.Item>


    <Form.Item>
      <Button type="primary" htmlType="submit"  >
        开始答题
      </Button>
    </Form.Item>
  </Form>
}

function App() {
  // const [showAnswer, setShow] = useState(false)
  const [useInfo, setUserInfo] = useState({})

  useEffect(() => {
     fetch(`/questionnaireTemplates?`).then(console.log)
  },[])
  const [step, setStep] = useState(2)
  let Component = BaseInfoCard
  switch (step) {
    case 0:
      Component = BaseInfoCard
      break
    case 1:
      Component = QuestionCard
      break
    case 2:
      Component = Result.bind(null,{status:'success',title:"Successfully Purchased Cloud Server ECS!"})

      break
    default:
      Component = Component = BaseInfoCard
      break
  }
  return (
    <div className="App">
      <Component setUserInfo={setUserInfo} useInfo={useInfo} setStep={setStep} />
    </div>
  );
}

export default App;
