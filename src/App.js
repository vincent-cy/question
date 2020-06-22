import React, { useState, useCallback } from 'react';
import './App.css';
import DATA from './data.json'
import axios from 'axios'
import {
  Button, Radio, Cascader, Spin, Layout,Affix,
  Checkbox, Form, Input, Col, Result, message, Row
} from 'antd';
import Count from './Count'

const isDev = process.env.NODE_ENV === "development"
const baseApi = isDev ? '/api' : 'http://101.200.182.153:3000/api'

const date = new Date().getTime() +  8 * 60 * 1000

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function QuestionCard(props) {
  const { setStep } = props
  const [loading, setLoading] = useState(false)
  // const [edit,setEdit] = useState(true)
  const answerObj = {}

  function onFinishFailed ({errorFields}){
    if(errorFields.length){
      message.error(`请完成${errorFields[0].errors.toString()}`)
    }
  }

  const onFieldsChange= (changedFields) => {
    if(changedFields.length){
      const key = changedFields[0].name[0]
      answerObj[key] = changedFields[0].value
    }
  }


  const onEnd = () => {
    message.success('答题时间到，自动提交答案中....');
    setTimeout(() =>{
      submit(answerObj)
    },2000)
  }


  function submit  (v){
    if(loading) return 
    setLoading(true)
    axios({
      method: 'post',
      url: `${baseApi}/a/answer`,
      data: {
        ...props.useInfo,
        answer: v
      }
    }).then(res => {
      setLoading(false)
      setStep(2)
    }).catch(err => {
      setLoading(false)
      message.error('提交错误，请重新提交');
    })
  }

  const onFinish = values => {
    submit(values)
  };

  return <Form
    size="large"
    onFinish={onFinish}
    onFieldsChange={onFieldsChange}
    onFinishFailed={onFinishFailed}
    wrapperCol={{
      span: 24,
    }}
    layout="vertical"
  >
    <div style={{height: 60}} >

    </div>
    {
      DATA.questions.map((item, index) => {
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
          name={`answer${index + 1}`}
          key={item.question}
          label={title}
          rules={[{ required: !isDev, message: `请完成${index + 1}的答案。` }]}
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
      <div style={{display:'flex', justifyContent: 'center'}}> 
        <Button type="primary" htmlType="submit"   >
          提交答案
        </Button>
      </div>
    </Form.Item>  
    <Spin spinning={loading} delay={500}></Spin>
      <Count
        onEnd={onEnd}
        style={{
          color: 'white',
          display:'block',
          position: 'fixed',
          textAlign: 'center',
          justifyContent: 'center',
          right: 20, top: 20,
          padding: 10,
          borderRadius: 20, 
          backgroundColor: '#1890ff'}} target={date} />
  </Form>
}

function BaseInfoCard(props) {
  const { setUserInfo, setStep } = props
  const onFinish = values => {
    setStep(1)
    setUserInfo({ ...values, address: values.address.toString() })
  };
  return <Layout>
    <img alt='banner' width='100%' src={'https://static.poogln.com/slog.fc43e174.jpeg'} />
    <Form
      size="large"
      onFinish={onFinish}
      wrapperCol={{
        span: 24,
      }}
      layout="vertical"
    >
      <h1 style={{
        height: 40,
        paddingTop: 10,
        color: '#1890ff'
      }} >基本信息</h1>
      <Form.Item label="姓名"
        rules={[{ required: true, message: '请输入您的姓名！' }]} name="name">
        <Input placeholder="请输入姓名" maxLength={8} />
      </Form.Item>

      <Form.Item label="所在乡镇、社区" rules={[{ required: true, message: '请选择您的单位或地区！' }]} name="address">
        <Cascader placeholder={'请选择'} options={DATA.organization} />
      </Form.Item>

      <Form.Item label="手机号码:" rules={[{
        required: true,
        pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
        message: '请输入正确的手机号码！'
      }]} name="phoneNumber">
        <Input placeholder="请输入手机号码" />
      </Form.Item>


      <Form.Item>
        <div style={{display:'flex', justifyContent: 'center'}}> 
          <Button type="primary" htmlType="submit"  >
              开始答题
          </Button>
        </div>
      </Form.Item>
    </Form>
  </Layout>
}

function App() {
  // const [showAnswer, setShow] = useState(false)
  const [useInfo, setUserInfo] = useState({})
  const [step, setStep1] = useState(0)
  const setStep = e => {
    window.scrollTo(0, 0);
    setStep1(e)
  }
  let Component = BaseInfoCard
  switch (step) {
    case 0:
      Component = BaseInfoCard
      break
    case 1:
      Component = QuestionCard
      break
    case 2:
      Component = Result.bind(null, { status: 'success', title: "恭喜 参与答题成功！" })

      break
    default:
      Component = Component = BaseInfoCard
      break
  }
  return (
    <div className="App">
      <Row>
        <Col flex={4}></Col>
        <Component setUserInfo={setUserInfo} useInfo={useInfo} setStep={setStep} />
        <Col flex={4}></Col>
      </Row>
      
    </div>
  );
}

export default App;
