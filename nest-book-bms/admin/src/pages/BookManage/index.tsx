import { useEffect, useState } from "react";
import { Button, Card, Form, Input, message, Popconfirm } from "antd";
import "./index.css";
import { CreateBookModal } from "./CreateBookModal";
import { UpdateBookModal } from "./UpdateBookModal";
import { BookDetailModal } from "./BookDetailModal";
import { getBookList, deleteBook } from "../../api";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  link: string;
}

export function BookManage() {
  // 获取书籍列表
  const [bookList, setBookList] = useState<Book[]>([]);
  // 模糊搜索
  const [title, setTitle] = useState("");
  // 添加图书弹窗
  const [createBookModalOpen, setCreateBookModalOpen] = useState(false);
  // 更新图书弹窗
  const [updateBookModalOpen, setUpdateBookModalOpen] = useState(false);
  // 图书详情弹窗
  const [bookDetailModalOpen, setBookDetailModalOpen] = useState(false);
  // 图书详情id
  const [bookDetailId, setBookDetailId] = useState(0);
  // 更新图书id
  const [updateBookId, setUpdateBookId] = useState(0);
  // 删除图书
  async function handleDelete(id: number) {
    try {
      await deleteBook(id);
      message.success("删除图书成功");
      getList();
    } catch (error: any) {
      const response = error.response || error;
      const msg = response?.data?.message || error.message || "删除图书失败";
      message.error(msg);
    }
  }
  async function getList() {
    try {
      const res = await getBookList(title);
      console.log(res);
      setBookList(res.data.data);
    } catch (error: any) {
      const response = error.response || error;
      const msg = response?.data?.message || error.message || "获取书籍列表失败";
      message.error(msg);
    }
  }
  useEffect(() => {
    getList();
  }, [title]);

  // 搜索图书
  async function onSearch(values: { name: string }) {
    setTitle(values.name);
  }

  return (
    <div id="bookManage">
      <CreateBookModal
        isOpen={createBookModalOpen}
        handleClose={() => {
          setCreateBookModalOpen(false);
          setTitle("");
        }}
      />
      <UpdateBookModal
        id={updateBookId}
        isOpen={updateBookModalOpen}
        handleClose={() => {
          setUpdateBookModalOpen(false);
          getList();
        }}
      />
      <BookDetailModal id={bookDetailId} isOpen={bookDetailModalOpen} handleClose={() => setBookDetailModalOpen(false)} />
      <h1>图书管理系统</h1>
      <div className="content">
        <div className="book-search">
          <Form name="search" layout="inline" onFinish={onSearch} colon={false}>
            <Form.Item label="图书名称" name="name">
              <Input />
            </Form.Item>
            <Form.Item label=" ">
              <Button type="primary" htmlType="submit">
                搜索图书
              </Button>
              <Button type="primary" htmlType="submit" style={{ background: "green", marginLeft: "10px" }} onClick={() => setCreateBookModalOpen(true)}>
                添加图书
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="book-list">
          {bookList.map((item) => {
            return (
              <Card className="card" hoverable key={item.id} style={{ width: 300 }} cover={<img alt="example" src={`http://localhost:3000${item.link}`} />}>
                <h2>{item.title}</h2>
                <div>作者：{item.author}</div>
                <div>分类：{item.category}</div>
                <div>价格：{item.price}</div>
                <div>描述：{item.description}</div>
                <div className="links">
                  <a
                    href="#"
                    onClick={() => {
                      setBookDetailId(item.id);
                      setBookDetailModalOpen(true);
                    }}
                  >
                    详情
                  </a>
                  <a
                    href="#"
                    onClick={() => {
                      setUpdateBookId(item.id);
                      setUpdateBookModalOpen(true);
                    }}
                  >
                    编辑
                  </a>
                  <Popconfirm title="图书删除" description="确认删除吗？" onConfirm={() => handleDelete(item.id)} okText="Yes" cancelText="No">
                    <a href="#">删除</a>
                  </Popconfirm>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
