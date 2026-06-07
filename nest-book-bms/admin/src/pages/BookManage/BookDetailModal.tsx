import { useEffect, useState } from "react";
import { Form, Input, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { getBookDetail } from "../../api/index";
import TextArea from "antd/es/input/TextArea";

interface UpdateBookModalProps {
  id: number;
  isOpen: boolean;
  handleClose: () => void;
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
  publishedDate: string;
  link: string;
}

export function BookDetailModal(props: UpdateBookModalProps) {
  const [form] = useForm<UpdateBook>();
  const [coverUrl, setCoverUrl] = useState("");

  async function query() {
    if (!props.id) {
      return;
    }
    try {
      const res = await getBookDetail(props.id);
      const data = res.data.data;
      form.setFieldsValue(data);
      setCoverUrl(`http://localhost:3000${data.link}`);
    } catch (error: any) {
      const response = error.response || error;
      const msg = response?.data?.message || error.message || "获取书籍详情失败";
      message.error(msg);
    }
  }

  useEffect(() => {
    query();
  }, [props.id]);

  return (
    <Modal title="图书详情" open={props.isOpen} onCancel={() => props.handleClose()} footer={null}>
      <Form form={form} colon={false} {...layout}>
        <Form.Item label="图书名称" name="title">
          <Input disabled />
        </Form.Item>
        <Form.Item label="作者" name="author">
          <Input disabled />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea disabled rows={4} />
        </Form.Item>
        <Form.Item label="价格" name="price">
          <Input disabled />
        </Form.Item>
        <Form.Item label="分类" name="category">
          <Input disabled />
        </Form.Item>
        <Form.Item label="封面">{coverUrl ? <img src={coverUrl} alt="封面" style={{ maxWidth: "100%", maxHeight: 200 }} /> : <span>暂无封面</span>}</Form.Item>
      </Form>
    </Modal>
  );
}
