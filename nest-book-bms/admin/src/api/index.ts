import axios from "axios";
import type { CreateBook } from "../pages/BookManage/CreateBookModal";
import type { UpdateBook } from "../pages/BookManage/UpdateBookModal";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

// 注册账号
export async function register(data: { username: string; password: string }) {
  return await instance.post("/user/register", data);
}

// 登录账号
export async function login(data: { username: string; password: string }) {
  return await instance.post("/user/login", data);
}

// 获取书籍列表
export async function getBookList(title?: string) {
  return await instance.get("/book", { params: { title } });
}

// 新增书籍
export async function createBook(data: CreateBook) {
  return await instance.post("/book", data);
}

// 获取书籍详情
export async function getBookDetail(id: number) {
  return await instance.get(`/book/${id}`);
}

// 更新书籍
export async function updateBook(id: number, data: UpdateBook) {
  return await instance.patch(`/book/${id}`, data);
}

// 删除书籍
export async function deleteBook(id: number) {
  return await instance.delete(`/book/${id}`);
}
