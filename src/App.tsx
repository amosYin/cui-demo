/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Select, DatePicker, Radio, Space, Typography, Card, Row, Col } from 'antd';
import { 
  FilterOutlined,
  DashboardOutlined, 
  PieChartOutlined, 
  BarChartOutlined, 
  SafetyCertificateOutlined, 
  FileTextOutlined
} from '@ant-design/icons';
import { Button, Tooltip as AntTooltip } from 'antd';
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

import Dashboard from './components/Dashboard';
import AssetAllocation from './components/AssetAllocation';
import PerformanceAttribution from './components/PerformanceAttribution';
import RiskMonitoring from './components/RiskMonitoring';
import ReportCenter from './components/ReportCenter';
import { Unit, GlobalFilters } from './types';

const { Header, Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// Context for global filters
interface FilterContextType {
  filters: GlobalFilters;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilters must be used within a FilterProvider');
  return context;
};

export default function App() {
  const [filters, setFilters] = useState<GlobalFilters>({
    product: '测试资管产品A',
    dateRange: [dayjs().subtract(3, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    benchmark: '沪深300',
    unit: 'CNY',
  });

  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.hash.replace('#', '') || 'dashboard');

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '整体分析' },
    { key: 'allocation', icon: <PieChartOutlined />, label: '资产配置' },
    { key: 'attribution', icon: <BarChartOutlined />, label: '业绩归因' },
    { key: 'risk', icon: <SafetyCertificateOutlined />, label: '风险监控' },
    { key: 'reports', icon: <FileTextOutlined />, label: '报告中心' },
  ];

  const handleMenuClick = (e: any) => {
    window.location.hash = e.key;
    setCurrentPath(e.key);
  };

  return (
    <ConfigProvider 
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#023D7F',
          borderRadius: 8,
          colorBgContainer: '#fff',
          colorBgLayout: '#f0f2f5',
        },
        components: {
          Card: {
            boxShadowTertiary: '0 4px 12px rgba(0,0,0,0.05)',
          }
        }
      }}
    >
      <FilterContext.Provider value={{ filters, setFilters }}>
        <Router>
          <Layout className="optimized-theme" style={{ minHeight: '100vh' }}>
            <Sider 
              collapsible 
              collapsed={collapsed} 
              onCollapse={(value) => setCollapsed(value)}
              theme="dark"
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 100,
                backgroundColor: '#023D7F'
              }}
            >
              <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Title level={4} style={{ color: 'white', margin: 0, whiteSpace: 'nowrap' }}>
                  {collapsed ? 'FMS' : '资管分析系统'}
                </Title>
              </div>
              <Menu 
                theme="dark" 
                defaultSelectedKeys={[currentPath]} 
                mode="inline" 
                items={menuItems}
                onClick={handleMenuClick}
                style={{ backgroundColor: '#023D7F' }}
              />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
              <Header style={{ 
                padding: '0 24px', 
                background: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 99,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                height: 'auto',
                minHeight: 64,
                paddingTop: 8,
                paddingBottom: 8
              }}>
                <Space size="large" wrap>
                  <Space>
                    <FilterOutlined style={{ color: '#023D7F' }} />
                    <Text strong>全局筛选</Text>
                  </Space>
                  <Space>
                    <Text type="secondary">选择产品：</Text>
                    <Select 
                      defaultValue={filters.product}
                      style={{ width: 160 }}
                      onChange={(val) => setFilters(prev => ({ ...prev, product: val }))}
                      options={[
                        { value: '测试资管产品A', label: '测试资管产品A' },
                        { value: '测试资管产品B', label: '测试资管产品B' },
                      ]}
                    />
                  </Space>
                  <Space>
                    <Text type="secondary">时间范围：</Text>
                    <RangePicker 
                      defaultValue={[dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]}
                      onChange={(dates) => {
                        if (dates && dates[0] && dates[1]) {
                          setFilters(prev => ({
                            ...prev,
                            dateRange: [dates[0]!.format('YYYY-MM-DD'), dates[1]!.format('YYYY-MM-DD')]
                          }));
                        }
                      }}
                    />
                  </Space>
                  <Space>
                    <Text type="secondary">业绩基准：</Text>
                    <Select 
                      defaultValue={filters.benchmark}
                      style={{ width: 150 }}
                      onChange={(val) => setFilters(prev => ({ ...prev, benchmark: val }))}
                      options={[
                        { value: '沪深300', label: '沪深300' },
                        { value: '中证800', label: '中证800' },
                        { value: '中债综合指数', label: '中债综合指数' },
                        { value: '中证500', label: '中证500' },
                      ]}
                    />
                  </Space>
                  <Radio.Group 
                    value={filters.unit} 
                    onChange={(e) => setFilters(prev => ({ ...prev, unit: e.target.value }))}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="CNY">元</Radio.Button>
                    <Radio.Button value="10K">万元</Radio.Button>
                    <Radio.Button value="100M">亿元</Radio.Button>
                  </Radio.Group>
                </Space>
                <Space>
                  <Text type="secondary">最后更新：{dayjs().format('YYYY-MM-DD HH:mm')}</Text>
                </Space>
              </Header>
              <Content style={{ 
                margin: '24px', 
                padding: 0, 
                background: 'transparent', 
                minHeight: 280 
              }}>
                <div style={{ 
                  padding: 0,
                  background: 'transparent'
                }}>
                  {currentPath === 'dashboard' && <Dashboard />}
                  {currentPath === 'allocation' && <AssetAllocation />}
                  {currentPath === 'attribution' && <PerformanceAttribution />}
                  {currentPath === 'risk' && <RiskMonitoring />}
                  {currentPath === 'reports' && <ReportCenter />}
                </div>
              </Content>
            </Layout>
          </Layout>
        </Router>
      </FilterContext.Provider>
    </ConfigProvider>
  );
}
