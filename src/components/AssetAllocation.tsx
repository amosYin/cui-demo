
import React from 'react';
import { Row, Col, Card, Table, Typography, Space, Tabs, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { mockAssetAllocation, mockBondTypes, mockStockIndustry } from '../mockData';

const { Title, Text } = Typography;

const AssetAllocation: React.FC = () => {
  // Major Asset Allocation Area Chart Option
  const getMajorAllocationOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } } },
    legend: { data: ['现金', '股票', '债券', '基金'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
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
    legend: { data: ['组合权重', '基准权重'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', data: mockStockIndustry.map(d => d.industry) },
    series: [
      { name: '组合权重', type: 'bar', data: mockStockIndustry.map(d => d.weight) },
      { name: '基准权重', type: 'bar', data: mockStockIndustry.map(d => d.benchmarkWeight) }
    ]
  });

  // Bond Type Distribution Option
  const getBondTypeOption = () => ({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '债券品种',
        type: 'pie',
        radius: '50%',
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
      <Text type={val >= 0 ? 'danger' : 'success'}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
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
            <Card title="历史资产配置比例变化" bordered={false}>
              <ReactECharts option={getMajorAllocationOption()} style={{ height: 450 }} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: '股票细分配置',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="行业分布 (组合 vs 基准)" bordered={false}>
              <ReactECharts option={getStockIndustryOption()} style={{ height: 400 }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="前十大重仓股" bordered={false}>
              <Table columns={stockColumns} dataSource={stockData} pagination={false} size="small" />
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
            <Card title="债券品种分布" bordered={false}>
              <ReactECharts option={getBondTypeOption()} style={{ height: 400 }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="信用评级分布" bordered={false}>
              <ReactECharts 
                option={{
                  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                  xAxis: { type: 'category', data: ['AAA', 'AA+', 'AA', 'A-1', '无评级'] },
                  yAxis: { type: 'value', name: '市值(万元)' },
                  series: [{ type: 'bar', data: [1500, 800, 400, 200, 100], itemStyle: { color: '#1890ff' } }]
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
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default AssetAllocation;
