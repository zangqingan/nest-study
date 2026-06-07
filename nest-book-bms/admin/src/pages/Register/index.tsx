import { Button, Form, Input, message } from "antd";
import { register } from "../../api";
import "./index.css";

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};
const onFinish = async (values: RegisterForm) => {
  // values 是表单提交的对象
  if (values.password !== values.confirmPassword) {
    message.error("两次密码不一致");
    return;
  }
  try {
    const res = await register({
      username: values.username,
      password: values.password,
    });
    console.log(res);
    message.success("注册成功");
    window.location.href = "/login";
  } catch (error: any) {
    const response = error.response || error;
    const msg = response?.data?.message || error.message || "注册失败";
    message.error(msg);
  }
};
export function Register() {
  return (
    <div id="register-container">
      <h1>图书管理系统注册</h1>
      <Form {...layout} name="register" onFinish={onFinish} colon={false} autoComplete="off">
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码!" }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="确认密码" name="confirmPassword" rules={[{ required: true, message: "请确认密码!" }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item {...layout2}>
          <div className="links">
            <a href="/login">已有账号？去登录</a>
          </div>
        </Form.Item>
        <Form.Item {...layout2}>
          <Button className="btn" type="primary" htmlType="submit">
            注册账号
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
