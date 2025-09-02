<template>
  <Layout class="dashboard-layout">
    <!-- 侧边栏 -->
    <Sider v-model:collapsed="collapsed" collapsible class="dashboard-sider">
      <div class="logo">
        <h2 v-if="!collapsed">工单管理系统</h2>
        <h2 v-else>工单</h2>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        default-selected-keys="['workorders']"
        class="dashboard-menu"
      >
        <Menu.Item key="workorders">
          <span>工单管理</span>
        </Menu.Item>
        <Menu.Item key="reports" v-if="userInfo.role === 'admin'">
          <span>数据报表</span>
        </Menu.Item>
        <Menu.Item key="settings">
          <span>系统设置</span>
        </Menu.Item>
      </Menu>
    </Sider>

    <Layout class="dashboard-main">
      <!-- 顶部导航 -->
      <Header class="dashboard-header">
        <div class="header-left">
          <Button type="text" @click="collapsed = !collapsed" class="menu-trigger">
            <span class="anticon">☰</span>
          </Button>
          <Title :level="4" class="page-title">工单管理</Title>
        </div>

        <div class="header-right">
          <Dropdown :menu="{ items: userMenuItems }" placement="bottomRight">
            <div class="user-info">
              <Avatar class="user-avatar">{{ userInfo.username.charAt(0).toUpperCase() }}</Avatar>
              <span class="username">{{ userInfo.username }}</span>
              <Tag :color="userInfo.role === 'admin' ? 'red' : 'blue'" class="role-tag">
                {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
              </Tag>
            </div>
          </Dropdown>
        </div>
      </Header>

      <!-- 主要内容 -->
      <Content class="dashboard-content">
        <div class="content-wrapper">
          <!-- 统计卡片 -->
          <Row :gutter="[16, 16]" class="stats-row">
            <Col :xs="24" :sm="12" :lg="6">
              <Card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ workOrderData.length }}</div>
                  <div class="stat-label">总工单数</div>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :sm="12" :lg="6">
              <Card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ totalHours.toFixed(1) }}</div>
                  <div class="stat-label">总工时</div>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :sm="12" :lg="6">
              <Card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ overtimeCount }}</div>
                  <div class="stat-label">加班工单</div>
                </div>
              </Card>
            </Col>
            <Col :xs="24" :sm="12" :lg="6">
              <Card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">{{ projectCount }}</div>
                  <div class="stat-label">项目数量</div>
                </div>
              </Card>
            </Col>
          </Row>

          <!-- 图表和表格 -->
          <Row :gutter="[16, 16]" class="main-content">
            <Col :xs="24" :lg="12">
              <Card title="Project Hours Distribution" class="chart-card">
                <div id="workOrderChart" class="chart"></div>
              </Card>
            </Col>

            <Col :xs="24" :lg="12">
              <Card title="工单列表" class="table-card">
                <Table
                  :columns="userInfo.role === 'admin' ? adminColumns : userColumns"
                  :data-source="workOrderData"
                  :pagination="false"
                  size="small"
                  class="workorder-table"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  message,
  Typography,
  Avatar,
  Dropdown,
} from 'ant-design-vue'
import * as echarts from 'echarts'

const { Header, Sider, Content } = Layout
const { Title } = Typography
const router = useRouter()

// 用户信息
const userInfo = ref({
  username: '',
  role: '',
})

// 菜单状态
const collapsed = ref(false)

// 工单数据 - 使用需求文档提供的模拟数据
const workOrderData = ref([
  {
    key: '001',
    id: '001',
    project: 'Road Project A',
    overtime: true,
    hours: 3.5,
    created_at: '2024-04-10 10:30',
  },
  {
    key: '002',
    id: '002',
    project: 'Bridge Maintenance B',
    overtime: false,
    hours: 2,
    created_at: '2024-04-09 13:00',
  },
  {
    key: '003',
    id: '003',
    project: 'Pipeline Fix C',
    overtime: true,
    hours: 4.5,
    created_at: '2024-04-08 08:00',
  },
  {
    key: '004',
    id: '004',
    project: 'Bridge Maintenance B',
    overtime: true,
    hours: 3,
    created_at: '2024-04-07 16:45',
  },
  {
    key: '005',
    id: '005',
    project: 'Tunnel Cleaning D',
    overtime: false,
    hours: 8.1,
    created_at: '2024-04-03 11:43',
  },
])

