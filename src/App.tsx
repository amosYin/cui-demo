/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Select, DatePicker, Radio, Space, Typography, Card, Row, Col } from 'antd';
import { 
  FilterOutlined,
  DashboardOutlined, 
  PieChartOutlined, 
  BarChartOutlined, 
  SafetyCertificateOutlined, 
  FileTextOutlined,
  DatabaseOutlined
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
import ValuationMaintenance from './components/ValuationMaintenance';
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
    product: '安联测试产品1',
    dateRange: [dayjs().subtract(3, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    benchmark: '沪深300',
    unit: 'CNY',
  });

  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.hash.replace('#', '') || 'valuation');

  useEffect(() => {
    // Trigger window resize event when sidebar collapses/expands
    // to allow charts to resize correctly
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 250); // Slightly more than the CSS transition time
    return () => clearTimeout(timer);
  }, [collapsed]);

  const menuItems = [
    { key: 'valuation', icon: <DatabaseOutlined />, label: '估值表维护' },
    { 
      key: 'analysis', 
      icon: <DashboardOutlined />, 
      label: '投后分析',
      children: [
        { key: 'dashboard', label: '整体分析' },
        { key: 'allocation', label: '资产配置' },
        { key: 'attribution', label: '业绩归因' },
        { key: 'risk', label: '风险监控' },
        { key: 'reports', label: '报告中心' },
      ]
    },
  ];

  const handleMenuClick = (e: any) => {
    window.location.hash = e.key;
    setCurrentPath(e.key);
  };

  const getPageTitle = () => {
    switch (currentPath) {
      case 'valuation': return '估值表维护';
      case 'dashboard': return '整体分析';
      case 'allocation': return '资产配置';
      case 'attribution': return '业绩归因';
      case 'risk': return '风险监控';
      case 'reports': return '报告中心';
      default: return '投后分析';
    }
  };

  const isAnalysisPage = ['dashboard', 'allocation', 'attribution', 'risk', 'reports'].includes(currentPath);

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
              breakpoint="lg"
              collapsedWidth="80"
              theme="dark"
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 100,
                backgroundColor: '#023D7F',
                boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Title level={4} style={{ color: 'white', margin: 0, whiteSpace: 'nowrap', fontSize: collapsed ? '16px' : '18px' }}>
                  {collapsed ? 'AL' : '安联投后分析工具'}
                </Title>
              </div>
              <Menu 
                theme="dark" 
                selectedKeys={[currentPath]} 
                mode="inline" 
                items={menuItems}
                onClick={handleMenuClick}
                style={{ backgroundColor: '#023D7F' }}
              />
            </Sider>
              <Layout style={{ 
                marginLeft: collapsed ? 80 : 200, 
                width: `calc(100% - ${collapsed ? 80 : 200}px)`,
                transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                minWidth: 0,
                overflowX: 'hidden'
              }}>
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
                  paddingBottom: 8,
                  width: '100%',
                  overflowX: 'auto'
                }}>
                <div className="flex items-center space-x-4">
                  <Space>
                    {currentPath === 'valuation' ? <DatabaseOutlined style={{ color: '#023D7F', fontSize: '18px' }} /> : <DashboardOutlined style={{ color: '#023D7F', fontSize: '18px' }} />}
                    <Title level={5} style={{ margin: 0 }}>{getPageTitle()}</Title>
                  </Space>
                  
                  {isAnalysisPage && (
                    <div className="ml-8 flex items-center space-x-6 border-l pl-8 border-gray-200">
                      <Space>
                        <FilterOutlined style={{ color: '#023D7F' }} />
                        <Text strong>全局筛选</Text>
                      </Space>
                      <Space>
                        <Text type="secondary">产品：</Text>
                        <Select 
                          defaultValue={filters.product}
                          style={{ width: 140 }}
                          onChange={(val) => setFilters(prev => ({ ...prev, product: val }))}
                          options={[
                            { value: '安联测试产品1', label: '安联测试产品1' },
                            { value: '测试资管产品B', label: '测试资管产品B' },
                          ]}
                          size="small"
                        />
                      </Space>
                      <Space>
                        <Text type="secondary">时间：</Text>
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
                          size="small"
                          style={{ width: 220 }}
                        />
                      </Space>
                      <Radio.Group 
                        value={filters.unit} 
                        onChange={(e) => setFilters(prev => ({ ...prev, unit: e.target.value }))}
                        buttonStyle="solid"
                        size="small"
                      >
                        <Radio.Button value="CNY">元</Radio.Button>
                        <Radio.Button value="10K">万元</Radio.Button>
                        <Radio.Button value="100M">亿元</Radio.Button>
                      </Radio.Group>
                    </div>
                  )}
                </div>
                
                <Space>
                  <Text type="secondary" style={{ fontSize: '12px' }}>更新：{dayjs().format('MM-DD HH:mm')}</Text>
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
                  {currentPath === 'valuation' && <ValuationMaintenance />}
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
