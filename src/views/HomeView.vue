<template>
  <div class="login-container">
    <div class="login-box">
      <Card title="用户登录" class="login-card">
        <div class="login-form">
          <div class="form-item">
            <label>用户名：</label>
            <Input v-model:value="formData.username" placeholder="请输入用户名" size="large" />
          </div>
          <div class="form-item">
            <label>密码：</label>
            <Input
              v-model:value="formData.password"
              type="password"
              placeholder="请输入密码"
              size="large"
            />
          </div>
          <div class="form-item">
            <Button type="primary" size="large" @click="handleLogin" class="login-btn">
              登录
            </Button>
          </div>
          <div class="login-tips">
            <p><strong>测试账号：</strong></p>
            <p>管理员：admin / admin</p>
            <p>普通用户：wuxingyu / 123456</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, Input, Button, message } from 'ant-design-vue'

const router = useRouter()

// 表单数据
const formData = ref({
  username: '',
  password: '',
})

// 登录处理
const handleLogin = () => {
  if (formData.value.username === 'admin' && formData.value.password === 'admin') {
    message.success('管理员登录成功！')
    localStorage.setItem('userRole', 'admin')
    localStorage.setItem('username', 'admin')
    router.push('/dashboard')
  } else if (formData.value.username === 'wuxingyu' && formData.value.password === '123456') {
    message.success('用户登录成功！')
    localStorage.setItem('userRole', 'user')
    localStorage.setItem('username', 'wuxingyu')
    router.push('/dashboard')
  } else {
    message.error('用户名或密码错误！')
  }
}
</script>

<style lang="less" scoped>
.login-container {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .login-box {
    width: 100%;
    max-width: 400px;

    .login-card {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      overflow: hidden;

      :deep(.ant-card-head) {
        background: #f8f9fa;
        border-bottom: 1px solid #e8e8e8;
      }

      :deep(.ant-card-head-title) {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #1890ff;
        padding: 20px 0;
      }

      :deep(.ant-card-body) {
        padding: 32px 24px;
      }

      .login-form {
        .form-item {
          margin-bottom: 24px;

          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
          }

          :deep(.ant-input) {
            height: 44px;
            border-radius: 6px;
            border: 1px solid #d9d9d9;
            transition: all 0.3s;

            &:focus {
              border-color: #1890ff;
              box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            }

            &:hover {
              border-color: #40a9ff;
            }
          }

          .login-btn {
            width: 100%;
            height: 44px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 6px;
            background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
            border: none;
            transition: all 0.3s;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
            }

            &:active {
              transform: translateY(0);
            }
          }
        }

        .login-tips {
          margin-top: 32px;
          padding: 20px;
          background: #f6f8fa;
          border-radius: 8px;
          border-left: 4px solid #1890ff;

          p {
            margin: 8px 0;
            color: #666;
            font-size: 14px;
            line-height: 1.5;

            strong {
              color: #1890ff;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-container {
    padding: 16px;

    .login-box {
      .login-card {
        :deep(.ant-card-head-title) {
          font-size: 20px;
          padding: 16px 0;
        }

        :deep(.ant-card-body) {
          padding: 24px 20px;
        }

        .login-form {
          .form-item {
            margin-bottom: 20px;

            label {
              font-size: 13px;
            }

            :deep(.ant-input) {
              height: 40px;
            }

            .login-btn {
              height: 40px;
              font-size: 15px;
            }
          }

          .login-tips {
            margin-top: 24px;
            padding: 16px;

            p {
              font-size: 13px;
              margin: 6px 0;
            }
          }
        }
      }
    }
  }
}

// 全局样式重置
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
