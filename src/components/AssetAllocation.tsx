
import React from 'react';
import { Row, Col, Card, Table, Typography, Space, Tabs, Tag, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { mockAssetAllocation, mockBondTypes, mockStockIndustry } from '../mockData';

const { Title, Text } = Typography;

const AssetAllocation: React.FC = () => {
  const renderTitle = (title: string, subTitle: string, description: string) => (
    <Space size={4}>
      <span>{title}</span>
      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: 4 }}>{subTitle}</Text>
      <Tooltip title={description}>
        <QuestionCircleOutlined style={{ color: '#bfbfbf', fontSize: '14px', cursor: 'help' }} />
      </Tooltip>
    </Space>
  );
  // Major Asset Allocation Area Chart Option
  const getMajorAllocationOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } } },
    legend: { data: ['现金', '股票', '债券', '基金'], top: 0 },
    color: ['#00BFA5', '#023D7F', '#0066CC', '#4DA1FF'],
    grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['2025-12', '2026-01', '2026-02', '2026-03'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: '现金', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [10, 12, 15, 15] },
      { name: '股票', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [40, 45, 42, 45] },
      { name: '债券', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [40, 35, 33, 30] },
      { name: '基金', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [10, 8, 10, 10] }
    ]
  });

  // Stock Industry Distribution Option
  const getStockIndustryOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['组合权重', '基准权重'], top: 0 },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', data: mockStockIndustry.map(d => d.industry) },
    series: [
      { name: '组合权重', type: 'bar', data: mockStockIndustry.map(d => d.weight), itemStyle: { color: '#023D7F' } },
      { name: '基准权重', type: 'bar', data: mockStockIndustry.map(d => d.benchmarkWeight), itemStyle: { color: '#B0BEC5' } }
    ]
  });

  // Bond Type Distribution Option
  const getBondTypeOption = () => ({
    tooltip: { trigger: 'item' },
    legend: { orient: 'horizontal', top: '0', left: 'center' },
    series: [
      {
        name: '债券品种',
        type: 'pie',
        radius: '50%',
        center: ['50%', '55%'],
        color: ['#023D7F', '#0066CC', '#4DA1FF', '#00BFA5', '#FFB300', '#7E57C2'],
        data: mockBondTypes.map(item => ({ value: item.value, name: item.type })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
      }
    ]
  });

  const stockColumns = [
    { title: '股票名称', dataIndex: 'name', key: 'name' },
    { title: '代码', dataIndex: 'code', key: 'code' },
    { title: '持仓市值(元)', dataIndex: 'value', key: 'value', render: (val: number) => val.toLocaleString() },
    { title: '权重(%)', dataIndex: 'weight', key: 'weight', render: (val: number) => val.toFixed(2) },
    { title: '当日贡献(%)', dataIndex: 'contribution', key: 'contribution', render: (val: number) => (
      <Text style={{ color: val >= 0 ? '#D50000' : '#00BFA5' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )}
  ];

  const stockData = [
    { key: '1', name: '贵州茅台', code: '600519.SH', value: 5420000, weight: 12.04, contribution: 0.15 },
    { key: '2', name: '宁德时代', code: '300750.SZ', value: 4210000, weight: 9.35, contribution: -0.24 },
    { key: '3', name: '招商银行', code: '600036.SH', value: 3120000, weight: 6.93, contribution: 0.08 },
    { key: '4', name: '中国平安', code: '601318.SH', value: 2850000, weight: 6.33, contribution: 0.12 },
    { key: '5', name: '五粮液', code: '000858.SZ', value: 2150000, weight: 4.78, contribution: -0.05 },
  ];

  const items = [
    {
      key: '1',
      label: '大类资产配置',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title={renderTitle("历史资产配置比例变化", "Historical Asset Allocation Changes", "展示组合大类资产配置比例的历史演变过程。")} variant="borderless">
              <ReactECharts option={getMajorAllocationOption()} style={{ height: 450 }} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: '3',
      label: '债券细分配置',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title={renderTitle("债券品种分布", "Bond Type Distribution", "展示债券资产在国债、金融债、信用债等不同品种上的分布。")} variant="borderless">
              <ReactECharts option={getBondTypeOption()} style={{ height: 400 }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={renderTitle("信用评级分布", "Credit Rating Distribution", "展示组合中债券资产的信用评级分布情况，评估信用风险敞口。")} variant="borderless">
              <ReactECharts 
                option={{
                  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                  legend: { data: ['市值(万元)'], top: 0 },
                  grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
                  xAxis: { type: 'category', data: ['AAA', 'AA+', 'AA', 'A-1', '无评级'] },
                  yAxis: { type: 'value', name: '市值(万元)' },
                  series: [{ name: '市值(万元)', type: 'bar', data: [1500, 800, 400, 200, 100], itemStyle: { color: '#023D7F' } }]
                }} 
                style={{ height: 400 }} 
              />
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card variant="borderless">
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default AssetAllocation;
