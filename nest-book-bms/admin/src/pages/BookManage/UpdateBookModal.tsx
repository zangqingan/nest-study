import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { CoverUpload } from "./Coverupload";
import { getBookDetail, updateBook } from "../../api";
import { useEffect } from "react";

interface UpdateBookModalProps {
  id: number;
  isOpen: boolean;
  handleClose: Function;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export interface UpdateBook {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  link: string;
}

export function UpdateBookModal(props: UpdateBookModalProps) {
  // 根据传入的id获取详情
  if (!props.id) {
    return null;
  }
  async function getDetail() {
    try {
      const res = await getBookDetail(props.id);
      console.log(res);
      form.setFieldsValue(res.data.data);
    } catch (error: any) {
      const response = error.response || error;
      const msg = response?.data?.message || error.message || "获取书籍详情失败";
      message.error(msg);
    }
  }
  useEffect(() => {
    getDetail();
  }, [props.id]);

  const [form] = useForm<UpdateBook>();

  const handleOk = async function () {
    await form.validateFields();
    const values = form.getFieldsValue();
    try {
      const res = await updateBook(props.id, values);
      console.log(res);
      message.success("更新成功");
      props.handleClose();
    } catch (error: any) {
      const response = error.response || error;
      const msg = response?.data?.message || error.message || "更新失败";
      message.error(msg);
    }
  };

  return (
    <Modal title="更新图书" open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()} okText={"更新"}>
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
        <Form.Item label="分类" name="category" rules={[{ required: true, message: "请输入图书分类!" }]}>
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
          <CoverUpload></CoverUpload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