// 计算属性
const totalHours = computed(() => {
  return workOrderData.value.reduce((sum, item) => sum + item.hours, 0)
})

const overtimeCount = computed(() => {
  return workOrderData.value.filter((item) => item.overtime).length
})

const projectCount = computed(() => {
  const projects = new Set(workOrderData.value.map((item) => item.project))
  return projects.size
})

// 图表实例
let chartInstance: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  const chartDom = document.getElementById('workOrderChart')
  if (chartDom) {
    chartInstance = echarts.init(chartDom)
    updateChart()
  }
}

// 更新图表数据
const updateChart = () => {
  if (!chartInstance) return

  // 按项目分组统计工时
  const projectHours: { [key: string]: number } = {}
  workOrderData.value.forEach((item) => {
    if (projectHours[item.project]) {
      projectHours[item.project] += item.hours
    } else {
      projectHours[item.project] = item.hours
    }
  })

  const projects = Object.keys(projectHours)
  const hours = Object.values(projectHours)

  const option = {
    title: {
      text: 'Project Hours Distribution',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#d9d9d9',
      textStyle: {
        color: '#333',
      },
      formatter: '{b}: {c} 小时',
    },
    grid: {
      top: 80,
      left: 40,
      right: 40,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      data: projects,
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
      axisLabel: {
        color: '#666',
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: '工时（小时）',
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
      axisLabel: {
        color: '#666',
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    },
    series: [
      {
        name: '工时',
        type: 'bar',
        data: hours,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#40a9ff' },
            ],
          },
        },
        barWidth: '60%',
      },
    ],
  }
  chartInstance.setOption(option)
}

