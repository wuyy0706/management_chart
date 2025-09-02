/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Ant Design Vue 组件类型声明
declare module 'ant-design-vue' {
  import { Component, Plugin } from 'vue'

  // 基础组件
  export const Button: Component
  export const Input: Component
  export const Card: Component
  export const Form: Component & {
    Item: Component
  }
  export const Layout: Component & {
    Header: Component
    Content: Component
    Sider: Component
  }
  export const Menu: Component & {
    Item: Component
  }
  export const Row: Component
  export const Col: Component
  export const Table: Component
  export const Tag: Component
  export const Space: Component
  export const Modal: Component & {
    confirm: (config: any) => void
  }
  export const Typography: Component & {
    Title: Component
    Text: Component
  }
  export const Avatar: Component
  export const Dropdown: Component

  // 消息提示
  export const message: {
    success: (content: string) => void
    error: (content: string) => void
    warning: (content: string) => void
    info: (content: string) => void
  }

  // 默认导出
  const Antd: Plugin
  export default Antd
}
