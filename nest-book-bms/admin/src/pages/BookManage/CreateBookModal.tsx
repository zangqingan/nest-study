import { Button, Form, Input, Modal, message, InputNumber, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { createBook } from "../../api";
import { CoverUpload } from "./Coverupload";

interface CreateBookModalProps {
  isOpen: boolean; //是否打开弹窗
  handleClose: Function; //关闭弹窗函数
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface CreateBook {
  title: string;
  price: number;
  category: string;
  author: string;
  description: string;
  link: string;
}

export function CreateBookModal(props: CreateBookModalProps) {
  const [form] = useForm<CreateBook>();
  // 提交表单
  const handleOk = async function () {
    // 校验表单
    await form.validateFields();
    // 获取表单数据
    const values = await form.getFieldsValue();
    try {
      const res = await createBook(values);
      console.log(res);
      message.success("新增图书成功");
      props.handleClose();
    } catch (error: any) {
      const response = error.response || error;
      const msg = response?.data?.message || error.message || "新增图书失败";
      message.error(msg);
    }
  };

  return (
    <Modal title="新增图书" open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()} okText={"创建"} cancelText={"取消"}>
      <Form form={form} colon={false} {...layout}>
        <Form.Item label="图书名称" name="title" rules={[{ required: true, message: "请输入图书名称!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="作者" name="author" rules={[{ required: true, message: "请输入图书作者!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="价格" name="price" rules={[{ required: true, message: "请输入图书价格!" }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="分类" name="category" rules={[{ required: true, message: "请选择图书分类!" }]}>
          <Select
            options={[
              { label: "小说", value: "小说" },
              { label: "科技", value: "科技" },
              { label: "历史", value: "历史" },
            ]}
          />
        </Form.Item>
        <Form.Item label="描述" name="description" rules={[{ required: true, message: "请输入图书描述!" }]}>
          <TextArea />
        </Form.Item>
        <Form.Item label="封面" name="link" rules={[{ required: true, message: "请上传图书封面!" }]}>
          <CoverUpload />
        </Form.Item>
      </Form>
    </Modal>
  );
}