// 删除工单
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除工单 ${record.id} 吗？`,
    onOk() {
      const index = workOrderData.value.findIndex((item) => item.key === record.key)
      if (index > -1) {
        workOrderData.value.splice(index, 1)
        updateChart() // 更新图表
        message.success('工单删除成功')
      }
    },
  })
}

// 退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    onOk() {
      localStorage.removeItem('userRole')
      localStorage.removeItem('username')
      message.success('已退出登录')
      router.push('/')
    },
  })
}

// 用户菜单
const userMenuItems = [
  {
    key: 'profile',
    label: '个人资料',
  },
  {
    key: 'settings',
    label: '设置',
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'logout',
    label: '退出登录',
    onClick: handleLogout,
  },
]

// 检查登录状态
const checkAuth = () => {
  const role = localStorage.getItem('userRole')
  const username = localStorage.getItem('username')

  if (!role || !username) {
    message.error('请先登录')
    router.push('/')
    return
  }

  userInfo.value = {
    username,
    role,
  }
}

// 普通用户表格列配置
const userColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project',
    ellipsis: true,
  },
  {
    title: 'Overtime',
    dataIndex: 'overtime',
    key: 'overtime',
    width: 100,
    customRender: ({ text }: { text: boolean }) => {
      return h(Tag, { color: text ? 'red' : 'green' }, () => (text ? 'Yes' : 'No'))
    },
  },
  {
    title: 'Hours',
    dataIndex: 'hours',
    key: 'hours',
    width: 80,
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
  },
]

// 管理员表格列配置（包含删除按钮）
const adminColumns = [
  ...userColumns,
  {
    title: '操作',
    key: 'action',
    width: 120,
    customRender: ({ record }: { record: any }) => {
      return h(Space, {}, [
        h(
          Button,
          {
            type: 'link',
            size: 'small',
            danger: true,
            onClick: () => handleDelete(record),
          },
          () => 'Delete',
        ),
      ])
    },
  },
]

onMounted(() => {
  checkAuth()
  initChart()

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
})
</script>

<style lang="less" scoped>
.dashboard-layout {
  min-height: 100vh;
  width: 100vw;
  background: #f0f2f5;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .dashboard-sider {
    background: #001529;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;

    .logo {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      margin: 16px;
      border-radius: 6px;
      transition: all 0.3s;

      h2 {
        color: white;
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        transition: all 0.3s;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .dashboard-menu {
      border-right: none;
      background: transparent;

      :deep(.ant-menu-item) {
        margin: 4px 16px;
        border-radius: 6px;
        height: 40px;
        line-height: 40px;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        &.ant-menu-item-selected {
          background: #1890ff;
          color: white;

          &:hover {
            background: #40a9ff;
          }
        }
      }
    }
  }

  .dashboard-main {
    margin-left: 200px;
    width: calc(100vw - 200px);
    min-height: 100vh;

    .dashboard-header {
      background: white;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .menu-trigger {
          font-size: 18px;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s;

          &:hover {
            background: #f5f5f5;
          }
        }

        .page-title {
          margin: 0;
          color: #333;
          font-weight: 600;
        }
      }

      .header-right {
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s;

          &:hover {
            background: #f5f5f5;
          }

          .user-avatar {
            background: #1890ff;
            color: white;
            font-weight: 600;
          }

          .username {
            font-weight: 500;
            color: #333;
            font-size: 14px;
          }

          .role-tag {
            font-size: 12px;
            border-radius: 4px;
          }
        }
      }
    }

    .dashboard-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
      width: 100%;
      box-sizing: border-box;

      .content-wrapper {
        width: 100%;
        max-width: none;

        .stats-row {
          margin-bottom: 24px;
          width: 100%;

          .stat-card {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            }

            :deep(.ant-card-body) {
              padding: 24px;
            }

            .stat-content {
              text-align: center;

              .stat-number {
                font-size: 32px;
                font-weight: bold;
                color: #1890ff;
                margin-bottom: 8px;
                line-height: 1;
              }

              .stat-label {
                color: #666;
                font-size: 14px;
                font-weight: 500;
              }
            }
          }
        }

        .main-content {
          margin-bottom: 24px;
          width: 100%;

          .chart-card {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            :deep(.ant-card-head) {
              border-bottom: 1px solid #f0f0f0;
              padding: 0 24px;
            }

            :deep(.ant-card-body) {
              padding: 24px;
            }

            .chart {
              width: 100%;
              height: 300px;
              border-radius: 4px;
            }
          }

          .table-card {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            :deep(.ant-card-head) {
              border-bottom: 1px solid #f0f0f0;
              padding: 0 24px;
            }

            :deep(.ant-card-body) {
              padding: 16px 24px;
            }

            .workorder-table {
              width: 100%;

              :deep(.ant-table-thead > tr > th) {
                background: #fafafa;
                font-weight: 600;
                color: #333;
              }

              :deep(.ant-table-tbody > tr > td) {
                padding: 12px 16px;
              }

              :deep(.ant-table-tbody > tr:hover > td) {
                background: #f5f5f5;
              }
            }
          }
        }
      }
    }
  }

  // 侧边栏收起状态
  &.ant-layout-sider-collapsed {
    .dashboard-main {
      margin-left: 80px;
      width: calc(100vw - 80px);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-layout {
    .dashboard-main {
      margin-left: 0;
      width: 100vw;

      .dashboard-header {
        padding: 0 16px;

        .header-left {
          .page-title {
            font-size: 16px !important;
          }
        }

        .header-right {
          .user-info {
            padding: 6px 12px;
            gap: 8px;

            .username {
              display: none;
            }
          }
        }
      }

      .dashboard-content {
        padding: 16px;

        .content-wrapper {
          .stats-row {
            .stat-card {
              :deep(.ant-card-body) {
                padding: 20px;
              }

              .stat-content {
                .stat-number {
                  font-size: 24px;
                }

                .stat-label {
                  font-size: 13px;
                }
              }
            }
          }

          .main-content {
            .chart-card {
              :deep(.ant-card-body) {
                padding: 20px;
              }

              .chart {
                height: 250px;
              }
            }

            .table-card {
              :deep(.ant-card-body) {
                padding: 12px 20px;
              }
            }
          }
        }
      }
    }

    .dashboard-sider {
      position: fixed;
      z-index: 1001;
      transform: translateX(-100%);
      transition: transform 0.3s;

      &.ant-layout-sider-collapsed {
        transform: translateX(0);
      }
    }
  }
}

// 全局样式
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
  background: #f0f2f5;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
