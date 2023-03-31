import { useState } from 'react';
import { useSession} from 'next-auth/react';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';


const Submit = () => {
  const [form] = Form.useForm();
  const [formErrors, setFormErrors] = useState({});
  const {data: session} = useSession();

  const onFinish = async (values) => {
    try {
      await axios.post('/api/createContract', values);
      form.resetFields();
      setFormErrors({});
      alert('Submission successful!');
    } catch (error) {
      console.error(error);
      alert('Submission failed. Please try again.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    setFormErrors(
      errorInfo.errorFields.reduce((acc, curr) => {
        acc[curr.name] = true;
        return acc;
      }, {})
    );
  };

  return (
    <div className="container">
      <Navbar />
      <h1>Create New Gamer Bounty</h1>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Contract Number"
          name="contractNumber"
          rules={[{ required: true, message: 'Please enter a contract number' }]}
          validateStatus={formErrors.contractNumber ? 'error' : ''}
          help={formErrors.contractNumber && 'This field is required'}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Game Name"
          name="gameName"
          rules={[{ required: true, message: 'Please enter a game name' }]}
          validateStatus={formErrors.gameName ? 'error' : ''}
          help={formErrors.gameName && 'This field is required'}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Target Player Name"
          name="targetPlayer"
          rules={[{ required: true, message: 'Please enter a target player name' }]}
          validateStatus={formErrors.targetPlayer ? 'error' : ''}
          help={formErrors.targetPlayer && 'This field is required'}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contract Conditions"
          name="contractConditions"
          rules={[{ required: true, message: 'Please enter contract conditions' }]}
          validateStatus={formErrors.contractConditions ? 'error' : ''}
          help={formErrors.contractConditions && 'This field is required'}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Bid Amount"
          name="bidAmount"
          rules={[{ required: true, message: 'Please enter a bid amount' }]}
          validateStatus={formErrors.bidAmount ? 'error' : ''}
          help={formErrors.bidAmount && 'This field is required'}
        >
          <Input type="number" prefix="$" />
        </Form.Item>
        <Form.Item
          label="Contract Status"
          name="contractStatus"
          rules={[{ required: true, message: 'Please enter contract status' }]}
          validateStatus={formErrors.contractStatus ? 'error' : ''}
          help={formErrors.contractStatus && 'This field is required'}
        >
          <Input />
        </Form.Item>
       
        <Form.Item
          label="Multiple Bidders Allowed?"
          name="multiBid"
          rules={[{ required: true, message: 'Please specify if multiple bidders are allowed' }]}
          validateStatus={formErrors.multiBid ? 'error' : ''}
          help={formErrors.multiBid && 'This field is required'}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Allow Multiple Submissions?"
          name="multiSubmit"
          rules={[{ required: true, message: 'Please specify if multiple submissions are allowed' }]}
          validateStatus={formErrors.multiSubmit ? 'error' : ''}
          help={formErrors.multiSubmit && 'This field is required'}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Requested By"
          name="requestedBy"
          rules={[{ required: true, message: 'Please enter the username of the requester' }]}
          validateStatus={formErrors.requestedBy ? 'error' : ''}
          help={formErrors.requestedBy && 'This field is required'}
          initialValue={session?.user?.email}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SmileOutlined />}>
            Submit
          </Button>
          <Button type="default" htmlType="reset" icon={<FrownOutlined />}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Submit;